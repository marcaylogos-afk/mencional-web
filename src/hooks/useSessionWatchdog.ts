/**
 * 🛰️ HOOK: useSessionWatchdog v18.0 - PRODUCTION 2026.04
 * Ubicación: /src/hooks/useSessionWatchdog.ts
 * Centinela de seguridad: Bloques de 60 min, Sincronización Forzada y Bypass Admin.
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { db } from '../services/ai/firebaseConfig';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './useAuth'; 
import { logger } from '../utils/logger';

const APP_ID = 'mencional-2026';
const SESSION_LIMIT_MS = 60 * 60 * 1000; // 1 Hora exacta

export const useSessionWatchdog = (sessionId: string | null, onInvalidate: () => void) => {
  const { isAdmin, user } = useAuth(); 
  const [isValid, setIsValid] = useState(true);
  
  // Estados vinculados a la interfaz OLED (High Contrast)
  const [isWarning, setIsWarning] = useState(false);   // Banner de pago (T-5 min)
  const [isCritical, setIsCritical] = useState(false); // Pulso Cian #00FBFF (T-10 min)
  
  const [timeLeftSec, setTimeLeftSec] = useState<number | null>(null);
  const checkTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 🛑 PROTOCOLO DE FINALIZACIÓN Y BLOQUEO PERSISTENTE
   */
  const handleInvalidation = useCallback(async () => {
    // 🛡️ Bypass Maestro
    if (isAdmin) {
      logger.info("WATCHDOG", "Bypass Maestro: Sesión extendida por rango administrativo.");
      return;
    }

    if (checkTimerRef.current) clearInterval(checkTimerRef.current);
    
    setIsValid(false);
    setIsWarning(false);
    setIsCritical(false);
    
    // 🔒 MARCA DE BLOQUEO LOCAL: Impide re-entrada post-refresh
    localStorage.setItem(`blocked_${sessionId}`, 'true');
    localStorage.setItem('mencional_access_status', 'expired');
    
    logger.warn("WATCHDOG", `Sincronización Forzada: Sesión ${sessionId} expirada.`);
    
    try {
      if (sessionId) {
        const sessionRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'sessions', sessionId);
        await updateDoc(sessionRef, { 
          status: 'expired',
          active: false,
          endedAt: serverTimestamp()
        });
      }
    } catch (e) {
      logger.error("WATCHDOG_CLEANUP_FAIL", e);
    }

    onInvalidate(); 
  }, [sessionId, onInvalidate, isAdmin]);

  useEffect(() => {
    if (!sessionId) return;

    // 🛡️ VALIDACIÓN INICIAL POST-REFRESH
    const isBlocked = localStorage.getItem(`blocked_${sessionId}`);
    if (isBlocked === 'true' && !isAdmin) {
      handleInvalidation();
      return;
    }

    const sessionDocRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'sessions', sessionId);

    const unsub = onSnapshot(sessionDocRef, (docSnap) => {
      if (!docSnap.exists()) {
        if (!isAdmin) handleInvalidation();
        return;
      }

      const data = docSnap.data();
      const closedStatuses = ["completed", "expired", "revoked", "inactive"];
      
      if (closedStatuses.includes(data.status) || data.active === false) {
        if (!isAdmin) handleInvalidation();
        return;
      }

      if (checkTimerRef.current) clearInterval(checkTimerRef.current);

      checkTimerRef.current = setInterval(() => {
        const now = Date.now();
        // Sincronización con el tiempo de inicio de la sesión
        const startTime = data.createdAt?.toMillis?.() || data.createdAt;
        const endTime = startTime + SESSION_LIMIT_MS;
        
        if (!startTime) return;

        const timeLeftMs = endTime - now;
        const secondsRemaining = Math.max(0, Math.floor(timeLeftMs / 1000));

        setTimeLeftSec(secondsRemaining);

        if (!isAdmin) {
          // 🚨 Alerta Crítica: 10 Minutos restantes (Pulso OLED Cian)
          if (secondsRemaining <= 600 && secondsRemaining > 300) {
            setIsCritical(true);
            setIsWarning(false);
          }

          // 💰 Alerta de Pago: 5 Minutos restantes (Banner Mercado Pago $90)
          if (secondsRemaining <= 300 && secondsRemaining > 0) {
            setIsWarning(true);
            setIsCritical(true); 
          }

          // 💀 Expulsión Automática: Al cumplir la hora
          if (timeLeftMs <= 0) {
            if (checkTimerRef.current) clearInterval(checkTimerRef.current);
            handleInvalidation();
          }
        }
      }, 1000);

    }, (error) => {
      logger.error("WATCHDOG_SYNC_ERROR", error);
      if (error.code === 'permission-denied' && !isAdmin) {
        handleInvalidation();
      }
    });

    return () => {
      unsub();
      if (checkTimerRef.current) clearInterval(checkTimerRef.current);
    };
  }, [sessionId, handleInvalidation, isAdmin]);

  return { 
    isValid: isAdmin ? true : isValid, 
    isWarning: isAdmin ? false : isWarning,      
    isCritical: isAdmin ? false : isCritical, 
    timeLeftSec: isAdmin ? 99999 : timeLeftSec,
    formattedTime: isAdmin ? "∞_MASTER" : (timeLeftSec !== null 
      ? `${Math.floor(timeLeftSec / 60)}:${(timeLeftSec % 60).toString().padStart(2, '0')}`
      : "--:--"),
    paymentLink: "https://mpago.la/1isA1oL" // Link de Mercado Pago actualizado
  };
};

export default useSessionWatchdog;