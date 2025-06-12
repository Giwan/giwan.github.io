import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
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
        // shadcn/ui colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Legacy Monokai colors for existing components
        text: {
          primary: '#f8f8f2',   // Main text (Monokai foreground)
          secondary: '#75715e', // Muted/comment text
          muted: '#a6a6a6',     // Very muted text
          inverse: '#272822'    // Dark text on light backgrounds
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

        // Legacy color mappings for gradual migration
        paper: '#272822',
        paperDark: '#1e1f1c',
        highlight: '#3e3d32',
        heading: '#f8f8f2',
        body: '#f8f8f2',
        success: '#a6e22e',     // Green
        warning: '#fd971f',     // Orange
        error: '#f92672',       // Red
        info: '#66d9ef',        // Blue
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
    typography,
  ],
}