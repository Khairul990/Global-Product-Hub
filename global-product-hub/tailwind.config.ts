import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212B",
        muted: "#687580",
        paper: "#F7F7F4",
        line: "#E6E8E5",
        accent: "#B56E45",
      },
      boxShadow: {
        soft: "0 16px 50px rgba(23,33,43,.07)",
      },
    },
  },
  plugins: [],
};
export default config;
