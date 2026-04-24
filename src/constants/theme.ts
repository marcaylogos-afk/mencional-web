/**
 * ⚡ MENCIONAL | THEME_CONSTANTS v2026.PROD
 * Ubicación: /src/constants/theme.ts
 * Paleta de 10 colores Neón optimizados para OLED (#000000).
 * ✅ SINCRONIZADO: Referencias de UI actualizadas para el directorio /ai/.
 */

export const MENCIONAL_COLORS = [
  '#00FBFF', // 1. Cian (Mencional / Learning / Directorio AI) - DEFAULT
  '#39FF14', // 2. Verde Neón (Maestro / Protocolo 'osos')
  '#FF3131', // 3. Rojo Neón (Alerta / Parpadeo final)
  '#FBFF00', // 4. Amarillo (Trend / Alerta suave)
  '#FF00FF', // 5. Magenta (Social / Interacción)
  '#8C52FF', // 6. Violeta (Ultra-Mencional / Motor AI)
  '#FF9100', // 7. Naranja (Rompehielo / AI Interaction)
  '#00FF95', // 8. Esmeralda (Aquamarina)
  '#0066FF', // 9. Azul Eléctrico
  '#FFFFFF'  // 10. Blanco Puro (Contraste)
];

// Fondo absoluto para ahorro de energía en paneles OLED y estética Neural
export const OLED_BLACK = '#000000';

/**
 * 🧠 ASIGNACIÓN TEMÁTICA POR MODO AI
 * Mapea los colores de la paleta con las funciones del directorio /ai/
 */
export const AI_MODE_COLORS = {
  learning: MENCIONAL_COLORS[0],   // Cian para /ai/LearningEngine
  ultra: MENCIONAL_COLORS[5],      // Violeta para /ai/UltraEngine
  rompehielo: MENCIONAL_COLORS[6], // Naranja para /ai/Icebreaker
  admin: MENCIONAL_COLORS[1]       // Verde para Bypass Maestro
};