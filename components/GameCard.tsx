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
      className="relative h-56 cursor-pointer rounded-xl overflow-hidden shadow-xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background */}
      {hasValidImage ? (
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Movie Poster Style Fallback */
        <div className={`w-full h-full bg-gradient-to-br ${posterStyle.gradient} relative overflow-hidden`}>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${posterStyle.accent}20 0%, transparent 50%), 
                               radial-gradient(circle at 80% 20%, ${posterStyle.accent}15 0%, transparent 40%),
                               radial-gradient(circle at 40% 80%, ${posterStyle.accent}10 0%, transparent 30%)`
            }} />
          </div>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-4 right-4 opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={24} style={{ color: posterStyle.accent }} />
          </motion.div>

          <motion.div
            className="absolute bottom-12 left-4 opacity-20"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap size={20} style={{ color: posterStyle.accent }} />
          </motion.div>

          {/* Main content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {/* Category Icon */}
            <motion.div
              className="mb-3 p-3 rounded-full bg-white/10 backdrop-blur-sm"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CategoryIcon size={28} style={{ color: posterStyle.accent }} />
            </motion.div>

            {/* Topic/Title */}
            <h3 className="text-white font-bold text-xl leading-tight drop-shadow-lg mb-2 line-clamp-2">
              {displayTopic}
            </h3>

            {/* Category label */}
            <span className="text-xs uppercase tracking-widest opacity-60 text-white">
              {game.category}
            </span>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Hover Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 flex flex-col justify-end p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.h4
          className="text-white font-bold text-lg mb-2 line-clamp-1"
          initial={{ y: 10 }}
          animate={{ y: isHovered ? 0 : 10 }}
        >
          {game.title}
        </motion.h4>
        <motion.p
          className="text-gray-300 text-sm line-clamp-2 mb-4"
          initial={{ y: 10 }}
          animate={{ y: isHovered ? 0 : 10 }}
          transition={{ delay: 0.05 }}
        >
          {game.description}
        </motion.p>

        <motion.div
          className="flex gap-3"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ delay: 0.1 }}
        >
          {isLocked ? (
            <div className="flex items-center gap-2 text-yellow-500">
              <Lock size={18} />
              <span className="text-sm font-medium">Premium</span>
            </div>
          ) : (
            <>
              <Link to={`/play/${game.id}`} onClick={(e) => e.stopPropagation()}>
                <motion.button
                  className="bg-white text-black rounded-lg px-4 py-2 flex items-center gap-2 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={16} className="fill-black" /> Play
                </motion.button>
              </Link>
              <motion.button
                className="border border-gray-400 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                whileHover={{ scale: 1.05, borderColor: '#fff' }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreInfo?.(game);
                }}
              >
                <Info size={16} /> Info
              </motion.button>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Premium Badge */}
      {isLocked && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
          PREMIUM
        </div>
      )}

      {/* Category Tag */}
      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
        {game.category}
      </div>

      {/* Grade badge */}
      {game.grade && (
        <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-0">
          {game.grade}
        </div>
      )}
    </motion.div>
  );
};
