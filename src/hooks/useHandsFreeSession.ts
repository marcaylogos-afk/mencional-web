/**
 * 🎙️ HOOK: useHandsFreeSession v17.5 - PRODUCTION 2026.PROD
 * Protocolo: Inmersión 100% manos libres con rotación cromática y REPETICIÓN X2.
 * Ubicación: /src/hooks/useHandsFreeSession.ts
 * ✅ ESTÁNDAR: Sincronizado con /src/services/ai/
 */

import { useEffect, useCallback, useRef } from 'react';
import { useInterpreter } from './useInterpreter';
import { useSessionFlow } from './useSessionFlow';
// ✅ Importaciones corregidas al estándar de carpeta 'ai'
import { translateService } from '../services/ai/translateService'; 
import { speechService } from '../services/ai/speechService';       
import { logger } from '../utils/logger';

export const useHandsFreeSession = (
  mode: 'learning' | 'interpreter' | 'rompehielo' | 'duo' | 'trio',
  targetLang: string = "en-US"
) => {
  // 1. VINCULACIÓN DE FLUJO VISUAL (Cromática OLED)
  const { 
    activeColor, 
    nextTurn, 
    participantId, 
    handleInterruption,
    colorClass,
    intervalTime 
  } = useSessionFlow(
    (mode === 'duo' || mode === 'trio' || mode === 'learning') ? mode : 
    (mode === 'interpreter' ? 'ultra_mencional' : 'rompehielo')
  );

  // 2. CONFIGURACIÓN DEL MOTOR NEURAL (Protocolos Gemini)
  // Forzamos 'LEARNING' en modos grupales para activar la traducción al idioma objetivo
  const interpreterMode = (mode === 'learning' || mode === 'duo' || mode === 'trio') 
    ? 'LEARNING' 
    : (mode === 'interpreter' ? 'INTERPRETER' : 'ROMPEHIELO');

  const { 
    sourceText, 
    translatedText, 
    isTranslating,
    suggestions,
    saveAsPDF,
    forceStop
  } = useInterpreter(interpreterMode, targetLang);

  const autoTurnTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPlayedText = useRef<string>(""); // Centinela anti-bucles de audio

  /**
   * 🧠 PROTOCOLO DE FIJACIÓN NEURAL (Audio Aoede x2)
   * Implementación del refuerzo auditivo para fijación de memoria a largo plazo.
   */
  const executeNeuralFixation = useCallback(async (text: string) => {
    if (!text || isTranslating) return;

    const isMencionalLearning = mode === 'learning' || mode === 'duo' || mode === 'trio';
    
    try {
      if (isMencionalLearning) {
        // ✅ PROTOCOLO APRENDIZAJE: Ejecuta Repetición x2 (Target Language)
        logger.info("NEURAL_FIXATION", `Iniciando refuerzo x2 en ${targetLang}`);
        await speechService.executeLearningProtocol(text, targetLang); 
      } else if (mode === 'interpreter') {
        // ✅ PROTOCOLO INTÉRPRETE: Velocidad 2.0x (Traducción fluida para Admin)
        await speechService.executeInterpreterProtocol(text, "es-MX");
      }
    } catch (error) {
      logger.error("NEURAL_FIXATION_ERROR", `Error en síntesis Aoede: ${error}`);
    }
  }, [mode, targetLang, isTranslating]);

  /**
   * 📡 MONITOREO DE TRADUCCIÓN SÍNCRONA
   * Dispara el audio automáticamente al detectar una nueva traducción de la IA.
   */
  useEffect(() => {
    if (translatedText && !isTranslating && translatedText !== lastPlayedText.current) {
      executeNeuralFixation(translatedText);
      lastPlayedText.current = translatedText; 
    }
    
    // Limpieza de caché de audio al resetear la entrada de voz
    if (!sourceText || sourceText === "ESCUCHANDO...") {
      lastPlayedText.current = "";
    }
  }, [translatedText, isTranslating, sourceText, executeNeuralFixation]);

  /**
   * 🔄 ROTACIÓN DE TURNOS (Sincronización 6s / 19s)
   * Gestiona el cambio de foco visual en sesiones grupales o individuales.
   */
  const handleAutoTransition = useCallback(() => {
    if (autoTurnTimeout.current) clearTimeout(autoTurnTimeout.current);

    autoTurnTimeout.current = setTimeout(() => {
      const isSystemIdle = !isTranslating && (!sourceText || sourceText === "" || sourceText === "ESCUCHANDO...");
      
      if (isSystemIdle) {
        if (mode === 'duo' || mode === 'trio') {
          nextTurn(); 
        } else {
          // Pulse de seguridad: Mantiene la UI activa si no hay voz detectada
          const safetyPhrase = translateService.getTrend();
          window.dispatchEvent(new CustomEvent('mencional_safety_pulse', { 
            detail: { phrase: safetyPhrase, color: activeColor } 
          }));
        }
      }
    }, mode === 'interpreter' ? 19000 : 6000);
  }, [mode, isTranslating, sourceText, nextTurn, activeColor]);

  useEffect(() => {
    handleAutoTransition();
    return () => { if (autoTurnTimeout.current) clearTimeout(autoTurnTimeout.current); };
  }, [sourceText, isTranslating, handleAutoTransition]);

  // Cleanup: Liberación de hardware (Micrófono y AudioContext)
  useEffect(() => {
    return () => {
      forceStop();
      speechService.stopAll();
      logger.info("SESSION_CLEANUP", "Hardware liberado desde /services/ai/");
    };
  }, [forceStop]);

  return {
    activeColor, 
    colorClass, 
    participantId, 
    sourceText, 
    translatedText, 
    suggestions,
    isTranslating, 
    saveAsPDF, 
    handleInterruption,
    sessionConfig: {
      cycleTime: mode === 'interpreter' ? 19 : 6, 
      replays: (mode === 'learning' || mode === 'duo' || mode === 'trio') ? 2 : 1,
      voiceProfile: "Aoede",
      isOLED: true
    }
  };
};

export default useHandsFreeSession;