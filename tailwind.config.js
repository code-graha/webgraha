// WebGraha — Tailwind build config (build-time only, not shipped to the browser).
// Rebuild command after adding new utility classes anywhere in *.html or assets/js/**/*.js:
//   npx tailwindcss -i assets/css/tailwind-src.css -o assets/css/tailwind.min.css --minify
module.exports = {
    content: ['./*.html', './assets/js/**/*.js'],
    theme: {
        extend: {
            colors: {
                brand: {
                    base: '#0a1128',
                    twilight: '#1c2c5c',
                    surface: 'rgba(15, 23, 42, 0.4)',
                    green: '#2c4c3b',
                    brown: '#4a3b2c',
                    text: '#e2e8f0',
                    accent: '#6ee7b7'
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))'
            }
        }
    }
}
