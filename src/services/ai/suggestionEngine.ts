/**
 * 🧠 MENCIONAL | SUGGESTION_ENGINE v2026.PROD
 * Ubicación: /src/services/ai/suggestionEngine.ts
 * Función: Generador de frases contextuales y tendencias (Ciclo 19s).
 * ✅ DIRECTORIO: Sincronizado a /ai/ (no ia)
 */
import { logger } from '../../utils/logger';

/**
 * 🗂️ POOL DE FRASES DINÁMICAS (Contexto Real)
 * Basado en las sesiones más socorridas del Nodo Maestro.
 * El usuario se expresa en español, el sistema inyecta el idioma objetivo.
 */
const CONTEXT_MAP: Record<string, Record<string, string[]>> = {
  learning: {
    GENERAL: [
      "I'm sorry, could you repeat that more slowly?", 
      "I'm looking for the right word to explain this.", 
      "That makes a lot of sense, thank you.",
      "I'd like to practice my fluency in this topic."
    ],
    NEGOCIOS: [
      "How can I sound more professional in this meeting?",
      "Let's go over the technical terms one more time.",
      "What is the best way to present these results?",
      "I agree with your point of view regarding the project."
    ],
    TECNOLOGIA: [
      "We need to discuss the system architecture.",
      "Is the AI integration working as expected?",
      "Let's review the deployment pipeline.",
      "The neural immersion is active and synced."
    ]
  },
  ultra: {
    GENERAL: [
      "Sincronizando flujo auditivo en tiempo real...",
      "Traducción neural activa: Modo Ultra-Interpreter.",
      "Procesando ventana de inmersión de 19 segundos...",
      "Capturando matices lingüísticos profesionales."
    ]
  },
  rompehielo: {
    SOCIAL: [
      "I don't have the details yet, what do you think?",
      "Did they give you any references for the new role?",
      "That sounds interesting, tell me more about it.",
      "I've been meaning to ask you about your recent trip."
    ]
  }
};

/**
 * 📉 getTrendingPhrases (Inicio de la App / WelcomeGate)
 * ✅ Frases en español para que el usuario inicie la práctica.
 */
export const getTrendingPhrases = (): string[] => {
  return [
    "¿Cómo sonar más natural en juntas?",
    "Preparación para entrevistas IT",
    "Inglés para negociaciones rápidas",
    "Frases de cortesía para networking",
    "Sincronización de hardware Aoede",
    "Dominio de tecnicismos en inglés"
  ];
};

/**
 * 🛰️ getDynamicSuggestion (Nube de Ideas / Inmersión)
 * ✅ Ciclo de 19 segundos para cambiar el contexto visual.
 */
export const getDynamicSuggestion = (
  mode: 'learning' | 'ultra' | 'rompehielo' = 'learning',
  topic: string = 'GENERAL'
): string => {
  const modePool = CONTEXT_MAP[mode] || CONTEXT_MAP.learning;
  const pool = modePool[topic.toUpperCase()] || modePool.GENERAL || modePool.SOCIAL;
  
  const suggestion = pool[Math.floor(Math.random() * pool.length)];
  
  // Log optimizado para el nuevo sistema de monitoreo
  logger.info(`AI_ENGINE`, `Rotación activa (19s): ${suggestion}`);
  return suggestion;
};

/**
 * ⚡ getRompehieloResponses
 * ✅ CORRECCIÓN CRÍTICA: Resuelve el TypeError: suggestionEngine.getRompehieloResponses is not a function.
 */
export const getRompehieloResponses = (): string[] => {
  return CONTEXT_MAP.rompehielo.SOCIAL;
};

/**
 * ⚡ getInitialTrend (La frase "Top" de bienvenida)
 */
export const getInitialTrend = (): string => "¿Listo para elevar tu nivel profesional hoy?";

/**
 * 🧠 getPromptByTopic (Interfaz para Acordeón Cognitivo)
 * ✅ Proporciona frases en el idioma elegido mientras el usuario habla español.
 */
export const getPromptByTopic = (topic: string = 'GENERAL'): string => {
  return getDynamicSuggestion('learning', topic);
};

/**
 * 📦 EXPORTACIÓN NOMBRADA (Protocolo de Sincronización)
 * Asegura que todos los componentes encuentren las funciones tras el rename a /ai/.
 */
export const suggestionEngine = {
  getDynamicSuggestion,
  getTrendingPhrases,
  getInitialTrend,
  getPromptByTopic,
  getRompehieloResponses 
};

export default suggestionEngine;