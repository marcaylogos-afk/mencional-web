/**
 * 🔊 AUDIO_ENGINE_UTILS v20.0 - MENCIONAL 2026 (PROD)
 * Ubicación: /src/utils/audioUtils.ts
 * Lógica de gestión de voz sintética, velocidad 2x y repetición dual.
 * ✅ DIRECTORIO AI: Sincronizado para el motor Aoede en /src/services/ai/
 */

export interface PlayNeuralAudioOptions {
  text: string;
  lang: string;
  rate?: number;       // 1.0 estándar, 2.0 para Intérprete (Ultra-Mencional)
  isDual?: boolean;    // Repetir 2 veces (Aprendizaje / Mencional 6s)
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * 🎙️ speakAoede
 * Motor principal de voz femenina, suave y profesional. 
 * Implementa la prevención de eco cancelando el buffer antes de cada intervención.
 */
export const speakAoede = ({
  text,
  lang,
  rate = 1.0,
  isDual = false,
  onStart,
  onEnd
}: PlayNeuralAudioOptions): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // 🛡️ PREVENCIÓN DE ECO: Purga total antes de emitir la nueva ráfaga
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getBestVoice(lang);
  
  if (voice) utterance.voice = voice;
  utterance.lang = lang;
  utterance.rate = rate; // Soporta 2.0x para Modo Intérprete cada 19s
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  let playCount = 0;
  const maxPlays = isDual ? 2 : 1;

  utterance.onstart = () => {
    if (playCount === 0 && onStart) onStart();
  };

  utterance.onend = () => {
    playCount++;
    // ✅ PROTOCOLO DE REPETICIÓN (X2): Para modo Aprendizaje
    if (playCount < maxPlays) {
      // Pausa táctica de 400ms entre repeticiones para fijación fonética
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 400);
    } else {
      if (onEnd) onEnd();
    }
  };

  window.speechSynthesis.speak(utterance);
};

/**
 * 🧹 clearAudioBuffer
 * Detiene inmediatamente cualquier salida de voz activa.
 * Vital para respetar los turnos de 6 segundos sin solapamientos.
 */
export const clearAudioBuffer = (): void => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

/**
 * 🎯 getBestVoice
 * Selección de voz Aoede. Prioriza voces femeninas, naturales y suaves.
 */
export const getBestVoice = (lang: string): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  const targetLang = lang.split('-')[0].toLowerCase();

  // Prioridad: Voces "Natural/Premium" para entorno profesional
  return (
    voices.find(v => v.lang.toLowerCase().startsWith(targetLang) && /Natural|Enhanced|Premium/i.test(v.name)) ||
    voices.find(v => v.lang.toLowerCase().startsWith(targetLang) && v.name.includes('Google')) ||
    voices.find(v => v.lang.toLowerCase().startsWith(targetLang)) ||
    voices[0] || 
    null
  );
};

/**
 * ⏳ sleep
 * Utilidad para pausas sincronizadas en hilos async (ej. entre ráfagas de 19s).
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise(res => setTimeout(res, ms));

/**
 * 🎯 formatTranscriptForTTS
 * Limpia el texto para una síntesis profesional.
 * Elimina asteriscos, hashtags o ruidos detectados por el ASR.
 */
export const formatTranscriptForTTS = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/[*_#]/g, '') 
    .replace(/\[.*?\]/g, '') 
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * 🔊 playNotificationTone
 * Feedback auditivo sutil para cambios de color en la interfaz (Rosa, Verde, Azul).
 */
export const playNotificationTone = (freq: number = 440, duration: number = 0.1): void => {
  if (typeof window === 'undefined') return;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) { /* Bloqueo de permisos de navegador */ }
};

const audioUtils = {
  speakAoede,
  clearAudioBuffer,
  getBestVoice,
  sleep,
  formatTranscriptForTTS,
  playNotificationTone
};

export default audioUtils;