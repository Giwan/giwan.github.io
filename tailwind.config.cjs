/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Code-friendly fonts
        serif: ['Merriweather', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // Monokai-inspired color palette
        primary: '#f8f8f2', // Monokai foreground 
        secondary: '#a6a6a6', // Muted text
        accent: '#ae81ff', // Monokai purple
        
        // Text colors
        heading: '#f8f8f2', // Light for headings on dark background
        body: '#f8f8f2', // Light text for dark background
        muted: '#a6a6a6', // Muted text
        
        // UI colors - dark mode
        paper: '#272822', // Monokai background
        paperDark: '#1e1f1c', // Darker paper
        highlight: '#3e3d32', // Highlight color
        border: '#3e3d32', // Border color
        
        // Monokai syntax colors
        monokai: {
          background: '#272822',
          foreground: '#f8f8f2',
          comment: '#75715e',
          yellow: '#e6db74', // Strings
          orange: '#fd971f', // Numbers/Constants
          red: '#f92672',    // Keywords
          purple: '#ae81ff', // Function calls
          blue: '#66d9ef',   // Function declarations
          green: '#a6e22e'   // Method names/CSS classes
        },

        // Semantic colors - Monokai style
        success: '#a6e22e', // Green
        warning: '#fd971f', // Orange
        error: '#f92672',   // Red
        info: '#66d9ef',    // Blue
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            lineHeight: '1.625',
          },
        },
      },
      boxShadow: {
        'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'paper': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'paper-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        '18': '4.5rem',
      },
      borderWidth: {
        '3': '3px',
      },
      fontSize: {
        'headline': ['2.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'subhead': ['1.75rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'lg-accessible': ['1.125rem', { lineHeight: '1.8', letterSpacing: '0.01em' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}