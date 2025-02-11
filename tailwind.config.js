/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
      },
      maxWidth: {
        container: '1920px',
      },
      spacing: {
        'fluid-p': 'clamp(1rem, 3vw, 3rem)',
      },
      fontSize: {
        'fluid-base': 'clamp(1rem, 1.5vw, 1.25rem)',
      },
    },
  },
  plugins: [],
};