import React, { useState } from 'react';
import { Play, Info, Lock } from 'lucide-react';
import { Game } from '../types';
import { Link } from 'react-router-dom';

interface GameCardProps {
  game: Game;
  isLocked: boolean;
  onMoreInfo?: (game: Game) => void;
}

// Generate a consistent gradient based on string hash
const getGradientFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate HSL colors for better visual appeal
  const h1 = Math.abs(hash % 360);
  const h2 = (h1 + 40) % 360; // Slight shift for gradient
  const s = 70 + (hash % 20); // 70-90% saturation
  const l = 35 + (hash % 15); // 35-50% lightness (darker for text readability)

  return `linear-gradient(135deg, hsl(${h1}, ${s}%, ${l}%) 0%, hsl(${h2}, ${s}%, ${l + 10}%) 100%)`;
};

export const GameCard: React.FC<GameCardProps> = ({ game, isLocked, onMoreInfo }) => {
  const [imageError, setImageError] = useState(false);
  const hasValidImage = game.thumbnailUrl && !imageError && !game.thumbnailUrl.includes('picsum.photos');

  // Get display topic (first topic or category)
  const displayTopic = game.topics?.[0] || game.category || 'Game';
  const gradient = getGradientFromString(game.title + game.category);

  return (
    <div className="group relative h-36 min-w-[240px] md:h-44 md:min-w-[300px] cursor-pointer transition-transform duration-200 ease-out md:hover:scale-105 md:hover:z-10">

      {/* Image or Gradient Fallback */}
      {hasValidImage ? (
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className="rounded-md object-cover w-full h-full"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="rounded-md w-full h-full flex flex-col items-center justify-center p-4"
          style={{ background: gradient }}
        >
          <span className="text-white/80 text-xs uppercase tracking-wider mb-1">
            {game.category}
          </span>
          <span className="text-white font-bold text-center text-lg leading-tight drop-shadow-lg">
            {displayTopic}
          </span>
        </div>
      )}

      {/* Overlay that appears on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex flex-col justify-center items-center p-4">
        <h4 className="text-white font-bold text-center mb-2">{game.title}</h4>
        <div className="flex gap-2">
          {isLocked ? (
            <div className="flex flex-col items-center text-gray-300">
              <Lock className="text-yellow-500 mb-1" />
              <span className="text-xs">Premium</span>
            </div>
          ) : (
            <>
              <Link to={`/play/${game.id}`}>
                <div className="bg-white rounded-full p-2 hover:bg-gray-200 transition">
                  <Play size={20} className="text-black fill-black" />
                </div>
              </Link>
              <button
                className="border border-gray-400 rounded-full p-2 hover:border-white transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreInfo?.(game);
                }}
              >
                <Info size={20} className="text-white" />
              </button>
            </>
          )}
        </div>
        <p className="text-xs text-gray-300 mt-2">{game.category}</p>
      </div>

      {isLocked && (
        <div className="absolute top-2 right-2 bg-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          PREMIUM
        </div>
      )}
    </div>
  );
};
