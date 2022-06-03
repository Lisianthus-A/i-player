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
            Utils: path.join(__dirname, "./renderer/utils"),
            Components: path.join(__dirname, "./renderer/components"),
            Store: path.join(__dirname, "./renderer/store"),
        },
    },
    build: {
        outDir: "webContent"
    }
});
