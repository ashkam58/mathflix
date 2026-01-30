import { Category, Game } from './types';
import ReactionTime from './games/ReactionTime';
import LinearSearchApp from './games/tomAndJerryLinearSearch';
import MentalMathMayhem from './games/mentalMathMayhem';
import DerivOMatic from './games/Deriv-O-Matic3000';

export const INITIAL_GAMES: Game[] = [
    {
        id: 'dsa-search-01',
        title: 'Tom & Jerry: Linear Search',
        description: 'Help Tom find Jerry hiding in the trash cans! Learn how Linear Search works by checking each spot one by one.',
        category: Category.DSA,
        grade: 'Grade 6-9',
        topics: ['Computer Science', 'Algorithms'],
        subtopics: ['Linear Search', 'Loops', 'Conditionals'],
        thumbnailUrl: '/thumbnails/tom-jerry-search.png', // Needs generation if not exists, but leaving placeholder as per pattern
        type: 'react',
        component: LinearSearchApp,
        isPremium: false,
        views: 0,
        content: ''
    },
    {
        id: 'math-ninja-dojo-01',
        title: 'Math Ninja Dojo',
        description: 'Train your brain like a ninja! Solve math problems quickly to build combos and earn points. Features 8-bit chiptune music, pixel art styling, and three difficulty levels.',
        category: Category.MATH,
        grade: 'Grade 3-8',
        topics: ['Mental Math', 'Arithmetic'],
        subtopics: ['Addition', 'Subtraction', 'Multiplication', 'Division'],
        thumbnailUrl: '/thumbnails/math-ninja-dojo.png',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/mathNinjaDojo.html'
    },
    {
        id: 'phys-static-01',
        title: 'Static Shock: The Electron Heist',
        description: 'Master the laws of static electricity! Rub materials together, track the moving electrons, and determine the net charge.',
        category: Category.SCIENCE, // Fits best within provided enums (logic/deduction)
        grade: 'Grade 6-9',
        topics: ['Physics', 'Electricity', 'Atoms'],
        subtopics: ['Triboelectricity', 'Electron Transfer', 'Net Charge'],
        thumbnailUrl: '/thumbnails/static-shock.png',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/static-shock.html'
    },
    {
        id: "math-circle-master-09",
        title: "Neon Circle Master",
        description: "Master Grade 9 Circle Theorems! Drag points to verify theorems and solve neon-styled puzzles.",
        category: Category.MATH,
        grade: "Grade 9",
        topics: ["Geometry", "Circles"],
        subtopics: ["Chords & Arcs", "Cyclic Quads", "Tangents"],
        thumbnailUrl: "/thumbnails/circle-master.png",
        type: "html",
        isPremium: false,
        views: 0,
        content: `< !DOCTYPE html >
  <html lang="en" >
  <head>
  <meta charset="UTF-8" >
  <meta name="viewport" content = "width=device-width, initial-scale=1.0" >
  <title>Neon Circle Master </title>
  < script src = "https://unpkg.com/react@18/umd/react.development.js" crossorigin > </script>
  < script src = "https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin > </script>
  < script src = "https://unpkg.com/@babel/standalone/babel.min.js" > </script>
  < script src = "https://cdn.tailwindcss.com" > </script>
  <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap');
        
        body {
  background - color: #12121c;
  color: #ffffff;
  font - family: 'Roboto', sans - serif;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Prevent body scroll, handle inside app */
}
        
        .neon - text {
  color: #00ffff;
  text - shadow: 0 0 5px #00ffff, 0 0 10px #00ffff;
  font - family: 'Orbitron', sans - serif;
}

        .neon - pink - text {
  color: #ff00ff;
  text - shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff;
  font - family: 'Orbitron', sans - serif;
}

        .neon - border {
  border: 2px solid #00ffff;
  box - shadow: 0 0 5px #00ffff, inset 0 0 5px #00ffff;
  border - radius: 12px;
}

        .glass - panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop - filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

        /* Scrollbar styling */
        :: -webkit - scrollbar {
  width: 8px;
}
        :: -webkit - scrollbar - track {
  background: #12121c;
}
        :: -webkit - scrollbar - thumb {
  background: #333;
  border - radius: 4px;
}
        :: -webkit - scrollbar - thumb:hover {
  background: #555;
}

        .btn - neon {
  background: transparent;
  border: 2px solid #ff00ff;
  color: #ff00ff;
  text - transform: uppercase;
  font - weight: bold;
  transition: all 0.3s ease;
  cursor: pointer;
  box - shadow: 0 0 5px #ff00ff;
}
        .btn - neon:hover {
  background: #ff00ff;
  color: #fff;
  box - shadow: 0 0 15px #ff00ff;
}

        .svg - canvas {
  touch - action: none;
  cursor: crosshair;
}
</style>
  </head>
  < body >
  <div id="root" > </div>

    < script type = "text/babel" >
        const { useState, useEffect, useRef } = React;

// --- Geometry Utilities ---
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const cartesianToPolar = (centerX, centerY, x, y) => {
  const dx = x - centerX;
  const dy = y - centerY;
  const radius = Math.sqrt(dx * dx + dy * dy);
  let angleRadians = Math.atan2(dy, dx);
  let angleDegrees = (angleRadians * 180 / Math.PI) + 90;
  if (angleDegrees < 0) angleDegrees += 360;
  return { radius, angle: angleDegrees };
};

const distance = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

// --- Data: Theorems & Quizzes ---
const modules = [
  {
    id: 'center_angle',
    title: 'Angle at Center',
    desc: 'The angle subtended by an arc at the center is double the angle at any point on the remaining part of the circle.',
    quiz: {
      question: "If the angle at the center is 120°, what is the angle at the remaining part of the circle?",
      options: ["60°", "240°", "120°", "90°"],
      correct: 0
    }
  },
  {
    id: 'same_segment',
    title: 'Angles in Same Segment',
    desc: 'Angles in the same segment of a circle are equal.',
    quiz: {
      question: "Two angles subtended by the same arc at the circumference are...",
      options: ["Complementary", "Supplementary", "Equal", "Double"],
      correct: 2
    }
  },
  {
    id: 'cyclic_quad',
    title: 'Cyclic Quadrilateral',
    desc: 'The sum of either pair of opposite angles of a cyclic quadrilateral is 180°.',
    quiz: {
      question: "In a cyclic quadrilateral ABCD, if ∠A = 100°, what is ∠C?",
      options: ["100°", "90°", "80°", "260°"],
      correct: 2
    }
  }
];

// --- Draggable SVG Point Component ---
const DraggablePoint = ({ cx, cy, color, onDrag, label }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent text selection
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      // Simple bounding rect calc to get mouse relative to SVG
      const svg = document.getElementById('geo-canvas');
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      onDrag(x, y);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onDrag]);

  return (
    <g>
    <circle 
                        cx= { cx } cy = { cy } r = "8"
  fill = { color }
  stroke = "#fff" strokeWidth = "2"
  style = {{ cursor: 'pointer' }
}
onMouseDown = { handleMouseDown }
onTouchStart = { handleMouseDown }
  />
  { label && (
    <text x={ cx + 12 } y = { cy - 12} fill = "white" fontSize = "14" fontWeight = "bold" > { label } </text>
                    )}
</g>
            );
        };

// --- Visualization Components ---

// 1. Angle at Center vs Circumference
const VizCenterAngle = () => {
  const center = { x: 200, y: 150 };
  const r = 100;

  // State for angles of points A, B, C on the circle
  const [angles, setAngles] = useState({ a: 220, b: 140, c: 30 }); // Degrees

  const getPos = (ang) => polarToCartesian(center.x, center.y, r, ang);

  const posA = getPos(angles.a);
  const posB = getPos(angles.b);
  const posC = getPos(angles.c);

  const updateAngle = (key, mx, my) => {
    const { angle } = cartesianToPolar(center.x, center.y, mx, my);
    setAngles(prev => ({ ...prev, [key]: angle }));
  };

  // Calculate actual geometric angles
  // Angle AOB (center)
  let angCenter = Math.abs(angles.a - angles.b);
  if (angCenter > 180) angCenter = 360 - angCenter;

  // Angle ACB (circumference) - math is complex to extract from polar, 
  // relying on theorem logic for display is safer for a demo, 
  // but let's calculate vector angles for realism.
  // Simplified for this demo: We show the theorem property.
  // We assume arc AB is the minor arc for simplicity in dragging logic limitation.

  // Let's just calculate vectors CA and CB
  const angleAtCircumference = angCenter / 2;

  return (
    <svg id= "geo-canvas" width = "400" height = "300" className = "svg-canvas mx-auto glass-panel rounded-lg" >
      {/* Circle */ }
      < circle cx = { center.x } cy = { center.y } r = { r } stroke = "#333" strokeWidth = "2" fill = "none" />
        <circle cx={ center.x } cy = { center.y } r = "3" fill = "white" />
          <text x={ center.x + 5 } y = { center.y + 15 } fill = "#666" fontSize = "10" > O </text>

  {/* Lines */ }
  <path d={
\`M \${posA.x} \${posA.y} L \${center.x} \${center.y} L \${posB.x} \${posB.y}\`} stroke="#ff00ff" strokeWidth="2" fill="rgba(255,0,255,0.1)" />
                    <path d={\`M \${posA.x} \${posA.y} L \${posC.x} \${posC.y} L \${posB.x} \${posB.y}\`} stroke="#00ffff" strokeWidth="2" fill="none" />

                    {/* Angles Text */}
                    <text x="10" y="20" fill="#ff00ff" fontSize="14">∠AOB (Center) = {angCenter.toFixed(0)}°</text>
                    <text x="10" y="40" fill="#00ffff" fontSize="14">∠ACB (Circle) = {angleAtCircumference.toFixed(1)}°</text>

                    {/* Draggable Points */}
                    <DraggablePoint cx={posA.x} cy={posA.y} color="#ff00ff" label="A" onDrag={(x,y) => updateAngle('a', x, y)} />
                    <DraggablePoint cx={posB.x} cy={posB.y} color="#ff00ff" label="B" onDrag={(x,y) => updateAngle('b', x, y)} />
                    <DraggablePoint cx={posC.x} cy={posC.y} color="#00ffff" label="C" onDrag={(x,y) => updateAngle('c', x, y)} />
                </svg>
            );
        };

        // 2. Angles in Same Segment
        const VizSameSegment = () => {
            const center = { x: 200, y: 180 };
            const r = 100;
            const [angles, setAngles] = useState({ a: 220, b: 140, c: 40, d: 80 });

            const getPos = (ang) => polarToCartesian(center.x, center.y, r, ang);
            const posA = getPos(angles.a);
            const posB = getPos(angles.b);
            const posC = getPos(angles.c);
            const posD = getPos(angles.d);

            const updateAngle = (key, mx, my) => {
                const { angle } = cartesianToPolar(center.x, center.y, mx, my);
                setAngles(prev => ({ ...prev, [key]: angle }));
            };

            // Calculate Angle subtended by arc AB at center to derive segment angles
            let angCenter = Math.abs(angles.a - angles.b);
            if (angCenter > 180) angCenter = 360 - angCenter;
            const segmentAngle = angCenter / 2;

            return (
                <svg id="geo-canvas" width="400" height="300" className="svg-canvas mx-auto glass-panel rounded-lg">
                    <circle cx={center.x} cy={center.y} r={r} stroke="#333" strokeWidth="2" fill="none" />
                    
                    {/* Chord Base */}
                    <line x1={posA.x} y1={posA.y} x2={posB.x} y2={posB.y} stroke="#666" strokeWidth="2" strokeDasharray="4" />

                    {/* Triangle 1 */}
                    <path d={\`M \${posA.x} \${posA.y} L \${posC.x} \${posC.y} L \${posB.x} \${posB.y}\`} stroke="#ff00ff" strokeWidth="2" fill="rgba(255,0,255,0.05)" />
                    
                    {/* Triangle 2 */}
                    <path d={\`M \${posA.x} \${posA.y} L \${posD.x} \${posD.y} L \${posB.x} \${posB.y}\`} stroke="#00ffff" strokeWidth="2" fill="rgba(0,255,255,0.05)" />

                    <text x="10" y="20" fill="#ff00ff" fontSize="14">∠ACB = {segmentAngle.toFixed(1)}°</text>
                    <text x="10" y="40" fill="#00ffff" fontSize="14">∠ADB = {segmentAngle.toFixed(1)}°</text>

                    <DraggablePoint cx={posA.x} cy={posA.y} color="#fff" label="A" onDrag={(x,y) => updateAngle('a', x, y)} />
                    <DraggablePoint cx={posB.x} cy={posB.y} color="#fff" label="B" onDrag={(x,y) => updateAngle('b', x, y)} />
                    <DraggablePoint cx={posC.x} cy={posC.y} color="#ff00ff" label="C" onDrag={(x,y) => updateAngle('c', x, y)} />
                    <DraggablePoint cx={posD.x} cy={posD.y} color="#00ffff" label="D" onDrag={(x,y) => updateAngle('d', x, y)} />
                </svg>
            );
        };

        // 3. Cyclic Quadrilateral
        const VizCyclicQuad = () => {
            const center = { x: 200, y: 150 };
            const r = 100;
            const [angles, setAngles] = useState({ a: 45, b: 135, c: 225, d: 315 });

            const getPos = (ang) => polarToCartesian(center.x, center.y, r, ang);
            const pt = {
                a: getPos(angles.a),
                b: getPos(angles.b),
                c: getPos(angles.c),
                d: getPos(angles.d)
            };

            const updateAngle = (key, mx, my) => {
                const { angle } = cartesianToPolar(center.x, center.y, mx, my);
                setAngles(prev => ({ ...prev, [key]: angle }));
            };

            // Helper to calculate angle between vectors
            const calcAngle = (p1, vertex, p2) => {
                const d1 = Math.sqrt(Math.pow(p1.x - vertex.x, 2) + Math.pow(p1.y - vertex.y, 2));
                const d2 = Math.sqrt(Math.pow(p2.x - vertex.x, 2) + Math.pow(p2.y - vertex.y, 2));
                const d3 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                // Law of Cosines
                let ang = Math.acos((d1*d1 + d2*d2 - d3*d3) / (2*d1*d2)) * (180/Math.PI);
                return ang;
            }

            const angleA = calcAngle(pt.d, pt.a, pt.b);
            const angleC = calcAngle(pt.b, pt.c, pt.d);
            const angleB = calcAngle(pt.a, pt.b, pt.c);
            const angleD = calcAngle(pt.c, pt.d, pt.a);

            return (
                <svg id="geo-canvas" width="400" height="300" className="svg-canvas mx-auto glass-panel rounded-lg">
                    <circle cx={center.x} cy={center.y} r={r} stroke="#333" strokeWidth="2" fill="none" />
                    
                    <polygon points={\`\${pt.a.x},\${pt.a.y} \${pt.b.x},\${pt.b.y} \${pt.c.x},\${pt.c.y} \${pt.d.x},\${pt.d.y}\`} 
                             fill="rgba(0, 255, 255, 0.1)" stroke="#00ffff" strokeWidth="2" />

                    <text x="10" y="20" fill="#fff" fontSize="14">∠A + ∠C = {(angleA + angleC).toFixed(0)}°</text>
                    <text x="10" y="40" fill="#fff" fontSize="14">∠B + ∠D = {(angleB + angleD).toFixed(0)}°</text>
                    
                    <text x={pt.a.x} y={pt.a.y} fill="#ff00ff" fontSize="12" dx="10">A: {angleA.toFixed(0)}°</text>
                    <text x={pt.c.x} y={pt.c.y} fill="#ff00ff" fontSize="12" dx="10">C: {angleC.toFixed(0)}°</text>

                    {Object.keys(pt).map(key => (
                        <DraggablePoint key={key} cx={pt[key].x} cy={pt[key].y} color="#ff00ff" label="" onDrag={(x,y) => updateAngle(key, x, y)} />
                    ))}
                </svg>
            );
        };

        // --- Main App Component ---
        const App = () => {
            const [activeModule, setActiveModule] = useState(0);
            const [quizState, setQuizState] = useState(null); // null, 'correct', 'wrong'

            const currentMod = modules[activeModule];

            const handleAnswer = (index) => {
                if (index === currentMod.quiz.correct) {
                    setQuizState('correct');
                } else {
                    setQuizState('wrong');
                }
                setTimeout(() => setQuizState(null), 2000);
            };

            return (
                <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
                    {/* Header */}
                    <header className="mb-6 border-b border-gray-800 pb-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold neon-text">NEON CIRCLE MASTER</h1>
                            <p className="text-gray-400 text-sm">Grade 9 • Interactive Geometry</p>
                        </div>
                        <div className="bg-gray-800 px-3 py-1 rounded-full text-xs text-cyan-400 border border-cyan-800">
                            Theorem {activeModule + 1}/{modules.length}
                        </div>
                    </header>

                    <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
                        
                        {/* Sidebar Navigation */}
                        <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2">
                            {modules.map((m, idx) => (
                                <button 
                                    key={m.id}
                                    onClick={() => { setActiveModule(idx); setQuizState(null); }}
                                    className={\`p-3 rounded-lg text-left transition-all whitespace-nowrap md:whitespace-normal \${
                                        activeModule === idx 
                                        ? 'bg-gray-800 border-l-4 border-cyan-400 text-white shadow-lg' 
                                        : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
                                    }\`}
                                >
                                    <span className="block text-xs uppercase tracking-wider mb-1">Theorem {idx + 1}</span>
                                    <span className="font-bold">{m.title}</span>
                                </button>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 flex flex-col overflow-y-auto">
                            
                            {/* Viz Container */}
                            <div className="bg-[#1a1a24] rounded-xl p-4 shadow-2xl border border-gray-800 mb-6">
                                <div className="mb-2 flex justify-between items-center">
                                    <h2 className="text-xl neon-pink-text">{currentMod.title}</h2>
                                    <span className="text-xs text-gray-500 bg-black px-2 py-1 rounded">Try dragging the points!</span>
                                </div>
                                <div className="relative">
                                    {activeModule === 0 && <VizCenterAngle />}
                                    {activeModule === 1 && <VizSameSegment />}
                                    {activeModule === 2 && <VizCyclicQuad />}
                                </div>
                                <p className="mt-4 text-gray-300 italic border-l-2 border-pink-500 pl-3">
                                    "{currentMod.desc}"
                                </p>
                            </div>

                            {/* Quiz Section */}
                            <div className="bg-black/40 rounded-xl p-6 border border-gray-800">
                                <h3 className="text-lg font-bold text-cyan-400 mb-4">Quick Check</h3>
                                <p className="mb-4 text-lg">{currentMod.quiz.question}</p>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    {currentMod.quiz.options.map((opt, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            className="btn-neon py-2 rounded text-sm hover:bg-cyan-900"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                {quizState === 'correct' && (
                                    <div className="mt-4 p-2 bg-green-900/50 text-green-400 text-center rounded border border-green-500">
                                        Correct! The math checks out.
                                    </div>
                                )}
                                {quizState === 'wrong' && (
                                    <div className="mt-4 p-2 bg-red-900/50 text-red-400 text-center rounded border border-red-500">
                                        Not quite. Look at the theorem visualization again!
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>`
    },
    {
        id: 'game-py-001-mi',
        title: 'Mission: Loop Breaker',
        description: 'Your mission, Agent, is to hack the mainframe laser grid using Python loops. Extract the intel, avoid the security beams. This message will self-destruct in 5 seconds.',
        category: Category.PYTHON,
        grade: 'Grade 6+',
        topics: ['Python', 'Coding', 'Logic'],
        subtopics: ['For Loops', 'Range Function', 'Hacking Simulation'],
        thumbnailUrl: '/thumbnails/python-mission-impossible.png', // Suggest updating thumbnail
        type: 'html',
        isPremium: false,
        views: 0,
        content: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mission: Loop Breaker</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        :root {
            --bg-color: #0a0a12;
            --terminal-bg: #14141e;
            --laser-red: #ff3333;
            --intel-blue: #00ccff;
            --hacker-green: #33ff33;
            --text-color: #e0e0e0;
        }
        body {
            margin: 0;
            padding: 0;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: 'Courier New', Courier, monospace; /* Hacking terminal font */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
            background-image: radial-gradient(circle at center, #1a1a2e 0%, #000 100%);
        }
        #root {
            width: 100%;
            max-width: 800px;
            height: 100vh;
            display: flex;
            flex-direction: column;
            border: 2px solid #333;
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
            position: relative;
        }

        /* Animations */
        @keyframes pulse-laser {
            0%, 100% { box-shadow: 0 0 5px var(--laser-red); opacity: 0.8; }
            50% { box-shadow: 0 0 20px var(--laser-red); opacity: 1; }
        }
        @keyframes pulse-intel {
            0%, 100% { box-shadow: 0 0 5px var(--intel-blue); transform: scale(1); }
            50% { box-shadow: 0 0 25px var(--intel-blue); transform: scale(1.1); }
        }
        @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .shaking {
            animation: shake 0.5s;
            animation-iteration-count: 1;
        }

        /* Layout */
        .game-container {
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 15px;
            background: rgba(20, 20, 30, 0.9);
        }
        
        .top-secret-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px dashed #555;
            padding-bottom: 10px;
        }
        .stamp {
            border: 3px solid var(--laser-red);
            color: var(--laser-red);
            font-weight: bold;
            padding: 5px 10px;
            transform: rotate(-5deg);
            font-size: 1.2rem;
            text-transform: uppercase;
        }

        .intel-brief {
            background: #1a1a24;
            border-left: 4px solid var(--intel-blue);
            padding: 15px;
            font-size: 0.95rem;
        }
        .hint-text { color: var(--intel-blue); font-weight: bold; }

        /* VISUALIZER - THE LASER CORRIDOR */
        .corridor-container {
            background: #000;
            border: 2px solid #555;
            padding: 30px 20px;
            position: relative;
            min-height: 120px;
            display: flex;
            align-items: center;
            overflow: hidden;
        }
        /* The glowing wire connecting nodes */
        .corridor-wire {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 4px;
            background: #333;
            z-index: 0;
            box-shadow: 0 0 10px var(--intel-blue);
        }

        .track {
            display: flex;
            justify-content: space-between;
            position: relative;
            width: 100%;
            z-index: 1;
        }

        .server-node {
            width: 40px;
            height: 40px;
            background: #222;
            border: 2px solid #444;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            position: relative;
        }

        .server-node.intel-target {
            border-color: var(--intel-blue);
            color: var(--intel-blue);
        }
        .server-node.intel-target .node-icon {
            animation: pulse-intel 1.5s infinite;
        }

        .server-node.laser-trap {
            border-color: var(--laser-red);
            color: var(--laser-red);
        }
        /* The actual laser beams */
        .laser-beam {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 100px;
            background: var(--laser-red);
            animation: pulse-laser 0.2s infinite alternate;
        }

        .hacking-probe {
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 60px;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2333ff33"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8.9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>') no-repeat center;
            z-index: 10;
            transition: all 0.5s ease-in-out;
            filter: drop-shadow(0 0 5px var(--hacker-green));
        }
        .probe-explosion {
             background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff3333"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>') no-repeat center !important;
             filter: drop-shadow(0 0 15px var(--laser-red)) !important;
             transform: translateX(-50%) scale(1.5) !important;
        }


        /* TERMINAL & CONTROLS */
        .terminal-interface {
            background: var(--terminal-bg);
            border: 2px solid #333;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .code-line {
            font-size: 1.1rem;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
        }
        .py-key { color: #ff7b00; font-weight: bold; }
        .py-func { color: var(--intel-blue); }
        .py-var { color: var(--hacker-green); }

        input.hack-input {
            background: #000;
            border: 1px solid var(--intel-blue);
            color: var(--hacker-green);
            font-family: inherit;
            font-size: 1rem;
            width: 60px;
            text-align: center;
            padding: 4px;
        }
        input.hack-input:focus { outline: none; box-shadow: 0 0 10px var(--intel-blue); }

        .mission-log {
            background: #000;
            height: 80px;
            overflow-y: auto;
            padding: 5px;
            font-size: 0.85rem;
            border-top: 2px solid #333;
        }
        .log-entry { margin: 2px 0; }
        .log-entry.success { color: var(--hacker-green); }
        .log-entry.fail { color: var(--laser-red); }
        .log-entry.sys { color: #666; }

        .controls { display: flex; gap: 10px; }
        .btn-hack {
            flex: 1;
            background: #333;
            border: 2px solid var(--hacker-green);
            color: var(--hacker-green);
            padding: 12px;
            font-family: inherit;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            text-transform: uppercase;
            transition: 0.2s;
        }
        .btn-hack:hover:not(:disabled) { background: var(--hacker-green); color: #000; box-shadow: 0 0 20px var(--hacker-green); }
        .btn-hack:disabled { opacity: 0.5; cursor: not-allowed; border-color: #555; color: #555; }
        .btn-next { border-color: var(--intel-blue); color: var(--intel-blue); }
        .btn-next:hover { background: var(--intel-blue); color: #000; box-shadow: 0 0 20px var(--intel-blue); }

    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        const MISSIONS = [
            {
                id: 1,
                brief: "Training Net: Extract Intel from nodes 0, 1, and 2. Security is offline.",
                targets: [0, 1, 2],
                lasers: [],
                maxIndex: 5,
                hint: "range(3) starts at 0 and stops BEFORE 3."
            },
            {
                id: 2,
                brief: "Stealth Ops: Laser grid active on entry nodes. Begin hack at node 2, stop before 5.",
                targets: [2, 3, 4],
                lasers: [0, 1],
                maxIndex: 6,
                hint: "Use range(start, stop)"
            },
            {
                id: 3,
                brief: "Laser Corridor: Security beams alternate. Jump the sequence to hit odd nodes only.",
                targets: [1, 3, 5, 7],
                lasers: [0, 2, 4, 6, 8],
                maxIndex: 9,
                hint: "Use range(start, stop, step)"
            },
            {
                id: 4,
                brief: "Extraction: Retreat sequence initiated. Hack from node 5 down to 2.",
                targets: [5, 4, 3, 2],
                lasers: [6, 1, 0],
                maxIndex: 7,
                hint: "A negative step moves backwards."
            }
        ];

        function App() {
            const [missionIdx, setMissionIdx] = useState(0);
            const [start, setStart] = useState("");
            const [stop, setStop] = useState("");
            const [step, setStep] = useState("");
            const [probePos, setProbePos] = useState(null);
            const [logs, setLogs] = useState(['SYS: Establishing secure connection...', 'SYS: Ready for input.']);
            const [isRunning, setIsRunning] = useState(false);
            const [status, setStatus] = useState("briefing"); // briefing, active, compromised, success
            const rootRef = useRef(null);

            const mission = MISSIONS[missionIdx];
            const maxNodes = mission.maxIndex;
            const nodeIndices = Array.from({length: maxNodes + 1}, (_, i) => i);

            const showStart = missionIdx > 0;
            const showStep = missionIdx > 1;

            const addLog = (text, type='sys') => {
                setLogs(prev => [...prev, {text, type}]);
                // Auto-scroll bottom
                setTimeout(() => {
                     const logContainer = document.getElementById('missionLog');
                     if(logContainer) logContainer.scrollTop = logContainer.scrollHeight;
                }, 10);
            };

            const executeHack = async () => {
                setIsRunning(true);
                setStatus("active");
                setLogs([]);
                addLog("INITIATING HACK SEQUENCE...", "sys");
                setProbePos(null);

                let rStart = showStart ? parseInt(start) : 0;
                let rStop = parseInt(stop);
                let rStep = showStep ? parseInt(step) : 1;

                if (isNaN(rStart)) rStart = 0;
                if (isNaN(rStop)) { 
                    addLog("ERROR: 'stop' parameter missing. Hack aborted.", "fail");
                    setIsRunning(false); setStatus("briefing"); return;
                }
                if (isNaN(rStep)) rStep = 1;
                if (rStep === 0) {
                    addLog("ERROR: Step cannot be zero. Infinite loop detected.", "fail");
                    setIsRunning(false); setStatus("briefing"); return;
                }

                let sequence = [];
                if (rStep > 0) {
                    for (let i = rStart; i < rStop; i += rStep) sequence.push(i);
                } else {
                    for (let i = rStart; i > rStop; i += rStep) sequence.push(i);
                }

                let collectedCount = 0;
                let compromised = false;
                let uniqueVisits = new Set();

                for (let i = 0; i < sequence.length; i++) {
                    const currentVal = sequence[i];
                    
                    if (currentVal < 0 || currentVal > maxNodes) {
                        addLog(\`ALERT: Probe lost connection at index \${currentVal}.\`, "fail");
                        compromised = true; break;
                    }

                    setProbePos(currentVal);
                    uniqueVisits.add(currentVal);
                    addLog(\`> ACCESSING NODE [\${currentVal}]...\`, "sys");

                    if (mission.lasers.includes(currentVal)) {
                        addLog("SECURITY ALERT: Laser grid triggered!", "fail");
                        compromised = true;
                        // Trigger shake effect
                        if(rootRef.current) {
                            rootRef.current.classList.add('shaking');
                            setTimeout(() => rootRef.current.classList.remove('shaking'), 500);
                        }
                        break;
                    }

                    if (mission.targets.includes(currentVal)) {
                        addLog("SUCCESS: Intel package secured.", "success");
                        collectedCount++;
                    }

                    await new Promise(r => setTimeout(r, 700)); // Slower for dramatic tension
                }

                const required = mission.targets.length;
                const cleanHits = uniqueVisits.size === collectedCount; // Ensure we didn't visit empty nodes

                if (compromised) {
                    setStatus("compromised");
                    addLog("MISSION FAILED: Probe destroyed.", "fail");
                } else if (collectedCount === required && cleanHits && uniqueVisits.size > 0) {
                    setStatus("success");
                    addLog("MISSION ACCOMPLISHED: All intel secured cleanly.", "success");
                } else {
                    setStatus("compromised");
                    addLog(\`MISSION FAILED: Incomplete intel (\${collectedCount}/\${required}) or inefficient path.\`, "fail");
                }

                setIsRunning(false);
            };

            const nextMission = () => {
                if (missionIdx < MISSIONS.length - 1) {
                    setMissionIdx(l => l + 1);
                    setStart(""); setStop(""); setStep("");
                    setLogs(['SYS: Loading next objective...']);
                    setProbePos(null);
                    setStatus("briefing");
                } else {
                    alert("IMF REPORT: You are an elite Python hacker. Good work, Agent.");
                }
            };

            return (
                <div className="game-container" ref={rootRef}>
                    <div className="top-secret-header">
                        <div style={{fontSize:'1.2rem', fontWeight:'bold'}}>OPERATION: LOOP BREAKER</div>
                        <div className="stamp">TOP SECRET // LEVEL {missionIdx + 1}</div>
                    </div>

                    <div className="intel-brief">
                        REQUEST: {mission.brief}
                        <br/>
                        <span className="hint-text">INTEL HINT: {mission.hint}</span>
                    </div>

                    {/* VISUALIZER */}
                    <div className="corridor-container">
                        <div className="corridor-wire"></div>
                        <div className="track">
                            {nodeIndices.map(idx => {
                                const isTarget = mission.targets.includes(idx);
                                const isLaser = mission.lasers.includes(idx);
                                const isProbeHere = probePos === idx;
                                
                                let nodeClass = "server-node";
                                if (isTarget) nodeClass += " intel-target";
                                if (isLaser) nodeClass += " laser-trap";

                                return (
                                    <div key={idx} className={nodeClass} style={{ opacity: (idx > maxNodes) ? 0.3 : 1 }}>
                                        {idx}
                                        {isLaser && <div className="laser-beam"></div>}
                                        {isTarget && <div className="node-icon" style={{position:'absolute', top:'-25px', fontSize:'1.2rem'}}>💾</div>}
                                        
                                        {isProbeHere && (
                                            <div className={\`hacking-probe \${status === 'compromised' ? 'probe-explosion' : ''}\`}></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* TERMINAL */}
                    <div className="terminal-interface">
                         <div>// HACKING TERMINAL v1.09</div>
                        <div className="code-line">
                            <span className="py-key">for</span>
                            <span className="py-var">i</span>
                            <span className="py-key">in</span>
                            <span className="py-func">range</span>(
                            
                            {showStart && (
                                <>
                                    <input className="hack-input" placeholder="start" value={start} onChange={(e) => setStart(e.target.value)} disabled={isRunning}/>
                                    <span>,</span>
                                </>
                            )}

                            <input className="hack-input" placeholder="stop" value={stop} onChange={(e) => setStop(e.target.value)} disabled={isRunning}/>

                            {showStep && (
                                <>
                                    <span>,</span>
                                    <input className="hack-input" placeholder="step" value={step} onChange={(e) => setStep(e.target.value)} disabled={isRunning}/>
                                </>
                            )}
                            
                            <span>):</span>
                        </div>
                        <div className="code-line" style={{paddingLeft: '40px'}}>
                            <span className="py-func">extract_data</span>(<span className="py-var">i</span>)
                        </div>

                        <div className="mission-log" id="missionLog">
                            {logs.map((log, i) => (
                                <div key={i} className={\`log-entry \${log.type}\`}>{log.text}</div>
                            ))}
                        </div>

                        <div className="controls">
                            <button className="btn-hack" onClick={executeHack} disabled={isRunning || status === 'success'}>
                                {isRunning ? 'HACKING...' : 'EXECUTE HACK'}
                            </button>
                            
                            {status === 'success' && (
                                <button className="btn-hack btn-next" onClick={nextMission}>
                                    NEXT MISSION >>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
  `
    },
    {
        id: "math-sliding-window-01",
        title: "Poké-Sum Slider",
        description: "Master the Sliding Window technique with this interactive Pokémon-themed visualizer!",
        category: Category.DSA,
        grade: "Grade 6+",
        topics: ["Algorithms", "Logic"],
        subtopics: ["Sliding Window", "Optimization", "Arrays"],
        thumbnailUrl: "/thumbnails/poke-sum.png",
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/poke-sum.html'
    },
    {
        id: "react-reaction-time-01",
        title: "Reaction Time Challenge",
        description: "Test your reflexes! Click as fast as you can when the screen turns green.",
        category: Category.FEATURED,
        grade: "All Ages",
        topics: ["Reflexes", "Timing"],
        subtopics: ["Reaction Speed", "Focus"],
        thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        type: "react",
        isPremium: false,
        views: 0,
        content: "Native React Component",
        component: ReactionTime
    },
    {
        id: "math-mental-mayhem-01",
        title: "Mental Math Mayhem",
        description: "Race against the clock to solve arithmetic problems! Keep your streak alive and prove your mental math agility.",
        category: Category.MATH,
        grade: "Grade 2-6",
        topics: ["Arithmetic", "Mental Math"],
        subtopics: ["Addition", "Subtraction", "Multiplication", "Division"],
        thumbnailUrl: "/thumbnails/mental-math.png",
        type: "react",
        isPremium: false,
        views: 0,
        content: "Native React Component",
        component: MentalMathMayhem
    },
    {
        id: "math-deriv-o-matic-01",
        title: "Deriv-O-Matic 4000",
        description: "Launch confetti by solving Calculus problems! practice derivatives and integrals in this high-energy game.",
        category: Category.MATH,
        grade: "Grade 11-12",
        topics: ["Calculus", "Derivatives"],
        subtopics: ["Power Rule", "Chain Rule", "Integrals"],
        thumbnailUrl: "/thumbnails/deriv-o-matic.png",
        type: "react",
        isPremium: false,
        views: 0,
        content: "Native React Component",
        component: DerivOMatic
    },
    {
        id: "math-ben10-dna-01",
        title: "Ben 10: DNA Match",
        description: "Help Ben Tenyson fix the Omnitrix by matching DNA fragments using geometry chord properties!",
        category: Category.MATH,
        grade: "Grade 8-10",
        topics: ["Geometry", "Circles"],
        subtopics: ["Chords", "Bisectors", "Radius"],
        thumbnailUrl: "/thumbnails/ben10-dna.png",
        type: "url",
        isPremium: false,
        views: 0,
        content: "/games/ben10DnaMatch.html"
    },
    {
        id: "math-phineas-bridge-01",
        title: "Phineas & Ferb: Bridge Challenge",
        description: "Build the ultimate bridge with Phineas and Ferb using the Pythagorean Theorem!",
        category: Category.MATH,
        grade: "Grade 8-10",
        topics: ["Geometry", "Triangles"],
        subtopics: ["Pythagoras Theorem", "Distance"],
        thumbnailUrl: "/thumbnails/phineas-bridge.png",
        type: "url",
        isPremium: false,
        views: 0,
        content: "/games/phineasBridgeChallange.html"
    },
    {
        id: "math-phineas-stabilizer-01",
        title: "Phineas & Ferb: Bridge Stabilizer",
        description: "Calibrate the bridge stabilizers using perpendicular bisectors to ensure structural integrity.",
        category: Category.MATH,
        grade: "Grade 8-10",
        topics: ["Geometry", "Constructions"],
        subtopics: ["Perpendicular Bisectors", "Locus"],
        thumbnailUrl: "/thumbnails/phineas-stabilizer.png",
        type: "url",
        isPremium: false,
        views: 0,
        content: "/games/phineasBridgeStabilizer.html"
    },
    {
        id: "math-sync-inator-01",
        title: "The Sync-inator 3000",
        description: "Organize fuel cells to synchronize the gears! Use Factors, HCF, and LCM to get the machine running.",
        category: Category.MATH,
        grade: "Grade 6-9",
        topics: ["Number Theory", "Factors"],
        subtopics: ["HCF", "LCM", "Prime Factorization"],
        thumbnailUrl: "/thumbnails/sync-inator.png",
        type: "url",
        isPremium: false,
        views: 0,
        content: "/games/theSync-Inator3000.html"
    },
    // ==================== HTML GAMES FROM PUBLIC/GAMES ====================
    {
        id: 'math-zombie-radar-01',
        title: 'Zombie Radar: Coordinate Hunter',
        description: 'Use coordinates to track down zombies on the grid before they reach you!',
        category: Category.MATH,
        grade: 'Grade 6-9',
        topics: ['Geometry', 'Coordinates'],
        subtopics: ['Cartesian Plane', 'Plotting Points'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/zombieRadar.html'
    },
    {
        id: 'math-battleship-grid-01',
        title: 'Battleship Grid Commander',
        description: 'Sink enemy ships by mastering coordinate geometry and grid navigation!',
        category: Category.MATH,
        grade: 'Grade 6-9',
        topics: ['Geometry', 'Coordinates'],
        subtopics: ['Grid Navigation', 'Strategic Plotting'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/battleshipGrid.html'
    },
    {
        id: 'math-powerpuff-factors-01',
        title: 'Powerpuff Factor Mission',
        description: 'Help the Powerpuff Girls defeat Mojo Jojo by finding factors and multiples!',
        category: Category.MATH,
        grade: 'Grade 5-8',
        topics: ['Number Theory', 'Factors'],
        subtopics: ['Factors', 'Multiples', 'Divisibility'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/powerPuffFactorMIssion.html'
    },
    {
        id: 'math-ghost-fractions-01',
        title: 'Ghost Fraction Match',
        description: 'Match equivalent fractions before the ghosts catch you in this spooky challenge!',
        category: Category.MATH,
        grade: 'Grade 4-7',
        topics: ['Fractions', 'Number Sense'],
        subtopics: ['Equivalent Fractions', 'Simplification'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/ghostFractionMatch.html'
    },
    {
        id: 'math-subtraction-tetris-01',
        title: 'Subtraction Tetris',
        description: 'Clear blocks by solving subtraction problems in this fast-paced puzzle game!',
        category: Category.MATH,
        grade: 'Grade 3-6',
        topics: ['Arithmetic', 'Mental Math'],
        subtopics: ['Subtraction', 'Speed Math'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/subtractionTetris.html'
    },
    {
        id: 'math-taxi-driver-01',
        title: 'Taxi Driver Challenge',
        description: 'Navigate the city using angles and distances to pick up passengers on time!',
        category: Category.MATH,
        grade: 'Grade 6-8',
        topics: ['Geometry', 'Measurement'],
        subtopics: ['Angles', 'Distance', 'Direction'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/taxiDriverChallenge.html'
    },
    {
        id: 'math-treasure-island-01',
        title: 'Treasure Island Hunt',
        description: 'Follow coordinate clues to find the hidden treasure on the island!',
        category: Category.MATH,
        grade: 'Grade 5-8',
        topics: ['Geometry', 'Coordinates'],
        subtopics: ['Mapping', 'Position', 'Direction'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/treasureIslandHunt.html'
    },
    {
        id: 'math-connect-dots-01',
        title: 'Connect the Dots: Geometry',
        description: 'Connect points to form geometric shapes and learn their properties!',
        category: Category.MATH,
        grade: 'Grade 4-7',
        topics: ['Geometry', 'Shapes'],
        subtopics: ['Polygons', 'Lines', 'Angles'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/connectTheDots.html'
    },
    {
        id: 'math-number-line-01',
        title: 'Number Line Hopper',
        description: 'Hop along the number line solving coordinate and integer problems!',
        category: Category.MATH,
        grade: 'Grade 5-8',
        topics: ['Number Sense', 'Coordinates'],
        subtopics: ['Integers', 'Number Line', 'Ordering'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/NummberLineHopper-CoordinateQuest.html'
    },
    {
        id: 'math-salami-sniper-01',
        title: 'Salami Sniper: Denominator Trainer',
        description: 'Slice salami to understand fractions and denominators in a fun way!',
        category: Category.MATH,
        grade: 'Grade 4-6',
        topics: ['Fractions', 'Division'],
        subtopics: ['Denominators', 'Parts of Whole'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/SalamiSniperDeniminatorTrainer.html'
    },
    {
        id: 'math-fair-share-01',
        title: 'Fair Share Validator',
        description: 'Make sure everyone gets their fair share by dividing resources equally!',
        category: Category.MATH,
        grade: 'Grade 4-7',
        topics: ['Division', 'Fractions'],
        subtopics: ['Equal Division', 'Sharing', 'Remainders'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/fairShareValidator.html'
    },
    {
        id: 'math-missing-corner-01',
        title: 'Missing Corner Mystery',
        description: 'Find the missing corner of shapes using geometry and deduction!',
        category: Category.MATH,
        grade: 'Grade 5-8',
        topics: ['Geometry', 'Shapes'],
        subtopics: ['Angles', 'Polygons', 'Deduction'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/missingCornerMystery.html'
    },
    {
        id: 'math-perfect-fit-01',
        title: 'The Perfect Fit: Factor Game',
        description: 'Find the perfect factors to complete the puzzle and win!',
        category: Category.MATH,
        grade: 'Grade 5-8',
        topics: ['Number Theory', 'Factors'],
        subtopics: ['Factor Pairs', 'Divisibility'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/thePerfectFitFactorGame.html'
    },
    {
        id: 'math-unit-collector-01',
        title: 'The Unit Collector',
        description: 'Collect and convert units of measurement in this educational adventure!',
        category: Category.MATH,
        grade: 'Grade 5-8',
        topics: ['Measurement', 'Units'],
        subtopics: ['Conversion', 'Metric System', 'Imperial'],
        thumbnailUrl: '',
        type: 'url',
        isPremium: false,
        views: 0,
        content: '/games/theUnitCollector.html'
    }
];

