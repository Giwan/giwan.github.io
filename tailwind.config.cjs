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
        // Unified Monokai color system
        // Background colors
        background: {
          DEFAULT: '#272822', // Main background
          dark: '#1e1f1c',    // Darker areas
          light: '#3e3d32',   // Lighter areas
          highlight: '#49483e' // Highlighted elements
        },
        
        // Text colors
        text: {
          primary: '#f8f8f2',   // Main text (Monokai foreground)
          secondary: '#75715e', // Muted/comment text
          muted: '#a6a6a6',     // Very muted text
          inverse: '#272822'    // Dark text on light backgrounds
        },

        // Border and surface colors
        border: {
          DEFAULT: '#3e3d32',
          light: '#49483e',
          dark: '#2c2d23'
        },

        // Monokai syntax colors for semantic use
        syntax: {
          yellow: '#e6db74',   // Strings, highlights
          orange: '#fd971f',   // Numbers, warnings
          red: '#f92672',      // Keywords, errors
          purple: '#ae81ff',   // Functions, primary accent
          blue: '#66d9ef',     // Types, info
          green: '#a6e22e'     // Classes, success
        },

        // Semantic colors mapped to Monokai
        primary: '#ae81ff',     // Purple - main brand color
        secondary: '#75715e',   // Comment gray
        accent: '#66d9ef',      // Blue - secondary accent
        success: '#a6e22e',     // Green
        warning: '#fd971f',     // Orange
        error: '#f92672',       // Red
        info: '#66d9ef',        // Blue

        // Legacy color mappings for gradual migration
        paper: '#272822',
        paperDark: '#1e1f1c',
        highlight: '#3e3d32',
        heading: '#f8f8f2',
        body: '#f8f8f2',
        muted: '#75715e'
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