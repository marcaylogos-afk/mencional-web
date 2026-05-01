/**
 * ⚡ VITE_CONFIG_PROD v2.6 - MENCIONAL 2026
 * Ubicación: /vite.config.ts
 * Objetivo: Resolución de rutas tácticas, inyección de variables de entorno y
 * optimización de despliegue para Vercel y dispositivos móviles.
 */

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno según el modo (development/production)
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
    // 🔑 SEGURIDAD Y ACCESO: Expone las variables críticas al cliente
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
        // ✅ CORRECCIÓN DE RUTA AI: Asegura que el servicio apunte a 'ai' y no 'ia'
        '@ai': path.resolve(__dirname, './src/services/ai'),
        '@data': path.resolve(__dirname, './src/services/data'),
        '@logic': path.resolve(__dirname, './src/services/logic'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@public': path.resolve(__dirname, './public')
      },
    },
    server: {
      port: 5173,
      host: true, // 📱 Crucial para que el celular vea la PC en red local
      strictPort: true,
      hmr: { overlay: true },
      watch: { usePolling: true }
    },
    publicDir: 'public', 
    build: {
      outDir: 'dist',
      target: 'esnext', 
      sourcemap: false, 
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Limpia la consola en producción para mayor velocidad
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.debug', 'console.warn'] 
        },
      },
      rollupOptions: {
        output: {
          // 📦 CODE-SPLITTING: Divide el código para cargas ultra rápidas en móvil
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