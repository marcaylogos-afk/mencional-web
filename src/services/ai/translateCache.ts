/**
 * 🧠 MENCIONAL NEURAL CACHE v16.2 - PRODUCTION (2026)
 * Orquestador de memoria inmediata y persistencia de sesiones.
 * ✅ UPDATE: Soporte para Detección Automática Bidireccional (EN <-> ES).
 * Ubicación: /src/services/ai/translateCache.ts
 */

// --- 🔵 INTERFACES DE PRODUCCIÓN ---

export interface LearningItem {
  q: string; // Frase original
  t: string; // Traducción
  id: number;
  sourceLang: string; // Idioma detectado de entrada
  targetLang: string; // Idioma de salida (Aoede)
}

export interface OfflineSession {
  date: string;
  timestamp: number;
  topic: string; 
  data: LearningItem[];
}

const cache: Record<string, string> = {};
const MAX_CACHE_SIZE = 500; 
const CACHE_PREFIX = 'mencional_cache_v16:';

// --- 🟢 MOTOR DE CACHÉ INTELIGENTE ---

/**
 * Traduce con triple nivel de verificación.
 * Ajustado para detectar el par de idiomas automáticamente.
 */
export const translateWithCache = async (
  text: string,
  detectedSourceLang: string, // Proviene de asr.ts
  translateFn: (t: string, source: string, target: string) => Promise<{ translation: string, target: string }>
): Promise<{ translation: string, target: string }> => {
  
  const cleanText = text.trim();
  if (!cleanText) return { translation: "", target: "" };

  // 🔄 LÓGICA BIDIRECCIONAL: Determinamos el destino basado en el origen detectado
  const targetLang = detectedSourceLang.startsWith('es') ? 'en-US' : 'es-MX';

  // Llave única normalizada: Incluye dirección de traducción para evitar colisiones
  const cacheKey = `${CACHE_PREFIX}${detectedSourceLang.split('-')[0]}_TO_${targetLang.split('-')[0]}:${cleanText.toLowerCase()}`;
  
  // NIVEL 1: RAM (Respuesta para el turno de 4s)
  if (cache[cacheKey]) {
    return { translation: cache[cacheKey], target: targetLang };
  }

  // NIVEL 2: LocalStorage
  try {
    const savedTranslation = localStorage.getItem(cacheKey);
    if (savedTranslation) {
      cache[cacheKey] = savedTranslation; 
      return { translation: savedTranslation, target: targetLang };
    }
  } catch (e) {}

  // NIVEL 3: Inferencia Neural (Llamada a translateService.ts)
  const result = await translateFn(cleanText, detectedSourceLang, targetLang);
  const translation = result.translation;

  // Gestión de Memoria RAM (FIFO)
  const keys = Object.keys(cache);
  if (keys.length >= MAX_CACHE_SIZE) {
    delete cache[keys[0]]; 
  }

  // Protocolo de Validación Mencional
  const isValid = translation && 
                  translation !== "SERVICE_UNAVAILABLE" && 
                  translation !== "ERROR";

  if (isValid) {
    cache[cacheKey] = translation;
    try {
      localStorage.setItem(cacheKey, translation);
    } catch (e) {
      clearTranslateCache(true); 
      try { localStorage.setItem(cacheKey, translation); } catch (err) {}
    }
  }
  
  return { translation, target: targetLang };
};

// --- 🟡 GESTIÓN DE HISTORIAL DE SESIONES ---

/**
 * Registra cada intervención alimentando la Nube de Ideas y el PDF.
 * Ahora guarda metadatos de idioma para el reporte final.
 */
export const saveToOfflineSession = (
  sessionId: string, 
  original: string, 
  translated: string,
  sourceLang: string,
  targetLang: string,
  currentTopic: string = "GENERAL"
) => {
  if (!sessionId || !original || !translated) return;

  const sessions = getOfflineSessions();
  const sessionKey = sessionId.toUpperCase();
  
  if (!sessions[sessionKey]) {
    sessions[sessionKey] = {
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      topic: currentTopic,
      data: []
    };
  }

  const currentSessionData = sessions[sessionKey].data;
  const isDuplicate = currentSessionData.some((item: LearningItem) => 
    item.q.toLowerCase() === original.toLowerCase()
  );
  
  if (!isDuplicate) {
    currentSessionData.push({
      q: original,
      t: translated,
      sourceLang,
      targetLang,
      id: Date.now()
    });
    
    try {
      localStorage.setItem('mencional_sessions_history', JSON.stringify(sessions));
    } catch (e) {
      const sessionIds = Object.keys(sessions);
      if (sessionIds.length > 1) {
        const oldestId = sessionIds.sort((a, b) => sessions[a].timestamp - sessions[b].timestamp)[0];
        delete sessions[oldestId];
        try {
          localStorage.setItem('mencional_sessions_history', JSON.stringify(sessions));
        } catch (retryErr) {}
      }
    }
  }
};

export const getOfflineSessions = (): Record<string, OfflineSession> => {
  try {
    const data = localStorage.getItem('mencional_sessions_history');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const clearTranslateCache = (cacheOnly: boolean = false) => {
  Object.keys(cache).forEach(key => delete cache[key]);
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    if (!cacheOnly) localStorage.removeItem('mencional_sessions_history');
  } catch (e) {}
};

// --- 📦 EXPORTACIÓN UNIFICADA ---

export const translateCache = {
  translateWithCache,
  saveToOfflineSession,
  getOfflineSessions,
  clearTranslateCache
};

export default translateCache;