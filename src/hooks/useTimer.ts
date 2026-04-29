/**
 * ⏱️ MENCIONAL | HOOK: USE_TIMER v2026.PROD
 * Protocolo de Ventanas Críticas de Escucha (Inferencia Neural): 
 * - Mencional (Aprendizaje): 6s
 * - Ultra-Mencional (Intérprete): 19s
 * - Rompehielo (Social): 4s
 * ✅ DIRECTORIO: Sincronizado a /src/services/ai/
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';

export const useTimer = (onTimeUp?: () => void) => {
  const { settings } = useSettings();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * 🎯 getThreshold: Define la ventana de vida de la escucha activa.
   * Se ajusta dinámicamente según el modo configurado en el Contexto.
   */
  const getThreshold = useCallback(() => {
    switch (settings.currentMode) {
      case 'ultra-interpreter':
      case 'ultra-mencional': 
      case 'interpreter':
      case 'ultra':
        return 19; // 🔵 NODO: ULTRA-MENCIONAL (Bloque de ideas profesional/largo)
      case 'rompehielo': 
      case 'icebreaker': 
        return 4;  // 🟠 NODO: ROMPEHIELO (Reacción social rápida/espontánea)
      case 'mencional':     
      case 'learning':             
      default:            
        return 6;  // 🟢 NODO: MENCIONAL (Función principal de aprendizaje)
    }
  }, [settings.currentMode]);

  /**
   * ⚡ RESET_TIMER: Invocado al detectar actividad vocal.
   * Mantiene el nodo activo mientras el usuario continúe su intervención.
   */
  const resetTimer = useCallback(() => {
    // 🛡️ SEGURIDAD: No iniciar ráfagas si la sesión global ya expiró
    const isBlocked = localStorage.getItem('mencional_access_status') === 'expired';
    if (isBlocked) {
      stopTimer();
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    
    const threshold = getThreshold();
    setTimeLeft(threshold);
    setIsActive(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsActive(false);
          
          // 🛑 TIEMPO AGOTADO: Se dispara la inferencia (Traducción o Respuesta)
          if (onTimeUp) onTimeUp(); 
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [getThreshold, onTimeUp]);

  /**
   * 🛑 STOP_TIMER: Finaliza la escucha y limpia el estado del cronómetro.
   */
  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(0);
  }, []);

  // Limpieza automática para prevenir fugas de memoria
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /**
   * 📊 progress: Cálculo para componentes visuales (Barra de progreso OLED).
   */
  const threshold = getThreshold();
  const progress = threshold > 0 ? (timeLeft / threshold) * 100 : 0;

  return {
    timeLeft,
    isActive,
    resetTimer,
    stopTimer,
    progress: isNaN(progress) ? 0 : progress,
    currentThreshold: threshold
  };
};

export default useTimer;