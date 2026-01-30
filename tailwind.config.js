/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./games/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                netflixRed: '#E50914',
                netflixBlack: '#141414',
                netflixDark: '#0b0b0b',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'], // distinct font for titles if needed
            },
            backgroundImage: {
                'netflix-gradient': 'linear-gradient(to top, rgba(0,0,0,0.8) 0, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)',
                'hero-radial': 'radial-gradient(circle at center, #1f1f1f 0%, #000000 100%)',
            }
        },
    },
    plugins: [],
}
