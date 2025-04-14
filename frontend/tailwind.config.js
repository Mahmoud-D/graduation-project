/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary Colors
        primary: "#FF6B35", // Main Brand Color - Vibrant Orange
        secondary: "#2A9D8F", // Secondary Color - Deep Teal
        
        // Supporting Colors
        accent: "#FFD166", // Accent Color - Bright Yellow
        "dark-shade": "#264653", // Dark Shade - Deep Navy
        "light-shade": "#F8F1E9", // Light Shade - Soft Cream
        
        // Functional Colors
        success: "#4CAF50", // Success - Green
        error: "#E63946", // Error/Urgent - Red
        neutral: "#E9ECEF", // Neutral - Light Gray

        // Shadcn UI required colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        primary: {
          DEFAULT: "#FF6B35",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2A9D8F",
          foreground: "#FFFFFF",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
//  plugins: [require("tailwindcss-animate")],
} 