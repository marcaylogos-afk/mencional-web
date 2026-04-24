/**
 * 🎙️ MENCIONAL | NEURAL_TTS_PLAYER v2026.PROD
 * Ubicación: /src/utils/playTTS.ts
 * Protocolo: Integración con ráfagas de 19s (Ultra), 6s (Mencional) y 4s (Rompehielo).
 * ✅ DIRECTORIO AI: Sincronizado para servicios en /src/services/ai/
 */

// ✅ IMPORTACIÓN CORRECTA: Carpeta 'ai' (no 'ia') según jerarquía de Mencional
import speechService from '../services/ai/speechService'; 
import { logger } from './logger';

interface TTSOptions {
  lang?: string;
  volume?: number;
  rate?: number;
  pitch?: number;
  mode?: 'learning' | 'ultra' | 'rompehielo';
}

/**
 * ⚡ playTTS (Base Neural)
 * Función fundamental para reproducir texto con buffer de estabilidad OLED.
 * Centraliza la comunicación con el motor de voz Aoede.
 */
export const playTTS = async (
  text: string, 
  options: TTSOptions = {}
): Promise<void> => {
  const { 
    lang = 'en-US', 
    rate, 
    mode
  } = options;

  if (!text || text.trim().length === 0) return;

  try {
    // 🛡️ PROTOCOLO DE INTERRUPCIÓN: Limpia el hardware antes de cada nueva ráfaga
    speechService.stopAll();

    /**
     * ⏱️ BUFFER TÁCTICO (150ms)
     * Estabilidad vital para evitar colisiones en el hardware de audio 
     * durante transiciones rápidas en interfaces OLED.
     */
    await new Promise(resolve => setTimeout(resolve, 150));
    
    logger.info("TTS_EXECUTION", `Emisión [${mode || 'custom'}]: ${text.substring(0, 30)}...`);
    
    // 🚀 EJECUCIÓN: Sincroniza con el método 'speak' del motor Aoede
    await speechService.speak(text, { 
      lang, 
      rate, 
      mode // 'learning' (Mencional), 'ultra' (Intérprete), 'rompehielo'
    });

  } catch (error) {
    logger.error("TTS_PLAYER_FAULT", "Fallo en orquestador de voz Mencional", error);
  }
};

/**
 * 🛰️ playUltraTranslation (Modo ULTRA-MENCIONAL - Intérprete)
 * Ciclo de 19s: Velocidad ráfaga (2.0x) para máxima eficiencia sin eco.
 * Prioriza la fluidez en traducciones de conferencias o podcasts.
 */
export const playUltraTranslation = async (text: string, lang: string = 'es-MX'): Promise<void> => {
  if (!text) return;
  logger.info("ULTRA_PLAYER", "Inyectando ráfaga ejecutiva (Ciclo 19s - 2.0x)");
  
  // El modo 'ultra' fuerza internamente rate: 2.0 y traducción al idioma natal (es-MX)
  await playTTS(text, { lang, mode: 'ultra', rate: 2.0 });
};

/**
 * 🧠 playLearningTTS (Modo MENCIONAL - Aprendizaje)
 * Ciclo de 6s: Protocolo de Doble Repetición (X2) para fijación fonética.
 * El usuario escucha su propia voz y la traducción repetida dos veces.
 */
export const playLearningTTS = async (
  text: string, 
  lang: string = 'en-US'
): Promise<void> => {
  if (!text) return;
  logger.info("LEARNING_PLAYER", "Secuencia Aoede: Doble Inyección (Mencional 6s)");
  
  // ✅ ACTIVA REPETICIÓN X2: El motor Aoede repetirá el audio 2 veces por configuración de modo
  await playTTS(text, { lang, mode: 'learning' });
};

/**
 * 🧊 playRompehieloTTS (Modo ROMPEHIELO)
 * Ciclo de 4s: Interacción social rápida.
 * Tono natural para evitar bloqueos en la charla grupal.
 */
export const playRompehieloTTS = async (
  text: string, 
  lang: string = 'en-US'
): Promise<void> => {
  if (!text) return;
  logger.info("ROMPEHIELO_PLAYER", "Respuesta táctica social (Ventana 4s)");

  await playTTS(text, { lang, mode: 'rompehielo', rate: 1.1 });
};

/**
 * 🔌 ttsPlayer
 * Objeto consolidado para exportación y uso en componentes de la UI.
 */
export const ttsPlayer = {
  play: playTTS,
  playUltra: playUltraTranslation,
  playLearning: playLearningTTS,
  playRompehielo: playRompehieloTTS,
  stop: () => {
    logger.info("TTS_HALT", "Interrupción manual de flujo de audio");
    speechService.stopAll();
  }
};

export default ttsPlayer;