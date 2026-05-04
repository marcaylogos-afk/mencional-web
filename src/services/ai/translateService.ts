/** 🛰️ MENCIONAL | NEURAL_TRANSLATE_ENGINE v2026.PROD
 * Protocolo: Ultra-Low Latency | Bidirectional Auto-Detection | Multi-Mode Sync
 * Ubicación: /src/services/ai/translateService.ts
 * ✅ UPDATE: Soporte para detección automática EN/ES (Protocolo Espejo).
 * ✅ UPDATE: Sincronización con sesiones optimizadas de 30 min.
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
 * Traduce automáticamente basándose en el idioma detectado.
 */
export const translateText = async (
  text: string, 
  mode: 'learning' | 'ultra' | 'rompehielo' = 'learning',
  isAutoDetect: boolean = true
): Promise<{ translation: string; sourceLang: string; targetLang: string }> => {
  if (!text || text.trim().length === 0) return { translation: "", sourceLang: "", targetLang: "" };

  const cleanInput = sanitizeText(text);

  try {
    // 🛡️ PROTOCOLO ESPEJO: Detección inicial (Google gtx detecta sl=auto automáticamente)
    // El objetivo por defecto es inglés, pero cambiaremos si el input ya es inglés.
    let target = 'en'; 
    
    // 🛡️ REGLA DE ORO MODO ULTRA: El administrador recibe siempre en Español.
    if (mode === 'ultra') {
      target = 'es';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    // Llamada al motor de ultra-baja latencia
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&dt=ld&q=${encodeURIComponent(cleanInput)}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("GOOGLE_FETCH_FAIL");

    const data = await response.json();
    const detectedSrc = data?.[2] || "es"; // Idioma detectado por el motor
    let translation = data?.[0]?.[0]?.[0]?.trim() || cleanInput;

    // 🔄 LÓGICA DE SWAP (Si detectó inglés y el target era inglés, re-traducimos a español)
    let finalTarget = target;
    if (isAutoDetect && mode !== 'ultra' && detectedSrc === 'en' && target === 'en') {
      finalTarget = 'es';
      const retryResponse = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(cleanInput)}`
      );
      const retryData = await retryResponse.json();
      translation = retryData?.[0]?.[0]?.[0]?.trim() || translation;
    }

    /** 🎓 PROCESAMIENTO TÁCTICO POR MODO */
    if (mode === 'learning') {
      if (cleanInput.length > 3) triggerTrendEffect(cleanInput, "LEARNING"); 
    } else if (mode === 'ultra') {
      translation = translation.replace(/[\[\]{}()]/g, "").replace(/\s+/g, ' '); 
    } else if (mode === 'rompehielo') {
      if (cleanInput.length > 2) triggerTrendEffect(cleanInput, "SOCIAL");
    }

    return { 
      translation, 
      sourceLang: detectedSrc, 
      targetLang: finalTarget 
    };

  } catch (error) {
    logger.error("TRANSLATE_FAILURE", "Fallo en motor neural. Usando redundancia.", error);
    return { translation: cleanInput, sourceLang: "auto", targetLang: "en" }; 
  }
};

/**
 * 🧊 getDynamicAIKeywords
 * Genera sugerencias sociales naturales para el Modo Rompehielo.
 */
export const getDynamicAIKeywords = async (
  lastTranscript: string, 
  targetLang: string = "en-US",
): Promise<string[]> => {
  if (!lastTranscript || !GEMINI_API_KEY) return ["Interesante", "Sigue", "Te escucho"]; 

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Context: Mencional App. Social interaction. Input: "${lastTranscript}". 
            Task: Provide 3 short, natural responses. Return ONLY a raw JSON array of strings.`
          }]
        }],
        generationConfig: { 
          responseMimeType: "application/json", 
          temperature: 0.8 
        }
      })
    });

    const data = await response.json();
    const suggestionsText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const suggestions = JSON.parse(suggestionsText);
    
    return Array.isArray(suggestions) ? suggestions.slice(0, 3) : ["Ok", "Great", "Cool"];
  } catch (error) {
    return ["Entiendo", "Cuéntame más", "Ok"];
  }
};

/**
 * 🚀 triggerTrendEffect
 * Sincronización con el Cloud de Tendencias (OLED Optimized).
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

    // Mantener solo tendencias de la última hora
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const sortedTrends = trends
      .filter(t => t.timestamp > oneHourAgo)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

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