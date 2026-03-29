import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });

// Define import.meta.env so components can access it
globalThis.import = {
  meta: {
    env: {
      MODE: "test",
      VITE_API_URL: process.env.VITE_API_URL || "http://localhost:4000",
      // add other VITE_ variables you use
    },
  },
};
