/**
 * 🛰️ HOOK: useSyncSession v16.0 - PRODUCTION 2026.PROD
 * Protocolo: Sincronización Realtime, Efecto Trend y Jerarquía Intérprete Ultra.
 * Ubicación: /src/hooks/useSyncSession.ts
 * ✅ DIRECTORIO: Sincronizado de /ia/ a /ai/
 */

import { useCallback, useEffect, useState, useRef } from "react";
import {
  ref,
  push,
  onChildAdded,
  serverTimestamp,
  query,
  limitToLast,
  DataSnapshot,
  off,
  update,
  increment
} from "firebase/database";

// ✅ Importación corregida a la nueva estructura de servicios
import { db } from "../services/ai/firebaseConfig";
import { useSettings } from "../context/SettingsContext";
import { logger } from "../utils/logger";

// Módulos alineados al modelo de negocio de Mencional 2026
export type SessionMode = 
  | 'LEARNING'     // Modo Aprendizaje: Ciclo 6s / Inmersión
  | 'INTERPRETER'  // Modo Intérprete: Ciclo 19s / Jerarquía Admin
  | 'ICEBREAKER'   // Modo Rompehielo: Ciclo 4s / Selección Automática
  | 'IDLE';

export interface CloudMessage {
  id: string;
  uid: string;
  original: string;    // Idioma Natal (Trigger de memoria)
  translated: string;  // Idioma Práctica (Foco Visual OLED)
  timestamp: number;
  role: "admin" | "participant";
  mode: SessionMode;
  userName?: string;
  targetLang: string;
  color?: string;      // Color Neón asignado al turno
}

export const useSyncSession = (sessionId: string = "global-session") => {
  const { settings, isAdmin } = useSettings();
  const [cloudMessages, setCloudMessages] = useState<CloudMessage[]>([]);
  
  // Ref para evitar duplicidad visual en reconexiones de red o hot-reloads
  const messagesKeyCache = useRef<Set<string>>(new Set());

  /**
   * 📤 ENVÍO A LA NUBE (SYNCCAST)
   * Sincroniza la voz procesada y alimenta el motor de tendencias global.
   */
  const syncToCloud = useCallback(
    async (
      original: string, 
      translated: string, 
      currentMode: SessionMode,
      targetLang: string,
      isSuggested: boolean = false
    ) => {
      if (!original.trim() || !translated.trim() || original === "ESCUCHANDO...") return;

      try {
        const sessionRef = ref(db, `sessions/${sessionId}/messages`);
        
        // Estructura de mensaje con jerarquía de roles Mencional
        const messageData = {
          uid: settings.userId || "anonymous_pilot",
          userName: settings.userName || "Neural_User",
          original: original.trim(),
          translated: translated.trim(),
          timestamp: serverTimestamp(),
          role: isAdmin ? "admin" : "participant",
          mode: currentMode,
          targetLang: targetLang,
          color: settings.selectedColor || "#00FBFF" // Estética OLED Cyan por defecto
        };

        // 1. Inyección en Firebase Realtime para actualización instantánea en el HUD
        await push(sessionRef, messageData);

        /**
         * 🔥 EFECTO TREND: Algoritmo de popularidad Mencional
         * Si la frase es útil o fue una sugerencia aceptada, sube de rango en la nube.
         */
        if (currentMode === 'LEARNING' || isSuggested) {
          // Normalización de ID para la tendencia (snake_case)
          const trendId = original.toLowerCase().trim()
            .replace(/[^a-z0-9]/g, '_')
            .substring(0, 50);

          const trendRef = ref(db, `trends/${targetLang}/${trendId}`);
          
          await update(trendRef, {
            phrase: original.trim(),
            translation: translated.trim(),
            popularity: increment(1), // Incremento atómico en el servidor
            lastUsed: serverTimestamp(),
            modeOrigin: currentMode
          });
          
          logger.info("TREND", `Frase viralizada: ${trendId}`);
        }

      } catch (error) {
        logger.error("CLOUD_SYNC_ERROR", `Fallo en sincronización: ${error}`);
      }
    },
    [sessionId, settings, isAdmin]
  );

  /**
   * 🎧 SUSCRIPCIÓN NEURAL REACTIVA (HUD Sync)
   * Mantiene el flujo de datos para el HUD y el sistema de reportes.
   */
  useEffect(() => {
    if (!sessionId) return;

    const messagesPath = `sessions/${sessionId}/messages`;
    const messagesRef = query(
      ref(db, messagesPath),
      limitToLast(150) // Límite para evitar lag en dispositivos móviles
    );

    const handleNewMessage = (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const msgId = snapshot.key as string;

      // 🛡️ Filtro de redundancia (Crucial para estabilidad en React 18+)
      if (messagesKeyCache.current.has(msgId)) return;
      messagesKeyCache.current.add(msgId);

      const newMessage: CloudMessage = {
        id: msgId,
        uid: data.uid,
        userName: data.userName,
        original: data.original,
        translated: data.translated,
        timestamp: data.timestamp || Date.now(),
        role: data.role,
        mode: data.mode,
        targetLang: data.targetLang || "en-US",
        color: data.color
      };

      setCloudMessages((prev) => {
        const combined = [...prev, newMessage];
        // Mantener el buffer ligero (solo los últimos 150 mensajes)
        return combined.slice(-150);
      });
    };

    const listener = onChildAdded(messagesRef, handleNewMessage);

    return () => {
      off(messagesRef, "child_added", listener);
      messagesKeyCache.current.clear();
      logger.info("SYNC", `Canal ${sessionId} cerrado.`);
    };
  }, [sessionId]);

  /**
   * 🧹 PURGA DE BUFFER LOCAL
   */
  const clearLocalMessages = useCallback(() => {
    setCloudMessages([]);
    messagesKeyCache.current.clear();
  }, []);

  return {
    syncToCloud,
    cloudMessages, 
    clearLocalMessages,
    setCloudMessages,
  };
};

export default useSyncSession;