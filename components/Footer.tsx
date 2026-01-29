import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-400 py-10 px-4 md:px-12 border-t border-gray-800 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-red-600 text-2xl font-bold tracking-tighter mb-2">MATHFLIX</h2>
          <p className="text-sm text-gray-500">Powered by Ashkam Intelligent Studios</p>
          <p className="text-xs text-gray-600 mt-1">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
        
        <div className="flex flex-col gap-3 text-sm">
          <h3 className="font-bold text-white mb-1 uppercase tracking-wider text-xs">Contact Us</h3>
          <a href="https://wa.me/918002416363" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-green-400 transition">
            <MessageCircle size={18} /> WhatsApp: +91-8002416363
          </a>
           <div className="flex items-center gap-2">
            <Phone size={18} /> For Online Classes: +91-8002416363
          </div>
          <a href="mailto:ashkam58@gmail.com" className="flex items-center gap-2 hover:text-white transition">
             <Mail size={18} /> ashkam58@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};