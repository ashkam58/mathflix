import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface AnimatedButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button',
    disabled = false,
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        // Magnetic effect on hover
        const handleMouseMove = (e: MouseEvent) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(button, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            button.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;

        // Ripple effect
        const button = buttonRef.current;
        const ripple = rippleRef.current;
        if (button && ripple) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.fromTo(ripple,
                {
                    opacity: 0.6,
                    scale: 0,
                    x: x - 50,
                    y: y - 50,
                },
                {
                    opacity: 0,
                    scale: 3,
                    duration: 0.6,
                    ease: 'power2.out',
                }
            );
        }

        // Scale bounce
        gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
        });

        onClick?.();
    };

    const baseStyles = 'relative overflow-hidden font-semibold rounded-md transition-all duration-200 inline-flex items-center justify-center gap-3';

    const variantStyles = {
        primary: 'bg-red-600 text-white hover:bg-red-700',
        secondary: 'bg-white text-black hover:bg-gray-100',
        outline: 'border border-gray-500 text-white hover:border-white bg-transparent',
    };

    const sizeStyles = {
        sm: 'px-5 py-2.5 text-sm',
        md: 'px-7 py-3',
        lg: 'px-8 py-3 text-lg',
    };

    return (
        <button
            ref={buttonRef}
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            <span
                ref={rippleRef}
                className="absolute w-[100px] h-[100px] rounded-full bg-white/30 pointer-events-none"
                style={{ opacity: 0 }}
            />
            {children}
        </button>
    );
};

export default AnimatedButton;
