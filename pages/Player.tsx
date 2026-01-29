import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, Tag, BookOpen, GraduationCap, Maximize, Minimize } from 'lucide-react';
import { getGameById, getUserProfile } from '../services/gameService';
import { Game, UserProfile } from '../types';
import { GoogleGenAI } from "@google/genai";
import confetti from 'canvas-confetti';

export const Player: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isThinking, setIsThinking] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Game Experience State
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (err) {
        console.error("Failed to load user profile in Player", err);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (id) {
      const g = getGameById(id);
      setGame(g);

      // Start Countdown Sequence
      setCountdown(3);
      setIsPlaying(false);
    }
  }, [id]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished
      setIsPlaying(true);
      setCountdown(null);
      triggerConfetti();
    }
  }, [countdown]);

  const triggerConfetti = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      gameContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleAskAI = async () => {
    if (!game) return;
    setIsThinking(true);
    setAiResponse('');

    try {
      const apiKey = process.env.API_KEY || '';
      if (!apiKey) {
        setAiResponse("AI Service Unavailable: Missing API Key.");
        setIsThinking(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `I am playing a game called "${game.title}". The description is: "${game.description}". I need a hint or a brief math/coding concept explanation related to this game. Keep it short, encouraging and helpful for a student.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiResponse(response.text || "I couldn't generate a hint right now.");
    } catch (error) {
      console.error(error);
      setAiResponse("Sorry, I'm having trouble connecting to the AI tutor right now.");
    } finally {
      setIsThinking(false);
    }
  };

  if (!game) return <div className="text-white p-10">Game not found</div>;
  if (game.isPremium && !user?.isSubscribed) return <div className="text-white p-10">Access Denied. Premium Subscription Required.</div>;

  return (
    <div className="h-screen w-full bg-black flex flex-col">
      {/* Header */}
      {!isFullscreen && (
        <div className="bg-[#141414] p-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white flex items-center gap-2 hover:text-gray-300">
              <ArrowLeft /> Back
            </Link>
            <div>
              <span className="text-lg font-bold text-gray-200 block">{game.title}</span>
              <div className="flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><GraduationCap size={12} /> {game.grade}</span>
                <span className="flex items-center gap-1"><BookOpen size={12} /> {game.topics.join(', ')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="text-gray-400 hover:text-white transition"
              title="Fullscreen"
            >
              <Maximize size={20} />
            </button>
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="text-indigo-400 flex items-center gap-2 border border-indigo-500/50 rounded-full px-4 py-1 hover:bg-indigo-900/30 transition"
            >
              <Sparkles size={16} /> AI Tutor
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Game Container */}
        <div
          ref={gameContainerRef}
          className={`flex-1 relative bg-gray-900 flex items-center justify-center transition-all duration-300 ${showAiPanel && !isFullscreen ? 'w-2/3' : 'w-full'}`}
        >
          {/* Fullscreen Overlay Controls */}
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 backdrop-blur-sm"
            >
              <Minimize size={24} />
            </button>
          )}

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
              <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse">
                {countdown === 0 ? 'GO!' : countdown}
              </div>
            </div>
          )}

          {isPlaying && (
            <>
              {game.type === 'react' && game.component && (
                <div className="w-full h-full overflow-auto bg-gray-900 flex items-center justify-center">
                  <game.component />
                </div>
              )}

              {(game.type === 'url' || game.type === 'html') && (
                <iframe
                  src={game.type === 'url' ? game.content : undefined}
                  srcDoc={game.type === 'html' ? game.content : undefined}
                  title={game.title}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin allow-forms"
                  allowFullScreen
                />
              )}
            </>
          )}
        </div>

        {/* AI Sidebar */}
        <div className={`bg-[#1a1a1a] border-l border-gray-800 transition-all duration-300 flex flex-col ${showAiPanel && !isFullscreen ? 'w-80 translate-x-0' : 'w-0 translate-x-full overflow-hidden'}`}>
          <div className="p-4 border-b border-gray-700 bg-[#252525]">
            <h3 className="font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles size={18} /> Ashkam AI Helper
            </h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto text-sm text-gray-300 space-y-4">
            <div className="bg-gray-800 p-3 rounded border border-gray-700">
              <h4 className="font-semibold text-gray-200 mb-2">Game Details</h4>
              <div className="space-y-1 text-gray-400 text-xs">
                <p><span className="text-gray-500">Grade:</span> {game.grade}</p>
                <p><span className="text-gray-500">Topics:</span> {game.topics.join(', ')}</p>
                <p><span className="text-gray-500">Subtopics:</span> {game.subtopics.join(', ')}</p>
              </div>
            </div>

            <p>Stuck on a level? Want to understand the math behind this? Ask me!</p>

            {aiResponse && (
              <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded text-indigo-100 animate-fade-in">
                {aiResponse}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleAskAI}
              disabled={isThinking}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded p-3 flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
            >
              {isThinking ? 'Thinking...' : 'Get Hint / Explain'} <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
