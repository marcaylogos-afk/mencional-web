/**
 * 🎨 COLORS10 v2026.12 | NEURAL CORE ASSETS
 * Definición maestra de espectro lumínico para interfaces OLED.
 * Ubicación: /src/utils/colors10.ts
 * ✅ DIRECTORIO AI: Sincronizado para temas en /src/services/ai/
 */

export const UI_SYSTEM_COLORS = {
  MASTER: "#00FBFF",          // Neon Turquoise (Mencional Core)
  MASTER_GLOW: "rgba(0, 251, 255, 0.4)",
  OLED_BLACK: "#000000",      // Absolute Black (Ahorro de energía y contraste)
  ZINC_MAIN: "#E4E4E7",       // Zinc 200 para lectura de transcripciones
  
  // Estados de Motor de IA (Voz Aoede y Reconocimiento)
  STATUS: {
    SUCCESS: "#39FF14",       // Matrix Green (Nodo Maestro / Acceso)
    AI_THINKING: "#FFBD03",   // Gold (Procesando ráfaga)
    AI_SPEAKING: "#FF1493",   // Deep Pink (Voz Aoede Activa)
    ERROR: "#FF3131",         // Neon Red (Baneo / Strike)
  }
} as const;

/**
 * 🌈 ESPECTRO_10: Los 10 colores disponibles para la configuración de sesión.
 * Estos deben mostrarse en el panel inicial antes de comenzar.
 * Se utilizan para indicar quién habla (rosa, verde, azul, etc.) de forma visual.
 */
export const COLORS_10 = [
  "#00FBFF", // 1. Neon Turquoise (Default)
  "#39FF14", // 2. Matrix Green (Admin)
  "#FF1493", // 3. Deep Pink (Aoede Style)
  "#8C52FF", // 4. Electric Purple
  "#FF3131", // 5. Neon Red
  "#FFBD03", // 6. Gold / Amarillo Oro
  "#00E5FF", // 7. Cyan Deep
  "#7FFF00", // 8. Chartreuse (Verde Limón)
  "#FF44CC", // 9. Hot Pink (Rosa Intenso)
  "#FFFFFF"  // 10. Pure White (Neutral)
] as const;

/**
 * 🏛️ CATEGORY_THEMES: Mapeo de identidad para los "Temas más socorridos".
 * Se muestran junto con los colores y opciones de idioma en el panel de configuración.
 * Nutridos de las tendencias de sesiones previas.
 */
export interface CategoryStyle {
  hex: string;
  glow: string;
  label: string;
}

export const getCategoryStyle = (category: string): CategoryStyle => {
  const mapping: Record<string, CategoryStyle> = {
    CALL_CENTER: { hex: "#00FBFF", glow: "rgba(0, 251, 255, 0.2)", label: "Atención_Cliente" },
    CAFE_SHOP: { hex: "#FFBD03", glow: "rgba(255, 189, 3, 0.2)", label: "Hostelería" },
    TECH_SUPPORT: { hex: "#8C52FF", glow: "rgba(140, 82, 255, 0.2)", label: "Soporte_IT" },
    BUSINESS: { hex: "#39FF14", glow: "rgba(57, 255, 20, 0.2)", label: "Negocios_Global" },
    SOCIAL: { hex: "#FF1493", glow: "rgba(255, 20, 147, 0.2)", label: "Interacción_Libre" },
    HOTEL_STAFF: { hex: "#7FFF00", glow: "rgba(127, 255, 0, 0.2)", label: "Turismo_Gestión" },
  };

  return mapping[category] || { hex: "#E4E4E7", glow: "rgba(228, 228, 231, 0.1)", label: "General" };
};

/**
 * 🛠️ UTILS: Conversión de HEX a RGBA para efectos de Framer Motion.
 * Permite que los rectángulos de frases Trend y el reloj tengan un resplandor dinámico.
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
    : `rgba(0, 251, 255, ${opacity})`;
};

export default UI_SYSTEM_COLORS;