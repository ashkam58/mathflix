import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, PlusCircle, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { logout } from '../services/authService';

interface NavbarProps {
  user: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = user.id !== 'guest';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    window.location.reload(); // Force refresh to clear state
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-red-600 text-3xl font-bold tracking-tighter cursor-pointer">
            MATHFLIX
          </Link>
          <ul className="hidden md:flex gap-6 text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer transition"><Link to="/">Home</Link></li>
            <li className="hover:text-white cursor-pointer transition">Math Games</li>
            <li className="hover:text-white cursor-pointer transition">Coding</li>
            {isLoggedIn && <li className="hover:text-white cursor-pointer transition">My List</li>}
          </ul>
        </div>

        <div className="flex items-center gap-6 text-white">
          {isLoggedIn ? (
            <>
              {user.isAdmin && (
                <Link to="/admin" className="hidden md:flex items-center gap-2 hover:text-gray-300 transition" title="Admin Panel">
                  <PlusCircle size={20} />
                  <span className="text-sm">Add Game</span>
                </Link>
              )}
              <Search className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
              <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
              <div className="flex items-center gap-4 cursor-pointer group relative">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold">
                    {user.name ? user.name.charAt(0) : '?'}
                  </div>
                  <span className="text-sm font-medium hidden md:block">{user.name || 'User'}</span>
                </div>

                {user.isSubscribed && <span className="absolute -top-1 left-6 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}

                <button onClick={handleLogout} className="text-gray-300 hover:text-white ml-2" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <button className="bg-red-600 px-4 py-1.5 rounded text-sm font-semibold hover:bg-red-700 transition">
                  Sign In
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
