/** 🧠 NEURAL RESPONSE ENGINE v2026.PROD - MENCIONAL OS
 * Ubicación: src/services/ai/NeuralResponse.ts
 * ✅ REPARADO: Sincronización con importación por defecto de speechService.
 */

// ✅ IMPORTACIÓN CORRECTA: Sin llaves { } porque speechService usa 'export default'
import speechService from './speechService';
import { logger } from '../../utils/logger';

export const neuralResponse = {
  
  /** 🎓 PROTOCOLO APRENDIZAJE (6 Segundos) */
  executeLearningCycle: async (targetLang: string, translatedText: string) => {
    try {
      logger.info("LEARNING_FRAME_INIT", { text: translatedText.toUpperCase() });
      
      // Verificación de disponibilidad del Nodo de Voz
      if (speechService && typeof speechService.speakLearning === 'function') {
        // ✅ Método unificado: Doble Impacto (1.0x -> 0.85x)
        await speechService.speakLearning(translatedText, targetLang);
      } else {
        throw new Error("SpeechService: speakLearning no disponible.");
      }
      
    } catch (error) {
      logger.error("NEURAL_LEARNING_FAIL", { error, translatedText });
    }
  },

  /** 🎙️ PROTOCOLO ULTRA-MENCIONAL (19 Segundos) */
  executeInterpreterCycle: async (originalText: string, spanishTranslation: string) => {
    try {
      logger.info("INTERPRETER_FRAME_VISUAL", { technicalRef: originalText });
      
      // En modo Ultra, se prioriza la velocidad de respuesta (1.2x)
      if (speechService && typeof speechService.speak === 'function') {
        await speechService.speak(spanishTranslation, 'es-MX');
      }

    } catch (error) {
      logger.error("NEURAL_INTERPRETER_FAIL", error);
    }
  },

  /** 🧊 PROTOCOLO ROMPEHIELO (4 Segundos) */
  executeRompehieloCycle: async (suggestedResponse: string, lang: string = 'en-US') => {
    try {
      logger.info("ROMPEHIELO_FRAME", { text: suggestedResponse.toUpperCase() });
      
      // Reacción de baja latencia para interacciones sociales
      if (speechService && typeof speechService.speak === 'function') {
        await speechService.speak(suggestedResponse, lang);
      }

    } catch (error) {
      logger.error("NEURAL_ROMPEHIELO_FAIL", error);
    }
  },

  /** 🛑 EMERGENCY_STOP: Silencio absoluto del Nodo */
  killAllCycles: () => {
    if (speechService && typeof speechService.stopAll === 'function') {
      speechService.stopAll();
    } else {
      window.speechSynthesis.cancel();
    }
    logger.warn("NEURAL_ENGINE", "Protocolo de parada de emergencia: Silenciando Nodo.");
  }
};

export default neuralResponse;