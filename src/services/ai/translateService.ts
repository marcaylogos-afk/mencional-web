/** 🛰️ MENCIONAL | NEURAL_TRANSLATE_ENGINE v2026.PROD
 * Protocolo: Ultra-Low Latency | Bidirectional Auto-Detection | Multi-Mode Sync
 * Ubicación: /src/services/ai/translateService.ts
 */

import { sanitizeText } from '../../utils/sanitizeText';
import { logger } from '../../utils/logger';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
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
    // 🛡️ PROTOCOLO ESPEJO: El target por defecto es inglés (en).
    let target = 'en'; 
    
    // 🛡️ REGLA DE ORO MODO ULTRA: El administrador recibe siempre en Español (es).
    if (mode === 'ultra') {
      target = 'es';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // Latencia estricta para Radar 5s

    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&dt=ld&q=${encodeURIComponent(cleanInput)}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("GOOGLE_FETCH_FAIL");

    const data = await response.json();
    const detectedSrc = data?.[2] || "es"; 
    let translation = data?.[0]?.[0]?.[0]?.trim() || cleanInput;

    // 🔄 LÓGICA DE SWAP DINÁMICO (Bidireccional)
    // Si detectamos que el usuario ya habló en inglés, forzamos traducción a español.
    let finalTarget = target;
    if (isAutoDetect && mode !== 'ultra' && detectedSrc === 'en' && target === 'en') {
      finalTarget = 'es';
      const retryResponse = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(cleanInput)}`
      );
      const retryData = await retryResponse.json();
      translation = retryData?.[0]?.[0]?.[0]?.trim() || translation;
    }

    // ✨ LIMPIEZA NEURAL DE OUTPUT
    // Eliminamos prefijos basura generados por algunos motores o proxies
    translation = translation
      .replace(/^(translated|traducción|traducido|output|result):\s*/i, "")
      .replace(/[\[\]{}()]/g, "") // Limpieza de caracteres técnicos para OLED
      .trim();

    /** 🎓 PROCESAMIENTO POR MODO */
    if (mode === 'learning') {
      // Sincronizamos con el motor de tendencias local
      if (cleanInput.length > 3) triggerTrendEffect(cleanInput, "LEARNING"); 
    } 

    return { 
      translation: translation.toUpperCase(), // Forzado para estética MENCIONAL
      sourceLang: detectedSrc, 
      targetLang: finalTarget 
    };

  } catch (error) {
    logger.error("TRANSLATE_FAILURE", "Fallo en motor neural.", error);
    // Fallback seguro: devolver el texto original
    return { translation: cleanInput, sourceLang: "auto", targetLang: "en" }; 
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
  if (!lastTranscript || !GEMINI_API_KEY) return ["Keep talking", "Interesting", "Continue"]; 

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Act as Mencional AI. Context: Language learning and social interaction. 
            Last user input: "${lastTranscript}". 
            Task: Provide 3 short, natural, and helpful conversation hints/suggestions in ${targetLang}. 
            Constraints: Max 3 words per hint. Return ONLY a raw JSON array of strings.`
          }]
        }],
        generationConfig: { 
          responseMimeType: "application/json", 
          temperature: 0.7 
        }
      })
    });

    const data = await response.json();
    const suggestionsText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const suggestions = JSON.parse(suggestionsText);
    
    return Array.isArray(suggestions) 
      ? suggestions.map(s => s.toUpperCase()).slice(0, 3) 
      : ["TE ESCUCHO", "Sigue", "OK"];
  } catch (error) {
    return ["PROCESANDO...", "Sigue hablando", "ADAPTANDO_CONTEXTO"];
  }
};

/**
 * 🚀 triggerTrendEffect (Cloud de Tendencias Persistente)
 * Registra frases frecuentes para el análisis de inmersión.
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

    // Ventana de tiempo: 30 minutos (Protocolo de Sesión Mencional)
    const thirtyMinsAgo = Date.now() - (30 * 60 * 1000);
    const sortedTrends = trends
      .filter(t => t.timestamp > thirtyMinsAgo)
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Top 15 para no saturar memoria

    localStorage.setItem(TREND_KEY, JSON.stringify(sortedTrends));
  } catch (err) {
    logger.error("TREND_SYNC_FAILED", "Error en motor de tendencias local.");
  }
};

export const translateService = {
  translateText,
  getKeywords: getDynamicAIKeywords,
  syncTrend: triggerTrendEffect
};

export default translateService;