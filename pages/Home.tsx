import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { GameCard } from '../components/GameCard';
import { AdModal } from '../components/AdModal';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { PreviewModal } from '../components/PreviewModal';
import { Footer } from '../components/Footer';
import { Play, Info, ChevronDown } from 'lucide-react';
import { Game, Category, UserProfile } from '../types';
import { getGames, getUserProfile, subscribeUser } from '../services/gameService';
import { Link } from 'react-router-dom';

// Animation variants for staggered reveal
const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.95 }
};

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
  const categories = Object.values(Category).filter(c => c !== Category.FEATURED);
  const grades = Array.from(new Set(games.map(g => g.grade).filter(Boolean)));

  const filterGames = (cat: Category) => {
    return games.filter(g => {
      const catMatch = g.category === cat;
      const gradeMatch = activeGradeFilter === 'All' || g.grade === activeGradeFilter;
      return catMatch && gradeMatch;
    });
  };

  const filteredView = activeCategory === 'All' ? categories : [activeCategory];

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
        {/* Hero Section with Animations */}
        {featuredGame && activeCategory === 'All' && activeGradeFilter === 'All' && (
          <div className="relative h-[85vh] w-full overflow-hidden">
            {/* Background Image with Ken Burns */}
            <div className="absolute inset-0">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
                src={featuredGame.thumbnailUrl}
                alt={featuredGame.title}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-[#141414]/30"></div>

              {/* Floating Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, -100],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </div>

              {/* Gradient Orbs */}
              <motion.div
                className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />
            </div>

            {/* Hero Content with Staggered Animation */}
            <motion.div
              className="absolute bottom-[15%] left-6 md:left-16 max-w-2xl space-y-6"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Animated Title */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl leading-tight"
              >
                {featuredGame.title}
              </motion.h1>

              {/* Animated Description */}
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-200 drop-shadow-md line-clamp-3 max-w-lg"
              >
                {featuredGame.description}
              </motion.p>

              {/* Animated Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex gap-5 mt-8"
              >
                <Link to={`/play/${featuredGame.id}`}>
                  <motion.button
                    className="flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-md font-semibold text-lg shadow-lg"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Play size={22} className="fill-black" /> Play
                  </motion.button>
                </Link>
                <motion.button
                  className="flex items-center gap-3 bg-gray-500/40 text-white px-7 py-3.5 rounded-md font-semibold text-lg backdrop-blur-sm border border-white/20"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setPreviewGame(featuredGame)}
                >
                  <Info size={22} /> More Info
                </motion.button>
              </motion.div>

              {/* Category Badge */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 text-sm text-gray-400 mt-4"
              >
                <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold">
                  FEATURED
                </span>
                <span>{featuredGame.category}</span>
                {featuredGame.grade && <span>• {featuredGame.grade}</span>}
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{
                opacity: { delay: 2, duration: 0.5 },
                y: { delay: 2, duration: 1.5, repeat: Infinity }
              }}
            >
              <ChevronDown size={32} className="text-white/50" />
            </motion.div>
          </div>
        )}

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`px-6 md:px-16 sticky top-[72px] z-40 py-5 bg-[#141414]/95 backdrop-blur border-b border-white/5 space-y-4 ${activeCategory !== 'All' || activeGradeFilter !== 'All' ? 'mt-24' : ''}`}
        >
          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeCategory === 'All'
                ? 'bg-white text-black'
                : 'text-gray-300 border border-gray-600 hover:border-white'
                }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as Category)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeCategory === cat
                  ? 'bg-white text-black'
                  : 'text-gray-300 border border-gray-600 hover:border-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grades Filter */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 items-center">
            <span className="text-sm text-gray-400 font-medium mr-2">GRADE LEVEL:</span>
            <button
              onClick={() => setActiveGradeFilter('All')}
              className={`px-4 py-1.5 rounded-full text-sm transition ${activeGradeFilter === 'All'
                ? 'bg-white text-black'
                : 'text-gray-400 border border-gray-600 hover:border-white hover:text-white'
                }`}
            >
              Any
            </button>
            {grades.map(g => (
              <button
                key={g}
                onClick={() => setActiveGradeFilter(g)}
                className={`px-4 py-1.5 rounded-full text-sm transition ${activeGradeFilter === g
                  ? 'bg-white text-black'
                  : 'text-gray-400 border border-gray-600 hover:border-white hover:text-white'
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Game Rows with Staggered Animation */}
        <div className="space-y-12 px-6 md:px-16 py-10 min-h-[50vh]">
          {filteredView.map((cat, catIdx) => {
            const catGames = filterGames(cat as Category);
            if (catGames.length === 0) return null;

            return (
              <motion.div
                key={cat}
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: catIdx * 0.1 }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-1 h-6 bg-red-600 rounded-full" />
                  {cat}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {catGames.map((game, idx) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      onClick={() => {
                        if (game.isPremium && !user.isSubscribed) {
                          setShowSubModal(true);
                        }
                      }}
                    >
                      <GameCard
                        game={game}
                        isLocked={game.isPremium && !user.isSubscribed}
                        onMoreInfo={() => setPreviewGame(game)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {filteredView.every(cat => filterGames(cat as Category).length === 0) && (
            <div className="text-center text-gray-500 py-20">
              <p className="text-xl">No games found for this filter.</p>
              <button
                onClick={() => { setActiveCategory('All'); setActiveGradeFilter('All'); }}
                className="mt-4 text-red-500 hover:underline"
              >
                Clear filters
              </button>
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
    </div>
  );
};