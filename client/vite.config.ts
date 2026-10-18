import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: "0.0.0.0",
      },
      plugins: [tailwindcss(), svelte()],
      define: {
        "process.env.VITE_API_URL": JSON.stringify(
          env.VITE_API_URL || "http://localhost:3000",
        ),
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "."),
        },
      },
    };
});
