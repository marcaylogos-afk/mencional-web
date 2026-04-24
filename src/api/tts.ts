/**
 * 🎙️ MENCIONAL_NEURAL_TTS v2026.PROD
 * Ubicación: /src/api/tts.ts 
 * Voz: Aoede (Neural2 Premium) | Protocolo de Sincronización Neural
 * ✅ SINCRONIZADO: Directorio de servicios actualizado de /ia/ a /ai/
 */

import { logger } from "../utils/logger";

interface TTSOptions {
  languageCode?: string;
  speakingRate?: number;
  pitch?: number;
}

/**
 * 🧠 Mapeo de Voces Aoede por Idioma (Neural2 High Fidelity)
 * Optimizado para inmersión profunda en el Nodo Maestro.
 */
const VOICES_MAP: Record<string, string> = {
  'en-US': 'en-US-Neural2-F',
  'es-MX': 'es-MX-Neural2-A',
  'fr-FR': 'fr-FR-Neural2-A',
  'it-IT': 'it-IT-Neural2-C',
  'pt-BR': 'pt-BR-Neural2-A',
  'de-DE': 'de-DE-Neural2-D'
};

/**
 * 🧠 Motor de Síntesis de Voz Premium
 * ✅ RUTA ACTUALIZADA: /api/ai/tts (Sincronizada con backend/index.js)
 */
export const synthesizeGeminiVoice = async (
  text: string,
  options: TTSOptions = {}
): Promise<string | null> => {
  const { 
    languageCode = "es-MX", 
    speakingRate = 0.95, 
    pitch = 0.0 
  } = options;

  if (!text) return null;

  try {
    // El endpoint ahora refleja la nueva estructura del directorio /ai/
    const response = await fetch("/api/ai/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode,
          name: VOICES_MAP[languageCode] || VOICES_MAP['en-US'],
          ssmlGender: "FEMALE", 
        },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: Math.min(Math.max(speakingRate, 0.25), 2.0),
          pitch: pitch,
        },
      }),
    });

    if (!response.ok) throw new Error("TTS_API_FAILURE_AT_AI_DIR");

    const data = await response.json();
    return data.audioContent; // Retorna string Base64 para playNeuralAudio

  } catch (error) {
    logger.error("NEURAL_TTS_CRITICAL", `Falla en motor /ai/: ${error}`);
    return null;
  }
};

/**
 * 🔊 playNeuralAudio
 * Control de hardware: Notifica eventos para el protocolo "Manos Libres".
 */
export const playNeuralAudio = async (base64Audio: string): Promise<void> => {
  return new Promise((resolve) => {
    // 🛡️ Protocolo de Inmersión: Bloquea MIC para evitar feedback
    window.dispatchEvent(new CustomEvent('ai-speech-start'));

    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    audio.className = "mencional-audio-stream";
    
    const handleEnd = () => {
      audio.remove();
      // 🔊 Protocolo de Inmersión: Libera MIC para captura de usuario
      window.dispatchEvent(new CustomEvent('ai-speech-end'));
      resolve();
    };

    audio.onended = handleEnd;
    audio.onerror = handleEnd;

    audio.play().catch(err => {
      logger.warn("AUDIO_AUTOPLAY_BLOCKED", "Interacción requerida para audio en /ai/");
      handleEnd();
    });
  });
};

/**
 * 🛑 stopAllSpeech - Purga sensorial total
 */
export const stopAllSpeech = () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  const activeAudios = document.querySelectorAll('.mencional-audio-stream') as NodeListOf<HTMLAudioElement>;
  activeAudios.forEach(audio => {
    audio.pause();
    audio.remove();
  });
  window.dispatchEvent(new CustomEvent('ai-speech-end'));
};

/**
 * 🚀 speakAoede (Orquestador de Modos)
 * Sincroniza velocidades y repeticiones según el modo activo.
 */
export const speakAoede = async (
  text: string, 
  mode: 'LEARNING' | 'INTERPRETER' | 'ICEBREAKER' = 'LEARNING',
  lang: string = 'en-US'
): Promise<void> => {
  
  stopAllSpeech();

  // Mapeo de velocidad táctica de Mencional
  const rate = mode === 'INTERPRETER' ? 2.0 : 0.95;

  try {
    const audioBase64 = await synthesizeGeminiVoice(text, { 
        speakingRate: rate,
        languageCode: lang 
    });
    
    if (!audioBase64) throw new Error("EMPTY_AI_VOICE_PAYLOAD");

    if (mode === 'LEARNING') {
      /** 🔄 PROTOCOLO DE FIJACIÓN DUAL: Doble impacto sensorial */
      await playNeuralAudio(audioBase64);
      await new Promise(r => setTimeout(r, 600)); 
      await playNeuralAudio(audioBase64);
    } else {
      await playNeuralAudio(audioBase64);
    }

  } catch (e) {
    logger.warn("AI_SERVICE_UNREACHABLE", "Fallback a WebSpeech local (Modo Offline)");
    
    window.dispatchEvent(new CustomEvent('ai-speech-start'));
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.lang = lang;
    utterance.onend = () => window.dispatchEvent(new CustomEvent('ai-speech-end'));
    window.speechSynthesis.speak(utterance);
  }
};

/**
 * ✅ EXPORTS OFICIALES MENCIONAL 2026
 */
export const playGeminiTTS = speakAoede;

export const ttsService = {
  synthesize: synthesizeGeminiVoice,
  play: playNeuralAudio,
  speak: speakAoede,
  stop: stopAllSpeech,
  playGeminiTTS: speakAoede
};

export default ttsService;