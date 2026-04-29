/**
 * 🎙️ VOICE_SESSION_PROTOCOL v16.5 - PRODUCCIÓN 2026
 * Coordinador de lógica de tiempo, estados de audio y triggers de pago.
 * Regla de Oro: Ciclos de 19s (Intérprete) / 6s (Learning).
 * Ubicación: /src/utils/voiceSession.ts
 */

import { logger } from "./logger";
import React from 'react';

export interface VoiceSessionState {
  timeLeft: number;
  isCritical: boolean;   // Activa 'time-low-pulse' a los 5 min (300s)
  formattedTime: string;
  isMicActive: boolean;
  isProcessing: boolean; // Estado de latencia de Gemini
  currentTurn: 'user' | 'target' | 'idle';
  sessionMode: 'LEARNING' | 'INTERPRETER';
}

/**
 * 🚀 getInitialSessionTime:
 * Define la duración del bloque de crédito basado en el rol.
 * Bloque estándar: 20 min (1200s). Admin: 60 min (3600s).
 */
export const getInitialSessionTime = (
  role: "admin" | "user",
  isPublic: boolean = false
): number => {
  if (role === "admin") return 3600; 
  return isPublic ? 1800 : 1200;    
};

/**
 * 🔢 formatTimer:
 * Renderiza el tiempo en formato MM:SS para el HUD OLED.
 */
export const formatTimer = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safeSeconds / 60);
  const s = safeSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

/**
 * 🚨 isSessionInCriticalMode:
 * Dispara alertas visuales (pulso neón) cuando quedan menos de 5 min.
 */
export const isSessionInCriticalMode = (seconds: number): boolean => {
  return seconds <= 300 && seconds > 0;
};

/**
 * ⚙️ getModeConfiguration:
 * Retorna los parámetros técnicos específicos de cada modo de sesión.
 */
export const getModeConfiguration = (mode: 'LEARNING' | 'INTERPRETER') => {
  if (mode === 'INTERPRETER') {
    return {
      cycleTime: 19,            // Acumulación de 19 segundos para fluidez
      audioSpeed: 2.0,          // Velocidad 2x (Protocolo Ultra-Mencional)
      repetitions: 1,           // Sin repeticiones para profesionalismo
      showSupportPhrases: false // Interfaz limpia, solo traducción
    };
  }
  return {
    cycleTime: 6,               // Ciclos cortos de 6 segundos (Fijación)
    audioSpeed: 1.0,            // Ritmo normal de aprendizaje
    repetitions: 2,             // Repetición doble (Fijación Neural)
    showSupportPhrases: true    // Muestra frases de apoyo
  };
};

/**
 * 🔄 handleTrendActivation:
 * Analiza si el transcript contiene conceptos clave para la "Nube de Ideas".
 */
export const handleTrendActivation = (phrase: string, suggestions: string[]): boolean => {
  if (!phrase || phrase.trim().length < 3) return false;
  
  const isTrend = suggestions.some(s => 
    phrase.toLowerCase().includes(s.toLowerCase())
  );

  if (isTrend) {
    logger.info("TREND_DETECTED", `Capturado: ${phrase.substring(0, 20)}...`);
    return true;
  }
  return false;
};

/**
 * 💳 triggerRenewalFlow:
 * Bloqueo de sesión y redirección al Gateway de Mercado Pago ($20 MXN).
 */
export const triggerRenewalFlow = (): void => {
  logger.info("PAYMENT", "Sesión agotada. Redirigiendo a renovación de bloque.");
  
  setTimeout(() => {
    // Link de producción para bloque de 20 min ($20 MXN)
    window.location.href = "https://mpago.la/2fPScDJ";
  }, 800);
};

/**
 * ✨ getDynamicAuraStyle:
 * Estética del anillo de voz (Aura) central con colores OLED.
 */
export const getDynamicAuraStyle = (
  isMicActive: boolean,
  isCritical: boolean,
  brandColor: string = "#00FBFF" // Cian Neural
): React.CSSProperties => {
  const listeningColor = "#FF007F"; // Rosa Mencional (Input de Usuario)
  const processingColor = brandColor; // Cian (Respuesta IA)

  const activeColor = isMicActive ? listeningColor : processingColor;

  if (isCritical) {
    return {
      borderColor: activeColor,
      boxShadow: `0 0 70px ${activeColor}88, inset 0 0 30px ${activeColor}AA`,
      transform: 'scale(1.15)',
      transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
      animation: 'time-low-pulse 0.8s infinite alternate'
    };
  }

  return {
    borderColor: isMicActive ? activeColor : "rgba(255, 255, 255, 0.1)",
    boxShadow: isMicActive 
      ? `0 0 50px ${activeColor}44, inset 0 0 20px ${activeColor}22` 
      : "0 0 20px rgba(0,0,0,0.8)",
    opacity: isMicActive ? 1 : 0.6,
    transform: isMicActive ? 'scale(1.05)' : 'scale(1)',
    transition: "all 0.8s ease-in-out",
  };
};

/**
 * 📡 getNeonStatusText:
 * Mensajes técnicos para la terminal OLED inferior.
 */
export const getNeonStatusText = (
  isProcessing: boolean,
  isMicActive: boolean,
  repeatCycle: number,
  mode: 'LEARNING' | 'INTERPRETER'
): string => {
  if (mode === 'INTERPRETER') return "MODO INTÉRPRETE: TRADUCCIÓN PROFESIONAL ACTIVA";
  if (repeatCycle > 0) return `MODO FIJACIÓN: REPETICIÓN ${repeatCycle}/2`;
  if (isProcessing) return "SINCRONIZANDO NODO GEMINI 1.5 PRO...";
  if (isMicActive) return "TURNO ACTIVO: ESCUCHANDO ENTORNO...";
  return "PROTOCOLO EN ESPERA (STANDBY)";
};

/**
 * 🔌 EXPORTACIÓN UNIFICADA (Interface Manager)
 */
export const voiceSessionManager = {
  getInitialTime: getInitialSessionTime,
  format: formatTimer,
  isCritical: isSessionInCriticalMode,
  getAura: getDynamicAuraStyle,
  getStatus: getNeonStatusText,
  getModeConfig: getModeConfiguration,
  renew: triggerRenewalFlow
};

export default voiceSessionManager;