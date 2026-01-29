import React, { useState, useEffect } from 'react';
import { X, Sparkles, Box, Code, Calculator, Phone } from 'lucide-react';

export const AdModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show ad after 2 seconds
    const timer = setTimeout(() => {
      const hasSeenAd = sessionStorage.getItem('hasSeenAd');
      if (!hasSeenAd) {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenAd', 'true');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#181818] w-full max-w-2xl rounded-lg shadow-2xl border border-gray-800 relative overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-20"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Creative Left Side */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-900 to-purple-900 p-8 flex flex-col justify-center text-center md:text-left relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Ashkam Intelligent Studios</h2>
            <p className="text-indigo-200 text-sm mb-6 relative z-10">Next Gen Education & Gaming</p>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3 text-white">
                <Box className="text-yellow-400" /> <span>Rubik's Cube Mastery</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Code className="text-green-400" /> <span>Python & Web Dev</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Calculator className="text-red-400" /> <span>Math & Scratch Games</span>
              </div>
            </div>
          </div>

          {/* Call to Action Right Side */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-[#181818]">
            <h3 className="text-xl font-bold text-white mb-4">Unlock Your Potential</h3>
            <p className="text-gray-400 text-sm mb-6">
              Join thousands of students learning to code, solve complex puzzles, and master mathematics with Ashkam Intelligent Studios.
            </p>
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition-all w-full flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              Start Learning Now
            </button>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
               <p className="text-gray-300 text-xs text-center mb-1">For Online Classes & Support</p>
               <a href="https://wa.me/918002416363" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-green-400 font-bold hover:text-green-300 transition">
                  <Phone size={16} /> +91-8002416363
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};