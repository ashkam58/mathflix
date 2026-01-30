import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, PlusCircle, LogOut, Menu, X } from 'lucide-react';
import { UserProfile } from '../types';
import { logout } from '../services/authService';

interface NavbarProps {
  user: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = user.id !== 'guest';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 border-b ${isScrolled
        ? 'bg-[#141414]/90 backdrop-blur-md border-white/5 py-3'
        : 'bg-gradient-to-b from-black/90 to-transparent border-transparent py-5'
        }`}
    >
      <div className="px-6 md:px-16 flex items-center justify-between">
        {/* Logo & Nav Links */}
        <div className="flex items-center gap-12">
          <Link to="/" className="text-netflixRed text-3xl font-bold tracking-tighter hover:scale-105 transition-transform">
            MATHFLIX
          </Link>

          <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <li className="relative group">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflixRed transition-all group-hover:w-full"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="hover:text-white transition-colors">Math Games</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflixRed transition-all group-hover:w-full"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="hover:text-white transition-colors">Coding</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflixRed transition-all group-hover:w-full"></span>
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6 text-white">
          {isLoggedIn ? (
            <>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
                >
                  <PlusCircle size={18} />
                  <span>Admin</span>
                </Link>
              )}

              <Search className="w-5 h-5 cursor-pointer text-gray-300 hover:text-white transition hidden md:block" />
              <Bell className="w-5 h-5 cursor-pointer text-gray-300 hover:text-white transition hidden md:block" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-netflixRed flex items-center justify-center font-bold text-sm shadow-lg shadow-red-900/50">
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="text-sm hidden md:block text-gray-300 font-medium">
                  {user.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition p-1"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login">
              <button className="bg-netflixRed px-6 py-2 rounded text-sm font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/20">
                Sign In
              </button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141414] border-t border-white/10 px-6 py-4 space-y-3 shadow-2xl">
          <Link to="/" className="block text-gray-300 hover:text-white py-2 font-medium">Home</Link>
          <span className="block text-gray-300 hover:text-white py-2 cursor-pointer font-medium">Math Games</span>
          <span className="block text-gray-300 hover:text-white py-2 cursor-pointer font-medium">Coding</span>
          {isLoggedIn && user.isAdmin && (
            <Link to="/admin" className="block text-red-400 hover:text-red-300 py-2 font-medium">Admin Panel</Link>
          )}
        </div>
      )}
    </nav>
  );
};
