/** 🔊 MOTOR MENCIONAL: SPEECH SERVICE v2026.PROD 
 * ✅ FIX TOTAL: Exportación directa de funciones para evitar errores de minificación.
 * ✅ AUDIO: Doble Impacto (1.0x -> 0.85x)
 * ✅ UBICACIÓN: /src/services/ai/speechService.ts
 */

let recognition: any = null;
const listeners: { [key: string]: Function[] } = {};
let isListening = false;
let isSpeaking = false;

// Inicialización del motor de reconocimiento
if (typeof window !== 'undefined') {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => { 
      isListening = true; 
      dispatch('status', 'listening'); 
    };
    recognition.onend = () => { 
      isListening = false; 
      dispatch('status', 'idle'); 
      dispatch('mic_closed', true); 
    };
    recognition.onerror = (event: any) => { 
      if (event.error !== 'no-speech') dispatch('error', event.error); 
      isListening = false; 
    };
  }
}

function dispatch(event: string, data: any) {
  listeners[event]?.forEach(cb => cb(data));
}

/** 🎤 INICIAR ESCUCHA ACTIVA */
export const startListening = async (lang: string = 'es-MX') => {
  if (!recognition || isSpeaking) return false;
  
  // Limpieza previa para evitar bloqueos en Chrome
  try { recognition.abort(); } catch(e) {}

  recognition.lang = lang;
  recognition.onresult = (event: any) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) final += event.results[i][0].transcript;
      else interim += event.results[i][0].transcript;
    }
    if (interim) dispatch('partial_result', interim);
    if (final) dispatch('final_result', { transcription: final.trim() });
  };

  try {
    recognition.start();
    return true;
  } catch (e) { return false; }
};

/** 🗣️ PROTOCOLO AOEDE: DOBLE IMPACTO (x2) */
export const speakLearning = async (text: string, lang: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  isSpeaking = true;
  try { recognition.abort(); } catch(e) {}
  window.speechSynthesis.cancel();

  const playUtterance = (rate: number, volume: number = 1.0) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      // Selección de voz premium (Google o Natural son las que mejor procesan el rate)
      const preferredVoice = voices.find(v => 
        v.lang.includes(lang) && (v.name.includes("Google") || v.name.includes("Natural"))
      );

      utterance.lang = lang;
      utterance.rate = rate; 
      utterance.volume = volume;
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(true);
      window.speechSynthesis.speak(utterance);
    });
  };

  try {
    // 1ª Pasada: Normal
    await playUtterance(1.0);
    // Pausa táctica para fijación
    await new Promise(r => setTimeout(r, 700)); 
    // 2ª Pasada: Lenta (Doble Impacto)
    await playUtterance(0.85, 0.9); 
  } finally {
    isSpeaking = false;
    dispatch('speaking_finished', true);
  }
};

/** 🛑 DETENER TODO */
export const stopAllSpeech = () => {
  if (recognition) try { recognition.abort(); } catch(e) {}
  if (typeof window !== 'undefined') window.speechSynthesis.cancel();
  isSpeaking = false;
  isListening = false;
};

/** 🔌 GESTIÓN DE EVENTOS */
export const onSpeechEvent = (event: string, cb: Function) => {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(cb);
};

export const offSpeechEvent = (event: string, cb?: Function) => {
  if (!cb) listeners[event] = [];
  else listeners[event] = listeners[event]?.filter(l => l !== cb);
};

// Exportación única por defecto para que tus componentes no se rompan
export default {
  start: startListening,
  speakLearning,
  stopAll: stopAllSpeech,
  on: onSpeechEvent,
  off: offSpeechEvent
};
