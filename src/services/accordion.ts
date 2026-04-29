/**
 * 🛰️ TRENDING_SERVICE_V2 | MENCIONAL 2026.PROD
 * Ubicación: /src/services/ai/accordion.ts
 * Gestión de la Nube de Ideas Dinámica, Sincronización Global y Modo Rompehielo.
 */

import { 
    collection, 
    getDocs, 
    addDoc,
    query,
    limit,
    orderBy,
    Timestamp 
} from "firebase/firestore";
import { db } from "./firebaseConfig"; 

/**
 * Interface para los rectángulos de tendencias (Trend Rectangles) del Lobby.
 */
export interface TrendingTopic {
    topic: string;         // La frase o hashtag neural
    relevance: number;     // Frecuencia de uso en sesiones reales
    languageCode: string;  // Idioma de origen
    category?: string;     // Contexto (Negocios, Salud, Rompehielo)
    createdAt: Timestamp;
}

/**
 * 📡 getTrendingTopics
 * Recupera los temas más calientes del clúster global para el Lobby OLED.
 */
export async function getTrendingTopics(): Promise<TrendingTopic[]> {
    try {
        const topicsRef = collection(db, 'mencional_trending_cloud');
        
        // Consulta: Últimos 20 temas para filtrar por relevancia en el grid
        const q = query(
            topicsRef, 
            orderBy('createdAt', 'desc'), 
            limit(20)
        );
        
        const snapshot = await getDocs(q);

        if (snapshot.empty) return [getDefaultTopic()];

        const topics = snapshot.docs.map(doc => doc.data() as TrendingTopic);
        
        // Priorizar por popularidad para el diseño de rectángulos del Lobby
        return topics
            .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
            .slice(0, 6); 

    } catch (error) {
        console.error("❌ MENCIONAL_SYNC_ERROR (Tendencias):", error);
        return [getDefaultTopic()];
    }
}

/**
 * 🚀 pushNewTrend
 * Propaga frases de alto valor a la Nube Global tras una sesión exitosa.
 */
export async function pushNewTrend(phrase: string, lang: string, category: string = 'GENERAL'): Promise<void> {
    if (!phrase || phrase.length < 4) return;

    try {
        const topicsRef = collection(db, 'mencional_trending_cloud');
        
        await addDoc(topicsRef, {
            topic: phrase.toUpperCase().trim(),
            relevance: 1,
            languageCode: lang,
            category: category,
            createdAt: Timestamp.now()
        });
        
        console.log(`✨ Trend Global Propagado: ${phrase}`);
    } catch (e) {
        // Falla silenciosa para proteger la ventana crítica de 4s en Rompehielo
        console.warn("⚠️ Trend_Propagation_Delayed");
    }
}

/**
 * 🔄 getRompehieloSuggestions
 * Específico para el Modo Rompehielo: Retorna 3 respuestas tácticas.
 * Se sincroniza con el motor de voz Aoede para la reproducción 2x.
 */
export async function getRompehieloSuggestions(inputAudioText: string): Promise<string[]> {
    try {
        const topics = await getTrendingTopics();
        
        // El motor selecciona 3 opciones basadas en la relevancia global actual
        const suggestions = topics
            .slice(0, 3)
            .map(t => t.topic);

        return suggestions.length >= 3 
            ? suggestions 
            : ["CLARO, ME INTERESA", "CUÉNTAME MÁS SOBRE ESO", "EXCELENTE PUNTO"];
    } catch {
        return ["SÍ", "NO", "TAL VEZ"];
    }
}

/**
 * ⏱️ checkSessionValidity (Regla de los 20 Minutos)
 * Sincronización forzada: El bloque de 20 min es ineludible para participantes.
 */
export function isSessionExpired(startTime: number): boolean {
    const TWENTY_MINUTES_MS = 20 * 60 * 1000;
    const currentTime = Date.now();
    const expired = (currentTime - startTime) > TWENTY_MINUTES_MS;

    if (expired) {
        console.log("🔒 Bloque de 20 min finalizado. Sincronizando saldo.");
    }
    return expired;
}

/**
 * 🛠️ getDefaultTopic
 * Temas de respaldo con estética profesional para fallos de red.
 */
function getDefaultTopic(): TrendingTopic {
    return {
        topic: "BUSINESS_STRATEGY_2026",
        relevance: 100,
        languageCode: "en-US",
        category: "BIZ",
        createdAt: Timestamp.now()
    };
}

// ✅ Exportación centralizada para el motor Mencional
export const trendingService = {
    getTopics: getTrendingTopics,
    push: pushNewTrend,
    getRompehieloSuggestions: getRompehieloSuggestions,
    isSessionExpired: isSessionExpired 
};

export default trendingService;