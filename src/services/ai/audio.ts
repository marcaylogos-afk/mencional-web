/**
 * 🎙️ NEURAL_AUDIO_SERVICE v2026.PROD - MENCIONAL
 * Motor de voz para Aoede: Síntesis con soporte de Ducking y Pitch Neural.
 * Ubicación: /src/services/ai/audio.ts
 * ✅ DIRECTORIO: Sincronizado de /ia/ a /ai/
 */

import { logger } from "../../utils/logger";

/**
 * 🔊 speakNeural
 * Motor principal de síntesis. Dispara eventos globales para que useAudioDucking
 * reduzca el volumen ambiental al 15% y bloquee el micro durante la emisión.
 */
export const speakNeural = (
  text: string,
  targetLang: string = 'en-US',
  speed: number = 0.9,
  pitch: number = 1.1 
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      logger.error("AUDIO", "SpeechSynthesis no soportado en este dispositivo.");
      reject("NODE_AUDIO_UNSUPPORTED");
      return;
    }

    // Cancelar emisiones previas para evitar "cola de voz" y solapamientos
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 1. FILTRADO DE VOZ AOEDE (Prioridad: Femenino + Natural + Localizada)
    const voices = window.speechSynthesis.getVoices();
    const aoedeVoice = 
      voices.find(v => v.lang.startsWith(targetLang) && (v.name.includes('Google') || v.name.includes('Natural'))) ||
      voices.find(v => v.lang.startsWith(targetLang) && (v.name.includes('Female') || v.name.includes('Helena') || v.name.includes('Zira'))) ||
      voices.find(v => v.lang.startsWith(targetLang)) ||
      voices[0];

    utterance.voice = aoedeVoice;
    utterance.lang = targetLang;
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.volume = 1.0;

    // 2. DISPARADORES PARA EL HOOK DE DUCKING (useAudioDucking.ts)
    utterance.onstart = () => {
      // Activa el modo "Escucha Atenta": Baja música y silencia reconocimiento de voz propio
      window.dispatchEvent(new CustomEvent('ai-speech-start'));
      logger.info("AUDIO_EMISSION", `Aoede transmitiendo en ${targetLang} a ${speed}x`);
    };

    utterance.onend = () => {
      // Restaura niveles de audio originales con fade-in
      window.dispatchEvent(new CustomEvent('ai-speech-end'));
      resolve();
    };

    utterance.onerror = (e) => {
      window.dispatchEvent(new CustomEvent('ai-speech-end'));
      logger.error("AUDIO_CRITICAL", e);
      reject(e);
    };

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * ❄️ PROTOCOLO DE FIJACIÓN NEURAL (REPETICIÓN x2)
 * Utilizado en Modo Aprendizaje (6s) y Rompehielo (4s).
 * Reproduce 2 veces la frase para asegurar el aprendizaje rápido.
 */
export const speakAprendizaje = async (text: string, lang: string = 'en-US') => {
  try {
    // Primera reproducción (Fijación 1)
    await speakNeural(text, lang, 0.95); 
    
    // Pausa de 800ms para procesamiento cognitivo del usuario
    await new Promise(r => setTimeout(r, 800));
    
    // Segunda reproducción (Fijación 2) para consolidar en la memoria a corto plazo
    await speakNeural(text, lang, 0.95);
    
    logger.info("AUDIO_FIX", `Protocolo x2 completado para: "${text}"`);
  } catch (error) {
    logger.error("APRENDIZAJE_AUDIO", "Fallo en protocolo de repetición.");
  }
};

/**
 * 🎙️ speakInterpreter (Protocolo 19s / Síntesis Acelerada)
 * Velocidad aumentada (2.0x) para no interrumpir el flujo natural de la charla.
 */
export const speakInterpreter = (text: string, lang: string = 'es-MX') => {
  return speakNeural(text, lang, 2.0); 
};

/**
 * 🛑 stopNeural
 * Detiene cualquier emisión de voz de forma inmediata.
 */
export const stopNeural = () => {
  window.speechSynthesis.cancel();
  window.dispatchEvent(new CustomEvent('ai-speech-end'));
};

/**
 * ⚡ initAudioContext
 * Pre-carga de voces para evitar latencia en el primer disparo.
 */
export const initAudioContext = () => {
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      logger.info("AUDIO", "Voces neuronales Aoede sincronizadas en /services/ai/");
    };
  }
};

export const audioService = {
  speak: speakNeural,
  speakAprendizaje, // Protocolo de repetición x2
  speakInterpreter,
  stop: stopNeural,
  init: initAudioContext
};

export default audioService;