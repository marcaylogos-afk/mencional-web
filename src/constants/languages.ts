/**
 * 🛰️ MENCIONAL_CORE | LANGUAGES & PALETTE v2026.12
 * Configuración central para bilingüismo por empapamiento social.
 * ✅ SINCRONIZADO: Referencias de motores actualizadas de /ia/ a /ai/
 * Ubicación: /src/constants/languages.ts
 */

export interface MencionalColor {
  id: string;
  name: string;
  hex: string;
  shadow: string;
}

/**
 * ✅ LANGUAGES: Mapeo de códigos ISO a nombres.
 * Prioridad: Inglés como motor principal (Requisito v2026.12).
 */
export const LANGUAGES: Record<string, string> = {
  en: "English",           // Prioridad 1 para aprendizaje activo
  es: "Español",           // Localización nativa
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  auto: "Inferencia AI",   // MODO: Inferencia Neural (Directorio /ai/)
};

/**
 * 🎨 PALETA MENCIONAL OLED (10 COLORES NEÓN)
 * Define la "Identidad de Turno" visual para evitar ruidos de interfaz.
 */
export const MENCIONAL_COLORS: MencionalColor[] = [
  { id: 'cyan', name: 'Cian Eléctrico', hex: '#00FBFF', shadow: 'rgba(0, 251, 255, 0.5)' }, 
  { id: 'green', name: 'Verde Neón', hex: '#39FF14', shadow: 'rgba(57, 255, 20, 0.5)' },
  { id: 'pink', name: 'Rosa Mencional', hex: '#FF1493', shadow: 'rgba(255, 20, 147, 0.5)' },
  { id: 'yellow', name: 'Oro Digital', hex: '#FFD700', shadow: 'rgba(255, 215, 0, 0.5)' }, 
  { id: 'orange', name: 'Naranja Fuego', hex: '#FF8C00', shadow: 'rgba(255, 140, 0, 0.5)' }, 
  { id: 'violet', name: 'Violeta Ultra', hex: '#8A2BE2', shadow: 'rgba(138, 43, 226, 0.5)' },
  { id: 'red', name: 'Rojo Alerta', hex: '#FF0000', shadow: 'rgba(255, 0, 0, 0.5)' },
  { id: 'white', name: 'Blanco Puro', hex: '#FFFFFF', shadow: 'rgba(255, 255, 255, 0.5)' },
  { id: 'turquoise', name: 'Esmeralda', hex: '#00FF7F', shadow: 'rgba(0, 255, 127, 0.5)' },
  { id: 'magenta', name: 'Magenta Neón', hex: '#FF00FF', shadow: 'rgba(255, 0, 255, 0.5)' }
];

/**
 * ⚙️ CONFIGURACIÓN DE PROTOCOLOS DE TIEMPO (NEURAL TIMINGS)
 * Sincronización estricta para evitar desfases en ráfagas (Bursts).
 */
export const NEURAL_TIMINGS = {
  ICEBREAKER_WINDOW: 4000,   // 4s Ventana crítica de respuesta (Rompehielo)
  LEARNING_WINDOW: 6000,     // 6s Máximo por intervención (Modo Aprendizaje)
  INTERPRETER_SYNC: 19000,   // 19s Ciclos de audio 2x en Modo Intérprete
  SESSION_BLOCK: 1200000,    // 20 minutos (1200000ms) por pago ($20 MXN)
  RENEWAL_ALERT: 300000,     // Alerta visual a los 5 min restantes
  MIN_SCHEDULING: 3600000    // 1 hora de anticipación mínima
};

/**
 * 💰 BUSINESS RULES (PROTOCOLO COMERCIAL)
 */
export const BUSINESS_RULES = {
  SESSION_COST_MXN: 20,      
  BLOCK_DURATION_MIN: 20,    
  ADMIN_PASSWORD: "osos",    // Clave Operador Maestro
  MODES: ["Aprendizaje", "Intérprete", "Rompehielo", "Ultra"]
};

/**
 * 🛠️ UTILS: Helpers para lógica de sistema
 */

// Asignación de color por ID o índice
export const getColorById = (id: string | number): MencionalColor => {
  if (typeof id === 'number') {
    return MENCIONAL_COLORS[id % MENCIONAL_COLORS.length];
  }
  return MENCIONAL_COLORS.find(c => c.id === id) || MENCIONAL_COLORS[0];
};

// Valida soporte de idioma en el motor /ai/
export const isSupportedLanguage = (code: string): boolean => {
  return Object.keys(LANGUAGES).includes(code);
};

// Label para UI
export const getLanguageLabel = (code: string): string => {
  return LANGUAGES[code] || "Nodo_AI_Desconocido";
};

/**
 * 🎙️ TTS LOCALE MAPPER (Voz Aoede)
 * Mapeo de voces para síntesis de audio (Sincronizado con /ai/tts)
 */
export const getTTSLocale = (code: string): string => {
  const map: Record<string, string> = {
    en: 'en-US',
    es: 'es-MX', 
    fr: 'fr-FR',
    it: 'it-IT',
    pt: 'pt-BR',
    de: 'de-DE'
  };
  return map[code] || 'en-US';
};

const LanguageSystem = {
  LANGUAGES,
  MENCIONAL_COLORS,
  NEURAL_TIMINGS,
  BUSINESS_RULES,
  getColorById,
  isSupportedLanguage,
  getLanguageLabel,
  getTTSLocale
};

export default LanguageSystem;