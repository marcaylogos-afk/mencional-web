/**
 * 🛡️ HOOK: useSocialGuardian v2026.PROD
 * Ubicación: /src/hooks/useSocialGuardian.ts
 * Protocolo: Umbral de Baneo (3 incidencias), Ghosting Personal y Motor Rompehielo Flash.
 * ✅ ESTRUCTURA: Sincronizada con /src/services/ai/
 */

import { useState, useCallback, useEffect } from "react";
import { logger } from "../utils/logger";
// Nota: SecurityEngine se mantiene en /data/ por ser persistencia de hardware, 
// pero interactúa con los servicios de /ai/ para filtrar contenido.
import { SecurityEngine } from "../services/data/SecurityEngine";

export const useSocialGuardian = () => {
  // --- 🗄️ PERSISTENCIA DE SEGURIDAD (LocalStorage para redundancia rápida) ---
  const [reports, setReports] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("mencional_global_reports");
    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [personalBlacklist, setPersonalBlacklist] = useState<string[]>(() => {
    const saved = localStorage.getItem("mencional_personal_blacklist");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // --- 💾 SINCRONIZACIÓN PERSISTENTE ---
  useEffect(() => {
    localStorage.setItem("mencional_global_reports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("mencional_personal_blacklist", JSON.stringify(personalBlacklist));
  }, [personalBlacklist]);

  /**
   * 🚩 REPORT_USER: Gestión de Incidencias.
   * Protocolo: 3 incidencias = Expulsión inmediata y bloqueo de Nodo.
   */
  const reportUser = useCallback((reportedId: string) => {
    if (!reportedId) return;

    setReports((prev) => {
      const currentCount = (prev[reportedId] || 0) + 1;
      
      if (currentCount >= 3) {
        logger.warn("SOCIAL_GUARDIAN", `🛑 BLOQUEO CRÍTICO: Nodo ${reportedId} expulsado.`);
        
        // Bloqueo a nivel de kernel de hardware (Fingerprint/HWID)
        if (SecurityEngine.triggerGlobalBlock) {
          SecurityEngine.triggerGlobalBlock(reportedId); 
        }
      } else {
        logger.info("SOCIAL_GUARDIAN", `⚠️ Tarjeta Amarilla (${currentCount}/3) para: ${reportedId}`);
      }
      
      return { ...prev, [reportedId]: currentCount };
    });
  }, []);

  /**
   * 🛑 GHOSTING POST-SESIÓN (Calificación de Afinidad)
   * Si la experiencia fue negativa, el participante entra en lista negra silenciosa 
   * para no volver a emparejarse en futuras sesiones.
   */
  const rateParticipant = useCallback((participantId: string, isPositive: boolean) => {
    if (!participantId || isPositive) return;
    
    setPersonalBlacklist(prev => {
      if (prev.includes(participantId)) return prev;
      logger.info("SOCIAL_GUARDIAN", `Protocolo Ghosting: ${participantId} excluido de futuras colas.`);
      return [...prev, participantId];
    });
  }, []);

  /**
   * 🚫 GATEKEEPER: Validación en Tiempo Real.
   * Cruza datos locales con el motor de seguridad global.
   */
  const isUserAllowed = useCallback((userId: string): boolean => {
    if (!userId) return true;
    
    const isGloballyBanned = (reports[userId] || 0) >= 3;
    const isPersonallyBlocked = personalBlacklist.includes(userId);
    
    // Verificación cruzada con el SecurityEngine (HWID/IP)
    const isBlacklistedInEngine = SecurityEngine.isBlacklisted ? SecurityEngine.isBlacklisted(userId) : false;

    return !isGloballyBanned && !isPersonallyBlocked && !isBlacklistedInEngine;
  }, [reports, personalBlacklist]);

  /**
   * 🧊 MOTOR ROMPEHIELO: DETECTOR DE INTENCIÓN FLASH
   * Analiza si el mensaje es una interacción social corta para bajar la latencia a 4s.
   */
  const analyzeSocialIntent = useCallback((text: string): { mode: 'ICEBREAKER' | 'STANDARD', latency: number } => {
    if (!text || text.trim().length < 2) return { mode: 'STANDARD', latency: 19000 };

    const icebreakerKeywords = [
      'who', 'what', 'where', 'when', 'why', 'how', 'do you', 'can you', 'is there', 'are you',
      'quién', 'qué', 'dónde', 'cuándo', 'por qué', 'cómo', 'sabes', 'tienes', 'conoces', 'eres',
      'hola', 'hi', 'hey', 'buenos', 'buenas', 'tal', 'mencional', 'name', 'nombre'
    ];
    
    const lowerText = text.toLowerCase().trim();
    
    // Detección por puntuación o palabras clave de apertura (Trigger Rompehielo)
    const isQuestion = 
      lowerText.includes('?') || 
      lowerText.includes('¿') ||
      icebreakerKeywords.some(word => lowerText.startsWith(word));

    // Si es una interacción relámpago (< 18 caracteres), activamos el Protocolo Flash de 4s.
    const isShortInteraction = lowerText.length < 18;

    if (isQuestion || isShortInteraction) {
      logger.info("SOCIAL_GUARDIAN", "⚡ Protocolo Flash detectado (4s Latency).");
      return { mode: 'ICEBREAKER', latency: 4000 };
    }

    // Modo estándar (Ultra-Mencional) para bloques de pensamiento largos
    return { mode: 'STANDARD', latency: 19000 };
  }, []);

  /**
   * ♻️ PURGA DE SEGURIDAD (Mantenimiento de Administrador)
   */
  const clearGuardianData = useCallback(() => {
    setReports({});
    setPersonalBlacklist([]);
    localStorage.removeItem("mencional_global_reports");
    localStorage.removeItem("mencional_personal_blacklist");
    logger.info("SOCIAL_GUARDIAN", "Registros de seguridad purgados exitosamente.");
  }, []);

  return {
    reportUser,
    rateParticipant,
    isUserAllowed,
    analyzeSocialIntent,
    clearGuardianData,
    reportsCount: reports,
    blacklist: personalBlacklist
  };
};

export default useSocialGuardian;