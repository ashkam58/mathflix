import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import { Footer } from '../components/Footer';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate('/');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 md:px-16 py-6 border-b border-gray-200 flex justify-between items-center">
        <Link to="/" className="text-netflixRed text-4xl font-bold tracking-tighter cursor-pointer block">
          MATHFLIX
        </Link>
        <Link to="/login" className="text-black text-lg font-semibold hover:underline">
          Sign In
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 md:p-16 rounded max-w-lg w-full">
          <h1 className="text-3xl font-bold mb-2 text-black">Create a password to start your membership</h1>
          <p className="text-gray-600 mb-8">Just a few more steps and you're done!<br />We hate paperwork, too.</p>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-400 rounded px-4 py-3 text-black focus:outline-none focus:border-blue-600"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-400 rounded px-4 py-3 text-black focus:outline-none focus:border-blue-600"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Add a password"
                className="w-full border border-gray-400 rounded px-4 py-3 text-black focus:outline-none focus:border-blue-600"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded text-xl mt-4 hover:bg-red-700 transition">
              Next
            </button>
          </form>
        </div>
      </div>
      <div className="bg-gray-100 py-8 border-t border-gray-300">
        <div className="max-w-6xl mx-auto px-12 text-gray-500 text-sm">
          Questions? Call +91-8002416363
        </div>
      </div>
    </div>
  );
};
