import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { Footer } from '../components/Footer';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCredentialResponse = async (response: any) => {
    const user = await import('../services/authService').then(m => m.loginWithGoogle(response.credential));
    if (user) {
      navigate('/');
      window.location.reload();
    } else {
      setError('Google Login failed.');
    }
  };

  React.useEffect(() => {
    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: process.env.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });
      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById("googleIconLogin"),
        { theme: "filled_black", size: "large", width: "400" }
      );
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user) {
      navigate('/');
      window.location.reload(); // Refresh to update Navbar state
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-75 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-blend-overlay flex flex-col">
      <div className="px-4 md:px-12 py-4">
        <Link to="/" className="text-red-600 text-4xl font-bold tracking-tighter cursor-pointer block">
          MATHFLIX
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-black/75 p-16 rounded-lg w-full max-w-md">
          <h1 className="text-white text-3xl font-bold mb-8">Sign In</h1>
          {error && <div className="bg-orange-500 text-white p-3 rounded mb-4 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email or phone number"
                className="w-full bg-[#333] rounded px-5 py-3 text-white focus:outline-none focus:bg-[#454545] placeholder-gray-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-[#333] rounded px-5 py-3 text-white focus:outline-none focus:bg-[#454545] placeholder-gray-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded mt-4 hover:bg-red-700 transition">
              Sign In
            </button>
          </form>

          <div className="mt-4">
            <div id="googleIconLogin" className="w-full"></div>
          </div>

          <div className="mt-4 flex justify-between text-gray-400 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-gray-500" /> Remember me
            </label>
            <a href="#" className="hover:underline">Need help?</a>
          </div>

          <div className="mt-16 text-gray-400">
            New to MathFlix? <Link to="/signup" className="text-white hover:underline">Sign up now.</Link>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
