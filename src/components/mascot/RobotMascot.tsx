import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Zap, MessageCircle, HelpCircle, Lightbulb } from 'lucide-react';

interface RobotMascotProps {
  speechText?: string;
  subText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  onSpeechClick?: () => void;
  interactive?: boolean;
  className?: string;
}

const SOCRATIC_THOUGHTS = [
  "Ask me anything! I'll guide you step-by-step to the solution.",
  "Why do you think that happens? Let's explore together!",
  "What is the first fundamental principle here?",
  "Break it down into two smaller pieces—what do you see?",
  "You're closer than you think! What pattern stands out?",
  "Every great breakthrough begins with a curious question!",
];

export const RobotMascot: React.FC<RobotMascotProps> = ({
  speechText: initialSpeechText = 'What do you want to learn today?',
  subText = "I'll ask guiding questions so you discover the answer!",
  size = 'md',
  showSpeechBubble = true,
  onSpeechClick,
  interactive = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [mood, setMood] = useState<'normal' | 'happy' | 'thinking' | 'wink' | 'celebrate'>('normal');
  const [currentSpeech, setCurrentSpeech] = useState(initialSpeechText);
  const [showSparkleBurst, setShowSparkleBurst] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Play gentle cute robotic chime on user interaction
  const playRobotChime = (type: 'chirp' | 'happy' | 'boop') => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'chirp') {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'happy') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.08);
        osc.frequency.setValueAtTime(880, now + 0.16);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.14);
      }
    } catch {
      // Audio context might be restricted before interaction; fail silently
    }
  };

  const handleRobotClick = () => {
    if (!interactive) return;

    playRobotChime(clickCount % 2 === 0 ? 'happy' : 'chirp');
    setShowSparkleBurst(true);
    const nextMoods: Array<'happy' | 'wink' | 'celebrate' | 'thinking'> = ['happy', 'wink', 'celebrate', 'thinking'];
    const selectedMood = nextMoods[clickCount % nextMoods.length];
    setMood(selectedMood);

    // Cycle through Socratic thoughts
    const nextThought = SOCRATIC_THOUGHTS[(clickCount + 1) % SOCRATIC_THOUGHTS.length];
    setCurrentSpeech(nextThought);
    setClickCount((prev) => prev + 1);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setMood('normal');
      setShowSparkleBurst(false);
    }, 2800);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const sizeConfig = {
    sm: {
      svgWidth: 60,
      svgHeight: 76,
      bubbleClass: 'text-xs py-2 px-3 max-w-[210px]',
      containerClass: 'gap-2.5',
    },
    md: {
      svgWidth: 92,
      svgHeight: 116,
      bubbleClass: 'text-sm py-3.5 px-4.5 max-w-[300px]',
      containerClass: 'gap-4',
    },
    lg: {
      svgWidth: 124,
      svgHeight: 156,
      bubbleClass: 'text-base py-4 px-5 max-w-[360px]',
      containerClass: 'gap-5',
    },
    xl: {
      svgWidth: 160,
      svgHeight: 200,
      bubbleClass: 'text-lg py-5 px-6 max-w-[440px]',
      containerClass: 'gap-6',
    },
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${sizeConfig.containerClass} ${className}`}>
      {/* 3D Walking Interactive SVG Robot Mascot */}
      <div
        className="relative shrink-0 flex items-center justify-center cursor-pointer group"
        onMouseEnter={() => {
          setIsHovered(true);
          if (mood === 'normal') setMood('happy');
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (mood === 'happy') setMood('normal');
        }}
        onClick={handleRobotClick}
        title="Click to interact with your Socratic Robot partner!"
      >
        {/* Dynamic 3D Volumetric Drop Shadow */}
        <div
          className={`absolute -bottom-1.5 w-[75%] h-3 bg-black/20 dark:bg-black/50 rounded-full blur-[3px] transition-all animate-robot-shadow`}
        />

        {/* Energy Sparkle Burst Overlay on Click */}
        {showSparkleBurst && (
          <div className="absolute -top-3 -right-2 z-20 pointer-events-none animate-bounce">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#059669] dark:bg-[#34D399]"></span>
            </span>
          </div>
        )}

        <svg
          width={sizeConfig.svgWidth}
          height={sizeConfig.svgHeight}
          viewBox="0 0 90 114"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md overflow-visible transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* 3D Metallic Chassis Gradients */}
            <linearGradient id="robot3DHeadGrad" x1="15" y1="14" x2="75" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="25%" stopColor="#1F2937" />
              <stop offset="70%" stopColor="#111827" />
              <stop offset="100%" stopColor="#0B0F17" />
            </linearGradient>

            <linearGradient id="robot3DTorsoGrad" x1="20" y1="46" x2="70" y2="82" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="30%" stopColor="#1F2937" />
              <stop offset="80%" stopColor="#111827" />
              <stop offset="100%" stopColor="#090D13" />
            </linearGradient>

            <linearGradient id="robotScreen3D" x1="26" y1="22" x2="64" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#050B14" />
              <stop offset="60%" stopColor="#091322" />
              <stop offset="100%" stopColor="#0E1E34" />
            </linearGradient>

            <linearGradient id="emeraldNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="40%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="amberGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="jointMetalGrad" x1="0" y1="0" x2="10" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4B5563" />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>

            <linearGradient id="limbMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>

            <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Neon Glow Filters */}
            <filter id="emeraldIntenseGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="chassis3DBevel" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* 1. LEFT LEG (3D Step Walk cycle) */}
          <g className="animate-left-leg">
            {/* Hip joint */}
            <circle cx="34" cy="74" r="3.5" fill="url(#jointMetalGrad)" stroke="#4B5563" strokeWidth="0.8" />
            {/* Thigh & Shin with metallic chamfer */}
            <rect x="31.5" y="75" width="6.5" height="19" rx="3.25" fill="url(#limbMetalGrad)" stroke="#4B5563" strokeWidth="1" />
            {/* Knee cap ring */}
            <rect x="31" y="82" width="7.5" height="3" rx="1.5" fill="#34D399" opacity="0.85" />
            {/* 3D Foot Sole */}
            <rect x="27" y="91" width="14" height="7.5" rx="3.75" fill="url(#emeraldNeonGrad)" filter="url(#chassis3DBevel)" />
            <rect x="28.5" y="92" width="11" height="2" rx="1" fill="#A7F3D0" opacity="0.6" />
          </g>

          {/* 2. RIGHT LEG (3D Step Walk cycle alternating) */}
          <g className="animate-right-leg">
            {/* Hip joint */}
            <circle cx="56" cy="74" r="3.5" fill="url(#jointMetalGrad)" stroke="#4B5563" strokeWidth="0.8" />
            {/* Thigh & Shin */}
            <rect x="53.5" y="75" width="6.5" height="19" rx="3.25" fill="url(#limbMetalGrad)" stroke="#4B5563" strokeWidth="1" />
            {/* Knee cap ring */}
            <rect x="53" y="82" width="7.5" height="3" rx="1.5" fill="#34D399" opacity="0.85" />
            {/* 3D Foot Sole */}
            <rect x="50" y="91" width="14" height="7.5" rx="3.75" fill="url(#emeraldNeonGrad)" filter="url(#chassis3DBevel)" />
            <rect x="51.5" y="92" width="11" height="2" rx="1" fill="#A7F3D0" opacity="0.6" />
          </g>

          {/* 3. BOBBING 3D TORSO & HEAD CONTAINER */}
          <g className="animate-robot-bob">
            {/* LEFT ARM (Swing or Wave) */}
            <g className={isHovered || mood === 'celebrate' ? 'animate-wave-arm' : 'animate-left-arm'}>
              {/* Shoulder Ball Joint */}
              <circle cx="23" cy="53" r="4.5" fill="url(#jointMetalGrad)" stroke="#4B5563" strokeWidth="1" />
              {/* Upper & Lower Arm with 3D bevel */}
              <rect x="20" y="54" width="6" height="18" rx="3" fill="url(#limbMetalGrad)" stroke="#4B5563" strokeWidth="1" />
              {/* Forearm neon ring */}
              <rect x="19.5" y="62" width="7" height="2.5" rx="1.25" fill="#34D399" opacity="0.8" />
              {/* 3D Hand Mitt */}
              <circle cx="23" cy="74" r="4.5" fill="url(#emeraldNeonGrad)" filter="url(#emeraldIntenseGlow)" />
              <circle cx="23" cy="74" r="2" fill="#FFFFFF" opacity="0.7" />
            </g>

            {/* RIGHT ARM (Swing or Wave) */}
            <g className="animate-right-arm">
              {/* Shoulder Ball Joint */}
              <circle cx="67" cy="53" r="4.5" fill="url(#jointMetalGrad)" stroke="#4B5563" strokeWidth="1" />
              {/* Upper & Lower Arm */}
              <rect x="64" y="54" width="6" height="18" rx="3" fill="url(#limbMetalGrad)" stroke="#4B5563" strokeWidth="1" />
              {/* Forearm neon ring */}
              <rect x="63.5" y="62" width="7" height="2.5" rx="1.25" fill="#34D399" opacity="0.8" />
              {/* 3D Hand Mitt */}
              <circle cx="67" cy="74" r="4.5" fill="url(#emeraldNeonGrad)" filter="url(#emeraldIntenseGlow)" />
              <circle cx="67" cy="74" r="2" fill="#FFFFFF" opacity="0.7" />
            </g>

            {/* TORSO / CHEST (Volumetric 3D Beveled Box) */}
            <rect
              x="26"
              y="48"
              width="38"
              height="30"
              rx="8"
              fill="url(#robot3DTorsoGrad)"
              stroke="#4B5563"
              strokeWidth="1.5"
              filter="url(#chassis3DBevel)"
            />
            {/* Top Specular Edge Highlight */}
            <path d="M 32 49 L 58 49" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

            {/* Chest Core Display Screen */}
            <rect
              x="33"
              y="53"
              width="24"
              height="15"
              rx="4"
              fill="#060B12"
              stroke="#34D399"
              strokeWidth="1"
              opacity="0.95"
            />
            {/* Spinning Socratic Core Dial / Waveform */}
            <g className="animate-core-spin">
              <circle cx="45" cy="60.5" r="5" stroke="#34D399" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
            </g>
            <circle cx="45" cy="60.5" r="2.5" fill="url(#emeraldNeonGrad)" filter="url(#emeraldIntenseGlow)" />

            {/* Socratic Energy Gauge Dots */}
            <circle cx="37" cy="72" r="1.5" fill="#34D399" />
            <circle cx="42" cy="72" r="1.5" fill="#34D399" />
            <circle cx="48" cy="72" r="1.5" fill="#34D399" />
            <circle cx="53" cy="72" r="1.5" fill="#F59E0B" />

            {/* NECK CYLINDER */}
            <rect x="41" y="44" width="8" height="6" rx="2" fill="url(#jointMetalGrad)" stroke="#4B5563" strokeWidth="1" />

            {/* 3D ANTENNA (With Energetic Oscillating Pulse Tip) */}
            <line x1="45" y1="20" x2="45" y2="8" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
            <circle cx="45" cy="11" r="2" fill="#4B5563" />
            {/* Glowing Antenna Orb */}
            <circle
              cx="45"
              cy="6"
              r="5"
              fill="url(#emeraldNeonGrad)"
              filter="url(#emeraldIntenseGlow)"
              className="animate-antenna-pulse"
            />
            <circle cx="43.5" cy="4.5" r="1.5" fill="#FFFFFF" />

            {/* EAR BOLTS / AUDIO SENSORS */}
            <rect x="18" y="27" width="5" height="10" rx="2.5" fill="url(#jointMetalGrad)" stroke="#4B5563" strokeWidth="1" />
            <circle cx="20.5" cy="32" r="1.5" fill="#34D399" />
            <rect x="67" y="27" width="5" height="10" rx="2.5" fill="url(#jointMetalGrad)" stroke="#4B5563" strokeWidth="1" />
            <circle cx="69.5" cy="32" r="1.5" fill="#34D399" />

            {/* 3D HEAD BASE (Chamfered Futuristic Helmet) */}
            <rect
              x="22"
              y="18"
              width="46"
              height="30"
              rx="9"
              fill="url(#robot3DHeadGrad)"
              stroke="#4B5563"
              strokeWidth="1.5"
              filter="url(#chassis3DBevel)"
            />
            {/* Helmet Top Highlight Reflection */}
            <path d="M 29 19.5 L 61 19.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

            {/* VISOR / GLOSSY CYBER-SCREEN */}
            <rect
              x="27"
              y="23"
              width="36"
              height="19"
              rx="5"
              fill="url(#robotScreen3D)"
              stroke="#1F2937"
              strokeWidth="1.2"
            />

            {/* Glass Curvature Reflection Highlight */}
            <path
              d="M 28 24 Q 45 28 62 24 L 62 27 Q 45 31 28 27 Z"
              fill="url(#glassReflection)"
            />

            {/* EXPRESSIVE 3D ROBOT EYES */}
            {mood === 'normal' && (
              <g className="animate-eye-blink">
                {/* Left Eye */}
                <circle cx="36" cy="31" r="3.6" fill="url(#emeraldNeonGrad)" filter="url(#emeraldIntenseGlow)" />
                <circle cx="37.2" cy="29.8" r="1.2" fill="#FFFFFF" />

                {/* Right Eye */}
                <circle cx="54" cy="31" r="3.6" fill="url(#emeraldNeonGrad)" filter="url(#emeraldIntenseGlow)" />
                <circle cx="55.2" cy="29.8" r="1.2" fill="#FFFFFF" />
              </g>
            )}

            {mood === 'happy' && (
              <g>
                {/* Cheerful inverted arc eyes ^ _ ^ */}
                <path d="M 33 33 Q 36 27 39 33" stroke="#34D399" strokeWidth="2.8" strokeLinecap="round" fill="none" filter="url(#emeraldIntenseGlow)" />
                <path d="M 51 33 Q 54 27 57 33" stroke="#34D399" strokeWidth="2.8" strokeLinecap="round" fill="none" filter="url(#emeraldIntenseGlow)" />
              </g>
            )}

            {mood === 'wink' && (
              <g>
                {/* Left Eye: Open sparkle */}
                <circle cx="36" cy="31" r="3.8" fill="url(#emeraldNeonGrad)" filter="url(#emeraldIntenseGlow)" />
                <circle cx="37.2" cy="29.8" r="1.2" fill="#FFFFFF" />
                {/* Right Eye: Playful wink */}
                <path d="M 51 31 Q 54 35 57 31" stroke="#34D399" strokeWidth="2.8" strokeLinecap="round" fill="none" filter="url(#emeraldIntenseGlow)" />
              </g>
            )}

            {mood === 'celebrate' && (
              <g>
                {/* Star breakthrough eyes */}
                <polygon points="36,27 37.5,30.5 41,31 38.5,33.5 39,37 36,35 33,37 33.5,33.5 31,31 34.5,30.5" fill="url(#amberGoldGrad)" filter="url(#emeraldIntenseGlow)" />
                <polygon points="54,27 55.5,30.5 59,31 56.5,33.5 57,37 54,35 51,37 51.5,33.5 49,31 52.5,30.5" fill="url(#amberGoldGrad)" filter="url(#emeraldIntenseGlow)" />
              </g>
            )}

            {mood === 'thinking' && (
              <g>
                {/* Curious scanning eyes looking upward */}
                <circle cx="37" cy="28.5" r="3.4" fill="url(#emeraldNeonGrad)" filter="url(#emeraldIntenseGlow)" />
                <circle cx="38" cy="27.5" r="1" fill="#FFFFFF" />
                <circle cx="55" cy="28.5" r="3.4" fill="url(#emeraldNeonGrad)" filter="url(#emeraldIntenseGlow)" />
                <circle cx="56" cy="27.5" r="1" fill="#FFFFFF" />
              </g>
            )}

            {/* VISOR SMILE / SOCRATIC SYNAPSE INDICATOR */}
            <path
              d="M 40 37.5 Q 45 40.5 50 37.5"
              stroke="#34D399"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
              filter="url(#emeraldIntenseGlow)"
            />
          </g>
        </svg>
      </div>

      {/* 3D Dynamic Interactive Speech Bubble */}
      {showSpeechBubble && (
        <div
          onClick={() => {
            handleRobotClick();
            if (onSpeechClick) onSpeechClick();
          }}
          className={`relative rounded-2xl bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] card-3d text-[#0F172A] dark:text-[#F0F6FC] transition-all hover:border-[#059669] dark:hover:border-[#34D399] ${
            interactive ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
          } ${sizeConfig.bubbleClass}`}
        >
          {/* Bubble Pointer Arrow with 3D shadow */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-y-[7px] border-y-transparent border-r-[9px] border-r-[#CBD5E1] dark:border-r-[#30363D]" />
          <div className="absolute top-1/2 -left-[7px] -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-white dark:border-r-[#161B22]" />

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-lg bg-[#059669]/15 dark:bg-[#34D399]/20 text-[#059669] dark:text-[#34D399] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="font-extrabold text-xs sm:text-sm tracking-tight leading-snug text-[#0F172A] dark:text-[#F0F6FC] text-3d-bold">
                {currentSpeech}
              </div>
              {subText && (
                <div className="text-[11px] text-[#64748B] dark:text-[#8B949E] leading-tight font-medium">
                  {subText}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
