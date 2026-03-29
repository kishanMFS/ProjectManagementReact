import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import EnvironmentPlugin from "vite-plugin-environment";
// import { env } from "process";

export default defineConfig({
  // plugins: [react(), EnvironmentPlugin("all")],
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "",
  // define: {
  //   envWithProcessPrefix: {
  //     "process.env": `${JSON.stringify(env)}`,
  //   },
  // },
  server: {
    hmr: {
      overlay: true,
    },
  },
});
