/**
 * 🎙️ HOOK: useSpeechRecognition v2026.PROD
 * Protocolo: Reconocimiento adaptativo con Aislamiento de Hardware
 * Ubicación: /src/hooks/useSpeechRecognition.ts
 * ✅ DIRECTORIO AI: Sincronizado a /src/services/ai/
 * Estado: STABLE_PROD | ANTI-COLLISION v4.5 | OLED BLACK
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '../utils/logger';

// Tipos de Modo según la arquitectura Mencional 2026
type RecognitionMode = 'learning' | 'ultra' | 'rompehielo';

interface SpeechRecognitionReturn {
  isListening: boolean;
  interimText: string;
  startListening: (lang?: string) => void;
  stopListening: () => void;
}

export const useSpeechRecognition = (
  onFinalResult: (text: string) => void,
  mode: RecognitionMode = 'learning',
  isAISpeaking: boolean = false 
): SpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManuallyStopped = useRef(true); 
  const currentLangRef = useRef<string>("es-MX");

  /**
   * ⏱️ VENTANAS DE SILENCIO (Protocolo Mencional 2026)
   * Tiempos de espera optimizados para cada flujo de AI en el directorio /ai/
   */
  const getSilenceDelay = useCallback(() => {
    switch (mode) {
      case 'ultra': 
        return 19000; // Ventana Ultra-Mencional (Ideas complejas/Discursos)
      case 'rompehielo': 
        return 4000;  // Respuesta rápida social (Ciclo crítico 4s)
      case 'learning':
      default: 
        return 6000;  // Ciclo estándar de fijación neural
    }
  }, [mode]);

  const stopListening = useCallback(() => {
    isManuallyStopped.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
        logger.info("AI_ASR_CORE", "Hardware liberado. Micrófono OFF.");
      } catch (e) {
        logger.warn("AI_ASR_WARN", "Limpieza de driver completada.");
      }
      recognitionRef.current = null;
    }
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    setIsListening(false);
    setInterimText("");
  }, []);

  const startListening = useCallback((lang: string = "es-MX") => {
    // 🛡️ ESCUDO ANTI-ECO: No encender micro si Aoede (AI Service) está hablando.
    if (isAISpeaking) {
      logger.info("AI_ASR_BLOCK", "Micro bloqueado: Protocolo Aoede emitiendo audio.");
      return;
    }
    
    isManuallyStopped.current = false;
    currentLangRef.current = lang;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      logger.error("AI_ASR_CRITICAL", "Navegador incompatible con Web Speech API");
      return;
    }

    // Prevención de colisiones de hardware (Clean Start)
    if (recognitionRef.current) {
        try {
            recognitionRef.current.onend = null;
            recognitionRef.current.abort();
        } catch(e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      const modeLabel = mode === 'ultra' ? "ULTRA-MENCIONAL" : mode.toUpperCase();
      logger.info("AI_ASR_ACTIVE", `Escucha iniciada: Modo ${modeLabel} [${lang}]`);
    };
    
    recognition.onresult = (event: any) => {
      let currentInterim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const finalValue = (transcript || "").trim();
          if (finalValue.length > 1) {
            logger.info("AI_ASR_FINAL", finalValue);
            onFinalResult(finalValue);
          }
        } else {
          currentInterim += transcript;
        }
      }
      setInterimText(currentInterim);
      
      // 🔄 Reinicio de ventana de silencio por actividad detectada
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && !isManuallyStopped.current) {
          try { 
            recognition.stop(); 
            logger.info("AI_ASR_IDLE", `Cierre por silencio: ${getSilenceDelay()}ms alcanzado.`);
          } catch(e) {}
        }
      }, getSilenceDelay());
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      logger.error("AI_ASR_FAIL", `Hardware_Error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      
      // 🔄 AUTO-REINICIO (Core de Experiencia 100% Manos Libres)
      if (!isManuallyStopped.current && !isAISpeaking) {
        setTimeout(() => {
          if (!isManuallyStopped.current && !isAISpeaking) {
            startListening(currentLangRef.current);
          }
        }, 1000); 
      }
    };

    // Delay táctico para liberar el bus de audio del sistema operativo
    setTimeout(() => {
      if (!isManuallyStopped.current && !isAISpeaking && !recognitionRef.current) {
          try {
              recognition.start();
              recognitionRef.current = recognition;
          } catch (e) {
              logger.warn("AI_ASR_RECOVERY", "Bus de audio ocupado. Sincronizando...");
          }
      }
    }, 400); 
  }, [onFinalResult, mode, getSilenceDelay, isAISpeaking]);

  /**
   * 🛡️ CONTROL MAESTRO DE PRIORIDAD (AI Audio Priority)
   * Apaga el micrófono instantáneamente si la voz de la IA se activa.
   */
  useEffect(() => {
    if (isAISpeaking) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null; 
          recognitionRef.current.abort();          
        } catch(e) {}
        recognitionRef.current = null;
        setIsListening(false);
        logger.info("AI_ASR_PRIORITY", "MIC_MUTED: Cediendo bus de audio al motor Aoede.");
      }
    } else {
      // Reactivación tras el silencio de la IA
      if (!isManuallyStopped.current) {
        const timer = setTimeout(() => {
          startListening(currentLangRef.current);
        }, 800); 
        return () => clearTimeout(timer);
      }
    }
  }, [isAISpeaking, startListening]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
    };
  }, []);

  return { isListening, interimText, startListening, stopListening };
};

export default useSpeechRecognition;