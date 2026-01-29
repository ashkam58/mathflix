import React, { useState, useEffect, useRef } from 'react';
import { Timer, MousePointer, HelpCircle, AlertCircle, Trophy, RotateCcw } from 'lucide-react';

const ReactionTime: React.FC = () => {
    const [gameState, setGameState] = useState<'IDLE' | 'WAITING' | 'READY' | 'CLICKED' | 'EARLY'>('IDLE');
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(0);
    const [bestTime, setBestTime] = useState<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleStart = () => {
        setGameState('WAITING');
        const delay = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds

        timeoutRef.current = setTimeout(() => {
            setGameState('READY');
            setStartTime(Date.now());
        }, delay);
    };

    const handleClick = () => {
        if (gameState === 'WAITING') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setGameState('EARLY');
        } else if (gameState === 'READY') {
            const time = Date.now() - startTime;
            setReactionTime(time);
            setGameState('CLICKED');
            if (bestTime === null || time < bestTime) {
                setBestTime(time);
            }
        }
    };

    const reset = () => {
        setGameState('IDLE');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Get color based on state
    const getBgColor = () => {
        switch (gameState) {
            case 'IDLE': return 'bg-gray-800';
            case 'WAITING': return 'bg-red-600';
            case 'READY': return 'bg-green-500';
            case 'CLICKED': return 'bg-blue-600';
            case 'EARLY': return 'bg-orange-500';
            default: return 'bg-gray-800';
        }
    };

    return (
        <div className={`w-full h-full min-h-[500px] flex flex-col items-center justify-center transition-colors duration-200 ${getBgColor()} text-white select-none rounded-xl shadow-2xl p-8`}>

            {/* Header / Stats */}
            <div className="absolute top-8 w-full px-8 flex justify-between max-w-4xl">
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
                    <Trophy size={20} className="text-yellow-400" />
                    <span className="font-mono font-bold">Best: {bestTime ? `${bestTime} ms` : '-'}</span>
                </div>
                <h1 className="text-2xl font-black tracking-wider uppercase opacity-80">Reaction Master</h1>
            </div>

            {/* Main Interactive Area */}
            <div
                onMouseDown={gameState === 'WAITING' || gameState === 'READY' ? handleClick : undefined}
                className="w-full max-w-2xl aspect-video flex flex-col items-center justify-center cursor-pointer"
            >
                {gameState === 'IDLE' && (
                    <div className="text-center animate-fade-in space-y-6">
                        <MousePointer size={64} className="mx-auto mb-4 text-blue-400 animate-bounce" />
                        <h2 className="text-4xl font-bold">Test Your Reflexes</h2>
                        <p className="text-xl text-gray-300">Click as fast as you can when the screen turns GREEN.</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleStart(); }}
                            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                        >
                            Start Game
                        </button>
                    </div>
                )}

                {gameState === 'WAITING' && (
                    <div className="text-center animate-pulse">
                        <h2 className="text-6xl font-black">WAIT...</h2>
                        <p className="mt-4 text-2xl opacity-80">Keep your finger ready.</p>
                    </div>
                )}

                {gameState === 'READY' && (
                    <div className="text-center scale-110">
                        <h2 className="text-8xl font-black tracking-tighter">CLICK!</h2>
                        <p className="mt-4 text-3xl font-bold">NOW NOW NOW!</p>
                    </div>
                )}

                {gameState === 'CLICKED' && (
                    <div className="text-center space-y-6 animate-fade-in-up">
                        <div className="inline-block bg-white text-blue-600 rounded-2xl p-8 shadow-xl">
                            <span className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Your Time</span>
                            <span className="text-7xl font-black font-mono">{reactionTime}</span>
                            <span className="text-2xl font-bold ml-2">ms</span>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleStart(); }}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-bold transition-all border border-white/50"
                            >
                                <RotateCcw size={20} /> Try Again
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'EARLY' && (
                    <div className="text-center space-y-4">
                        <AlertCircle size={64} className="mx-auto text-white/80" />
                        <h2 className="text-4xl font-bold">Too Soon!</h2>
                        <p className="text-xl">You clicked before it turned green.</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleStart(); }}
                            className="mt-8 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-bold transition-all border border-white/50"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            <div className="absolute bottom-8 text-white/40 text-sm">
                Reaction Time Test • Mathflix Games
            </div>
        </div>
    );
};

export default ReactionTime;
