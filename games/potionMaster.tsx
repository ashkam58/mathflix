import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Zap, Skull, RefreshCw, Trophy, Volume2, VolumeX } from 'lucide-react';

const PotionGame = () => {
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [currentNumber, setCurrentNumber] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
    const [level, setLevel] = useState(1);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [highScore, setHighScore] = useState(0);

    // Ingredient Data
    const ingredients = [
        {
            id: 2,
            name: "Moon Dust",
            rule: "Even Numbers",
            color: "from-blue-400 to-indigo-600",
            icon: "🌙",
            check: (n) => n % 2 === 0
        },
        {
            id: 5,
            name: "Phoenix Tears",
            rule: "Ends in 0 or 5",
            color: "from-red-400 to-orange-600",
            icon: "🔥",
            check: (n) => n % 5 === 0
        },
        {
            id: 10,
            name: "Toad Slime",
            rule: "Ends in 0",
            color: "from-green-400 to-emerald-600",
            icon: "🐸",
            check: (n) => n % 10 === 0
        },
        {
            id: 3,
            name: "Sun Beams",
            rule: "Sum of digits is 3,6,9...",
            color: "from-yellow-300 to-amber-500",
            icon: "☀️",
            check: (n) => n % 3 === 0,
            minLevel: 2
        }
    ];

    // Sound Effects (Simulated with visual cues/console for now in this environment)
    const playSound = (type) => {
        if (!soundEnabled) return;
        // In a real browser environment with audio files, we would play them here.
        // console.log(`Playing sound: ${type}`);
    };

    const generateNumber = useCallback(() => {
        // Generate a number that is definitely divisible by at least one active ingredient
        let validNumber = false;
        let num = 0;

        // Available divisors based on level
        const activeIngredients = ingredients.filter(i => !i.minLevel || level >= i.minLevel);
        const divisors = activeIngredients.map(i => i.id);

        while (!validNumber) {
            num = Math.floor(Math.random() * 100) + 1;
            // 30% chance to force a "tricky" number (like 10, which works for 2, 5, and 10)
            if (Math.random() > 0.7) {
                const randomDivisor = divisors[Math.floor(Math.random() * divisors.length)];
                num = randomDivisor * (Math.floor(Math.random() * 10) + 1);
            }

            // Ensure at least one rule matches
            if (divisors.some(d => num % d === 0)) {
                validNumber = true;
            }
        }
        setCurrentNumber(num);
    }, [level]);

    const startGame = () => {
        setScore(0);
        setLives(3);
        setLevel(1);
        setGameState('playing');
        generateNumber();
        setFeedback(null);
    };

    const handleIngredientClick = (ingredient) => {
        if (gameState !== 'playing' || feedback) return;

        const isCorrect = ingredient.check(currentNumber);

        if (isCorrect) {
            // Success Logic
            setFeedback('correct');
            playSound('success');
            setScore(prev => prev + 10);

            // Level up every 50 points
            if ((score + 10) % 50 === 0) {
                setLevel(prev => prev + 1);
            }

            setTimeout(() => {
                setFeedback(null);
                generateNumber();
            }, 1000); // Wait for animation
        } else {
            // Failure Logic
            setFeedback('wrong');
            playSound('explode');
            setLives(prev => prev - 1);

            if (lives <= 1) {
                setTimeout(() => {
                    setGameState('gameover');
                    if (score > highScore) setHighScore(score);
                }, 1000);
            } else {
                setTimeout(() => {
                    setFeedback(null);
                }, 1000);
            }
        }
    };

    // --- SVG Components ---

    const CauldronSVG = ({ state }) => (
        <svg viewBox="0 0 200 200" className="w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl transition-all duration-300">
            <defs>
                <radialGradient id="liquidGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor={state === 'correct' ? '#FCD34D' : state === 'wrong' ? '#EF4444' : '#8B5CF6'} />
                    <stop offset="100%" stopColor={state === 'correct' ? '#F59E0B' : state === 'wrong' ? '#991B1B' : '#4C1D95'} />
                </radialGradient>
            </defs>

            {/* Back legs */}
            <path d="M50 160 L40 190" stroke="#374151" strokeWidth="8" strokeLinecap="round" />
            <path d="M150 160 L160 190" stroke="#374151" strokeWidth="8" strokeLinecap="round" />

            {/* Pot Body */}
            <path d="M20 60 Q20 170 100 170 Q180 170 180 60" fill="#1F2937" stroke="#374151" strokeWidth="4" />
            <ellipse cx="100" cy="60" rx="80" ry="15" fill="#374151" />

            {/* Liquid */}
            <ellipse cx="100" cy="65" rx="70" ry="12" fill="url(#liquidGrad)" className={`${state === 'correct' ? 'animate-pulse' : ''}`} />

            {/* Bubbles Animation */}
            {state !== 'wrong' && (
                <g className="animate-bounce" style={{ animationDuration: '3s' }}>
                    <circle cx="80" cy="50" r="5" fill={state === 'correct' ? '#FCD34D' : '#A78BFA'} opacity="0.6">
                        <animate attributeName="cy" from="60" to="20" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="120" cy="55" r="3" fill={state === 'correct' ? '#FCD34D' : '#A78BFA'} opacity="0.6">
                        <animate attributeName="cy" from="60" to="10" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                        <animate attributeName="opacity" values="0.6;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                    </circle>
                </g>
            )}

            {/* Explosion Effect */}
            {state === 'wrong' && (
                <g>
                    <path d="M100 60 L80 20" stroke="#EF4444" strokeWidth="4" />
                    <path d="M100 60 L120 20" stroke="#EF4444" strokeWidth="4" />
                    <path d="M100 60 L100 10" stroke="#EF4444" strokeWidth="4" />
                    <path d="M100 60 L60 40" stroke="#EF4444" strokeWidth="4" />
                    <path d="M100 60 L140 40" stroke="#EF4444" strokeWidth="4" />
                    <circle cx="100" cy="60" r="20" fill="#EF4444" opacity="0.5" className="animate-ping" />
                </g>
            )}

            {/* Rim Highlight */}
            <path d="M20 60 Q20 75 100 75 Q180 75 180 60" fill="none" stroke="#4B5563" strokeWidth="2" opacity="0.5" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden flex flex-col items-center justify-center relative select-none">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-600 rounded-full blur-[100px] opacity-20 animate-pulse delay-700"></div>
                {/* Stone Wall Texture CSS Pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            </div>

            {/* Header / HUD */}
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Score</span>
                        <span className="text-2xl font-bold text-yellow-400 font-mono">{score}</span>
                    </div>
                    {level > 1 && (
                        <div className="px-2 py-1 bg-purple-900/50 rounded border border-purple-500/30 text-xs text-purple-300">
                            Level {level}
                        </div>
                    )}
                </div>

                <h1 className="hidden md:block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                    Potion Master's Code
                </h1>

                <div className="flex items-center space-x-4">
                    <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <Zap key={i} size={20} className={`${i < lives ? 'text-red-400 fill-red-400' : 'text-slate-600'} transition-all`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* GAME OVER SCREEN */}
            {gameState === 'gameover' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 shadow-2xl text-center max-w-md w-full mx-4 transform transition-all hover:scale-105">
                        <Skull size={64} className="mx-auto text-slate-600 mb-4" />
                        <h2 className="text-4xl font-bold mb-2 text-white">Potion Ruined!</h2>
                        <p className="text-slate-400 mb-6">The mixture became unstable.</p>

                        <div className="flex justify-center space-x-8 mb-8">
                            <div className="text-center">
                                <p className="text-xs text-slate-500 uppercase">Your Score</p>
                                <p className="text-3xl font-bold text-yellow-400">{score}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-500 uppercase">Best Score</p>
                                <p className="text-3xl font-bold text-purple-400">{highScore}</p>
                            </div>
                        </div>

                        <button
                            onClick={startGame}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 active:scale-95 transition-all shadow-lg flex items-center justify-center space-x-2"
                        >
                            <RefreshCw size={20} />
                            <span>Brew Again</span>
                        </button>
                    </div>
                </div>
            )}

            {/* START SCREEN */}
            {gameState === 'start' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 animate-in fade-in duration-500">
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 rounded-full"></div>
                        <CauldronSVG state="idle" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 mb-4 text-center px-4">
                        Potion Master
                    </h1>
                    <p className="text-slate-400 mb-8 text-center max-w-sm px-4">
                        Add the correct ingredient based on the number's secret code!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-2xl px-4">
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center space-x-3">
                            <div className="text-2xl">🌙</div>
                            <div className="text-left">
                                <div className="font-bold text-blue-300">Moon Dust</div>
                                <div className="text-xs text-slate-400">For Even Numbers</div>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center space-x-3">
                            <div className="text-2xl">🔥</div>
                            <div className="text-left">
                                <div className="font-bold text-red-300">Phoenix Tears</div>
                                <div className="text-xs text-slate-400">Ends in 0 or 5</div>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center space-x-3">
                            <div className="text-2xl">🐸</div>
                            <div className="text-left">
                                <div className="font-bold text-green-300">Toad Slime</div>
                                <div className="text-xs text-slate-400">Ends in 0</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        className="px-12 py-4 bg-yellow-500 text-yellow-950 rounded-full font-bold text-xl hover:bg-yellow-400 hover:scale-105 transition-all shadow-xl shadow-yellow-500/20 flex items-center space-x-2"
                    >
                        <Sparkles />
                        <span>Start Brewing</span>
                    </button>
                </div>
            )}

            {/* GAMEPLAY AREA */}
            <div className={`flex flex-col items-center justify-between h-full py-20 w-full max-w-3xl transition-opacity duration-500 ${gameState !== 'playing' ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'}`}>

                {/* The Magic Number Cloud */}
                <div className="relative group">
                    <div className={`absolute inset-0 bg-white/10 blur-xl rounded-full transition-all duration-300 ${feedback === 'correct' ? 'bg-green-400/30 scale-150' : feedback === 'wrong' ? 'bg-red-500/30 scale-150' : ''}`}></div>
                    <div className="text-8xl md:text-9xl font-black font-mono tracking-tighter drop-shadow-lg transform transition-all duration-300"
                        style={{
                            color: feedback === 'correct' ? '#4ADE80' : feedback === 'wrong' ? '#EF4444' : '#E2E8F0',
                            transform: feedback ? 'scale(1.2)' : 'scale(1)'
                        }}>
                        {currentNumber}
                    </div>
                    {feedback === 'correct' && (
                        <div className="absolute -right-12 -top-4 text-yellow-400 animate-bounce font-bold text-2xl">+10</div>
                    )}
                </div>

                {/* The Cauldron */}
                <div className="relative my-4">
                    <CauldronSVG state={feedback} />

                    {/* Instruction Text */}
                    <div className="absolute -bottom-8 w-full text-center">
                        <p className="text-sm font-medium text-slate-400 bg-slate-900/80 px-4 py-1 rounded-full inline-block border border-slate-700">
                            What ingredient matches {currentNumber}?
                        </p>
                    </div>
                </div>

                {/* Ingredient Shelf */}
                <div className="w-full px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {ingredients.filter(i => !i.minLevel || level >= i.minLevel).map((ing) => (
                            <button
                                key={ing.id}
                                onClick={() => handleIngredientClick(ing)}
                                disabled={!!feedback}
                                className={`
                            relative group overflow-hidden
                            bg-slate-800 border-2 border-slate-700 hover:border-slate-500
                            rounded-xl p-4 transition-all duration-200
                            hover:-translate-y-1 active:scale-95 active:translate-y-0
                            flex flex-col items-center justify-center
                            ${feedback ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}
                        `}
                            >
                                {/* Glowing Background on Hover */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${ing.color} transition-opacity`}></div>

                                <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-200">{ing.icon}</div>
                                <div className="font-bold text-white text-sm md:text-base">{ing.name}</div>
                                <div className={`text-xs font-mono mt-1 bg-gradient-to-r ${ing.color} text-transparent bg-clip-text font-bold`}>
                                    {ing.rule}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Level Unlock Message */}
                    {level === 1 && (
                        <div className="text-center mt-4 text-xs text-slate-500">
                            Reach 50 points to unlock Sun Beams! ☀️
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default PotionGame;