/**
 * 📈 TRENDS_SERVICE v18.0 - MENCIONAL 2026
 * Motor de Inteligencia Colectiva y Gestión de Rectángulos Tácticos OLED.
 * Ubicación: /src/services/business/trendsService.ts
 */

import { 
  collection, query, orderBy, limit, getDocs, addDoc, 
  Timestamp, where, updateDoc, doc, deleteDoc, 
  DocumentData, QueryDocumentSnapshot 
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import React from "react";
import { sanitizer } from "../../utils/sanitizer"; 
import { UI_SYSTEM_COLORS } from "../../utils/colors10";

export interface TrendTopic {
  id: string;
  topic: string;     // Frase o Tema (ej: "INGENIERÍA_NEURAL")
  intensity: number;  // Ranking de popularidad
  category: 'social' | 'professional' | 'casual';
  lastUsed: Timestamp;
}

/**
 * 🛰️ getNeuralTrends
 * Extrae los temas más calientes del ecosistema generados por participantes.
 */
export const getNeuralTrends = async (): Promise<TrendTopic[]> => {
  try {
    const trendsRef = collection(db, "neural_trends");
    // Priorizamos intensidad y frescura (últimas 24h)
    const q = query(trendsRef, orderBy("intensity", "desc"), limit(12));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Fallback: Temas de reserva con estética técnica (Protocolo de Inicio)
      return [
        { id: 'f1', topic: 'INTERPRETACIÓN_IA', intensity: 100, category: 'professional', lastUsed: Timestamp.now() },
        { id: 'f2', topic: 'APRENDIZAJE_MENCIONAL', intensity: 85, category: 'professional', lastUsed: Timestamp.now() },
        { id: 'f3', topic: 'CONEXIÓN_GLOBAL', intensity: 70, category: 'social', lastUsed: Timestamp.now() },
        { id: 'f4', topic: 'FLUJO_NEURAL', intensity: 60, category: 'casual', lastUsed: Timestamp.now() }
      ];
    }

    const trends = querySnapshot.docs.map(d => ({ 
      id: d.id, 
      ...(d.data() as Omit<TrendTopic, 'id'>) 
    })) as TrendTopic[];

    // Limpieza en segundo plano (No bloqueante)
    cleanupOldTrends(querySnapshot.docs);
    
    return trends;
  } catch (error) {
    console.error("TREND_FETCH_ERROR:", error);
    return [];
  }
};

/**
 * ⚡ triggerTrendEffect
 * Alimenta el algoritmo de tendencias basándose en el uso real.
 */
export const triggerTrendEffect = async (phrase: string): Promise<void> => {
  if (!phrase || phrase.length > 30 || phrase.length < 3) return; 

  const cleanPhrase = sanitizer.convertToTrendSlug(phrase);
  if (!cleanPhrase) return;

  try {
    const trendsRef = collection(db, "neural_trends");
    const q = query(trendsRef, where("topic", "==", cleanPhrase));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const trendDoc = snapshot.docs[0];
      await updateDoc(doc(db, "neural_trends", trendDoc.id), {
        intensity: (trendDoc.data().intensity || 0) + 1,
        lastUsed: Timestamp.now()
      });
    } else {
      await addDoc(trendsRef, {
        topic: cleanPhrase,
        intensity: 1,
        category: 'social',
        lastUsed: Timestamp.now()
      });
    }
  } catch (error) {
    // Bypass silencioso para métricas (No interrumpe el flujo principal)
  }
};

/**
 * 🧠 getSessionSuggestions
 * Sugerencias contextuales de alta velocidad para el usuario.
 */
export const getSessionSuggestions = (context: string): string[] => {
  const ctx = context.toLowerCase();
  
  if (ctx.includes('restaurant') || ctx.includes('comer') || ctx.includes('food')) {
    return ['¿QUÉ RECOMIENDAS?', 'LA CUENTA, POR FAVOR', 'SOY ALÉRGICO A...', 'MESA PARA DOS'];
  }
  
  if (ctx.includes('meeting') || ctx.includes('trabajo') || ctx.includes('office')) {
    return ['ESTOY DE ACUERDO', '¿CUÁL ES EL OBJETIVO?', 'LO REVISO EN BREVE', 'ENVIARÉ EL REPORTE'];
  }

  if (ctx.includes('saludo') || ctx.includes('hola') || ctx.includes('conocer')) {
    return ['¡MUCHO GUSTO!', '¿A QUÉ TE DEDICAS?', 'HABLEMOS DE OTRA COSA', 'ES UN PLACER'];
  }

  return ['TOTALMENTE', 'CUÉNTAME MÁS', '¡QUÉ INTERESANTE!', 'TIENE SENTIDO'];
};

/**
 * ✨ getThemeStyle
 * Generador de estilos para el "Rectángulo Táctico" (Capsule UI).
 * Enfoque: Minimalismo OLED y Acentos Neón.
 */
export const getThemeStyle = (isActive: boolean = false, color: string = UI_SYSTEM_COLORS.MASTER): React.CSSProperties => {
  return { 
    borderRadius: '20px', 
    padding: '14px 28px', 
    fontSize: '9px',
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: '900', 
    letterSpacing: '0.35em', 
    textTransform: 'uppercase',
    background: isActive ? color : 'rgba(10, 10, 10, 0.7)',
    color: isActive ? '#000000' : '#666666',
    backdropFilter: 'blur(20px)',
    border: isActive ? `1px solid ${color}` : '1px solid rgba(255, 255, 255, 0.05)',
    cursor: 'pointer',
    transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
    boxShadow: isActive ? `0 0 35px ${color}55` : '0 10px 30px rgba(0,0,0,0.5)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    marginBottom: '12px',
    userSelect: 'none',
    flexShrink: 0
  };
};

/**
 * 🧹 cleanupOldTrends
 * Purga de seguridad: Mantiene el ecosistema fresco eliminando temas obsoletos.
 */
const cleanupOldTrends = async (docs: QueryDocumentSnapshot<DocumentData>[]) => {
  const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 Horas
  const now = Date.now();

  for (const d of docs) {
    const data = d.data();
    const lastUsedMs = data.lastUsed?.toMillis() || 0;
    
    if (now - lastUsedMs > MAX_AGE_MS) {
      try {
        await deleteDoc(doc(db, "neural_trends", d.id));
      } catch (e) {
        // Error silenciado para optimizar experiencia
      }
    }
  }
};

export const trendsService = { 
  getNeuralTrends, 
  triggerTrendEffect, 
  getSessionSuggestions, 
  getThemeStyle 
};

export default trendsService;