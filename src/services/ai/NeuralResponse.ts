/**
 * 🧠 NEURAL RESPONSE ENGINE v22.0 - MENCIONAL OS
 * Ubicación: src/services/ai/NeuralResponse.ts
 * Protocolos: Aprendizaje (6s), Rompehielo (4s), Intérprete (19s).
 * Estado: PRODUCTION_READY | AOEDE_VOICE_DRIVEN
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import speechService, { MencionalLanguage } from './speechService';
import { logger } from '../../utils/logger';

export interface NeuralFrame {
  visualText: string;
  subText?: string;
  audioText: string;
  mode: 'LEARNING' | 'INTERPRETER' | 'ROMPEHIELO';
  style: 'LARGE_BOLD' | 'TECHNICAL_SMALL' | 'CANDY_ADS';
  duration: number;
}

export const neuralResponse = {
  
  /**
   * 🎓 PROTOCOLO APRENDIZAJE (6 Segundos)
   * Visual: Texto en MAYÚSCULAS, Negrita, Estilo OLED.
   * Audio: Voz Aoede con repetición dual (0.9x -> 0.8x) para fijación profunda.
   */
  executeLearningCycle: async (targetLang: MencionalLanguage, translatedText: string) => {
    try {
      // 1. Registro visual para componentes de UI (UltraView / MencionalView)
      logger.info("LEARNING_FRAME_INIT", { 
        text: translatedText.toUpperCase(), 
        style: 'LARGE_BOLD', 
        duration: 6000 
      });

      // 2. Audio Dual Inmersivo: Ejecuta la secuencia de repetición asíncrona
      // Bloquea el hilo de voz hasta completar las dos iteraciones (0.9x y 0.8x)
      await speechService.learningFocus(translatedText, targetLang);
      
      logger.info("LEARNING_CYCLE_COMPLETE", { text: translatedText });
    } catch (error) {
      logger.error("NEURAL_LEARNING_FAIL", { error, translatedText });
    }
  },

  /**
   * 🎙️ PROTOCOLO ULTRA-MENCIONAL (19 Segundos)
   * Orientado a la interpretación de alta velocidad (Contexto Profesional).
   * Jerarquía: Referencia técnica en pantalla + Audio acelerado (1.5x).
   */
  executeInterpreterCycle: async (originalText: string, spanishTranslation: string) => {
    try {
      // 1. Visualización de referencia técnica (Inglés pequeño)
      logger.info("INTERPRETER_FRAME_VISUAL", { 
        technicalRef: originalText, 
        style: 'TECHNICAL_SMALL',
        duration: 19000 
      });

      // 2. Audio de salida: Español fluido a 1.5x para mantener tiempo real sincronizado
      await speechService.ultraInterpreterSync(spanishTranslation, 'es-MX');

    } catch (error) {
      logger.error("NEURAL_INTERPRETER_FAIL", error);
    }
  },

  /**
   * 🧊 PROTOCOLO ROMPEHIELO (4 Segundos)
   * Wingman social: Inferencia inmediata para diálogos fluidos y reacciones rápidas.
   */
  executeRompehieloCycle: async (suggestedResponse: string, lang: MencionalLanguage = 'en-US') => {
    try {
      // Notificación visual táctica en modo "Ghost"
      logger.info("ROMPEHIELO_FRAME", { 
        text: suggestedResponse.toUpperCase(), 
        duration: 4000 
      });

      // Emisión natural para imitación inmediata (1.0x) con la firma de Aoede
      await speechService.rompehieloReaction(suggestedResponse, lang);

    } catch (error) {
      logger.error("NEURAL_ROMPEHIELO_FAIL", error);
    }
  },

  /**
   * 🍬 PROTOCOLO "CARAMELO" (Frases de Apoyo)
   * Estilo OLED Stealth: Vocabulario complementario inyectado cada 19s.
   */
  getSupportCandy: (phrase: string): NeuralFrame => {
    const cleanPhrase = phrase.trim().toUpperCase();
    return {
      visualText: cleanPhrase,
      audioText: cleanPhrase,
      mode: 'LEARNING',
      style: 'CANDY_ADS',
      duration: 19000
    };
  },

  /**
   * 🛑 EMERGENCY_STOP
   * Silencia el motor de voz Aoede y limpia colas de ejecución neurales.
   */
  killAllCycles: () => {
    speechService.stopAll();
    logger.warn("NEURAL_ENGINE", "Protocolo de parada de emergencia: Silenciando Nodo.");
  }
};

export default neuralResponse;