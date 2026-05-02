/** 🛰️ MENCIONAL | NEURAL_TRANSLATE_ENGINE v2026.PROD
 * Protocolo: Ultra-Low Latency | Bidirectional Auto-Detection | Multi-Mode Sync
 * Ubicación: /src/services/ai/translateService.ts
 */

import { sanitizeText } from '../../utils/sanitizeText';
import { logger } from '../../utils/logger';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Endpoint actualizado para Gemini 2.0 Flash
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface GlobalTrend {
  phrase: string;
  topic: string;
  timestamp: number;
  count: number;
}

/**
 * 🧠 translateText (Motor Híbrido Bidireccional)
 * Traduce automáticamente basándose en el idioma detectado con Swap-Logic.
 */
export const translateText = async (
  text: string, 
  mode: 'learning' | 'ultra' | 'rompehielo' = 'learning',
  isAutoDetect: boolean = true
): Promise<{ translation: string; sourceLang: string; targetLang: string }> => {
  if (!text || text.trim().length === 0) return { translation: "", sourceLang: "", targetLang: "" };

  const cleanInput = sanitizeText(text);

  try {
    // 🛡️ PROTOCOLO ESPEJO: El target por defecto suele ser inglés.
    let target = 'en'; 
    
    // 🛡️ REGLA DE ORO MODO ULTRA / APRENDIZAJE: 
    // En Ultra el admin recibe español. En Learning, si el input es español, queremos inglés.
    if (mode === 'ultra') target = 'es';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800); // Latencia estricta para Radar

    // Usamos el motor de Translate con un fallback a Gemini si el 404 persiste
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&dt=ld&q=${encodeURIComponent(cleanInput)}`,
      { signal: controller.signal }
    );

    if (!response.ok) throw new Error("GOOGLE_FETCH_FAIL");

    const data = await response.json();
    const detectedSrc = data?.[2] || "es"; 
    let translation = data?.[0]?.[0]?.[0]?.trim() || cleanInput;

    // 🔄 LÓGICA DE SWAP DINÁMICO (Bidireccional)
    let finalTarget = target;
    if (isAutoDetect && mode !== 'ultra' && detectedSrc === 'en') {
      finalTarget = 'es';
      const retryResponse = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(cleanInput)}`
      );
      const retryData = await retryResponse.json();
      translation = retryData?.[0]?.[0]?.[0]?.trim() || translation;
    }

    clearTimeout(timeoutId);

    // ✨ LIMPIEZA NEURAL DE OUTPUT
    translation = translation
      .replace(/^(translated|traducción|traducido|output|result):\s*/i, "")
      .replace(/[\[\]{}()]/g, "")
      .trim();

    /** 🎓 PROCESAMIENTO POR MODO */
    if (mode === 'learning' && cleanInput.length > 3) {
      triggerTrendEffect(cleanInput, "LEARNING"); 
    } 

    return { 
      translation: translation.toUpperCase(), 
      sourceLang: detectedSrc, 
      targetLang: finalTarget 
    };

  } catch (error) {
    logger.error("TRANSLATE_FAILURE", "Fallo en motor neural. Activando modo Espejo.", error);
    // Fallback: Si el 404 ocurre, devolvemos el texto original para no romper el flujo visual.
    return { translation: cleanInput.toUpperCase(), sourceLang: "auto", targetLang: "en" }; 
  }
};

/**
 * 🧊 getDynamicAIKeywords (Acordeón Cognitivo)
 * Genera sugerencias basadas en el contexto usando Gemini 2.0 Flash.
 */
export const getDynamicAIKeywords = async (
  lastTranscript: string, 
  targetLang: string = "en-US",
): Promise<string[]> => {
  // Failsafe si no hay API KEY o el texto es muy corto
  if (!lastTranscript || lastTranscript.length < 3 || !GEMINI_API_KEY) {
    return ["KEEP GOING", "TE ESCUCHO", "CONTINUE"];
  }

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Context: Language immersion app 'Mencional'. 
            User said: "${lastTranscript}". 
            Output: 3 short conversation hints in ${targetLang}. 
            Format: Raw JSON array of strings, max 2 words per string. No prose.`
          }]
        }],
        generationConfig: { 
          responseMimeType: "application/json", 
          temperature: 1 
        }
      })
    });

    const data = await response.json();
    
    // Manejo de errores de cuota o 404 de Gemini
    if (data.error) {
      logger.error("GEMINI_KEYWORD_ERROR", data.error.message);
      return ["SIGUE HABLANDO", "INTERESANTE", "CUÉNTAME MÁS"];
    }

    const suggestionsText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const suggestions = JSON.parse(suggestionsText);
    
    return Array.isArray(suggestions) 
      ? suggestions.map(s => s.toUpperCase()).slice(0, 3) 
      : ["TE ESCUCHO", "CONTINUAR", "OK"];
  } catch (error) {
    return ["PROCESANDO...", "SIGUE HABLANDO", "ADAPTANDO..."];
  }
};

/**
 * 🚀 triggerTrendEffect (Cloud de Tendencias Local)
 */
export const triggerTrendEffect = (phrase: string, context: string = "GENERAL"): void => {
  if (!phrase || phrase.length < 3) return;
  
  try {
    const TREND_KEY = 'global_trends_cloud';
    const rawData = localStorage.getItem(TREND_KEY);
    let trends: GlobalTrend[] = JSON.parse(rawData || "[]");

    const cleanPhrase = phrase.trim().toUpperCase(); 
    const existingIndex = trends.findIndex((t) => t.phrase === cleanPhrase);

    if (existingIndex === -1) {
      trends.push({ phrase: cleanPhrase, topic: context, timestamp: Date.now(), count: 1 });
    } else {
      trends[existingIndex].timestamp = Date.now();
      trends[existingIndex].count += 1;
    }

    const thirtyMinsAgo = Date.now() - (30 * 60 * 1000);
    const sortedTrends = trends
      .filter(t => t.timestamp > thirtyMinsAgo)
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    localStorage.setItem(TREND_KEY, JSON.stringify(sortedTrends));
  } catch (err) {
    logger.error("TREND_SYNC_FAILED", "Error en motor de tendencias.");
  }
};

export const translateService = {
  translateText,
  getKeywords: getDynamicAIKeywords,
  syncTrend: triggerTrendEffect
};

export default translateService;