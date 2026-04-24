/**
 * 🎨 COLORS10 v2026.12 | NEURAL CORE ASSETS
 * Ubicación: /src/utils/colors10.ts
 * Propósito: Definición de variables de color para interfaces OLED y efectos Candy Glass.
 */

export const colors10 = {
  // 🟦 PRIMARY: MENCIONAL IDENTITY
  primary: "#00FBFF",        // Neon Turquoise (Cyan Principal)
  primaryGlow: "rgba(0, 251, 255, 0.4)",
  primaryDark: "#008A8C",

  // ⬛ OLED OPTIMIZATION (Perfect Blacks)
  black: "#000000",          // Absolute Black para ahorro de energía OLED
  blackGlass: "rgba(0, 0, 0, 0.7)",
  deepGrey: "#0A0A0A",

  // ⬜ ACCENTS & TEXT
  white: "#FFFFFF",
  whiteMuted: "rgba(255, 255, 255, 0.6)",
  zinc: {
    400: "#A1A1AA",
    500: "#71717A",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
  },

  // 🚦 STATUS & PROTOCOLS
  success: "#10B981",        // Emerald para Sincronización Exitosa
  warning: "#FBBF24",        // Amber para Timeout de Silencio
  error: "#EF4444",          // Red para Fallos de Hardware (ASR_ERROR)
  
  // ✨ CANDY GLASS EFFECTS
  glass: {
    border: "rgba(255, 255, 255, 0.05)",
    reflection: "rgba(0, 251, 255, 0.1)",
    shadow: "rgba(0, 0, 0, 0.5)",
  },

  // 🛰️ SPECIAL MODES (Telemetry Colors)
  learning: "#8B5CF6",       // Violeta para Modo Aprendizaje (6s)
  interpreter: "#00FBFF",    // Cyan para Modo Ultra-Interpreter (19s)
  icebreaker: "#F472B6",     // Pink para Modo Rompehielo (4s)
};

// Helper para generar gradientes dinámicos Mencional
export const getNeuralGradient = (opacity: number = 1) => {
  return `linear-gradient(135deg, rgba(0, 251, 255, ${opacity}), rgba(0, 0, 0, 1))`;
};

export default colors10;