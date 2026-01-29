import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { GameCard } from '../components/GameCard';
import { AdModal } from '../components/AdModal';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { PreviewModal } from '../components/PreviewModal';
import { Footer } from '../components/Footer';
import { Play, Info } from 'lucide-react';
import { Game, Category, UserProfile } from '../types';
import { getGames, getUserProfile, subscribeUser } from '../services/gameService';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [user, setUser] = useState<UserProfile>({
    id: 'guest',
    name: 'Guest',
    email: '',
    isSubscribed: false,
    myList: []
  });
  const [showSubModal, setShowSubModal] = useState(false);
  const [previewGame, setPreviewGame] = useState<Game | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [activeGradeFilter, setActiveGradeFilter] = useState<string>('All');

  useEffect(() => {
    setGames(getGames());
    getUserProfile().then(u => setUser(u));
  }, []);

  const handleSubscribe = () => {
    subscribeUser();
    setUser(getUserProfile());
    setShowSubModal(false);
  };

  const featuredGame = games[0];

  // Group games by category for the rows
  const categories = Object.values(Category).filter(c => c !== Category.FEATURED);

  // Extract unique grades from games for filter
  const grades = Array.from(new Set(games.map(g => g.grade).filter(Boolean)));

  const filterGames = (cat: Category) => {
    return games.filter(g => {
      const catMatch = g.category === cat;
      const gradeMatch = activeGradeFilter === 'All' || g.grade === activeGradeFilter;
      return catMatch && gradeMatch;
    });
  };

  const filteredView = activeCategory === 'All'
    ? categories
    : [activeCategory];

  return (
    <div className="bg-[#141414] min-h-screen flex flex-col">
      <Navbar user={user} />
      <AdModal />
      <SubscriptionModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        onSubscribe={handleSubscribe}
      />

      <div className="flex-grow">
        {/* Hero Section */}
        {featuredGame && activeCategory === 'All' && activeGradeFilter === 'All' && (
          <div className="relative h-[80vh] w-full">
            <div className="absolute inset-0">
              <img
                src={featuredGame.thumbnailUrl}
                alt={featuredGame.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
            </div>

            <div className="absolute bottom-[20%] left-4 md:left-12 max-w-xl space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">{featuredGame.title}</h1>
              <p className="text-lg text-gray-200 drop-shadow-md line-clamp-3">{featuredGame.description}</p>
              <div className="flex gap-4 mt-4">
                <Link to={`/play/${featuredGame.id}`}>
                  <Button variant="secondary" size="lg" className="flex items-center gap-2">
                    <Play size={24} className="fill-black" /> Play
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 bg-gray-500/30 backdrop-blur-sm border-none text-white hover:bg-gray-500/50"
                  onClick={() => setPreviewGame(featuredGame)}
                >
                  <Info size={24} /> More Info
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className={`px-4 md:px-12 sticky top-[70px] z-40 py-4 bg-[#141414]/95 backdrop-blur shadow-md space-y-3 ${activeCategory !== 'All' ? 'mt-20' : ''}`}>
          {/* Categories */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap transition ${activeCategory === 'All' ? 'bg-white text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as Category)}
                className={`px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap transition ${activeCategory === cat ? 'bg-white text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grades Filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">Grade Level:</span>
            <button
              onClick={() => setActiveGradeFilter('All')}
              className={`px-3 py-0.5 rounded border text-xs transition ${activeGradeFilter === 'All' ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-700 text-gray-400 hover:text-white'}`}
            >
              Any
            </button>
            {grades.map(g => (
              <button
                key={g}
                onClick={() => setActiveGradeFilter(g)}
                className={`px-3 py-0.5 rounded border text-xs transition ${activeGradeFilter === g ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-700 text-gray-400 hover:text-white'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Game Rows */}
        <div className="space-y-8 px-4 md:px-12 mt-4 min-h-[50vh]">
          {filteredView.map((cat) => {
            const catGames = filterGames(cat as Category);
            if (catGames.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-100 hover:text-white cursor-pointer">{cat}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2">
                  {catGames.map(game => (
                    <div key={game.id} onClick={() => {
                      if (game.isPremium && !user.isSubscribed) {
                        setShowSubModal(true);
                      }
                    }}>
                      <GameCard
                        game={game}
                        isLocked={game.isPremium && !user.isSubscribed}
                        onMoreInfo={() => setPreviewGame(game)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {filteredView.every(cat => filterGames(cat as Category).length === 0) && (
            <div className="text-center text-gray-500 mt-20">
              <p>No games found for this filter combination.</p>
            </div>
          )}
        </div>
      </div>

      <PreviewModal
        game={previewGame}
        isOpen={!!previewGame}
        onClose={() => setPreviewGame(null)}
      />
      <Footer />
    </div >
  );
};