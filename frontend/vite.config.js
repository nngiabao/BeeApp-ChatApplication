import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",      // <-- THIS FIXES CSS NOT LOADING ON VERCEL
  define: {
    global: "globalThis",
  },
});
