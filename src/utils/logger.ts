/**
 * 🛠️ MENCIONAL | UTILS: LOGGER v2026.PROD
 * Ubicación: /src/utils/logger.ts
 * Propósito: Registro de eventos para Mencional, Ultra-Mencional y Rompehielo.
 * ✅ DIRECTORIO AI: Sincronizado a /src/services/ai/
 */

export const logger = {
  /**
   * 🖥️ SYSTEM_BOOT: Muestra el estado del núcleo al iniciar.
   * Confirma visualmente que el directorio /ai/ y la REPETICIÓN_X2 están activos.
   */
  system: () => {
    console.log(
      `%c CORE: V2026.PROD %c|%c DIRECTORIO_AI: /SRC/SERVICES/AI/ %c|%c REPETICIÓN_X2: ACTIVE `,
      'color: #888; background: #222; padding: 3px;',
      'color: #555;',
      'color: #00FBFF; background: #222; padding: 3px;',
      'color: #555;',
      'color: #39FF14; background: #222; padding: 3px; font-weight: bold;'
    );
  },

  /**
   * 📡 INFO: Registra eventos de flujo normal (Aprendizaje / General).
   * Color: Cian Neón (#00FBFF).
   */
  info: (tag: string, msg: any) => {
    console.log(
      `%c[${tag}] %c${msg}`, 
      'color: #00FBFF; font-weight: 900; text-transform: uppercase; background: #000; padding: 2px 5px; border-radius: 3px;', 
      'color: #ffffff; font-weight: normal;'
    );
  },

  /**
   * 🚀 ULTRA: Registra eventos del Modo Intérprete (Exclusivo Admin).
   * Color: Verde Neón (#39FF14).
   */
  ultra: (tag: string, msg: any) => {
    console.log(
      `%c[${tag}_ULTRA] %c${msg}`, 
      'color: #39FF14; font-weight: 900; text-transform: uppercase; background: #000; padding: 2px 5px; border-left: 3px solid #39FF14;', 
      'color: #ffffff; font-weight: bold;'
    );
  },

  /**
   * 💖 SOCIAL: Registra eventos de Rompehielo.
   * Color: Rosa Neón (#FF00F5).
   */
  social: (tag: string, msg: any) => {
    console.log(
      `%c[${tag}_SOCIAL] %c${msg}`, 
      'color: #FF00F5; font-weight: 900; text-transform: uppercase; background: #000; padding: 2px 5px; border-radius: 3px;', 
      'color: #ffffff; font-style: italic;'
    );
  },

  /**
   * 🚨 ERROR: Registra fallos críticos (como el de hardware vocal o red).
   */
  error: (tag: string, msg: any) => {
    console.error(
      `%c[${tag}_ERROR] %c${msg}`, 
      'color: #FF0000; font-weight: 900; text-transform: uppercase; border-left: 4px solid #FF0000; padding-left: 10px;', 
      'color: #ffcccc;'
    );
  },

  /**
   * ⚠️ WARN: Registra advertencias de sistema (como re-sincronizaciones).
   */
  warn: (tag: string, msg: any) => {
    console.warn(
      `%c[${tag}_WARN] %c${msg}`, 
      'color: #FFD700; font-weight: 900; text-transform: uppercase;', 
      'color: #fff3cd;'
    );
  }
};

/**
 * ✅ EXPORTACIÓN DUAL
 * Garantiza compatibilidad con SettingsContext.tsx y el motor de IA en /ai/.
 */
export default logger;