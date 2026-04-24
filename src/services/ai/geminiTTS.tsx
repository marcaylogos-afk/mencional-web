/**
 * 🎙️ MENCIONAL | GEMINI_TTS_CORE v2026.PROD
 * Ubicación: /src/services/ai/geminiTTS.ts
 * Función: Síntesis de voz neural con optimización rítmica para el motor Aoede.
 * Protocolos: Aprendizaje (6s + Repetición x2), Rompehielo (4s), Intérprete (19s @ 1.5x).
 * ✅ DIRECTORIO: Actualizado de /ia/ a /ai/
 */

import { logger } from '../../utils/logger';

// --- CONFIGURACIÓN DE VOZ NEURAL MENCIONAL ---
const DEFAULT_LANG = 'en-US'; 
const NEURAL_RATE = 0.9;      // Velocidad humana para fijación (Aprendizaje)
const INTERPRETER_RATE = 1.5; // Velocidad fluida para Modo Intérprete (Ciclo 19s)
const REPEAT_PAUSE = 600;     // Milisegundos de silencio entre repeticiones x2

/**
 * 🛠️ getAoedeVoice: Filtra voces profesionales.
 * Busca específicamente perfiles femeninos, suaves y naturales para la inmersión.
 */
const getAoedeVoice = (lang: string): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined') return null;
  const voices = window.speechSynthesis.getVoices();
  const target = lang.split('-')[0].toLowerCase();

  return (
    // Prioridad: Voces de Google (Premium) o Naturales de alta fidelidad
    voices.find(v => v.lang.toLowerCase().startsWith(target) && v.name.includes('Google') && v.name.includes('Female')) ||
    voices.find(v => v.lang.toLowerCase().startsWith(target) && v.name.includes('Natural')) ||
    voices.find(v => v.lang.toLowerCase().startsWith(target) && v.localService) ||
    null
  );
};

/**
 * 1. NÚCLEO DE EMISIÓN: emitUtterance
 * Maneja una sola instancia de voz neural con el timbre característico de Aoede.
 */
const emitUtterance = (text: string, rate: number, lang: string): Promise<void> => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.05; // Timbre Aoede: Femenino, profesional y cálido
    utterance.volume = 1.0;

    const voice = getAoedeVoice(lang);
    if (voice) utterance.voice = voice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      logger.error("TTS_ERROR", "Fallo en motor de audio neural Aoede.", e);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * 2. EXPORTACIÓN NOMINAL: playGeminiTTS
 * Implementa el protocolo de DOBLE REPETICIÓN (x2) para el Modo Aprendizaje (6s).
 */
export const playGeminiTTS = async (
  text: string, 
  rate: number = NEURAL_RATE, 
  lang: string = DEFAULT_LANG,
  repeat: boolean = true // Por defecto repite 2 veces para fijación neural
): Promise<void> => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    logger.error("TTS", "Navegador incompatible con síntesis neural.");
    return;
  }

  // Protocolo Anti-Solapamiento: Limpia el buffer antes de una nueva instrucción
  window.speechSynthesis.cancel();

  logger.info("TTS_EMISSION", `Iniciando protocolo Aoede: ${text.substring(0, 25)}...`);

  // Primera Ejecución: Impacto inicial
  await emitUtterance(text, rate, lang);

  // Segunda Ejecución: Refuerzo (Regla de Aprendizaje / Rompehielo)
  if (repeat) {
    await new Promise(r => setTimeout(r, REPEAT_PAUSE));
    logger.info("TTS_REPEAT", "Segunda pasada para fijación (Protocolo x2).");
    await emitUtterance(text, rate, lang);
  }
};

/**
 * 3. EXPORTACIÓN PARA INTÉRPRETE: playInterpreterAudio
 * Protocolo: Sin repetición, velocidad 1.5x, diseñado para el ciclo de 19 segundos.
 */
export const playInterpreterAudio = async (text: string, lang: string = 'es-MX'): Promise<void> => {
  return playGeminiTTS(text, INTERPRETER_RATE, lang, false);
};

/**
 * 4. EXPORTACIÓN PARA APOYO: playSupportAudio
 * Frases de sistema estilo "CandyGlass" (suaves y directas).
 */
export const playSupportAudio = async (text: string): Promise<void> => {
  return playGeminiTTS(text, 1.0, 'es-MX', false);
};

/**
 * 5. OBJETO DE SERVICIO: ttsService
 * Orquestador central para ser consumido por useAudioAoede.ts
 */
export const ttsService = {
  speak: playGeminiTTS,
  speakInterpreter: playInterpreterAudio,
  speakSupport: playSupportAudio,
  stop: () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      logger.info("TTS_STOP", "Protocolo de silencio activado.");
    }
  }
};

export default ttsService;