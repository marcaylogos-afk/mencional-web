/** 🧹 NEURAL_TEXT_SANITIZER - Mencional Protocol 2026
 * Ubicación: /src/utils/sanitizeText.ts
 * Función: Purificación de lenguaje, eliminación de ruido de ASR y filtrado selectivo para Ultra Interprete.
 */

import { logger } from './logger';

// 🛡️ FILTRO PROFESIONAL: Palabras ofensivas
const BANNED_WORDS = [
  /\b(pendejo|mierda|puto|verga|chinga|cabron|pito|culero|fuck|shit|asshole|bitch|bastard)\b/gi,
];

// 🎙️ FILTRO DE MULETILLAS (Fillers)
const FILLERS = [
  /\b(eh|em|mmm|eee|este|o sea|bueno|pues|like|you know|i mean|actually|basically|literally)\b/gi,
  /\b(tipo|nada|así|entonces|verdad|digamos|nomás|anyway|whatever)\b/gi,
  /\b(uh|um|er|ah|hmmm|so)\b/gi
];

// 🧠 COGNADOS COMUNES (Palabras que no necesitan traducción por su similitud)
const COGNATES = [
  "hospital", "radio", "hotel", "actor", "idea", "menu", "pasta", "video", 
  "alcohol", "fútbol", "central", "animal", "area", "conclusion", "doctor"
];

/**
 * ✅ sanitizeText
 */
export const sanitizeText = (text: string): string => {
  if (!text) return "";
  let cleaned = text.trim();

  BANNED_WORDS.forEach(regex => {
    cleaned = cleaned.replace(regex, "[...]");
  });

  FILLERS.forEach(regex => {
    cleaned = cleaned.replace(regex, "");
  });

  // Corrección de Tartamudeo Digital
  cleaned = cleaned.replace(/\b(\w+)(?:\s+\1\b)+/gi, "$1");
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
};

/**
 * 🔍 isProperNoun
 * Detecta si una palabra es un nombre propio o marca (Mayúscula no inicial).
 */
const isProperNoun = (word: string, index: number): boolean => {
  if (index === 0) return false; // La primera palabra siempre suele ser mayúscula
  return /^[A-Z][a-z]+/.test(word);
};

/**
 * 🔍 isCognate
 * Verifica si la palabra es un cognado exacto.
 */
const isCognate = (word: string): boolean => {
  return COGNATES.includes(word.toLowerCase());
};

/**
 * 🚀 getUltraSelectiveText
 * EXCLUSIVO MODO INTÉRPRETE: Filtra cognados, nombres propios y palabras conocidas.
 * Devuelve un array de palabras que REALMENTE necesitan traducción.
 */
export const getUltraSelectiveText = (text: string, knownWords: string[] = []): string[] => {
  const sanitized = sanitizeText(text);
  const words = sanitized.split(/\s+/);

  return words.filter((word, index) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;]/g, "");
    
    // Reglas de Omisión
    if (cleanWord.length <= 2) return false; // Omitir "a", "it", "so"
    if (isCognate(cleanWord)) return false;
    if (isProperNoun(word, index)) return false;
    if (knownWords.includes(cleanWord)) return false;

    return true;
  });
};

/**
 * 🔍 isQuestion
 */
export const isQuestion = (text: string): boolean => {
  const clean = text.trim();
  if (!clean) return false;
  const questionIndicators = [
    /\?$/, /^¿/,
    /^(quién|qué|cuál|cuándo|dónde|por qué|cómo|who|what|where|when|why|how|which|do|does|can|is|are|am|will|could|should)/i
  ];
  return questionIndicators.some(regex => regex.test(clean));
};

/**
 * 🎨 formatLearningDisplay (MODO APRENDIZAJE)
 */
export const formatLearningDisplay = (text: string): string => {
  if (!text) return "";
  return text.toUpperCase().replace(/["'“”]/g, "").replace(/[.]$/, "").trim();
};

/**
 * 🎨 formatAccordionDisplay
 */
export const formatAccordionDisplay = (text: string): string => {
  if (!text) return "";
  const cleaned = text.replace(/["'“”]/g, "").trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
};

/**
 * 🛰️ getInterpreterNeonText (MODO INTÉRPRETE - Transcripción base)
 */
export const getInterpreterNeonText = (text: string): string => {
  const sanitized = sanitizeText(text);
  const formatted = sanitized.replace(/["'“”]/g, "").trim();

  if (formatted) {
    logger.info("DISPLAY", `ULTRA_INTERPRETE_RAW: ${formatted.substring(0, 15)}...`);
  }
  return formatted;
};

export default {
  sanitize: sanitizeText,
  isQuestion,
  getUltraSelectiveText,
  formatLearningDisplay,
  getInterpreterNeonText,
  formatAccordionDisplay
};