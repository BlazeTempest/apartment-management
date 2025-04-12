/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Enable dark mode using a class
  content: [
    './pages/**/*.{ts,tsx,js,jsx}', // Include pages
    './components/**/*.{ts,tsx,js,jsx}', // Include components
    './app/**/*.{ts,tsx,js,jsx}', // Include app directory if using Next.js structure later
    './src/**/*.{ts,tsx,js,jsx}', // Include src directory
	],
  prefix: "", // No prefix for Tailwind classes
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Add custom theme extensions here if needed
      // Example:
      // colors: {
      //   primary: '#007bff',
      // },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": { // Added from mockups
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out", // Added from mockups
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Plugin for animations (used by ShadCN)
}
