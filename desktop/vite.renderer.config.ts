import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config
export default defineConfig({
    plugins: [TanStackRouterVite(), react({

    })],
    resolve: {
        alias: {
            "@app": path.resolve(__dirname, "./../frontend/src"),
        },
    },
    publicDir: "./../frontend/public"
});
