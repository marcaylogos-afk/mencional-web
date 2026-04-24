/** 📝 MENCIONAL | VOCABULARY_SERVICE v2026.PROD
 * ✅ FILTROS: Anti-cognados, Anti-marcas, Anti-ruido gramatical.
 * ✅ EXCLUSIÓN: Sin aparatos electrónicos, números digitales o artículos.
 * ✅ FOCO: Phrasal Verbs, conectores avanzados y frases de elocuencia.
 * ✅ AUDITORÍA: Capacidad de bypass para sesiones de invitado.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../../utils/logger";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateNeuralVocabulary = async (
  targetLang: string, 
  knownWords: string[], 
  topic: string
) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.9, // Elevamos un poco para evitar repetitividad en sesiones infinitas
      }
    });

    // Detectamos si es una sesión de auditoría (lista vacía) para ajustar el tono del prompt
    const isAuditoryMode = knownWords.length === 0;

    const prompt = `
      Eres el motor de inteligencia léxica de Mencional. Tu misión es generar nodos de conocimiento para una inmersión profunda.
      
      CONTEXTO: 
      - Idioma objetivo: ${targetLang}.
      - Tópico de entrenamiento: "${topic}".
      - Modo: ${isAuditoryMode ? 'AUDITORÍA_COMPLETA (Entregar vocabulario variado y representativo)' : 'ALTO_RENDIMIENTO (Evitar lo básico)'}.

      REGLAS DE EXCLUSIÓN ESTRICTAS (CRÍTICO):
      1. RUIDO GRAMATICAL: Prohibidos pronombres básicos (I, you, he), artículos (the, a, an), días de la semana, meses o colores básicos.
      2. TECNOLOGÍA OBSOLETA: No incluyas "computer", "phone", "radio", "screen", etc.
      3. COGNADOS OBVIOS: No incluyas palabras que se escriban igual o casi igual en español (ej: "hospital", "idea", "actor").
      4. NÚMEROS: No usar dígitos.
      5. LISTA NEGRA PERSONAL: Ignora absolutamente estos términos: [${knownWords.join(", ")}].

      CONTENIDO DESEADO (NODOS DE VALOR):
      - PHRASAL VERBS: Acciones compuestas naturales y fluidas.
      - CONECTORES LÓGICOS: (e.g., "henceforth", "notwithstanding", "on the flip side").
      - FRASES IDIOMÁTICAS: Expresiones de impacto que no se traducen literal.
      - SUSTANTIVOS ABSTRACTOS: Conceptos de elocuencia nivel B2-C1.

      ESTRUCTURA DE RESPUESTA:
      Devuelve ÚNICAMENTE un array JSON con este formato:
      [{ "word": string, "translation": string, "level": "B2" | "C1" }]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Limpieza de Markdown y parseo
    const cleanedText = text.replace(/```json|```/g, "");
    const parsedVocabulary = JSON.parse(cleanedText);

    if (!Array.isArray(parsedVocabulary)) {
        throw new Error("Formato de respuesta IA inválido");
    }

    logger.info("AI_VOCAB", `Nodos generados: ${parsedVocabulary.length} | Modo: ${isAuditoryMode ? 'Auditoría' : 'Filtro_Activo'}`);
    return parsedVocabulary;

  } catch (error) {
    logger.error("AI_VOCAB", "Fallo en motor léxico Gemini", error);
    
    // Fallback de emergencia con Phrasal Verbs potentes
    return [
      { word: "To carry out", translation: "Llevar a cabo", level: "B2" },
      { word: "Nonetheless", translation: "No obstante", level: "C1" },
      { word: "To bridge the gap", translation: "Cerrar la brecha", level: "C1" },
      { word: "To figure out", translation: "Descifrar / Entender", level: "B2" },
      { word: "Underlying", translation: "Subyacente", level: "C1" },
      { word: "To go about", translation: "Abordar / Proceder", level: "B2" },
      { word: "Widespread", translation: "Generalizado", level: "C1" }
    ];
  }
};