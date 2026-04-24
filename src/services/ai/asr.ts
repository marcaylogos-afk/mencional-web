/**
 * 🎙️ MENCIONAL | ASR & NEURAL TRANSLATION SERVICE v2026.12
 * Protocolo: Ultra-Mencional (19s) | Mencional (6s) | Rompehielo (4s)
 * Ubicación: /src/services/ai/asr.ts
 * ✅ UPDATE: Implementación de Protocolo Espejo (Detección Bidireccional).
 */

import { logger } from "../../utils/logger"; 
import { speechService } from "./speechService"; 
import { translateService } from "./translateService"; // Importamos el motor de traducción bidireccional

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

let isProcessing = false;

/**
 * ✅ 1. MOTOR DE INFERENCIA NEURAL ADAPTATIVO (GEMINI 2.0)
 * Ahora soporta el cambio dinámico de voces según el idioma detectado.
 */
export const translate = async (
  text: string, 
  mode: 'learning' | 'ultra' | 'rompehielo' = 'learning',
  isAutoDetect: boolean = true
): Promise<string> => {
  if (!text || text.trim().length < 2 || isProcessing) return "";

  try {
    isProcessing = true;

    // 🔄 Utilizamos el translateService para obtener la detección de idioma y la traducción espejo
    const { translation, targetLang } = await translateService.translateText(text, mode, isAutoDetect);

    /**
     * 🧠 PROTOCOLO AOEDE: Sincronización de Voz Inteligente.
     * Si detectamos que el targetLang es 'es', Aoede hablará en español.
     * Si es 'en', hablará en inglés.
     */
    if (translation) {
      await speechService.speak(translation, { 
        lang: targetLang === 'es' ? 'es-MX' : 'en-US', 
        mode: mode 
      });
    }

    return translation;
  } catch (error) {
    logger.error("NEURAL_INFERENCE_FAILED", error);
    return ""; 
  } finally {
    isProcessing = false;
  }
};

/**
 * ✅ 2. ASR CON VENTANAS CRÍTICAS (100% MANOS LIBRES)
 */
export const startListening = (
  onResult: (text: string, isFinal: boolean) => void, 
  config: {
    lang: string; 
    mode: 'learning' | 'ultra' | 'rompehielo';
    isAutoDetect: boolean;
  }
) => {
  const { lang = "es-MX", mode = "learning", isAutoDetect = true } = config;
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    logger.error("ASR_NOT_SUPPORTED", "Browser not compatible");
    return null;
  }

  const recognition = new SpeechRecognition();
  
  /**
   * 🛡️ REGLA DE ORO: Si auto-detect está activo, usamos un modo de escucha
   * que priorice la captura sin forzar gramáticas rígidas de un solo idioma.
   */
  recognition.lang = isAutoDetect ? "es-MX" : lang; 
  recognition.continuous = true;
  recognition.interimResults = true;

  const SILENCE_THRESHOLDS = {
    ultra: 2200,      
    learning: 1400,   
    rompehielo: 700   
  };

  let silenceTimer: ReturnType<typeof setTimeout> | null = null;

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalTranscript += transcript;
      else interimTranscript += transcript;
    }

    const currentText = finalTranscript || interimTranscript;
    onResult(currentText, finalTranscript !== '');
    
    if (silenceTimer) clearTimeout(silenceTimer);
    
    silenceTimer = setTimeout(async () => {
      if (currentText.trim().length > 1 && !isProcessing) {
        logger.info("ASR_AUTO_TRIGGER", `Iniciando Espejo Neural...`);
        
        // Ejecutamos la traducción bidireccional
        await translate(currentText, mode, isAutoDetect); 
        
        try { recognition.stop(); } catch (e) {}
      }
    }, SILENCE_THRESHOLDS[mode]);
  };

  recognition.onend = () => {
    // El reinicio es vital para mantener el flujo manos libres de 30 min
    if (!isProcessing) {
      setTimeout(() => {
        try { recognition.start(); } catch (e) {}
      }, 300);
    }
  };

  try {
    recognition.start();
  } catch (e) {
    logger.error("ASR_START_FAIL", e);
  }

  return recognition;
};

export const stopListening = (recognition: any) => {
  if (recognition) {
    recognition.onresult = null;
    recognition.onend = null;
    recognition.onerror = null;
    try { recognition.abort(); } catch (e) {}
  }
};

export const asrService = { translate, startListening, stopListening };
export default asrService;