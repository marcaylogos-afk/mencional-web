/**
 * ⚡ VITE_CONFIG_PROD v2.6 - MENCIONAL 2026
 * Ubicación: /vite.config.ts
 * Objetivo: Resolución de rutas tácticas, inyección de variables de entorno (Auth)
 * y optimización de carga para dispositivos móviles.
 */

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno (como VITE_ADMIN_BYPASS_CODE) según el modo
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        fastRefresh: true,
        babel: {
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }]
          ],
        },
      }),
    ],
    // 🔑 SOLUCIÓN AL ERROR DE CONTRASEÑA: Expone las variables al navegador
    define: {
      'process.env.VITE_ADMIN_BYPASS_CODE': JSON.stringify(env.VITE_ADMIN_BYPASS_CODE),
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.css'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@api': path.resolve(__dirname, './src/api'),
        '@components': path.resolve(__dirname, './src/components'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@context': path.resolve(__dirname, './src/context'), 
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@services': path.resolve(__dirname, './src/services'),
        '@views': path.resolve(__dirname, './src/views'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@ai': path.resolve(__dirname, './src/services/ai'),
        '@data': path.resolve(__dirname, './src/services/data'),
        '@logic': path.resolve(__dirname, './src/services/logic'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@public': path.resolve(__dirname, './public')
      },
    },
    server: {
      port: 5173,
      host: true, 
      strictPort: true,
      hmr: { overlay: true },
      watch: { usePolling: true }
    },
    publicDir: 'public', 
    build: {
      outDir: 'dist',
      target: 'esnext', 
      sourcemap: false, 
      minify: 'terser', // Optimización que activamos previamente
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.debug', 'console.warn'] 
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) return 'vendor-firebase';
              if (id.includes('@google/generative-ai')) return 'vendor-google-ai';
              if (id.includes('framer-motion') || id.includes('lucide-react')) return 'vendor-ui-kit';
              if (id.includes('howler') || id.includes('tone')) return 'vendor-audio-engine';
              return 'vendor-libs';
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1200, 
    }
  };
});