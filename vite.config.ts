import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 4000,
    },
    plugins: [react()],
    resolve: {
        alias: {
            Utils: path.join(__dirname, "./renderer/utils"),
            Components: path.join(__dirname, "./renderer/components"),
        },
    },
});
