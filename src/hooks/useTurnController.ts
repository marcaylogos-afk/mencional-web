/** * 🔄 HOOK: TURN_CONTROLLER - MENCIONAL 2026.PROD
 * Protocolo: Voz Activa -> 6s Límite -> Doble Repetición Aoede (Fijación Neural)
 * Ubicación: /src/hooks/useTurnController.ts
 * ✅ DIRECTORIO: Sincronizado a /src/services/ai/
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
// ✅ Importaciones corregidas a la carpeta 'ai'
import translateService from "../services/ai/translateService";
import speechService from "../services/ai/speechService";
import { logger } from "../utils/logger";

/**
 * 🎨 PALETA MENCIONAL OLED (10 Colores Oficiales)
 * Utilizados para identificar visualmente quién tiene el turno.
 */
const MENCIONAL_COLORS = [
  '#00FBFF', // Cian Neón (Principal)
  '#39FF14', // Verde Neón
  '#FF007A', // Rosa Neón
  '#B026FF', // Violeta
  '#FF5F1F', // Naranja
  '#FFD700', // Oro
  '#FF3131', // Rojo
  '#BCFF00', // Lima
  '#00E5FF', // Turquesa
  '#FFF01F'  // Amarillo
];

export const useTurnController = (
  participants: any[] = [], 
  mode: 'INDIVIDUAL' | 'DUO' | 'TRIO' = 'INDIVIDUAL'
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(6); // Ventana de 6s
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * 🌈 IDENTIFICADOR CROMÁTICO
   * Vincula al participante con su color OLED para el "Aura" de la sesión.
   */
  const currentParticipant = useMemo(() => {
    if (participants.length > 0 && participants[currentIndex]) {
      return {
        ...participants[currentIndex],
        color: MENCIONAL_COLORS[currentIndex % MENCIONAL_COLORS.length]
      };
    }
    return { 
      id: 'NODE-MASTER', 
      name: 'OPERADOR', 
      color: MENCIONAL_COLORS[0] 
    };
  }, [currentIndex, participants]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextTurn = useCallback(() => {
    setIsExecuting(false);
    setCurrentIndex((prev) => (prev + 1) % (participants.length || 1));
  }, [participants.length]);

  const startTurnTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(6);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          // Rotación automática si no es modo individual
          if (mode !== 'INDIVIDUAL' && participants.length > 1) {
            logger.info("TURN_CONTROL", "Rotación automática por ventana de 6s agotada.");
            nextTurn();
          } else {
            // Reinicio en modo individual para mantener el flujo constante
            setTimeLeft(6);
            startTurnTimer();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [mode, participants.length, nextTurn, stopTimer]);

  /**
   * 🚀 EXECUTE_TURN_ACTIONS
   * Procesa la traducción y dispara la doble repetición de la voz Aoede.
   */
  const executeTurnActions = async (text: string, targetLang: string) => {
    if (isExecuting || !text.trim()) return "";
    
    stopTimer(); // Pausa técnica para procesamiento AI
    setIsExecuting(true);

    try {
      // 1. Traducción vía /services/ai/
      const translated = await translateService.translateText(text, targetLang, 'learning');
      
      if (translated) {
        // 🔊 AUDIO_FIJACIÓN_X2: El motor Aoede maneja la repetición doble internamente
        await speechService.speak(translated, { 
          lang: targetLang, 
          mode: 'learning' 
        });
      }

      // 🔄 Gestión de Turnos tras el habla
      if (mode !== 'INDIVIDUAL' && participants.length > 1) {
        nextTurn();
      } else {
        setIsExecuting(false);
      }
      
      startTurnTimer();
      return translated;
    } catch (error) {
      logger.error("TURN_EXECUTION_FAILED", "Fallo en flujo de traducción/audio.");
      setIsExecuting(false);
      startTurnTimer();
      return "";
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    startTurnTimer();
    return () => stopTimer();
  }, [startTurnTimer, stopTimer]);

  return {
    currentIndex,
    currentParticipant,
    isExecuting,
    timeLeft,
    executeTurnActions,
    nextTurn,
    startTurnTimer,
    stopTimer,
    MENCIONAL_COLORS
  };
};

export default useTurnController;