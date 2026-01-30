import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Lock, Sparkles, Zap, Brain, Code, Gamepad2, Calculator } from 'lucide-react';
import { Game, Category } from '../types';
import { Link } from 'react-router-dom';

interface GameCardProps {
  game: Game;
  isLocked: boolean;
  onMoreInfo?: (game: Game) => void;
}

// Get icon based on category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case Category.MATH: return Calculator;
    case Category.CODING: return Code;
    case Category.LOGIC: return Brain;
    default: return Gamepad2;
  }
};

// Generate movie poster gradient based on category
const getPosterStyle = (category: string, title: string): { gradient: string; accent: string } => {
  const styles: Record<string, { gradient: string; accent: string }> = {
    [Category.MATH]: {
      gradient: 'from-indigo-900 via-purple-900 to-slate-900',
      accent: '#818cf8'
    },
    [Category.CODING]: {
      gradient: 'from-emerald-900 via-teal-900 to-slate-900',
      accent: '#34d399'
    },
    [Category.LOGIC]: {
      gradient: 'from-amber-900 via-orange-900 to-slate-900',
      accent: '#fbbf24'
    },
    [Category.PYTHON]: {
      gradient: 'from-blue-900 via-cyan-900 to-slate-900',
      accent: '#22d3ee'
    },
    [Category.WEB_DEV]: {
      gradient: 'from-rose-900 via-pink-900 to-slate-900',
      accent: '#fb7185'
    },
    default: {
      gradient: 'from-slate-800 via-gray-900 to-black',
      accent: '#e50914'
    }
  };
  return styles[category] || styles.default;
};

export const GameCard: React.FC<GameCardProps> = ({ game, isLocked, onMoreInfo }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasValidImage = game.thumbnailUrl && !imageError && !game.thumbnailUrl.includes('picsum.photos');
  const displayTopic = game.topics?.[0] || game.title;
  const posterStyle = getPosterStyle(game.category, game.title);
  const CategoryIcon = getCategoryIcon(game.category);

  return (
    <motion.div
      className="relative aspect-video cursor-pointer rounded-md overflow-hidden bg-[#181818] group z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        scale: 1.05,
        zIndex: 50,
        boxShadow: `0 0 20px ${posterStyle.accent}40`
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Background */}
      {hasValidImage ? (
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Movie Poster Style Fallback */
        <div className={`w-full h-full bg-gradient-to-br ${posterStyle.gradient} relative overflow-hidden`}>
          {/* Animated background pattern based on category */}
          <div className="absolute inset-0 opacity-20">
            {/* Retro Math Pixel Grid */}
            {game.category === Category.MATH && (
              <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${posterStyle.accent}20 1px, transparent 1px), linear-gradient(90deg, ${posterStyle.accent}20 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
            )}
            {/* Cyber Coding Scanlines */}
            {game.category === Category.CODING && (
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>
            )}
          </div>

          {/* Floating decorative elements - reduced clutter */}
          <motion.div
            className="absolute top-4 right-4 opacity-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={20} style={{ color: posterStyle.accent }} />
          </motion.div>

          {/* Main content - Center Title/Icon if no image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              className="mb-3 p-3 rounded-full bg-white/5 backdrop-blur-sm"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <CategoryIcon size={32} style={{ color: posterStyle.accent }} />
            </motion.div>
          </div>
        </div>
      )}

      {/* Content Overlay - Always visible gradient for text readability, enhanced on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-4">
        <div className="transform transition-transform duration-300 group-hover:-translate-y-10">
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md line-clamp-1">{game.title}</h3>

          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-white/20 text-white`}>
              {game.category}
            </span>
            {isLocked && (
              <span className="text-[10px] uppercase font-bold text-yellow-500 flex items-center gap-1">
                <Lock size={10} /> Premium
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Actions (Play/Info) - Slide in from bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/60 backdrop-blur-md"
      >
        {!isLocked ? (
          <div className="flex gap-2 w-full">
            <Link to={`/play/${game.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
              <button className="w-full bg-white text-black py-1.5 rounded text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                <Play size={14} className="fill-black" /> Play
              </button>
            </Link>
            <button
              className="p-1.5 rounded-full border border-gray-400 hover:border-white text-white transition"
              onClick={(e) => { e.stopPropagation(); onMoreInfo?.(game); }}
            >
              <Info size={18} />
            </button>
          </div>
        ) : (
          <div className="w-full text-center text-xs text-gray-300 py-1">
            Subscribe to play
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
