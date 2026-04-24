/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar';

export default {
  // Escaneo de archivos para generar el CSS necesario
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // ✅ MODO OSCURO: Configurado como 'class' para forzar el fondo #02040a
  darkMode: 'class', 
  
  theme: {
    extend: {
      colors: {
        // 🌌 Colores de la identidad Digoapp (Candy Night)
        night: "#02040a",
        medicalCyan: "#00afb9",
        medicalBlue: "#0081a7",
        candyRose: "#f43f5e",
        // Colores auxiliares para la Red Neural
        neuralGray: "#111827",
        auraCyan: "rgba(0, 175, 185, 0.3)",
      },
      
      // ✨ Animaciones personalizadas para Digo Mencional y Ultra Mencional
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neural-flow': 'neural-flow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },

      // Definición de fotogramas para efectos visuales avanzados
      keyframes: {
        'neural-flow': {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },

      // 🖼️ Soporte para el diseño de "Candy Glass"
      backdropBlur: {
        xs: '2px',
      },

      // Sombras de Neón para los botones de Admin y Participante
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 175, 185, 0.4)',
        'neon-rose': '0 0 15px rgba(244, 63, 94, 0.4)',
      }
    },
  },

  // 🔌 Plugins para interfaces elegantes y scrolleo profesional
  plugins: [
    scrollbar({ nocompatible: true }),
  ],
};