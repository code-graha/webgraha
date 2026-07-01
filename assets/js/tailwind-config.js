// WebGraha — shared Tailwind Play CDN config (used by every page)
tailwind.config = {
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
