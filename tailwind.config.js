/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
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
        kwaici: {
          paragraph: {
            DEFAULT: "#41424B"
          },
          primary: {
            DEFAULT: "#0A20E6"
          },
          black: {
            DEFAULT: "#1C1E28",
            800: '#323030',
            700: "#6D6767",
            600: "#BDBDBD",
            500: '#C7D4DE'
          },
          red: {
            DEFAULT: "#DA1028"
          },
          green: {
            DEFAULT: "#0EAC5F"
          },
          orange: {
            DEFAULT: "#FE9C34"
          },
        }
      },
      aspectRatio: {
        'video-potrait': '9 / 16'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
