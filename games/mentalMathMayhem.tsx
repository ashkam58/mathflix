import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Flame, Trophy, Timer, X, Zap, Crown, AlertTriangle, FastForward, Heart, Pause, Bell } from 'lucide-react';

/**
 * CONFIGURATION & DATA
 */
const TOTAL_QUESTIONS = 30; // Increased to 30
const TIME_PER_QUESTION = 5; // Seconds

// Generate questions based on difficulty tier
const generateQuestion = (index) => {
    let q = "";
    let a = 0;

    if (index < 5) {
        // Tier 1: Warmup Add/Sub (Levels 1-5)
        const op = Math.random() > 0.5 ? '+' : '-';
        const n1 = Math.floor(Math.random() * 20) + 10;
        const n2 = Math.floor(Math.random() * 9) + 1;
        q = `${n1} ${op} ${n2}`;
        a = op === '+' ? n1 + n2 : n1 - n2;
    } else if (index < 10) {
        // Tier 2: Speed Multiplication (Levels 6-10)
        const n1 = Math.floor(Math.random() * 9) + 2;
        const n2 = Math.floor(Math.random() * 9) + 2;
        q = `${n1} × ${n2}`;
        a = n1 * n2;
    } else if (index < 15) {
        // Tier 3: Division (Levels 11-15)
        const n2 = Math.floor(Math.random() * 8) + 2;
        const ans = Math.floor(Math.random() * 9) + 2;
        const n1 = n2 * ans;
        q = `${n1} ÷ ${n2}`;
        a = ans;
    } else if (index < 20) {
        // Tier 4: Mixed Operations (Levels 16-20)
        const n1 = Math.floor(Math.random() * 10) + 2;
        const n2 = Math.floor(Math.random() * 5) + 2;
        const n3 = Math.floor(Math.random() * 10) + 1;
        q = `${n1} × ${n2} + ${n3}`;
        a = (n1 * n2) + n3;
    } else if (index < 25) {
        // Tier 5: Squares & Subtraction (Levels 21-25)
        const n = Math.floor(Math.random() * 8) + 4; // 4 to 12
        const sub = Math.floor(Math.random() * 10) + 1;
        q = `${n}² - ${sub}`;
        a = (n * n) - sub;
    } else {
        // Boss Level (Levels 26-30)
        const n1 = Math.floor(Math.random() * 12) + 2;
        const n2 = Math.floor(Math.random() * 20);
        q = `(${n1} × ${n1}) - ${n2}`;
        a = (n1 * n1) - n2;
    }

    return { question: q, answer: a };
};

export default function MentalMathMayhem() {
    const [gameState, setGameState] = useState('menu'); // menu, countdown, playing, gameover, victory
    const [level, setLevel] = useState(0); // Current question index
    const [currentProblem, setCurrentProblem] = useState({ question: "2 + 2", answer: 4 });
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [lives, setLives] = useState(5); // Increased lives
    const [powers, setPowers] = useState({ freeze: 3, skip: 2, heal: 1 }); // Power-up charges
    const [shake, setShake] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: 'correct' | 'wrong' | 'power', val: string }
    const [showSubReminder, setShowSubReminder] = useState(false);

    // Refs
    const timerRef = useRef(null);
    const subTimerRef = useRef(null);
    const inputRef = useRef(null);

    // --- Audio / SFX Placeholders ---
    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    // --- Game Loop Logic ---

    const startGame = () => {
        setGameState('countdown');
        setScore(0);
        setLives(5); // Increased lives
        setStreak(0);
        setLevel(0);
        setInput("");
        setPowers({ freeze: 3, skip: 2, heal: 1 });
        setShowSubReminder(false);

        // Subscribe animation timer (triggers 60s into the game)
        if (subTimerRef.current) clearTimeout(subTimerRef.current);
        subTimerRef.current = setTimeout(() => {
            if (gameState === 'playing' || gameState === 'menu') { // Check if valid state
                triggerSubAnimation();
            }
        }, 60000);
    };

    const triggerSubAnimation = () => {
        setShowSubReminder(true);
        setTimeout(() => setShowSubReminder(false), 6000);
    };

    // The actual start after countdown
    const startLevel = useCallback(() => {
        const nextQ = generateQuestion(level);
        setCurrentProblem(nextQ);
        setInput("");
        setTimeLeft(TIME_PER_QUESTION);
        setGameState('playing');

        // Focus hidden input for keyboard users
        if (inputRef.current) inputRef.current.focus();
    }, [level]);

    // Countdown Effect
    useEffect(() => {
        if (gameState === 'countdown') {
            const timer = setTimeout(() => {
                startLevel();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [gameState, startLevel]);

    // Timer Logic
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 0) {
                        handleWrong("TIME");
                        return TIME_PER_QUESTION;
                    }
                    return prev - 0.1;
                });
            }, 100);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState]);

    // Power-Up Handlers
    const usePower = (type) => {
        if (gameState !== 'playing' || powers[type] <= 0) return;

        setPowers(prev => ({ ...prev, [type]: prev[type] - 1 }));

        if (type === 'freeze') {
            setTimeLeft(prev => prev + 5);
            setFeedback({ type: 'power', val: '+5 SEC' });
        } else if (type === 'skip') {
            handleCorrect(true); // true = skip
            setFeedback({ type: 'power', val: 'SKIPPED' });
        } else if (type === 'heal') {
            setLives(prev => Math.min(prev + 1, 5));
            setFeedback({ type: 'power', val: '+1 LIFE' });
        }

        setTimeout(() => setFeedback(null), 800);
        // Refocus input after button click
        if (inputRef.current) inputRef.current.focus();
    };

    // Handle Input logic
    const handleInput = (val) => {
        if (gameState !== 'playing') return;

        if (val === 'DEL') {
            setInput(prev => prev.slice(0, -1));
            return;
        }

        // Limit length
        if (input.length > 5) return;

        const newInput = input + val;
        setInput(newInput);

        // Auto-check answer (Instant feedback)
        const numInput = parseInt(newInput);
        if (!isNaN(numInput)) {
            if (numInput === currentProblem.answer) {
                handleCorrect();
            } else if (newInput.length >= String(currentProblem.answer).length) {
                if (String(numInput).length > String(currentProblem.answer).length) {
                    handleWrong("WRONG");
                }
            }
        }
    };

    const handleCorrect = (skipped = false) => {
        clearInterval(timerRef.current);
        if (!skipped) {
            setScore(prev => prev + Math.ceil(timeLeft * 100) + (streak * 50));
            setStreak(prev => prev + 1);
            setFeedback({ type: 'correct', val: '+TIME' });
        }

        setTimeout(() => setFeedback(null), 500);

        if (level >= TOTAL_QUESTIONS - 1) {
            setGameState('victory');
        } else {
            setLevel(prev => prev + 1);
            setTimeout(startLevel, 200);
        }
    };

    const handleWrong = (reason) => {
        triggerShake();
        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
                setGameState('gameover');
            } else {
                setInput("");
                setStreak(0);
                setTimeLeft(TIME_PER_QUESTION); // Reset time for mercy
            }
            return newLives;
        });
        setFeedback({ type: 'wrong', val: reason === "TIME" ? "TOO SLOW" : "WRONG" });
        setTimeout(() => setFeedback(null), 500);
    };

    // Keyboard Listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== 'playing') return;

            // Number keys
            if (e.key >= '0' && e.key <= '9') {
                handleInput(e.key);
            } else if (e.key === 'Backspace') {
                handleInput('DEL');
            }

            // Power-up Hotkeys
            if (e.key === 'f') usePower('freeze');
            if (e.key === 's') usePower('skip');
            if (e.key === 'h') usePower('heal');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, input, currentProblem, powers]);


    /**
     * RENDER HELPERS
     */
    const getFlameIntensity = () => {
        if (streak < 3) return 'opacity-20 grayscale';
        if (streak < 6) return 'opacity-60 text-orange-500';
        return 'opacity-100 text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]';
    };

    return (
        <div className={`
      flex flex-col h-screen w-full bg-slate-950 text-white font-mono overflow-hidden select-none
      ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}
    `}>
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px) rotate(-2deg); }
          75% { transform: translateX(10px) rotate(2deg); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
      `}</style>

            {/* HEADER / HUD */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-red-600 px-3 py-1 text-xs font-black italic rounded transform -skew-x-12">
                        GAME 2
                    </div>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => ( // 5 Lives now
                            <HeartIcon key={i} active={i < lives} />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className={`transition-all duration-300 ${getFlameIntensity()}`}>
                        <Flame size={32} fill="currentColor" />
                    </div>
                    <span className="text-xs text-slate-500 font-bold tracking-widest">STREAK x{streak}</span>
                </div>

                <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase">Score</div>
                    <div className="text-2xl font-black text-yellow-400">{score.toLocaleString()}</div>
                </div>
            </div>

            {/* MAIN GAME AREA */}
            <div className="flex-1 flex flex-col relative">

                {/* SUBSCRIBE REMINDER OVERLAY */}
                {showSubReminder && (
                    <div className="absolute top-4 right-0 z-50 animate-[slideInRight_0.5s_ease-out]">
                        <div className="bg-gradient-to-l from-purple-600 to-indigo-600 text-white p-4 pl-8 rounded-l-full shadow-2xl flex items-center gap-4 border-l-4 border-yellow-400">
                            <div className="bg-white text-purple-600 p-2 rounded-full animate-bounce">
                                <Bell size={24} fill="currentColor" />
                            </div>
                            <div>
                                <div className="font-black text-lg uppercase italic">Don't forget!</div>
                                <div className="text-sm opacity-90">Subscribe for +10 Luck 🍀</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PROGRESS BAR (TIMER) */}
                {gameState === 'playing' && (
                    <div className="h-4 w-full bg-slate-900">
                        <div
                            className={`h-full transition-all duration-100 ease-linear ${timeLeft < 2 ? 'bg-red-600' : 'bg-blue-500'}`}
                            style={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
                        />
                    </div>
                )}

                {/* CONTENT SWITCHER */}
                {gameState === 'menu' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 rounded-full"></div>
                            <h1 className="relative text-6xl md:text-8xl font-black text-center leading-none tracking-tighter text-white">
                                MENTAL<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">MAYHEM</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 text-slate-400 text-sm md:text-base font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><Timer size={16} /> 30 Levels</span>
                            <span className="w-px h-4 bg-slate-600"></span>
                            <span className="flex items-center gap-2"><Zap size={16} /> Power-ups</span>
                        </div>

                        <button
                            onClick={startGame}
                            className="group bg-white text-black px-12 py-4 rounded-full text-xl font-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                        >
                            START THE CHAOS
                        </button>
                    </div>
                )}

                {gameState === 'countdown' && (
                    <div className="flex-1 flex items-center justify-center bg-slate-950">
                        <div className="text-[150px] font-black text-white animate-pulse">
                            GET READY
                        </div>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="flex-1 flex flex-col items-center justify-center relative">

                        {/* Background elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/4 left-10 text-slate-800 text-9xl font-black opacity-10 select-none">÷</div>
                            <div className="absolute bottom-1/4 right-10 text-slate-800 text-9xl font-black opacity-10 select-none">×</div>
                        </div>

                        {/* Question Display */}
                        <div className="z-10 text-center mb-4">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em] mb-2 block">
                                Level {level + 1}/{TOTAL_QUESTIONS}
                            </span>
                            <div className="text-7xl md:text-9xl font-black text-white drop-shadow-2xl">
                                {currentProblem.question}
                            </div>

                            {/* Input Display Area */}
                            <div className={`
                 mt-4 h-24 flex items-center justify-center text-6xl font-mono font-bold text-blue-400
                 ${feedback?.type === 'wrong' ? 'text-red-500' : ''}
                 ${feedback?.type === 'power' ? 'text-yellow-400' : ''}
               `}>
                                {feedback ? (
                                    <span className="animate-bounce">{feedback.val}</span>
                                ) : (
                                    <span className="border-b-4 border-slate-700 px-8 min-w-[200px]">
                                        {input}<span className="animate-pulse text-slate-600">_</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* POWER UP BAR */}
                        <div className="flex gap-4 mb-8 z-20">
                            <PowerButton
                                icon={<Pause size={24} />}
                                label="Freeze (F)"
                                count={powers.freeze}
                                color="bg-blue-600"
                                onClick={() => usePower('freeze')}
                            />
                            <PowerButton
                                icon={<FastForward size={24} />}
                                label="Skip (S)"
                                count={powers.skip}
                                color="bg-purple-600"
                                onClick={() => usePower('skip')}
                            />
                            <PowerButton
                                icon={<Heart size={24} />}
                                label="Heal (H)"
                                count={powers.heal}
                                color="bg-red-600"
                                onClick={() => usePower('heal')}
                            />
                        </div>

                        {/* Virtual Numpad (for touch/mouse) */}
                        <div className="grid grid-cols-3 gap-2 w-full max-w-sm px-4 mb-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button
                                    key={num}
                                    onClick={() => handleInput(num.toString())}
                                    className="h-16 bg-slate-800 rounded hover:bg-slate-700 text-2xl font-bold border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all"
                                >
                                    {num}
                                </button>
                            ))}
                            <button onClick={() => handleInput('0')} className="col-span-2 h-16 bg-slate-800 rounded hover:bg-slate-700 text-2xl font-bold border-b-4 border-slate-900 active:border-b-0 active:translate-y-1">0</button>
                            <button onClick={() => handleInput('DEL')} className="h-16 bg-red-900/50 text-red-400 rounded hover:bg-red-900/80 text-xl font-bold border-b-4 border-red-900 active:border-b-0 active:translate-y-1 flex items-center justify-center">
                                <RotateCcw size={24} />
                            </button>
                        </div>
                    </div>
                )}

                {(gameState === 'gameover' || gameState === 'victory') && (
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm p-8 text-center animate-in fade-in zoom-in duration-300">
                        <div className="mb-6">
                            {gameState === 'victory' ? (
                                <Crown size={80} className="text-yellow-400 mx-auto animate-bounce" />
                            ) : (
                                <AlertTriangle size={80} className="text-red-500 mx-auto animate-pulse" />
                            )}
                        </div>

                        <h2 className="text-5xl font-black mb-2 text-white">
                            {gameState === 'victory' ? "MATH GOD" : "WASTED"}
                        </h2>

                        <p className="text-slate-400 text-xl mb-8">
                            Score: <span className="text-white font-bold">{score}</span>
                        </p>

                        {/* END SCREEN SUBSCRIBE HOOK */}
                        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-1 rounded-xl w-full max-w-md shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <div className="bg-slate-900 p-6 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <Trophy className="text-yellow-400" size={24} />
                                    <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs">New Challenger</span>
                                </div>
                                <p className="text-left text-sm text-slate-300 mb-2">
                                    <span className="font-bold text-white">MathWizard_99</span> just beat your time by 0.4s!
                                </p>
                                <div className="h-10 bg-white text-black font-black flex items-center justify-center rounded uppercase tracking-wider text-sm">
                                    Subscribe to Steal The Crown
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={startGame}
                            className="mt-8 text-slate-500 hover:text-white flex items-center gap-2 font-bold"
                        >
                            <RotateCcw size={16} /> TRY AGAIN
                        </button>
                    </div>
                )}

            </div>

            {/* Hidden input for keyboard focus trapping if needed explicitly */}
            <input ref={inputRef} className="opacity-0 absolute" readOnly autoFocus />
        </div>
    );
}

// Sub-component for Lives
const HeartIcon = ({ active }) => (
    <svg
        width="24" height="24" viewBox="0 0 24 24"
        fill={active ? "#ef4444" : "#334155"}
        className={`transition-colors duration-300 ${active ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : ''}`}
    >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

// Power Button Component
const PowerButton = ({ icon, label, count, color, onClick }) => (
    <button
        onClick={onClick}
        disabled={count <= 0}
        className={`
            relative flex flex-col items-center justify-center w-20 h-20 rounded-xl transition-all
            ${count > 0 ? `${color} hover:brightness-110 active:scale-95 shadow-lg` : 'bg-slate-800 opacity-50 cursor-not-allowed'}
        `}
    >
        <div className="text-white mb-1">{icon}</div>
        <span className="text-[10px] font-bold uppercase">{label}</span>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center font-bold text-xs border-2 border-slate-900">
            {count}
        </div>
    </button>
);