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
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
    >
      <div className="px-6 md:px-16 py-4 flex items-center justify-between">
        {/* Logo & Nav Links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-red-600 text-2xl md:text-3xl font-bold tracking-tight">
            MATHFLIX
          </Link>

          <ul className="hidden md:flex gap-6 text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer transition">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-white cursor-pointer transition">Math Games</li>
            <li className="hover:text-white cursor-pointer transition">Coding</li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5 text-white">
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
                <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="text-sm hidden md:block text-gray-300">
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
              <button className="bg-red-600 px-6 py-2 rounded text-sm font-semibold hover:bg-red-700 transition">
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
        <div className="md:hidden bg-[#141414] border-t border-white/10 px-6 py-4 space-y-3">
          <Link to="/" className="block text-gray-300 hover:text-white py-2">Home</Link>
          <span className="block text-gray-300 hover:text-white py-2 cursor-pointer">Math Games</span>
          <span className="block text-gray-300 hover:text-white py-2 cursor-pointer">Coding</span>
          {isLoggedIn && user.isAdmin && (
            <Link to="/admin" className="block text-red-400 hover:text-red-300 py-2">Admin Panel</Link>
          )}
        </div>
      )}
    </nav>
  );
};
