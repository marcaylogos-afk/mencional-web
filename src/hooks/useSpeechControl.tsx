/**
 * 🎙️ MENCIONAL | USE_SPEECH_CONTROL v2026.PROD
 * Hook maestro para la gestión de ciclos de voz y telemetría.
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import { useState, useEffect, useCallback, useRef } from 'react';
// ✅ Importaciones corregidas al nuevo estándar /ai/
import speechService from '../services/ai/speechService';
import { sessionService } from '../services/sessionService';
import { logger } from '../utils/logger';

interface SpeechControlOptions {
  mode: 'learning' | 'interpreter' | 'rompehielo';
  language: string;
  sessionId: string;
  onTranscript: (text: string) => void;
  samplingRate: number; // 4000 | 6000 | 19000 (ms)
}

export const useSpeechControl = ({
  mode,
  language,
  sessionId,
  onTranscript,
  samplingRate
}: SpeechControlOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 🛡️ PROTOCOLO DE PROCESAMIENTO: FINALIZAR TURNO
   * Se dispara cuando la ventana de escucha (Sampling Rate) expira.
   */
  const finalizeTurn = useCallback(async (finalText: string) => {
    const cleanText = finalText.trim();
    
    if (!cleanText || cleanText === "ESCUCHANDO...") {
      logger.info("VOICE", "Turno vacío o sin cambios, reiniciando escucha...");
      setIsListening(false);
      return;
    }

    // 1. Registro de Telemetría (Métrica de palabras para el progreso del usuario)
    const wordCount = cleanText.split(/\s+/).length;
    try {
      await sessionService.log(sessionId, wordCount, mode === 'learning');
    } catch (err) {
      logger.warn("TELEMETRY_SYNC_FAIL", "No se pudo registrar la métrica en la nube.");
    }

    // 2. Notificar al componente superior (Trigger para Traducción/Inferencia)
    onTranscript(cleanText);
    
    // 3. Limpieza de estado para el siguiente ciclo de inmersión
    setTranscript("");
    setIsListening(false);
    speechService.stopListening();
  }, [sessionId, mode, onTranscript]);

  /**
   * ⚡ ACTIVACIÓN DE HARDWARE AOEDE (Captura Neural)
   */
  const startVoiceCapture = useCallback(() => {
    if (isListening) return;

    setIsListening(true);
    speechService.startListening({
      language,
      onResult: (text: string) => {
        setTranscript(text);
        
        // REINICIO DINÁMICO: Si el usuario sigue hablando, el cronómetro se refresca.
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timerRef.current = setTimeout(() => {
          finalizeTurn(text);
        }, samplingRate); 
      },
      onError: (err: any) => {
        logger.error("AOEDE_HARDWARE_ERR", err);
        setIsListening(false);
      }
    });

    // FAILSAFE: Si el driver de audio no reporta nada en (rate + 1s), liberar hardware.
    timerRef.current = setTimeout(() => {
      if (isListening && !transcript) {
        setIsListening(false);
        speechService.stopListening();
        logger.info("VOICE_FAILSAFE", "Cierre por inactividad absoluta.");
      }
    }, samplingRate + 1000);

  }, [isListening, language, samplingRate, finalizeTurn, transcript]);

  /**
   * 🛑 PARADA DE EMERGENCIA / CIERRE DE CICLO
   */
  const stopVoiceCapture = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    speechService.stopListening();
    setIsListening(false);
    setTranscript("");
  }, []);

  // Limpieza automática al desmontar el Nodo para prevenir fugas de memoria
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      speechService.stopAll();
    };
  }, []);

  return {
    isListening,
    transcript,
    startVoiceCapture,
    stopVoiceCapture,
    setTranscript
  };
};

export default useSpeechControl;