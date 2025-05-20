/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
                mono: ['Menlo', 'monospace'],
            },
            colors: {
                primary: '#1DA1F2',
                secondary: '#14171A',
                textMuted: '#79aad3',
                background: '#F5F8FA',
                text: '#14171A',
                red: '#ff0000',
            },
        },
    },
    plugins: [],
}
