import React, { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

interface ParticleBackgroundProps {
    variant?: 'hero' | 'subtle';
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ variant = 'hero' }) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options: ISourceOptions = useMemo(() => {
        const isHero = variant === 'hero';

        return {
            fullScreen: false,
            background: {
                color: {
                    value: 'transparent',
                },
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: 'grab',
                    },
                    onClick: {
                        enable: true,
                        mode: 'push',
                    },
                },
                modes: {
                    grab: {
                        distance: 140,
                        links: {
                            opacity: 0.5,
                        },
                    },
                    push: {
                        quantity: 2,
                    },
                },
            },
            particles: {
                color: {
                    value: isHero ? ['#ff4444', '#4488ff', '#44ff88', '#ffaa44'] : ['#ffffff'],
                },
                links: {
                    color: isHero ? '#ff4444' : '#ffffff',
                    distance: 150,
                    enable: true,
                    opacity: isHero ? 0.15 : 0.05,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: isHero ? 1.5 : 0.5,
                    direction: 'none',
                    random: true,
                    straight: false,
                    outModes: {
                        default: 'bounce',
                    },
                },
                number: {
                    density: {
                        enable: true,
                        height: 800,
                        width: 800,
                    },
                    value: isHero ? 60 : 30,
                },
                opacity: {
                    value: isHero ? 0.6 : 0.2,
                    animation: {
                        enable: true,
                        speed: 0.5,
                        sync: false,
                    },
                },
                shape: {
                    type: ['circle', 'triangle', 'square'],
                },
                size: {
                    value: { min: 2, max: isHero ? 6 : 3 },
                    animation: {
                        enable: true,
                        speed: 2,
                        sync: false,
                    },
                },
            },
            detectRetina: true,
        };
    }, [variant]);

    if (!init) return null;

    return (
        <Particles
            id={`tsparticles-${variant}`}
            options={options}
            className="absolute inset-0 -z-10"
        />
    );
};

export default ParticleBackground;
