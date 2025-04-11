/** @type {import('tailwindcss').Config} */
export default {
  prefix: "easyleap-",
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,js,jsx,css}"],
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: {
            height: "0"
          },
          to: {
            height: "var(--radix-accordion-content-height)"
          }
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)"
          },
          to: {
            height: "0"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
      fontFamily: {
        dmSans: ["DM Sans", "serif"],
        poppins: ["Poppins", "serif"],
        figTree: ["Figtree", "serif"],
        firaCode: ["Fira Code", "serif"],
        inter: ["Inter", "serif"],
        jetbrainsMono: ["JetBrains Mono", "serif"]
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
