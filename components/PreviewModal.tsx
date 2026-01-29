import React, { useEffect, useState } from 'react';
import { X, Play, Plus, ThumbsUp, Volume2, VolumeX } from 'lucide-react';
import { Game } from '../types';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface PreviewModalProps {
    game: Game | null;
    isOpen: boolean;
    onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ game, isOpen, onClose }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!game) return null;

    if (!isOpen && !isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`
        relative w-full max-w-4xl mx-4 bg-[#181818] rounded-md shadow-2xl overflow-hidden 
        transform transition-all duration-300 origin-center
        ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}
        max-h-[90vh] overflow-y-auto scrollbar-hide
      `}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-[#181818] rounded-full p-2 hover:bg-[#2a2a2a] transition"
                >
                    <X size={24} className="text-white" />
                </button>

                {/* Hero Section of Modal */}
                <div className="relative aspect-video w-full">
                    <img
                        src={game.thumbnailUrl}
                        alt={game.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />

                    <div className="absolute bottom-8 left-8 right-8">
                        <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-md">{game.title}</h2>

                        <div className="flex items-center gap-3">
                            <Link to={`/play/${game.id}`} className="flex-1 max-w-[150px]">
                                <Button variant="secondary" className="w-full flex items-center justify-center gap-2 font-bold py-2">
                                    <Play size={24} className="fill-black" /> Play
                                </Button>
                            </Link>
                            <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white transition group">
                                <Plus size={20} className="text-gray-400 group-hover:text-white" />
                            </button>
                            <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white transition group">
                                <ThumbsUp size={20} className="text-gray-400 group-hover:text-white" />
                            </button>

                            <div className="flex-1" />

                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="p-2 border border-white/20 rounded-full bg-black/30 hover:bg-black/50 transition"
                            >
                                {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-8 grid md:grid-cols-[2fr_1fr] gap-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-sm font-semibold">
                            <span className="text-green-400">98% Match</span>
                            <span className="text-gray-400">{game.grade}</span>
                            <span className="border border-gray-600 px-1 rounded text-xs text-gray-300">HD</span>
                        </div>

                        <p className="text-white text-lg leading-relaxed">{game.description}</p>

                        <div className="border-t border-gray-700 pt-6 mt-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Educational Topics</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-300">
                                {game.topics.map((topic, i) => (
                                    <li key={i}>{topic}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div>
                            <span className="text-gray-500">Category:</span>
                            <span className="text-gray-300 ml-2 hover:underline cursor-pointer">{game.category}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Subtopics:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {game.subtopics.map((sub, i) => (
                                    <span key={i} className="text-gray-300 hover:text-white cursor-pointer">
                                        {sub}{i < game.subtopics.length - 1 ? ',' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-500">Maturity:</span>
                            <span className="text-gray-300 ml-2 border border-gray-600 px-1 rounded text-xs">All Ages</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
