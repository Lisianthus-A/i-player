import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    server: {
        port: 4000,
    },
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.join(__dirname, "./renderer"),
        },
    },
    build: {
        outDir: "webContent"
    }
});
