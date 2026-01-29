import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, FastForward, Info, Pause, Code } from 'lucide-react';

const LinearSearchApp = () => {
    const [boxes, setBoxes] = useState(Array(7).fill({ status: 'idle' }));
    const [jerryIndex, setJerryIndex] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isSearching, setIsSearching] = useState(false);
    const [searchSpeed, setSearchSpeed] = useState(1200); // Slower default for code reading
    const [message, setMessage] = useState("Help Tom find Jerry! Click 'Start Chase' to begin.");
    const [gameResult, setGameResult] = useState(null);
    const [activeLine, setActiveLine] = useState(0); // 0 = no code highlighted

    // Initialize the game
    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        const newJerryIndex = Math.floor(Math.random() * 7);
        setJerryIndex(newJerryIndex);
        setBoxes(Array(7).fill({ status: 'idle' }));
        setCurrentIndex(-1);
        setIsSearching(false);
        setGameResult(null);
        setActiveLine(0);
        setMessage("Jerry is hiding! Tom has the 'Linear Search' blueprint ready.");
    };

    // The Search Loop
    useEffect(() => {
        let timeoutId;

        if (isSearching) {
            if (currentIndex === -1) {
                // Initial delay before starting the loop visual
                timeoutId = setTimeout(() => {
                    setCurrentIndex(0);
                    setActiveLine(1); // Highlights "for let i = 0..."
                }, 500);
            } else if (currentIndex < boxes.length && gameResult !== 'won') {
                processStep();
            } else if (currentIndex >= boxes.length) {
                setIsSearching(false);
                setActiveLine(5); // "return false"
                setMessage("Tom checked everywhere. Jerry got away!");
            }
        }

        return () => clearTimeout(timeoutId);
    }, [isSearching, currentIndex, boxes, searchSpeed, gameResult]);

    const processStep = () => {
        // We break the "loop" into visual steps using timeouts

        // Step 1: Check condition (Implicit in the loop structure, but visually we are entering the block)
        // Already set activeLine(1) before entering here or at end of previous cycle

        // Step 2: Check the 'if' condition
        setTimeout(() => {
            setActiveLine(2); // "if (arr[i] === target)"

            setBoxes(prev => {
                const newBoxes = [...prev];
                newBoxes[currentIndex] = { ...newBoxes[currentIndex], status: 'checking' };
                return newBoxes;
            });
            setMessage(`Checking index ${currentIndex}: Is Jerry here?`);

            // Step 3: Result of check
            setTimeout(() => {
                if (currentIndex === jerryIndex) {
                    // FOUND
                    setActiveLine(3); // "return i"
                    setBoxes(prev => {
                        const newBoxes = [...prev];
                        newBoxes[currentIndex] = { ...newBoxes[currentIndex], status: 'found' };
                        return newBoxes;
                    });
                    setIsSearching(false);
                    setGameResult('won');
                    setMessage(`GOTCHA! Found Jerry at index ${currentIndex}!`);
                } else {
                    // NOT FOUND, PREPARE NEXT LOOP
                    setBoxes(prev => {
                        const newBoxes = [...prev];
                        newBoxes[currentIndex] = { ...newBoxes[currentIndex], status: 'empty' };
                        return newBoxes;
                    });

                    // Move to next iteration
                    setCurrentIndex(prev => prev + 1);
                    setActiveLine(1); // Back to "for loop" line
                }
            }, searchSpeed / 2);

        }, searchSpeed / 2);
    };

    const toggleSearch = () => {
        if (gameResult === 'won' || (currentIndex >= boxes.length && currentIndex > 0)) {
            resetGame();
            setTimeout(() => setIsSearching(true), 100);
        } else {
            setIsSearching(!isSearching);
            // If starting fresh, set line to 1
            if (!isSearching && currentIndex === -1) setActiveLine(1);
        }
    };

    const changeSpeed = () => {
        setSearchSpeed(prev => (prev === 1200 ? 600 : 1200));
    };

    // --- Components ---

    const CodeSnippet = ({ activeLine }) => {
        const codeLines = [
            { id: 1, text: "for (let i = 0; i < trashCans.length; i++) {" },
            { id: 2, text: "  if (trashCans[i] === 'Jerry') {" },
            { id: 3, text: "    return 'Found Him!';" },
            { id: 4, text: "  }" },
            { id: 5, text: "}" },
            { id: 6, text: "return 'Not Found';" }
        ];

        return (
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 shadow-inner w-full sm:w-80 border-4 border-gray-700 relative overflow-hidden">
                {/* Acme Stamp */}
                <div className="absolute top-2 right-2 opacity-20 transform rotate-12 pointer-events-none">
                    <div className="border-2 border-red-500 text-red-500 font-bold px-2 text-xs rounded uppercase">Acme Code</div>
                </div>

                <div className="mb-2 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-700 pb-1">Script.js</div>
                {codeLines.map((line) => (
                    <div
                        key={line.id}
                        className={`px-2 py-1 rounded transition-colors duration-200 ${activeLine === line.id ? 'bg-yellow-600 text-white font-bold scale-105 origin-left' : ''}`}
                    >
                        <span className="inline-block w-6 text-gray-600 select-none text-xs">{line.id}</span>
                        {line.text}
                    </div>
                ))}

                {/* Variable Watcher */}
                <div className="mt-4 pt-2 border-t border-gray-700 text-xs text-green-400 font-mono">
                    <p>Variables:</p>
                    <div className="flex justify-between mt-1">
                        <span>i = <span className="text-white">{currentIndex === -1 ? 0 : currentIndex >= 7 ? 6 : currentIndex}</span></span>
                        <span>val = <span className="text-white">{currentIndex !== -1 && currentIndex < 7 ? (currentIndex === jerryIndex ? "'Jerry'" : "'Trash'") : "null"}</span></span>
                    </div>
                </div>
            </div>
        );
    };

    const TomIcon = () => (
        <div className="w-16 h-16 relative animate-bounce-slight">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                <circle cx="50" cy="50" r="45" fill="#6B7280" stroke="#374151" strokeWidth="3" />
                <path d="M30 35 L40 20 L50 35" fill="#6B7280" stroke="#374151" strokeWidth="2" />
                <path d="M70 35 L60 20 L50 35" fill="#6B7280" stroke="#374151" strokeWidth="2" />
                <circle cx="35" cy="45" r="5" fill="white" /> <circle cx="35" cy="45" r="2" fill="black" />
                <circle cx="65" cy="45" r="5" fill="white" /> <circle cx="65" cy="45" r="2" fill="black" />
                <ellipse cx="50" cy="60" rx="8" ry="5" fill="#FCA5A5" />
                <path d="M30 65 Q50 80 70 65" stroke="black" strokeWidth="2" fill="none" />
                <path d="M20 60 L5 55 M20 65 L5 70 M80 60 L95 55 M80 65 L95 70" stroke="black" strokeWidth="1" />
            </svg>
        </div>
    );

    const JerryIcon = () => (
        <div className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pop-in z-10">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <circle cx="50" cy="50" r="40" fill="#D97706" stroke="#92400E" strokeWidth="3" />
                <circle cx="30" cy="30" r="15" fill="#D97706" stroke="#92400E" strokeWidth="2" />
                <circle cx="70" cy="30" r="15" fill="#D97706" stroke="#92400E" strokeWidth="2" />
                <circle cx="40" cy="45" r="4" fill="black" />
                <circle cx="60" cy="45" r="4" fill="black" />
                <circle cx="50" cy="60" r="3" fill="black" />
                <path d="M40 70 Q50 75 60 70" stroke="black" strokeWidth="2" fill="none" />
            </svg>
        </div>
    );

    interface TrashCanProps {
        status: string;
        index: number;
    }

    const TrashCan: React.FC<TrashCanProps> = ({ status, index }) => {
        let bgColor = "bg-gray-300";
        let borderColor = "border-gray-500";
        let scale = "scale-100";
        let shadow = "shadow-md";

        if (status === 'checking') {
            bgColor = "bg-yellow-100";
            borderColor = "border-yellow-500";
            scale = "scale-110";
            shadow = "shadow-xl ring-4 ring-yellow-300";
        } else if (status === 'found') {
            bgColor = "bg-green-100";
            borderColor = "border-green-600";
            scale = "scale-110";
            shadow = "shadow-xl ring-4 ring-green-400";
        } else if (status === 'empty') {
            bgColor = "bg-gray-200";
            borderColor = "border-gray-300";
            scale = "scale-95 opacity-60";
            shadow = "shadow-sm";
        }

        return (
            <div className={`relative flex flex-col items-center justify-end w-16 h-20 sm:w-20 sm:h-28 transition-all duration-300 ease-in-out transform ${scale}`}>
                <div className="absolute -top-6 text-gray-500 font-bold font-mono text-xs">Idx:{index}</div>

                {status === 'checking' && (
                    <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-20">
                        <TomIcon />
                    </div>
                )}

                <div className={`w-full h-full rounded-lg border-4 ${borderColor} ${bgColor} ${shadow} flex items-center justify-center overflow-hidden relative`}>
                    <div className={`absolute top-0 w-[110%] h-3 bg-gray-600 rounded-full transform -translate-y-1/2 transition-transform duration-300 ${status !== 'idle' ? '-rotate-12 -translate-y-3' : ''}`}></div>

                    <div className="absolute w-full h-full flex flex-col justify-evenly opacity-20 pointer-events-none">
                        <div className="h-1 bg-black w-full"></div>
                        <div className="h-1 bg-black w-full"></div>
                    </div>

                    {status === 'found' && <JerryIcon />}
                    {status === 'empty' && (
                        <div className="text-xl opacity-50 select-none animate-pulse">❌</div>
                    )}
                    {status === 'idle' && (
                        <div className="text-2xl opacity-30 select-none">?</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-blue-50 text-gray-800 font-sans flex flex-col">
            <header className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl overflow-hidden border-2 border-gray-800">🐱</div>
                        <h1 className="text-xl font-bold tracking-tight">Linear Search Visualization</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Code size={18} className="hidden sm:block" />
                        <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">Step-by-Step Mode</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col lg:flex-row items-start justify-center p-4 gap-8 max-w-7xl mx-auto w-full">

                {/* LEFT COLUMN: Visuals */}
                <div className="flex-1 w-full flex flex-col items-center space-y-6">

                    {/* Message Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-lg w-full text-center border-b-4 border-blue-400 min-h-[5rem] flex items-center justify-center">
                        <p className="text-lg font-medium text-gray-700">
                            {message}
                        </p>
                    </div>

                    {/* Trash Cans Grid */}
                    <div className="bg-white/50 rounded-2xl p-6 w-full flex flex-wrap justify-center gap-4 min-h-[300px] items-center border border-blue-100 shadow-inner">
                        {boxes.map((box, idx) => (
                            <TrashCan key={idx} index={idx} status={box.status} />
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="bg-white p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-center gap-4 w-full border border-gray-100">
                        <button
                            onClick={toggleSearch}
                            disabled={gameResult === 'won' && !isSearching}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95 ${isSearching ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} shadow-md`}
                        >
                            {isSearching ? <Pause size={20} /> : <Play size={20} />}
                            <span>{isSearching ? 'Pause' : gameResult === 'won' ? 'Found!' : 'Run Code'}</span>
                        </button>

                        <button
                            onClick={resetGame}
                            className="flex items-center space-x-2 px-6 py-3 rounded-full font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all active:scale-95 shadow-sm"
                        >
                            <RotateCcw size={20} />
                            <span>Reset</span>
                        </button>

                        <div className="w-px h-8 bg-gray-300 hidden sm:block"></div>

                        <button
                            onClick={changeSpeed}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                            <FastForward size={18} />
                            <span>Speed: {searchSpeed === 1200 ? 'Normal' : 'Fast'}</span>
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Code & Theory */}
                <div className="w-full lg:w-80 flex flex-col gap-6">

                    {/* Code Panel */}
                    <div className="w-full flex justify-center lg:justify-start">
                        <CodeSnippet activeLine={activeLine} />
                    </div>

                    {/* Theory Card */}
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 relative">
                        <div className="absolute -top-3 left-4 bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Info size={14} /> LOGIC
                        </div>
                        <div className="space-y-2 text-sm text-gray-700 mt-2">
                            <p>
                                <span className="font-bold">1. Loop:</span> We visit each index <code>i</code> from 0 to 6.
                            </p>
                            <p>
                                <span className="font-bold">2. Compare:</span> At each step, we ask: "Is the item at <code>trashCans[i]</code> equal to <code>'Jerry'</code>?"
                            </p>
                            <p>
                                <span className="font-bold">3. Return:</span> If YES, we return "Found". If we finish the loop without finding him, he's not there.
                            </p>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default LinearSearchApp;