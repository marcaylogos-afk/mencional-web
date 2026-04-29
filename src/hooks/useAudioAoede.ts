/**
 * 🎧 MENCIONAL | HOOK: USE_AUDIO_AOEDE v2026.PROD
 * Protocolo: Doble Repetición para Aprendizaje (Mencional) + Auto-Listening
 * Servicio: Aoede Neural Voice Sync (Suave y Natural)
 * Ubicación: /src/hooks/useAudioAoede.ts
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */
import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';

// ✅ RUTA CORREGIDA AL ESTÁNDAR 'ai'
import speechService from '../services/ai/speechService';
import { useSettings } from '../context/SettingsContext';

export const useAudioAoede = () => {
  const { settings } = useSettings();
  const [isSpeaking, setIsSpeaking] = useState(false);

  /**
   * 🗣️ speak: Ejecuta la síntesis de voz Aoede.
   * Implementa la lógica 100% manos libres: Reactiva el micro automáticamente.
   */
  const speak = useCallback(async (text: string) => {
    if (!text || isSpeaking) return;

    try {
      setIsSpeaking(true);
      
      // 🛡️ SEGURIDAD DE HARDWARE: Pausamos la escucha para evitar que la IA se procese a sí misma
      speechService.stopListening();
      
      logger.info("AOEDE", `Iniciando síntesis neural: ${text.substring(0, 20)}...`);

      /**
       * 🟢 PROTOCOLO MENCIONAL (MODO APRENDIZAJE)
       * Ciclo de 6s: Doble fijación (Repetición X2) para absorción léxica.
       * Velocidad: 0.9x (Ritmo pedagógico para claridad fonética).
       */
      if (settings.activeMode === 'learning' || settings.activeMode === 'mencional') {
        await speechService.speak(text, { 
          lang: settings.targetLanguage, 
          mode: 'learning',
          rate: 0.9 
        });
        logger.info("AOEDE", "Protocolo de Repetición X2 (Aprendizaje) completado.");
      } 
      
      /**
       * 🟣 PROTOCOLO ULTRA-MENCIONAL (INTÉRPRETE)
       * Ciclo de 19s: Acumulación de bloques largos.
       * Velocidad: 1.5x (Ritmo profesional fluido para interpretación real).
       */
      else if (settings.activeMode === 'interpreter' || settings.activeMode === 'ultra_mencional') {
        await speechService.speak(text, { 
          lang: settings.targetLanguage, 
          mode: 'ultra',
          rate: 1.5 
        });
        logger.info("AOEDE", "Ciclo Ultra-Mencional (19s) finalizado.");
      }

      /**
       * 🔴 PROTOCOLO ROMPEHIELO (SOCIAL)
       * Ciclo de 4s: Reacción flash para interacciones rápidas.
       * Velocidad: 1.1x (Naturalidad conversacional).
       */
      else if (settings.activeMode === 'rompehielo') {
        await speechService.speak(text, { 
          lang: settings.targetLanguage, 
          mode: 'rompehielo',
          rate: 1.1 
        });
        logger.info("AOEDE", "Respuesta Rompehielo (4s) ejecutada.");
      }

      // ✅ AUTOMATIZACIÓN MANOS LIBRES: 
      // Una vez que el audio termina, el sistema vuelve a "Escuchar".
      logger.info("AOEDE", "Audio finalizado. Reactivando captura neural...");
      
      /**
       * ⏱️ BUFFER TÁCTICO: 400ms
       * Intervalo de seguridad para que el eco del altavoz se disipe
       * antes de abrir la compuerta del micrófono.
       */
      setTimeout(() => {
        speechService.startListening({
          language: settings.nativeLanguage || 'es-MX',
          onResult: (result) => logger.info("AOEDE_MIC", `Captura reactivada: ${result.substring(0, 10)}...`)
        });
      }, 400);

    } catch (error) {
      logger.error("AOEDE_ERROR", `Fallo en el flujo de audio: ${error}`);
    } finally {
      setIsSpeaking(false);
    }
  }, [settings.targetLanguage, settings.nativeLanguage, settings.activeMode, isSpeaking]);

  return {
    speak,
    isSpeaking,
    /**
     * 🛑 stop: Aborta cualquier salida de audio y libera el micro de inmediato.
     */
    stop: () => {
      speechService.stopAll();
      setIsSpeaking(false);
      logger.info("AOEDE", "Hardware liberado manualmente.");
    }
  };
};

export default useAudioAoede;