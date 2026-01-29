import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Play, RefreshCw, Trophy, Crown, Cloud } from 'lucide-react';

const StaircaseGame = () => {
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
    const [baseNumber, setBaseNumber] = useState(5);
    const [score, setScore] = useState(0);
    const [platforms, setPlatforms] = useState([]);
    const [playerPos, setPlayerPos] = useState({ rowId: -1, colIndex: 1 }); // -1 is the ground
    const [cameraY, setCameraY] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [highScore, setHighScore] = useState(0);

    // --- Game Logic ---

    // Generate a distracter number that is close to the correct answer but NOT a multiple
    const generateDistractor = (correctVal, base) => {
        let badVal = correctVal;
        while (badVal === correctVal || badVal % base === 0 || badVal <= 0) {
            // Generate number within range of +/- 10
            const offset = Math.floor(Math.random() * 20) - 10;
            badVal = correctVal + offset;
        }
        return badVal;
    };

    const createRow = (rowId, base) => {
        const correctVal = base * (rowId + 1); // Row 0 is base*1, Row 1 is base*2

        // Create 3 slots
        const slots = [null, null, null];
        const correctIndex = Math.floor(Math.random() * 3);

        // Fill correct slot
        slots[correctIndex] = { val: correctVal, type: 'correct', id: `r${rowId}-c${correctIndex}` };

        // Fill other slots with distractors
        for (let i = 0; i < 3; i++) {
            if (i !== correctIndex) {
                slots[i] = {
                    val: generateDistractor(correctVal, base),
                    type: 'wrong',
                    id: `r${rowId}-c${i}`
                };
            }
        }
        return { id: rowId, slots };
    };

    const startGame = (selectedBase) => {
        setBaseNumber(selectedBase);
        setScore(0);
        setPlayerPos({ rowId: -1, colIndex: 1 }); // Start on ground
        setCameraY(0);
        setAnimating(false);

        // Generate initial platforms
        const initialPlatforms = [];
        for (let i = 0; i < 7; i++) {
            initialPlatforms.push(createRow(i, selectedBase));
        }
        setPlatforms(initialPlatforms);
        setGameState('playing');
    };

    const handleJump = (rowId, colIndex, platform) => {
        if (gameState !== 'playing' || animating) return;

        // Verify jump is to the immediate next row
        if (rowId !== playerPos.rowId + 1) return;

        setAnimating(true);
        setPlayerPos({ rowId, colIndex });

        if (platform.type === 'correct') {
            // SUCCESS JUMP
            setTimeout(() => {
                setScore(prev => prev + 1);
                setCameraY(prev => prev + 120); // Move camera up

                // Add new platform at top
                setPlatforms(prev => {
                    const nextRowId = prev[prev.length - 1].id + 1;
                    return [...prev, createRow(nextRowId, baseNumber)];
                });

                setAnimating(false);
            }, 400); // Wait for jump animation
        } else {
            // FAILED JUMP
            setTimeout(() => {
                setGameState('gameover');
                if (score > highScore) setHighScore(score);
                setAnimating(false);
            }, 600); // Wait for fall animation starts
        }
    };

    // --- Graphics Components ---

    const WizardCharacter = ({ isJumping, isFalling }) => (
        <svg viewBox="0 0 100 100" className={`w-16 h-16 transition-transform duration-300 ${isJumping ? '-translate-y-8 scale-110' : ''} ${isFalling ? 'translate-y-20 rotate-12 opacity-0' : ''}`}>
            {/* Cape */}
            <path d="M30 60 Q50 90 70 60 L70 80 Q50 100 30 80 Z" fill="#7C3AED" />
            {/* Body */}
            <circle cx="50" cy="60" r="20" fill="#8B5CF6" />
            {/* Eyes */}
            <circle cx="43" cy="55" r="3" fill="white" />
            <circle cx="57" cy="55" r="3" fill="white" />
            <circle cx="43" cy="55" r="1" fill="black" />
            <circle cx="57" cy="55" r="1" fill="black" />
            {/* Hat */}
            <path d="M20 45 L80 45 L50 5 Z" fill="#4C1D95" />
            <path d="M20 45 Q50 55 80 45" fill="#5B21B6" />
            {/* Stars on Hat */}
            <circle cx="50" cy="25" r="2" fill="yellow" className="animate-pulse" />
            <circle cx="40" cy="35" r="1.5" fill="yellow" />
            <circle cx="60" cy="35" r="1.5" fill="yellow" />
        </svg>
    );

    const StonePlatform = ({ val, type, isClicked }) => {
        // Platform visual state
        let bgClass = "fill-slate-700";
        let textClass = "fill-slate-300";

        if (isClicked) {
            if (type === 'correct') {
                bgClass = "fill-green-600";
                textClass = "fill-white";
            } else {
                bgClass = "fill-red-600 opacity-50"; // Crumbling look
                textClass = "fill-red-200";
            }
        }

        return (
            <svg viewBox="0 0 140 60" className="w-full h-full drop-shadow-lg cursor-pointer hover:scale-105 transition-transform">
                {/* Floating Animation Wrapper handled by CSS in parent usually, but SVG internal logic here */}
                <path d="M10 20 Q70 0 130 20 L120 50 Q70 60 20 50 Z" className={bgClass} stroke="#1E293B" strokeWidth="2" />
                <path d="M10 20 Q70 0 130 20" fill="none" stroke="#334155" strokeWidth="3" opacity="0.5" />
                <text x="70" y="42" textAnchor="middle" fontSize="24" fontWeight="bold" fontFamily="monospace" className={textClass}>{val}</text>

                {/* Moss/Grass decoration */}
                <path d="M30 25 Q35 15 40 25" stroke="#22C55E" strokeWidth="2" fill="none" />
                <path d="M90 23 Q95 13 100 23" stroke="#22C55E" strokeWidth="2" fill="none" />
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-sky-900 overflow-hidden relative font-sans select-none text-white">

            {/* --- BACKGROUND SKY --- */}
            <div
                className="absolute inset-0 transition-colors duration-[5000ms]"
                style={{
                    background: `linear-gradient(to bottom, 
             ${score > 10 ? '#0f172a' : '#1e3a8a'} 0%, 
             ${score > 5 ? '#4c1d95' : '#3b82f6'} 100%)`
                }}
            >
                {/* Moving Clouds */}
                <div className="absolute top-20 left-10 opacity-20 animate-pulse"><Cloud size={100} /></div>
                <div className="absolute top-60 right-20 opacity-10 animate-pulse delay-700"><Cloud size={80} /></div>

                {/* Stars (appear when high up) */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ${score > 5 ? 'opacity-100' : 'opacity-0'}`}>
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute bg-white rounded-full w-1 h-1" style={{ top: Math.random() * 100 + '%', left: Math.random() * 100 + '%' }}></div>
                    ))}
                </div>
            </div>

            {/* --- HUD --- */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-slate-900/30 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded font-bold text-xs uppercase">Target</span>
                    <span className="font-bold text-lg">Multiples of {baseNumber}</span>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-3xl font-black text-white drop-shadow-md">{score}m</div>
                    <div className="text-xs text-slate-300">Height</div>
                </div>
            </div>

            {/* --- MENU SCREEN --- */}
            {gameState === 'menu' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 animate-in fade-in">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-purple-600 rounded-full mb-4 shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                            <ArrowUp size={48} className="text-white animate-bounce" />
                        </div>
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-purple-400 mb-2">
                            Staircase of Spells
                        </h1>
                        <p className="text-slate-300">Choose your magic number to climb!</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full max-w-md px-4">
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                            <button
                                key={num}
                                onClick={() => startGame(num)}
                                className="py-4 bg-slate-800 hover:bg-purple-600 border border-slate-700 hover:border-purple-400 rounded-xl font-bold text-xl transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* --- GAME OVER SCREEN --- */}
            {gameState === 'gameover' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-red-900/90 backdrop-blur animate-in zoom-in duration-300">
                    <Trophy size={64} className="text-yellow-400 mb-4" />
                    <h2 className="text-4xl font-bold text-white mb-2">You fell!</h2>
                    <p className="text-xl text-red-200 mb-8">It's a long way down...</p>

                    <div className="bg-black/30 p-6 rounded-xl mb-8 flex justify-between w-64 border border-white/10">
                        <div className="text-center">
                            <div className="text-xs text-slate-400 uppercase">Score</div>
                            <div className="text-3xl font-bold">{score}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-400 uppercase">Best</div>
                            <div className="text-3xl font-bold text-yellow-400">{highScore}</div>
                        </div>
                    </div>

                    <button
                        onClick={() => setGameState('menu')}
                        className="px-8 py-3 bg-white text-red-900 font-bold rounded-full hover:scale-110 transition-transform flex items-center gap-2"
                    >
                        <RefreshCw size={20} /> Play Again
                    </button>
                </div>
            )}

            {/* --- PLAYING AREA --- */}
            <div
                className="absolute inset-0 flex justify-center items-end pb-10 overflow-hidden"
                style={{ perspective: '1000px' }}
            >
                {/* Main scrolling container */}
                <div
                    className="relative w-full max-w-md h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateY(${cameraY}px)` }}
                >

                    {/* Render Platforms */}
                    {platforms.map((row, index) => {
                        // Calculate visual position (bottom-up)
                        // Each row is 120px height
                        const bottomPos = (row.id + 1) * 120;

                        // Only render if visible (performance)
                        // current cameraY moves positive. 
                        // row.id * 120 needs to be within [cameraY, cameraY + screenHeight] roughly
                        // Simplified: always render for this demo size

                        return (
                            <div
                                key={row.id}
                                className="absolute left-0 right-0 h-24 flex justify-between items-center px-2"
                                style={{ bottom: `${bottomPos}px` }}
                            >
                                {row.slots.map((slot, colIdx) => (
                                    <div
                                        key={slot.id}
                                        className="w-1/3 p-1 relative group"
                                        onClick={() => handleJump(row.id, colIdx, slot)}
                                    >
                                        <StonePlatform
                                            val={slot.val}
                                            type={slot.type}
                                            isClicked={playerPos.rowId === row.id && playerPos.colIndex === colIdx}
                                        />
                                        {/* Hover Effect Helper */}
                                        {gameState === 'playing' && playerPos.rowId === row.id - 1 && (
                                            <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    })}

                    {/* Starting Ground */}
                    <div className="absolute bottom-0 w-full h-10 bg-emerald-800 rounded-t-full flex items-center justify-center border-t-4 border-emerald-600">
                        <span className="text-emerald-300 text-sm font-bold opacity-50">START</span>
                    </div>

                    {/* Player Character */}
                    {/* Position depends on state */}
                    <div
                        className="absolute w-24 h-24 flex items-center justify-center transition-all duration-300 ease-out z-20 pointer-events-none"
                        style={{
                            bottom: `${(playerPos.rowId + 1) * 120 + 30}px`, // +30 to sit on platform
                            left: `${playerPos.colIndex * 33.33}%`,
                            width: '33.33%'
                        }}
                    >
                        <WizardCharacter
                            isJumping={animating && gameState !== 'gameover'}
                            isFalling={gameState === 'gameover'}
                        />
                    </div>

                </div>

                {/* Lava/Void at bottom that follows camera */}
                <div
                    className="absolute -bottom-20 w-full h-24 bg-purple-900 blur-xl opacity-80 z-10 transition-transform duration-500"
                // style={{ transform: `translateY(${cameraY * 0.8}px)` }} // Moves slower than camera to look like it's rising
                ></div>

            </div>

            {/* Tutorial/Guide Overlay for first move */}
            {gameState === 'playing' && score === 0 && (
                <div className="absolute bottom-40 left-0 right-0 text-center animate-bounce pointer-events-none z-30">
                    <div className="inline-block bg-black/50 text-white px-4 py-2 rounded-xl backdrop-blur">
                        Tap the number <b>{baseNumber}</b> to jump!
                    </div>
                </div>
            )}

        </div>
    );
};

export default StaircaseGame;