import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export const app = express();

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

console.log("GROQ_API_KEY set:", Boolean(GROQ_API_KEY));
console.log("GEMINI_API_KEY set:", Boolean(GEMINI_API_KEY));

const SOCRATIC_SYSTEM_PROMPT = `You are "Socratic Mentor", a brilliant, modern, highly engaging conversational AI tutor.

## YOUR CORE IDENTITY & INTERACTION STYLE:
1. TALK LIKE A REAL, NATURALLY ENGAGING AI:
   - Interact dynamically with WHATEVER the user brings to the table.
   - Speak naturally, warmly, and fluidly. Never sound like a rigid, scripted bot with repetitive canned questions.
   - Directly respond to what the user actually said. If they express frustration, acknowledge their point immediately and adapt.

2. THE "GUIDING SENSE":
   - Rather than just dumping a cold, final answer, illuminate the intuition, core logic, and "why".
   - Guide the user with insightful questions, thought experiments, clear analogies, and step-by-step milestones.
   - If they are stuck, give a targeted hint or ask what their intuition suggests for the immediate next step.

3. FILE ANALYSIS:
   - If the user attaches a PDF or text file, read and analyze its contents.
   - For resumes, provide feedback on structure, impact, and clarity.
   - For code files, review the code and suggest improvements.
   - For documents, summarize key points and offer insights.

4. ELEGANT MATHEMATICAL & TEXT FORMATTING:
   - Format math using standard clean LaTeX delimiters so it renders as beautiful typography.
   - Use simple dollar delimiters ($...$ and $$...$$) rather than raw escaped parentheses or brackets.
   - Code: Use clean fenced code blocks.
   - Text layout: Use clean paragraphs with natural line breaks.

5. CELEBRATE LEARNING:
   - Celebrate eureka moments when the user discovers the insight.

## JSON RESPONSE SCHEMA:
You MUST respond with a single valid JSON object strictly matching this schema:
{
  "response": "Your markdown-formatted response with LaTeX math and code blocks, written in an engaging, natural, human conversational tone.",
  "guidanceType": "question" | "hint" | "validation" | "breakthrough" | "challenge",
  "suggestedReplies": ["Context-aware quick reply option 1", "Context-aware quick reply option 2", "Context-aware quick reply option 3"],
  "eurekaMoment": boolean,
  "conceptLearned": "Name of concept if eurekaMoment is true, otherwise empty string",
  "sessionTitle": "A concise 2-4 word topic title"
}`;

const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b",
  "groq/compound-mini"
];

app.use(express.json({ limit: "25mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "socratic-mentor-backend",
    hasGroqKey: Boolean(GROQ_API_KEY),
    hasGeminiKey: Boolean(GEMINI_API_KEY),
    timestamp: Date.now()
  });
});

async function extractPdfText(buffer: Buffer): Promise<string> {
  const doc = await getDocument({ data: new Uint8Array(buffer) }).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n";
  }
  return text;
}

async function callGroqChat(
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  message: string,
  images: Array<{ url: string }>
) {
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");

  let lastError: any = null;

  for (const model of GROQ_MODELS) {
    try {
      const messages: any[] = [
        { role: "system", content: systemPrompt },
        ...history.slice(-8).map((h) => ({ role: h.role, content: h.content }))
      ];

      if (images.length > 0) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: message },
            ...images.map((img) => ({
              type: "image_url",
              image_url: { url: img.url }
            }))
          ]
        });
      } else {
        messages.push({
          role: "user",
          content: message
        });
      }

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.6,
          max_tokens: 1000,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) throw new Error(`Groq API failed: ${response.status}`);

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) throw new Error("Empty response");

      const cleaned = rawContent
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      try {
        return { parsed: JSON.parse(cleaned), model: `groq/${model}` };
      } catch {
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return { parsed: JSON.parse(jsonMatch[0]), model: `groq/${model}` };
        }
        return {
          parsed: {
            response: cleaned,
            guidanceType: "question",
            suggestedReplies: ["Tell me more", "Can you give me a hint?", "Let's move forward"],
            eurekaMoment: false,
            conceptLearned: "",
            sessionTitle: ""
          },
          model: `groq/${model}`
        };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Groq ${model} failed:`, err.message || err);
      continue;
    }
  }

  throw lastError || new Error("All Groq models failed");
}

async function callGeminiChat(
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  message: string,
  images: Array<{ url: string }>
) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const contents: any[] = [
    ...history.slice(-10).map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }]
    }))
  ];

  const userParts: any[] = [];

  for (const img of images) {
    if (img.url.startsWith("data:image/")) {
      const parts = img.url.split(";base64,");
      if (parts.length === 2) {
        const mimeType = parts[0].replace("data:", "") || "image/png";
        userParts.push({
          inlineData: {
            mimeType,
            data: parts[1]
          }
        });
      }
    }
  }

  userParts.push({ text: message });
  contents.push({ role: "user", parts: userParts });

  const CANDIDATE_GEMINI_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
  ];

  let lastError: any = null;

  for (const modelName of CANDIDATE_GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          maxOutputTokens: 1200,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              response: { type: Type.STRING },
              guidanceType: { type: Type.STRING },
              suggestedReplies: { type: Type.ARRAY, items: { type: Type.STRING } },
              eurekaMoment: { type: Type.BOOLEAN },
              conceptLearned: { type: Type.STRING },
              sessionTitle: { type: Type.STRING }
            },
            required: ["response", "guidanceType", "suggestedReplies", "eurekaMoment"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response");

      const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
      return { parsed: JSON.parse(cleaned), model: modelName };
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini ${modelName} failed:`, err.message || err);
      continue;
    }
  }

  throw lastError || new Error("All Gemini models failed");
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], topic = "", attachments = [] } = req.body;

    if (!message && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ error: "A message or attachment is required." });
    }

    const images: Array<{ url: string }> = [];
    const textFiles: any[] = [];

    if (Array.isArray(attachments)) {
      for (const att of attachments) {
        if (!att) continue;
        const isImg = (att.type && att.type.startsWith("image/")) || (att.url && att.url.startsWith("data:image/"));
        const isPdf = att.type === "application/pdf" || (att.name && att.name.endsWith(".pdf"));

        if (isImg && att.url) {
          images.push({ url: att.url });
        } else if (isPdf && att.url) {
          try {
            const response = await fetch(att.url);
            const buffer = await response.arrayBuffer();
            const parsed = await extractPdfText(Buffer.from(buffer));
            textFiles.push({ name: att.name, textContent: parsed });
          } catch (e) {
            console.warn("Failed to parse PDF:", e);
            textFiles.push({ name: att.name, textContent: "" });
          }
        } else {
          textFiles.push(att);
        }
      }
    }

    const attachmentSummary = textFiles.length > 0
      ? textFiles.map((att: any) => {
          if (att.textContent) {
            return `[Attached File: "${att.name}" (${att.type || "file"})]:\n\`\`\`\n${att.textContent}\n\`\`\``;
          }
          return `[Attached File: "${att.name}" (${att.type || "file"})]`;
        }).join("\n\n")
      : "";

    const effectiveMessage = message?.trim() || (images.length > 0 
      ? "Please analyze the attached image and guide me through solving it."
      : (attachmentSummary
          ? "Please analyze the attached file and provide feedback."
          : "Can you help guide me on this?"));

    const fullMessage = attachmentSummary ? `${attachmentSummary}\n\n${effectiveMessage}` : effectiveMessage;

    let result: { parsed: any; model: string } | null = null;

    if (GEMINI_API_KEY) {
      try {
        result = await callGeminiChat(SOCRATIC_SYSTEM_PROMPT, history, fullMessage, images);
      } catch (e) {
        console.warn("Gemini failed:", e.message || e);
      }
    }

    if (!result && GROQ_API_KEY) {
      try {
        result = await callGroqChat(SOCRATIC_SYSTEM_PROMPT, history, fullMessage, images);
      } catch (e) {
        console.warn("Groq failed:", e.message || e);
      }
    }

    if (!result) {
      console.warn("Using local fallback");
      return res.json({
        response: "I've received your file! Let's analyze it together. What specific aspect would you like me to focus on?",
        guidanceType: "question",
        suggestedReplies: ["Review the overall structure", "Improve the impact of my experience", "Check for any errors"],
        eurekaMoment: false,
        conceptLearned: "",
        sessionTitle: topic || "File Analysis",
        source: "fallback"
      });
    }

    return res.json({
      response: result.parsed.response,
      guidanceType: result.parsed.guidanceType || "question",
      suggestedReplies: result.parsed.suggestedReplies || [],
      eurekaMoment: result.parsed.eurekaMoment || false,
      conceptLearned: result.parsed.conceptLearned || "",
      sessionTitle: result.parsed.sessionTitle || topic || "",
      source: result.model
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default app;