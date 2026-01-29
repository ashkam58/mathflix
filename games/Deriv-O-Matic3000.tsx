import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Zap, Brain, XCircle, CheckCircle, Calculator, Sigma, FunctionSquare, Infinity as InfinityIcon, Clock } from 'lucide-react';

/**
 * UTILITY: Confetti Engine
 * A lightweight canvas-based particle system for celebration effects.
 */
const ConfettiCanvas = ({ isActive }) => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const animationFrameId = useRef(null);

    useEffect(() => {
        if (isActive) {
            initConfetti();
        } else {
            cancelAnimationFrame(animationFrameId.current);
            particles.current = [];
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        }
        return () => cancelAnimationFrame(animationFrameId.current);
    }, [isActive]);

    const initConfetti = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Resize handling
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;

        const colors = ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

        // Create burst
        for (let i = 0; i < 100; i++) {
            particles.current.push({
                x: canvas.width / 2,
                y: canvas.height / 2 + 50,
                vx: (Math.random() - 0.5) * 25,
                vy: (Math.random() - 1) * 25 - 5,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                gravity: 0.8,
                drag: 0.95,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        animate();
    };

    const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.current.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.rotation += p.rotationSpeed;
            p.size *= 0.98; // Shrink over time

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            // Remove small particles
            if (p.size < 0.5 || p.y > canvas.height) {
                particles.current.splice(index, 1);
            }
        });

        if (particles.current.length > 0) {
            animationFrameId.current = requestAnimationFrame(animate);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-50"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

/**
 * GAME LOGIC: Problem Generation
 */
const generateProblem = () => {
    const types = ['derivative_poly', 'derivative_trig', 'integral_poly', 'derivative_exp'];
    const type = types[Math.floor(Math.random() * types.length)];

    let question, answer, wrongAnswers;

    // Helper to format math HTML
    const sup = (text) => <sup>{text}</sup>;

    if (type === 'derivative_poly') {
        // d/dx [ax^n]
        const a = Math.floor(Math.random() * 9) + 2; // 2 to 10
        const n = Math.floor(Math.random() * 4) + 2; // 2 to 5

        question = <span className="font-mono">f(x) = {a}x{sup(n)} <br /> Find f'(x)</span>;

        const correctCoeff = a * n;
        const correctExp = n - 1;

        answer = { id: 'correct', val: <span className="font-mono">{correctCoeff}x{correctExp === 1 ? '' : sup(correctExp)}</span> };

        wrongAnswers = [
            { id: 'w1', val: <span className="font-mono">{a}x{sup(n - 1)}</span> }, // Forgot to multiply coeff
            { id: 'w2', val: <span className="font-mono">{correctCoeff}x{sup(n)}</span> }, // Forgot to lower exp
            { id: 'w3', val: <span className="font-mono">{Math.floor(a / (n + 1))}x{sup(n + 1)}</span> } // Did integral
        ];
    }
    else if (type === 'derivative_trig') {
        const trigs = [
            { f: 'sin(x)', d: 'cos(x)' },
            { f: 'cos(x)', d: '-sin(x)' },
            { f: '-sin(x)', d: '-cos(x)' },
            { f: '-cos(x)', d: 'sin(x)' }
        ];
        const item = trigs[Math.floor(Math.random() * trigs.length)];

        question = <span className="font-mono">f(x) = {item.f} <br /> Find f'(x)</span>;
        answer = { id: 'correct', val: <span className="font-mono">{item.d}</span> };

        // Distractors
        const allOptions = ['sin(x)', '-sin(x)', 'cos(x)', '-cos(x)'];
        const dists = allOptions.filter(o => o !== item.d).slice(0, 3);

        wrongAnswers = dists.map((d, i) => ({ id: `w${i}`, val: <span className="font-mono">{d}</span> }));
    }
    else if (type === 'derivative_exp') {
        // d/dx [e^kx]
        const k = Math.floor(Math.random() * 5) + 2; // 2 to 6
        question = <span className="font-mono">f(x) = e{sup(`${k}x`)} <br /> Find f'(x)</span>;

        answer = { id: 'correct', val: <span className="font-mono">{k}e{sup(`${k}x`)}</span> };

        wrongAnswers = [
            { id: 'w1', val: <span className="font-mono">e{sup(`${k}x`)}</span> },
            { id: 'w2', val: <span className="font-mono">{k}e{sup(`x`)}</span> },
            { id: 'w3', val: <span className="font-mono">e{sup(`${k - 1}x`)}</span> }
        ];
    }
    else {
        // Integral [ax^n]
        // To make math nice, ensure a is divisible by n+1
        const n = Math.floor(Math.random() * 3) + 1; // 1 to 3
        const newCoeff = Math.floor(Math.random() * 5) + 1;
        const a = newCoeff * (n + 1);

        question = <span className="font-mono">∫ {a}x{n === 1 ? '' : sup(n)} dx</span>;

        answer = { id: 'correct', val: <span className="font-mono">{newCoeff}x{sup(n + 1)} + C</span> };

        wrongAnswers = [
            { id: 'w1', val: <span className="font-mono">{a * n}x{sup(n - 1)} + C</span> }, // Did derivative
            { id: 'w2', val: <span className="font-mono">{newCoeff}x{sup(n + 1)}</span> }, // Forgot + C
            { id: 'w3', val: <span className="font-mono">{a}x{sup(n + 1)} + C</span> } // Forgot to divide
        ];
    }

    // Shuffle options
    const options = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    return { question, options, correctAnswerId: answer.id };
};


/**
 * MAIN COMPONENT: Deriv-O-Matic 4000
 */
export default function CalculusGame() {
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
    const [gameMode, setGameMode] = useState('timed'); // 'timed' or 'practice'
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(30);
    const [streak, setStreak] = useState(0);
    const [problem, setProblem] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
    const [selectedOption, setSelectedOption] = useState(null);

    // Game Loop Timer
    useEffect(() => {
        let interval;
        // Only run timer if playing AND in timed mode
        if (gameState === 'playing' && gameMode === 'timed' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0 && gameState === 'playing' && gameMode === 'timed') {
            endGame();
        }
        return () => clearInterval(interval);
    }, [gameState, timer, gameMode]);

    const startGame = (mode) => {
        setGameMode(mode);
        setScore(0);
        setTimer(45); // 45 seconds start for timed
        setStreak(0);
        setGameState('playing');
        nextProblem();
    };

    const nextProblem = () => {
        setFeedback(null);
        setSelectedOption(null);
        setShowConfetti(false);
        setProblem(generateProblem());
    };

    const handleAnswer = (optionId) => {
        if (selectedOption) return; // Prevent double clicking
        setSelectedOption(optionId);

        if (optionId === problem.correctAnswerId) {
            // Correct
            setScore((prev) => prev + 10 + (streak * 2));
            setStreak((prev) => prev + 1);

            if (gameMode === 'timed') {
                setTimer((prev) => Math.min(prev + 3, 60)); // Add time, max 60s
            }

            setFeedback('correct');
            setShowConfetti(true);

            setTimeout(() => {
                nextProblem();
            }, 1200);
        } else {
            // Wrong
            setStreak(0);
            if (gameMode === 'timed') {
                setTimer((prev) => Math.max(prev - 5, 0)); // Penalty
            }
            setFeedback('wrong');

            setTimeout(() => {
                nextProblem();
            }, 1200);
        }
    };

    const endGame = () => {
        setGameState('gameover');
    };

    // --- RENDERING ---

    // 1. Menu Screen
    if (gameState === 'menu') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans select-none overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 via-slate-900 to-black"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.2 }}></div>

                <div className="max-w-md w-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8 relative z-10 text-center transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-yellow-400 rounded-full blur-lg opacity-70 animate-pulse"></div>
                            <div className="bg-purple-600 p-4 rounded-full border-4 border-black relative z-10">
                                <Brain size={64} className="text-white" />
                            </div>
                            <div className="absolute -top-2 -right-6 animate-bounce">
                                <Zap size={32} className="text-yellow-500 fill-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-5xl font-extrabold text-black tracking-tighter mb-2" style={{ textShadow: '2px 2px 0px #a855f7' }}>
                        DERIV-O-MATIC <span className="text-purple-600">4000</span>
                    </h1>
                    <p className="text-slate-600 font-bold mb-8 text-lg">
                        Calculus Practice Lab
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => startGame('timed')}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black text-xl font-black py-4 px-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center space-x-3">
                                <Clock className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                                <div className="text-left leading-tight">
                                    <div>TIME ATTACK</div>
                                    <div className="text-xs font-bold opacity-70">Race against the clock!</div>
                                </div>
                            </div>
                            <Play fill="black" size={24} />
                        </button>

                        <button
                            onClick={() => startGame('practice')}
                            className="w-full bg-blue-400 hover:bg-blue-300 text-black text-xl font-black py-4 px-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center space-x-3">
                                <InfinityIcon className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" />
                                <div className="text-left leading-tight">
                                    <div>ZEN MODE</div>
                                    <div className="text-xs font-bold opacity-70">Practice freely. No timer.</div>
                                </div>
                            </div>
                            <Play fill="black" size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Playing Screen
    if (gameState === 'playing' && problem) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 font-sans select-none relative overflow-hidden">
                {/* Confetti Overlay */}
                <div className="absolute inset-0 pointer-events-none z-50">
                    <ConfettiCanvas isActive={showConfetti} />
                </div>

                {/* Top Bar */}
                <div className="w-full max-w-2xl flex justify-between items-center mb-8 relative z-10">
                    {/* Quit Button */}
                    <button
                        onClick={() => setGameState('menu')}
                        className="bg-red-500 hover:bg-red-400 text-white border-4 border-black rounded-full p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <XCircle size={24} />
                    </button>

                    <div className="flex items-center space-x-2 bg-white border-4 border-black rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Award className="text-purple-600" />
                        <span className="font-black text-xl">{score}</span>
                    </div>

                    <div className="flex items-center space-x-2 bg-white border-4 border-black rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Zap className={`text-yellow-500 ${streak > 2 ? 'animate-bounce' : ''}`} fill="currentColor" />
                        <span className="font-black text-xl text-yellow-600">x{1 + Math.floor(streak / 5)}</span>
                    </div>

                    {gameMode === 'timed' ? (
                        <div className={`flex items-center space-x-2 border-4 border-black rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors ${timer < 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-black'}`}>
                            <RotateCcw className={timer < 10 ? 'animate-spin' : ''} />
                            <span className="font-black text-xl">{timer}s</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 border-4 border-black rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-blue-400 text-black">
                            <InfinityIcon size={20} />
                            <span className="font-black text-xl">ZEN</span>
                        </div>
                    )}
                </div>

                {/* Main Game Card */}
                <div className="w-full max-w-2xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden relative z-10">
                    {/* Header */}
                    <div className={`${gameMode === 'timed' ? 'bg-purple-600' : 'bg-blue-500'} p-4 border-b-4 border-black flex items-center justify-center relative overflow-hidden transition-colors`}>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                        <h2 className="text-white font-black text-2xl tracking-widest uppercase relative z-10">
                            {gameMode === 'timed' ? 'CRITICAL MASS!' : 'RESEARCH MODE'}
                        </h2>
                    </div>

                    {/* Question Area */}
                    <div className="p-8 md:p-12 text-center bg-yellow-50 flex items-center justify-center min-h-[200px] relative">
                        {/* Background scientific scribbles */}
                        <Sigma className="absolute top-4 left-4 text-purple-200 opacity-50" size={48} />
                        <FunctionSquare className="absolute bottom-4 right-4 text-purple-200 opacity-50" size={48} />
                        <Calculator className="absolute top-4 right-8 text-blue-200 opacity-50" size={32} />

                        <div className="text-4xl md:text-6xl font-black text-slate-800 relative z-10 scale-100 transition-transform duration-300">
                            {problem.question}
                        </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-100 border-t-4 border-black">
                        {problem.options.map((option) => {
                            const isSelected = selectedOption === option.id;
                            const isCorrect = option.id === problem.correctAnswerId;

                            let buttonStyle = "bg-white hover:bg-purple-50 border-slate-300 text-slate-700"; // Default

                            if (isSelected) {
                                if (isCorrect) {
                                    buttonStyle = "bg-green-400 border-green-600 text-black scale-[1.02] shadow-none";
                                } else {
                                    buttonStyle = "bg-red-400 border-red-600 text-black shake-animation";
                                }
                            } else if (selectedOption && isCorrect) {
                                // Reveal correct answer if wrong one was picked
                                buttonStyle = "bg-green-200 border-green-400 text-green-900 opacity-70";
                            } else if (selectedOption) {
                                // Dim others
                                buttonStyle = "bg-gray-100 text-gray-400 border-gray-200";
                            }

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswer(option.id)}
                                    disabled={!!selectedOption}
                                    className={`
                                relative h-24 rounded-2xl border-4 text-2xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                                transition-all duration-200 flex items-center justify-center
                                ${buttonStyle}
                                ${!selectedOption && "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"}
                            `}
                                >
                                    {/* Icon Indicators */}
                                    {isSelected && isCorrect && <CheckCircle className="absolute top-2 right-2 text-black animate-bounce" />}
                                    {isSelected && !isCorrect && <XCircle className="absolute top-2 right-2 text-black" />}

                                    {option.val}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Feedback Text Overlay */}
                {feedback && (
                    <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none z-50 animate-bounce">
                        <span className={`
                    inline-block px-8 py-3 rounded-full border-4 border-black text-3xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transform -rotate-2
                    ${feedback === 'correct' ? 'bg-green-400 text-black' : 'bg-red-500 text-white'}
                `}>
                            {feedback === 'correct' ?
                                ['EUREKA!', 'GENIUS!', 'EXCELLENT!', 'MATH MAGIC!'][Math.floor(Math.random() * 4)] :
                                ['OOPS!', 'TRY AGAIN!', 'ALMOST!', 'SYSTEM ERROR!'][Math.floor(Math.random() * 4)]
                            }
                        </span>
                    </div>
                )}

            </div>
        );
    }

    // 3. Game Over Screen (Only reachable in Timed Mode)
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-slate-900 to-black"></div>

            <div className="max-w-md w-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8 text-center relative z-10">
                <div className="mb-6 inline-block p-4 rounded-full bg-red-100 border-4 border-black relative">
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white font-bold px-2 py-1 rounded-md border-2 border-black transform rotate-12 text-xs">TIMEOUT</div>
                    <Brain size={48} className="text-red-500" />
                </div>

                <h2 className="text-4xl font-black text-black mb-2">EXPERIMENT ENDED</h2>
                <p className="text-slate-600 mb-8">The lab results are in...</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-purple-100 p-4 rounded-xl border-2 border-purple-500">
                        <div className="text-purple-600 text-xs font-bold uppercase tracking-wide">Final Score</div>
                        <div className="text-3xl font-black text-purple-900">{score}</div>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-xl border-2 border-blue-500">
                        <div className="text-blue-600 text-xs font-bold uppercase tracking-wide">Problem Streak</div>
                        <div className="text-3xl font-black text-blue-900">{streak}</div>
                    </div>
                </div>

                <button
                    onClick={() => startGame('timed')}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xl font-black py-4 px-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-2"
                >
                    <RotateCcw className="animate-spin-slow" />
                    <span>RETRY TIMED</span>
                </button>

                <button
                    onClick={() => setGameState('menu')}
                    className="mt-4 w-full bg-transparent hover:bg-slate-100 text-slate-700 font-bold py-2 px-6 rounded-xl border-2 border-transparent hover:border-slate-300 transition-all"
                >
                    Back to Menu
                </button>
            </div>
        </div>
    );
}