import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"
import {visualizer} from "rollup-plugin-visualizer"

// https://vite.dev/config/
export default defineConfig(({command}) => {
    const isProduction = command === "build"
    return {
        plugins: [
            react(),
            visualizer({
                open: true
            })
        ],
        base: isProduction ? "/tamagotchi-resources/" : "/",
        build: {
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    manualChunks(id: string): string | undefined {
                        if (id.includes("ag-grid-community")) {
                            return "ag-grid-community"
                        }
                    }
                }
            }
        }
    }
})
