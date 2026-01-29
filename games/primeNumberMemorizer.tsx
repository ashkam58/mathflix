import React, { useState, useEffect, useRef } from 'react';
import { Star, Play, RotateCcw, Trophy, Check, X, Volume2, VolumeX, Music, Home, HelpCircle, Zap } from 'lucide-react';

// --- Assets & Icons ---

const RoboCatIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* Head */}
        <circle cx="50" cy="50" r="45" fill="#00A0E9" stroke="#333" strokeWidth="2" />
        <circle cx="50" cy="55" r="35" fill="white" stroke="#333" strokeWidth="2" />
        {/* Eyes */}
        <ellipse cx="35" cy="35" rx="10" ry="12" fill="white" stroke="#333" strokeWidth="2" />
        <ellipse cx="65" cy="35" rx="10" ry="12" fill="white" stroke="#333" strokeWidth="2" />
        <circle cx="40" cy="35" r="2" fill="black" />
        <circle cx="60" cy="35" r="2" fill="black" />
        {/* Nose */}
        <circle cx="50" cy="48" r="5" fill="#EE3437" stroke="#333" strokeWidth="2" />
        <line x1="50" y1="53" x2="50" y2="75" stroke="#333" strokeWidth="2" />
        {/* Whiskers */}
        <line x1="20" y1="55" x2="40" y2="58" stroke="#333" strokeWidth="2" />
        <line x1="20" y1="65" x2="40" y2="65" stroke="#333" strokeWidth="2" />
        <line x1="20" y1="75" x2="40" y2="72" stroke="#333" strokeWidth="2" />
        <line x1="80" y1="55" x2="60" y2="58" stroke="#333" strokeWidth="2" />
        <line x1="80" y1="65" x2="60" y2="65" stroke="#333" strokeWidth="2" />
        <line x1="80" y1="75" x2="60" y2="72" stroke="#333" strokeWidth="2" />
        {/* Mouth */}
        <path d="M 30 70 Q 50 85 70 70" fill="none" stroke="#333" strokeWidth="2" />
        {/* Collar */}
        <rect x="25" y="85" width="50" height="8" rx="4" fill="#EE3437" stroke="#333" strokeWidth="2" />
        <circle cx="50" cy="92" r="6" fill="#FFD700" stroke="#333" strokeWidth="2" />
    </svg>
);

const DorayakiIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <ellipse cx="50" cy="50" rx="45" ry="35" fill="#D2691E" stroke="#5D4037" strokeWidth="2" />
        <ellipse cx="50" cy="50" rx="35" ry="25" fill="#DEB887" opacity="0.6" />
        <path d="M 15 50 Q 50 80 85 50" fill="#8B4513" opacity="0.3" />
    </svg>
);

// --- Data ---
const PRIMES_UNDER_100 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

// --- Components ---

const Button = ({ onClick, children, color = "blue", className = "", disabled = false }) => {
    const baseStyles = "transform transition-all duration-150 active:scale-95 font-bold rounded-2xl border-b-4 shadow-lg px-6 py-3 flex items-center justify-center gap-2";
    const colors = {
        blue: "bg-blue-400 hover:bg-blue-300 border-blue-600 text-white",
        red: "bg-red-400 hover:bg-red-300 border-red-600 text-white",
        yellow: "bg-yellow-400 hover:bg-yellow-300 border-yellow-600 text-yellow-900",
        green: "bg-green-400 hover:bg-green-300 border-green-600 text-white",
        purple: "bg-purple-400 hover:bg-purple-300 border-purple-600 text-white",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${colors[color]} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

// --- Views ---

const MainMenu = ({ onStart, score }) => (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
            <div className="absolute -top-12 -left-12 w-24 h-24 animate-bounce">
                <RoboCatIcon />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-blue-600 drop-shadow-md text-center tracking-tight">
                PRIME<br />ADVENTURE
            </h1>
            <div className="absolute -bottom-4 -right-8 bg-yellow-400 px-3 py-1 rounded-full text-xs font-bold border-2 border-yellow-600 rotate-12">
                For Saindhavi!
            </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border-4 border-blue-200 shadow-xl w-full max-w-md text-center">
            <p className="text-lg text-blue-800 font-medium mb-6">
                Help the Robot Cat find the magical Prime Numbers to fix his gadgets!
            </p>

            <div className="space-y-4">
                <Button onClick={() => onStart('learn')} color="yellow" className="w-full text-xl">
                    <HelpCircle size={24} /> Learn with Gadgets
                </Button>
                <Button onClick={() => onStart('game')} color="blue" className="w-full text-xl">
                    <Zap size={24} /> Dorayaki Dash
                </Button>
                <Button onClick={() => onStart('quiz')} color="purple" className="w-full text-xl">
                    <Star size={24} /> Super Quiz
                </Button>
            </div>
        </div>

        <div className="flex gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-400">
            <DorayakiIcon className="w-6 h-6" />
            <span className="font-bold text-yellow-800">Total Bean Cakes: {score}</span>
        </div>
    </div>
);

const LearnMode = ({ onBack }) => {
    const [grid, setGrid] = useState(Array.from({ length: 100 }, (_, i) => ({ val: i + 1, status: 'neutral' })));
    const [step, setStep] = useState(0);
    const [message, setMessage] = useState("Let's find all Primes up to 100!");

    const resetGrid = () => {
        setGrid(Array.from({ length: 100 }, (_, i) => ({ val: i + 1, status: 'neutral' })));
        setStep(0);
        setMessage("Let's find all Primes up to 100!");
    };

    const markMultiples = (num, color) => {
        setGrid(prev => prev.map(cell => {
            if (cell.val === 1) return { ...cell, status: 'crossed' };
            if (cell.val === num) return { ...cell, status: 'prime' };
            if (cell.val > num && cell.val % num === 0 && cell.status !== 'crossed') return { ...cell, status: 'crossed' };
            return cell;
        }));
    };

    const handleStep = () => {
        if (step === 0) { // Handle 1
            setGrid(prev => prev.map(c => c.val === 1 ? { ...c, status: 'crossed' } : c));
            setMessage("1 is NOT a prime number. It's too lonely!");
            setStep(1);
        } else if (step === 1) { // Handle 2
            markMultiples(2);
            setMessage("2 is the only EVEN prime! All other even numbers are composite.");
            setStep(2);
        } else if (step === 2) { // Handle 3
            markMultiples(3);
            setMessage("3 is Prime! Multiples of 3 (like 9, 15) are out.");
            setStep(3);
        } else if (step === 3) { // Handle 5
            markMultiples(5);
            setMessage("5 is Prime! Multiples of 5 end in 0 or 5.");
            setStep(4);
        } else if (step === 4) { // Handle 7
            markMultiples(7);
            setMessage("7 is Prime! Remove its multiples like 49, 77.");
            setStep(5);
        } else if (step === 5) { // Finish
            setGrid(prev => prev.map(c => {
                if (c.status === 'neutral') return { ...c, status: 'prime' };
                return c;
            }));
            setMessage("All the colored numbers are PRIME! They only have two factors: 1 and themselves.");
            setStep(6);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4 bg-white/50 p-2 rounded-xl">
                <Button onClick={onBack} color="blue" className="px-4 py-2 text-sm"><Home size={16} /> Menu</Button>
                <h2 className="text-xl font-bold text-blue-700">Prime Gadget Filter</h2>
                <Button onClick={resetGrid} color="red" className="px-4 py-2 text-sm"><RotateCcw size={16} /> Reset</Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200 mb-4 text-center shadow-inner">
                <p className="text-lg font-bold text-blue-800">{message}</p>
            </div>

            <div className="flex-1 overflow-auto bg-white rounded-xl shadow-xl p-2 md:p-4 grid grid-cols-10 gap-1 md:gap-2 content-start">
                {grid.map((cell) => {
                    let bg = "bg-gray-100 text-gray-700";
                    if (cell.status === 'prime') bg = "bg-yellow-400 text-yellow-900 border-2 border-yellow-600 shadow-md transform scale-105 z-10 font-bold";
                    if (cell.status === 'crossed') bg = "bg-red-100 text-red-300 opacity-50 scale-90";

                    return (
                        <div key={cell.val} className={`aspect-square flex items-center justify-center rounded-lg text-sm md:text-xl transition-all duration-500 ${bg}`}>
                            {cell.val}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex justify-center pb-2">
                {step < 6 ? (
                    <Button onClick={handleStep} color="green" className="w-full max-w-xs text-lg animate-pulse">
                        Next Step <Play size={20} />
                    </Button>
                ) : (
                    <div className="text-center bg-yellow-200 text-yellow-800 px-6 py-2 rounded-full font-bold border border-yellow-400">
                        Mission Complete! Good job Saindhavi!
                    </div>
                )}
            </div>
        </div>
    );
};

const GameMode = ({ onBack, addScore }) => {
    const [gameState, setGameState] = useState('playing'); // playing, over
    const [items, setItems] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const canvasRef = useRef(null);
    const requestRef = useRef();

    // Game Logic Loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        const spawnItem = () => {
            const isPrime = Math.random() > 0.5;
            let val;
            if (isPrime) {
                val = PRIMES_UNDER_100[Math.floor(Math.random() * PRIMES_UNDER_100.length)];
            } else {
                do {
                    val = Math.floor(Math.random() * 99) + 2;
                } while (PRIMES_UNDER_100.includes(val));
            }

            const id = Date.now() + Math.random();
            setItems(prev => [...prev, {
                id,
                val,
                isPrime,
                x: Math.random() * 80 + 10, // 10% to 90% width
                y: 110, // Start below screen
                speed: Math.random() * 0.5 + 0.3
            }]);
        };

        const interval = setInterval(spawnItem, 1000);
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameState('over');
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, [gameState]);

    // Animation Loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        const animate = () => {
            setItems(prev => prev
                .map(item => ({ ...item, y: item.y - item.speed }))
                .filter(item => item.y > -20) // Remove if off top
            );
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState]);

    const handleItemClick = (id, isPrime) => {
        if (gameState !== 'playing') return;

        if (isPrime) {
            setScore(s => s + 10);
            addScore(1);
            // Play good sound effect logic here
        } else {
            setScore(s => Math.max(0, s - 5));
            // Play bad sound effect logic here
        }
        setItems(prev => prev.filter(i => i.id !== id));
    };

    return (
        <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-b from-sky-300 to-blue-200 rounded-xl border-4 border-blue-400">
            {/* Background Clouds */}
            <div className="absolute top-10 left-10 text-white/40"><Zap size={100} /></div>
            <div className="absolute bottom-20 right-10 text-white/40"><Star size={80} /></div>

            {/* HUD */}
            <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur z-10">
                <div className="flex items-center gap-2">
                    <Button onClick={onBack} color="blue" className="px-2 py-1 text-xs"><Home size={14} /></Button>
                    <div className="bg-yellow-400 px-3 py-1 rounded-lg border-2 border-yellow-600 font-bold text-yellow-900">
                        Time: {timeLeft}s
                    </div>
                </div>
                <h2 className="text-xl font-black text-blue-600 hidden md:block">DORAYAKI DASH</h2>
                <div className="bg-blue-600 text-white px-4 py-1 rounded-lg font-bold border-2 border-blue-800">
                    Score: {score}
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 relative">
                {gameState === 'playing' ? (
                    items.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleItemClick(item.id, item.isPrime)}
                            className="absolute transform -translate-x-1/2 transition-transform active:scale-90 hover:scale-110"
                            style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        >
                            {item.isPrime ? (
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                    <DorayakiIcon className="w-full h-full drop-shadow-lg" />
                                    <span className="absolute text-yellow-900 font-black text-lg">{item.val}</span>
                                </div>
                            ) : (
                                <div className="relative w-14 h-14 flex items-center justify-center bg-gray-600 rounded-full border-4 border-gray-800 shadow-xl">
                                    <span className="text-white font-bold">{item.val}</span>
                                </div>
                            )}
                        </button>
                    ))
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-3xl text-center animate-in zoom-in">
                            <h2 className="text-3xl font-black text-blue-600 mb-4">Time's Up!</h2>
                            <p className="text-xl mb-6">You collected <span className="text-yellow-600 font-bold">{score / 10}</span> Primes!</p>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={onBack} color="blue">Back</Button>
                                <Button onClick={() => {
                                    setScore(0);
                                    setTimeLeft(30);
                                    setItems([]);
                                    setGameState('playing');
                                }} color="green">Play Again</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions Overlay for start */}
                {gameState === 'playing' && timeLeft === 30 && items.length === 0 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <p className="text-2xl font-black text-blue-900 bg-white/50 px-6 py-2 rounded-xl">Catch the Prime Cakes!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const QuizMode = ({ onBack, addScore }) => {
    const [question, setQuestion] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
    const [streak, setStreak] = useState(0);

    const generateQuestion = () => {
        const isIdentification = Math.random() > 0.5;

        if (isIdentification) {
            // Find the prime among options
            const correct = PRIMES_UNDER_100[Math.floor(Math.random() * PRIMES_UNDER_100.length)];
            const distractors = [];
            while (distractors.length < 3) {
                const d = Math.floor(Math.random() * 99) + 2;
                if (!PRIMES_UNDER_100.includes(d) && !distractors.includes(d) && d !== correct) {
                    distractors.push(d);
                }
            }
            const options = [...distractors, correct].sort(() => Math.random() - 0.5);

            setQuestion({
                type: 'find',
                text: 'Which one is PRIME?',
                options,
                correct
            });
        } else {
            // Yes/No is it prime
            const num = Math.floor(Math.random() * 99) + 2;
            const isPrime = PRIMES_UNDER_100.includes(num);
            setQuestion({
                type: 'bool',
                text: `Is ${num} a Prime Number?`,
                options: ['Yes', 'No'],
                correct: isPrime ? 'Yes' : 'No'
            });
        }
        setFeedback(null);
    };

    useEffect(() => {
        generateQuestion();
    }, []);

    const handleAnswer = (ans) => {
        if (feedback) return;

        if (ans === question.correct) {
            setFeedback('correct');
            setStreak(s => s + 1);
            addScore(1);
            setTimeout(generateQuestion, 1500);
        } else {
            setFeedback('wrong');
            setStreak(0);
            setTimeout(generateQuestion, 2000);
        }
    };

    return (
        <div className="flex flex-col h-full bg-indigo-50">
            <div className="flex justify-between items-center p-4 bg-white shadow-sm">
                <Button onClick={onBack} color="blue" className="px-4 py-2 text-sm">Exit</Button>
                <div className="flex items-center gap-2">
                    <Trophy className="text-yellow-500" />
                    <span className="font-bold text-indigo-900">Streak: {streak}</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 mb-6 animate-bounce">
                    <RoboCatIcon />
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-indigo-200 w-full max-w-lg text-center">
                    <h3 className="text-2xl font-bold text-indigo-900 mb-8">{question?.text}</h3>

                    <div className="grid grid-cols-2 gap-4">
                        {question?.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                disabled={feedback !== null}
                                className={`
                  p-6 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105 active:scale-95 border-b-4
                  ${feedback === 'correct' && opt === question.correct
                                        ? 'bg-green-500 text-white border-green-700'
                                        : feedback === 'wrong' && opt !== question.correct && feedback !== null // Don't highlight wrong unless clicked usually, but simple here
                                            ? 'opacity-50 bg-gray-200'
                                            : feedback === 'wrong' && opt === question.correct // Show correct if wrong
                                                ? 'bg-green-500 text-white border-green-700 ring-4 ring-green-300'
                                                : 'bg-indigo-100 text-indigo-600 border-indigo-300 hover:bg-indigo-200'
                                    }
                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    <div className={`mt-6 h-8 font-bold text-lg transition-opacity ${feedback ? 'opacity-100' : 'opacity-0'}`}>
                        {feedback === 'correct' ? (
                            <span className="text-green-600 flex items-center justify-center gap-2">
                                <Check size={24} /> Correct! You got a gadget!
                            </span>
                        ) : (
                            <span className="text-red-500 flex items-center justify-center gap-2">
                                <X size={24} /> Oops! Try again!
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main App ---

export default function App() {
    const [view, setView] = useState('menu'); // menu, learn, game, quiz
    const [score, setScore] = useState(0);

    const addScore = (amount) => setScore(s => s + amount);

    return (
        <div className="w-full h-screen bg-sky-100 font-sans text-slate-800 overflow-hidden select-none">
            {/* Container to maintain aspect ratio on desktop, full on mobile */}
            <div className="max-w-4xl mx-auto h-full shadow-2xl bg-white relative overflow-hidden flex flex-col">

                {view === 'menu' && <MainMenu onStart={setView} score={score} />}
                {view === 'learn' && <LearnMode onBack={() => setView('menu')} />}
                {view === 'game' && <GameMode onBack={() => setView('menu')} addScore={addScore} />}
                {view === 'quiz' && <QuizMode onBack={() => setView('menu')} addScore={addScore} />}

                {/* Global Footer Decoration */}
                {view === 'menu' && (
                    <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400" />
                )}
            </div>

            {/* Style for custom font if needed, using system sans for speed but rounded looks better */}
            <style>{`
        body { font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; }
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
      `}</style>
        </div>
    );
}