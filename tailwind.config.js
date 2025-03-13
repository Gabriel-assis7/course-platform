import containerQueries from "@tailwindcss/container-queries";
import tailwindAnimate from "tailwindcss-animate";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "1500px",
      },
    },
    extend: {},
    plugins: [],
  },
  plugins: [tailwindAnimate, containerQueries],
};
