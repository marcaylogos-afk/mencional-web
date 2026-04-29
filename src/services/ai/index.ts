/**
 * 🧠 AI_CORE_INDEX v16.0 - MENCIONAL 2026 (STABLE PRODUCTION)
 * Centralizador de servicios neuronales y definiciones de tipos maestros.
 * Ubicación: /src/services/ai/index.ts
 */

// --- 📡 EXPORTACIÓN DE MÓDULOS CRÍTICOS ---
export * from './asr';                  // Reconocimiento (startNeuralASR)
export * from './speech';               // Síntesis y control de voz
export * from './translateService';     // Traducción (translateText)
export * from './instructionEngine';    // Lógica de prompts
export * from './geminiTTS';            // Engine avanzado de audio
export * from './trendTrigger';         // Análisis de contexto
export * from './suggestionEngine';     // Frases sugeridas para acordeón

// --- 🏷️ DEFINICIÓN DE TIPOS GLOBALES (CORE) ---

export type VoiceOption = 'Aoede' | 'Neural' | 'System';
export type UserRole = 'admin' | 'ia' | 'participant';
export type AppMode = 'lobby' | 'interpreter' | 'ultra' | 'learning' | 'rompehielo';

/**
 * Interfaz para el estado de la IA en tiempo real (Telemetría HUD)
 */
export interface IAStatus {
  isListening: boolean;
  isProcessing: boolean;
  isSynthesizing: boolean;    
  activeVoice: VoiceOption;
  latencyMs: number;          
  neuralConfidence: number;   
}

/**
 * Estructura de un "Frame" de sugerencia coherente
 * Alineado con la jerarquía visual: Inglés (Mediano) / Español (Gigante)
 */
export interface SuggestionFrame {
  id: string;
  originalText: string;       // Inglés (Mixed-Case)
  translatedText: string;     // Español (All-Caps)
  probability: number;        
  timestamp: number;
}

/**
 * 🔐 PROTOCOLOS DE SEGURIDAD Y PRIVACIDAD 2026
 */
export const PURGE_PROTOCOL = {
  BUFFER_TIMEOUT: 6000,
  STRICT_MODE: true,
  ENCRYPTION: 'AES-256-GCM',
  CLEAN_EXIT: true
};

/**
 * ⚡ CONSTANTES DE SINCRONÍA TEMPORAL (Single Source of Truth)
 * Centraliza los tiempos solicitados para evitar desfases en los componentes.
 */
export const TIMING_CONFIG = {
  // Tiempos de Ciclo
  INTERPRETER_CYCLE: 19000,   // 19 segundos (Intérprete Ultra)
  LEARNING_CYCLE: 6000,       // 6 segundos (Aprendizaje Rápido)
  
  // Audio Ducking (Protocolo Headphones)
  DUCKING_VOLUME: 0.2,        // Reducción al 20% para laptop/móvil
  NORMAL_VOLUME: 1.0,
  
  // Refuerzo Auditivo
  REINFORCEMENT_DELAY: 2200   // Delay para el "Eco de fijación" (Protocolo 2x2)
};

/**
 * Utilidad para formatear la jerarquía visual solicitada
 * @param text Texto a procesar
 * @param type 'source' (Inglés mediano) o 'target' (Español gigante)
 */
export const formatNeuralText = (text: string, type: 'source' | 'target'): string => {
  if (type === 'source') {
    // Mixed-case: Primera mayúscula, resto minúscula
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  // Target: Todo mayúsculas para impacto visual gigante
  return text.toUpperCase();
};