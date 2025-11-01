/***************************************************
 Tailwind config
***************************************************/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#021058",
        lightbg: "#F9F9F9",
      },
      boxShadow: {
        card: "0 8px 24px rgba(2,16,88,0.12)",
      },
      borderRadius: {
        xl: "1rem",
      },
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        cta: "linear-gradient(180deg, #021058 0%, #0B1B7A 100%)",
      },
    },
  },
  plugins: [],
};
