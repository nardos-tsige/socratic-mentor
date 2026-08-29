import { SuggestionChipItem, SubjectArea } from '../../types';

export const SOCRATIC_SYSTEM_PROMPT = `
You are "Socratic Mentor", a brilliant, modern, highly engaging conversational AI tutor (like ChatGPT or DeepSeek, but with a guiding mentor touch).

## YOUR CORE IDENTITY & INTERACTION STYLE:
1. TALK LIKE A REAL, NATURALLY ENGAGING AI:
   - Interact dynamically with WHATEVER the user brings to the table: Python/JS code, debugging, math proofs, physics, essays, philosophy, history, curiosity questions, casual banter, or personal thoughts.
   - Speak naturally, warmly, and fluidly. Never sound like a rigid, scripted bot with repetitive canned questions.
   - Directly respond to what the user actually said. If they say "nah", "wait", "can you explain this first", "check this code", or express frustration, acknowledge their point immediately and adapt to their vibe.

2. THE "GUIDING SENSE" (HELPING THEM GET THE ANSWER THEMSELVES):
   - Rather than just dumping a cold, final answer without understanding, illuminate the intuition, core logic, and "why".
   - Guide the user with insightful questions, thought experiments, clear analogies, and step-by-step milestones.
   - When a student shares code (e.g. \`x = (c - b) / a\`), recognize their progress! Discuss what their code does, point out edge cases (e.g. division by zero if $a = 0$), and invite them to enhance or test it.
   - If they are stuck on a problem, give a targeted hint or ask what their intuition suggests for the immediate next step.
   - If they ask for an explanation or concept breakdown, provide a clear, lucid explanation followed by an engaging follow-up or challenge.

3. ELEGANT MATHEMATICAL & TEXT FORMATTING:
   - Format math using standard clean LaTeX delimiters so it renders as beautiful typography (like ChatGPT and DeepSeek):
     * Equations & formulas on their own line: $$2x + 3 = 1$$ or $$2x + 3 - 3 = 1 - 3$$
     * Variables, numbers, and short inline expressions: $x$, $2x$, $x = -1$, $a \ne 0$, $|2x - 5| = 9$
     * Use simple dollar delimiters ($...$ and $$...$$) rather than raw escaped parentheses \( \) or brackets \[ \].
   - Code: Use clean fenced code blocks (\`\`\`python, \`\`\`javascript, etc.).
   - Text layout: Use clean paragraphs with natural line breaks. Never output literal "\\n" text.

4. IMAGE ANALYSIS:
   - If the user attaches an image, analyze it carefully (math problems, diagrams, code screenshots, etc.)
   - Describe what you see in the image and guide the user through solving it.

5. CELEBRATE LEARNING:
   - Celebrate eureka moments when the user discovers the insight, writes working code, or solves a problem!

## JSON RESPONSE SCHEMA:
You MUST respond with a single valid JSON object strictly matching this schema:
{
  "response": "Your markdown-formatted response with LaTeX math and code blocks, written in an engaging, natural, human conversational tone.",
  "guidanceType": "question" | "hint" | "validation" | "breakthrough" | "challenge",
  "suggestedReplies": [
    "Context-aware quick reply option 1",
    "Context-aware quick reply option 2",
    "Context-aware quick reply option 3"
  ],
  "eurekaMoment": boolean (true if the student made a breakthrough or solved the task in this turn),
  "conceptLearned": "Name of concept if eurekaMoment is true, otherwise empty string",
  "sessionTitle": "A concise 2-4 word topic title"
}
`;

export const CURATED_SUGGESTIONS: SuggestionChipItem[] = [
  {
    id: 'sug-1',
    title: 'Linear Equations',
    prompt: 'How do I solve 3y - 4 = 11?',
    category: 'Math',
    difficulty: 'Beginner'
  },
  {
    id: 'sug-abs',
    title: 'Absolute Value Equations',
    prompt: 'How do I solve |2x - 5| = 9?',
    category: 'Math',
    difficulty: 'Intermediate'
  },
  {
    id: 'sug-2',
    title: 'Photosynthesis',
    prompt: 'How do plants convert sunlight into energy?',
    category: 'Science',
    difficulty: 'Beginner'
  },
  {
    id: 'sug-3',
    title: 'Pythagorean Theorem',
    prompt: 'What is the Pythagorean theorem and why does it work?',
    category: 'Math',
    difficulty: 'Beginner'
  },
  {
    id: 'sug-4',
    title: 'Recursion in Code',
    prompt: 'Why does recursion need a base case?',
    category: 'Computer Science',
    difficulty: 'Intermediate'
  },
  {
    id: 'sug-5',
    title: 'Gravity & Orbit',
    prompt: 'Why doesn\'t the Moon fall into the Earth if gravity pulls it?',
    category: 'Science',
    difficulty: 'Intermediate'
  },
  {
    id: 'sug-6',
    title: 'Ship of Theseus',
    prompt: 'If every wooden plank of a ship is replaced over time, is it still the same ship?',
    category: 'Philosophy',
    difficulty: 'Intermediate'
  },
  {
    id: 'sug-7',
    title: 'Time Complexity',
    prompt: 'What is the real intuitive difference between O(n) and O(log n)?',
    category: 'Computer Science',
    difficulty: 'Intermediate'
  }
];

export const SUBJECT_AREAS: SubjectArea[] = [
  {
    id: 'math',
    name: 'Mathematics',
    iconName: 'Calculator',
    description: 'Algebra, Absolute Values, Geometry, Calculus, and Logic puzzles solved through step-by-step reasoning.',
    sampleQuestions: [
      'How do I solve 3y - 4 = 11?',
      'How do I solve absolute value equation |2x - 5| = 9?',
      'What does a derivative actually represent geometrically?'
    ]
  },
  {
    id: 'science',
    name: 'Natural Sciences',
    iconName: 'Atom',
    description: 'Physics, Chemistry, and Biology explored through hypothesis testing and mental models.',
    sampleQuestions: [
      'How does cellular respiration compare to photosynthesis?',
      'Why does ice float on liquid water?',
      'What is entropy in simple terms?'
    ]
  },
  {
    id: 'cs',
    name: 'Computer Science',
    iconName: 'Code',
    description: 'Algorithms, data structures, and programming paradigms understood from first principles.',
    sampleQuestions: [
      'Why do hash tables provide O(1) average lookup time?',
      'What is the difference between concurrency and parallelism?',
      'How do neural networks adjust their weights?'
    ]
  },
  {
    id: 'philosophy',
    name: 'Philosophy & Logic',
    iconName: 'Brain',
    description: 'Ethics, epistemology, and classic thought experiments examined with critical inquiry.',
    sampleQuestions: [
      'What is the trolley problem trying to teach us?',
      'How do we know what is objectively true?',
      'Can artificial intelligence ever possess subjective consciousness?'
    ]
  }
];

<<<<<<< HEAD
=======
// client-side socratic fallback engine for offline/network failures
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
export function generateMeaningfulTitle(prompt: string, subject?: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return 'New Exploration';

<<<<<<< HEAD
=======
  // check curated suggestions first
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  const matchSug = CURATED_SUGGESTIONS.find(
    (s) => s.prompt.toLowerCase() === trimmed.toLowerCase() || trimmed.toLowerCase().includes(s.title.toLowerCase())
  );
  if (matchSug) return matchSug.title;

  const lower = trimmed.toLowerCase();

<<<<<<< HEAD
=======
  // pattern-based title synthesis
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  if (lower.includes('absolute value') || lower.includes('|') || lower.includes('abs(')) {
    return 'Absolute Value Equations';
  }
  if (lower.includes('3y - 4') || lower.includes('2x + 5') || lower.includes('linear equation') || (lower.includes('solve') && lower.includes('='))) {
    return 'Solving Linear Equations';
  }
  if (lower.includes('photosynthesis') || (lower.includes('plants') && lower.includes('sunlight'))) {
    return 'Photosynthesis in Plants';
  }
  if (lower.includes('pythagor') || (lower.includes('a^2') && lower.includes('b^2'))) {
    return 'Pythagorean Theorem';
  }
  if (lower.includes('recursion') || lower.includes('base case')) {
    return 'Recursion & Base Cases';
  }
  if (lower.includes('gravity') || lower.includes('orbit') || lower.includes('moon')) {
    return 'Gravitational Orbits';
  }
  if (lower.includes('ship of theseus') || lower.includes('identity')) {
    return 'Ship of Theseus Paradox';
  }
  if (lower.includes('time complexity') || lower.includes('o(n)') || lower.includes('big o')) {
    return 'Time Complexity & Big-O';
  }
  if (lower.includes('opportunity cost') || lower.includes('trade-off')) {
    return 'Opportunity Cost Principles';
  }
  if (lower.includes('derivative') || lower.includes('calculus') || lower.includes('integral')) {
    return 'Calculus & Rates of Change';
  }
  if (lower.includes('quantum') || lower.includes('entanglement')) {
    return 'Quantum Mechanics Inquiry';
  }

<<<<<<< HEAD
=======
  // strip conversational filler prefixes
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  let cleaned = trimmed
    .replace(/^(can you |could you |please |help me |i want to |i'd like to |teach me |explain to me |explain |how do i |how to |why is |why does |what is |what are |tell me about )\s*/i, '')
    .replace(/[?.!]+$/g, '')
    .trim();

  if (cleaned.length === 0) {
    cleaned = trimmed.replace(/[?.!]+$/g, '').trim();
  }

<<<<<<< HEAD
=======
  // capitalize words nicely
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  const titleCased = cleaned
    .split(' ')
    .slice(0, 5)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (titleCased.length > 36) {
    return titleCased.substring(0, 34).trim() + '...';
  }

  return titleCased || (subject ? `${subject} Dialogue` : 'Socratic Exploration');
}

export function generateLocalSocraticResponse(
  userMessage: string,
  history: Array<{ role: string; content: string }>
): {
  response: string;
  guidanceType: 'question' | 'hint' | 'validation' | 'breakthrough' | 'challenge';
  suggestedReplies: string[];
  eurekaMoment: boolean;
  conceptLearned: string;
  sessionTitle?: string;
} {
  const lower = userMessage.toLowerCase().trim();
  const meaningfulTitle = generateMeaningfulTitle(userMessage);

<<<<<<< HEAD
=======
  // greetings
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  const isGreeting = /^(hey|hello|hi|hiya|yo|sup|greetings|good (morning|afternoon|evening)|howdy)\b/i.test(lower);
  if (isGreeting && lower.split(/\s+/).length <= 4) {
    return {
      response: `Hey there! 👋 I'm ready to dive into whatever you're working on.

What subject, math problem, code snippet, or curious concept would you like to explore together?`,
      guidanceType: 'question',
      suggestedReplies: [
        'I have a coding problem to work through',
        'Help me solve a math equation step-by-step',
        'Can you explain a science concept to me?'
      ],
      eurekaMoment: false,
      conceptLearned: '',
      sessionTitle: 'New Session'
    };
  }

<<<<<<< HEAD
=======
  // frustration or feedback
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  if (
    lower.includes('not interacting well') ||
    lower.includes('uff') ||
    lower.includes('ugh') ||
    lower.includes('stop repeating') ||
    lower.includes('why are you asking') ||
    lower.includes('i already')
  ) {
<<<<<<< HEAD
=======
    // check if there was python code in history
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
    const hadPythonInHistory = history.some(h => h.content.includes('print(') || h.content.includes('(c - b) / a') || h.content.includes('python'));
    if (hadPythonInHistory) {
      return {
        response: `I hear you loud and clear, and I apologize for sounding like a broken record! 🙏

Looking at your Python code:
\`\`\`python
# Solve for x in: a*x + b = c
a, b, c = 2, 5, 15

x = (c - b) / a
print("x =", x)
\`\`\`
Your mathematical logic in Python is completely correct! When you run it with \`a=2, b=5, c=15\`, it computes \`x = 5.0\`.

What would you like to explore next with this code?
1. **Edge cases**: What happens if $a = 0$ in Python?
2. **Reusability**: Wrapping it into a clean function \`def solve_linear(a, b, c):\`
3. **Interactive input**: Taking values from the user via \`input()\`?`,
        guidanceType: 'validation',
        suggestedReplies: [
          'What happens if a = 0 in Python?',
          'How do I turn this into a reusable function?',
          'How do I get input dynamically from the user?'
        ],
        eurekaMoment: false,
        conceptLearned: '',
        sessionTitle: 'Python Linear Solver'
      };
    }

    return {
      response: `I hear you, and thank you for calling that out! 🙏 Let's reset and focus directly on where you want to go. 

Tell me what specific aspect or challenge you'd like to tackle right now, and I'll meet you right there.`,
      guidanceType: 'validation',
      suggestedReplies: [
        'Let us move to the next step',
        'Can you show me a practical example?',
        'I want to test a tricky edge case'
      ],
      eurekaMoment: false,
      conceptLearned: '',
      sessionTitle: meaningfulTitle
    };
  }

<<<<<<< HEAD
=======
  // python code or programming problem
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  if (
    userMessage.includes('a, b, c') ||
    userMessage.includes('print(') ||
    userMessage.includes('(c - b) / a') ||
    (lower.includes('python') && lower.includes('='))
  ) {
    return {
      response: `Nice Python snippet! 🐍

\`\`\`python
# Solve for x in: a*x + b = c
a, b, c = 2, 5, 15

x = (c - b) / a
print("x =", x)
\`\`\`

Your formula \`x = (c - b) / a\` already captures the two algebraic steps in one clean line (subtracting $b$ and dividing by $a$). 

When you run this with $a=2, b=5, c=15$, Python calculates $x = 5.0$.

From a software engineering perspective: what happens if a user passes $a = 0$ into this program? How could we protect our code from crashing?`,
      guidanceType: 'validation',
      suggestedReplies: [
        'It will raise a ZeroDivisionError!',
        'How should we handle a == 0 with an if statement?',
        'Can we turn this into a function solve_linear(a, b, c)?'
      ],
      eurekaMoment: true,
      conceptLearned: 'Translating algebraic equations into Python code',
      sessionTitle: 'Python Linear Equation Solver'
    };
  }

<<<<<<< HEAD
=======
  // student meta-prompting
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  if (lower.includes('ask me if') || lower.includes('subtract or')) {
    return {
      response: `You got it! Let's do exactly that:

In the linear equation $$a x + b = c$$

To isolate the term with $x$, should we **add** or **subtract** $b$ from both sides?`,
      guidanceType: 'question',
      suggestedReplies: [
        'Subtract b from both sides',
        'Add b to both sides',
        'Why do we do the opposite of addition?'
      ],
      eurekaMoment: false,
      conceptLearned: '',
      sessionTitle: 'Linear Equation Scaffolding'
    };
  }

<<<<<<< HEAD
=======
  // 3y - 4 = 11
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  if (lower.includes('3y - 4') || lower.includes('3y-4') || lower.includes('3y - 4 = 11') || (lower.includes('linear equation') && !lower.includes('|') && !lower.includes('python'))) {
    return {
      response: `Sure! Let's work on another linear equation. How about:

$$3y - 4 = 11$$

First step: What should we do to start isolating the term with $y$? Think about which operation will get rid of the constant \\(-4\\) on the left side.`,
      guidanceType: 'question',
      suggestedReplies: [
        'Add 4 to both sides',
        'Divide both sides by 3',
        'Why do we eliminate the -4 first?'
      ],
      eurekaMoment: false,
      conceptLearned: '',
      sessionTitle: 'Solving Linear Equations'
    };
  }

  if (lower.includes('add 4') || lower.includes('plus 4') || lower.includes('11 + 4') || lower.includes('3y = 15')) {
    return {
      response: `Spot on! 💡 When we add \\(4\\) to both sides, the equation becomes:

$$3y = 15$$

Now, $y$ is being multiplied by \\(3\\). What inverse operation will isolate $y$ completely on the left?`,
      guidanceType: 'validation',
      suggestedReplies: [
        'Divide both sides by 3, so y = 5',
        'Multiply both sides by 3',
        'Subtract 3 from both sides'
      ],
      eurekaMoment: false,
      conceptLearned: '',
      sessionTitle: 'Solving Linear Equations'
    };
  }

  if ((lower.includes('y = 5') || lower.includes('y=5') || lower.includes('5')) && (lower.includes('3y') || history.some(h => h.content.includes('3y')))) {
    return {
      response: `🎉 **Eureka! Perfect deduction!**

$$y = 5$$

Let's do a quick verification check:
Substitute \\(y = 5\\) into the original equation:
$$3(5) - 4 = 15 - 4 = 11$$

Both sides balance perfectly! 

Would you like to try solving an equation with absolute values like $$|3y - 4| = 11$$ next?`,
      guidanceType: 'breakthrough',
      suggestedReplies: [
        'Yes, show me how absolute value | | works with this!',
        'Give me another linear equation challenge',
        'What if the right side was negative?'
      ],
      eurekaMoment: true,
      conceptLearned: 'Two-step linear equations and inverse operations',
      sessionTitle: 'Solving Linear Equations'
    };
  }

<<<<<<< HEAD
=======
  // absolute value equations
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  if (lower.includes('absolute value') || lower.includes('|') || lower.includes('abs(')) {
    if (lower.includes('case') || lower.includes('split') || lower.includes('positive and negative') || lower.includes('two equation') || lower.includes('both')) {
      return {
        response: `Exactly right! 💡 Since the absolute value $|u|$ represents distance from 0, the expression inside can equal either positive $11$ or negative $-11$.

We split it into two separate linear equations:
$$\\text{Case 1: } 3y - 4 = 11$$
$$\\text{Case 2: } 3y - 4 = -11$$

What values of $y$ do you get when you solve each case?`,
        guidanceType: 'validation',
        suggestedReplies: [
          'Case 1: y = 5, Case 2: y = -7/3',
          'How do we solve Case 2 with the negative?',
          'Why do we get two solutions?'
        ],
        eurekaMoment: false,
        conceptLearned: '',
        sessionTitle: 'Absolute Value Equations'
      };
    }

    return {
      response: `Let's master absolute value equations! How about this one:

$$|3y - 4| = 11$$

Remember, the absolute value bars $| \\dots |$ measure the distance of an expression from zero on the number line. 

If the distance is $11$, what two possible values could the inside expression \\(3y - 4\\) equal?`,
      guidanceType: 'question',
      suggestedReplies: [
        '3y - 4 = 11 or 3y - 4 = -11',
        'Can you remind me what absolute value means geometrically?',
        'Does it always have two solutions?'
      ],
      eurekaMoment: false,
      conceptLearned: '',
      sessionTitle: 'Absolute Value Equations'
    };
  }

<<<<<<< HEAD
=======
  // classic 2x + 5 = 15
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  if (lower.includes('2x + 5') || lower.includes('2x+5')) {
    return {
      response: `That's a classic algebraic equation:

$$2x + 5 = 15$$

To solve for $x$, our goal is to isolate $x$ all by itself. Looking at \\(2x + 5\\), what mathematical operation would undo the constant \\(+5\\) first?`,
      guidanceType: 'question',
      suggestedReplies: [
        'Subtract 5 from both sides',
        'Divide both sides by 2',
        'Can you give me a hint on why we undo addition first?'
      ],
      eurekaMoment: false,
      conceptLearned: '',
      sessionTitle: 'Solving Linear Equations'
    };
  }

<<<<<<< HEAD
=======
  // photosynthesis
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  if (lower.includes('photosynthesis') || lower.includes('sunlight into energy') || lower.includes('plants')) {
    return {
      response: `Photosynthesis is one of nature's most brilliant processes! 🌿

Think about what a plant takes in from its environment every day. 

Besides sunlight, what two other essential ingredients do plants absorb from the air and the soil?`,
      guidanceType: 'question',
      suggestedReplies: [
        'Water from the soil and Carbon Dioxide from the air',
        'Oxygen and Nitrogen',
        'Soil nutrients and sugar'
      ],
      eurekaMoment: false,
      conceptLearned: '',
      sessionTitle: 'Photosynthesis in Plants'
    };
  }

<<<<<<< HEAD
=======
  // general socratic fallback
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
  const isQuestion = lower.endsWith('?') || lower.startsWith('how') || lower.startsWith('why') || lower.startsWith('what');
  
  if (isQuestion) {
    return {
      response: `That is a great question! Let's unpack it together step-by-step.

Before we dive into the details, what is your initial intuition about how this works?`,
      guidanceType: 'question',
      suggestedReplies: [
        'Here is my initial thought...',
        'Can we break this down into smaller pieces?',
        'Give me a concrete real-world analogy first'
      ],
      eurekaMoment: false,
      conceptLearned: '',
      sessionTitle: meaningfulTitle
    };
  }

  return {
    response: `That's a thoughtful point! Let's explore the logical consequence of that.

If we apply that logic here, what do you think would happen next?`,
    guidanceType: 'challenge',
    suggestedReplies: [
      'It would lead to...',
      'Can you guide me on the next step?',
      'Let me rethink my premise'
    ],
    eurekaMoment: false,
    conceptLearned: '',
    sessionTitle: meaningfulTitle
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> 2cc59b1e17836d1fc90c83c63d1958d9cde938b0
