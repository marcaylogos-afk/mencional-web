/**
 * 🎙️ MENCIONAL | NEURAL_VOICE_HOOK v20.0 - PRODUCTION
 * Orquestador de Audio: Ciclos de 19s, Turnos de 6s y Audio Ducking Aoede.
 * Ubicación: /src/hooks/useSessionVoice.ts
 * ✅ DIRECTORIO: Sincronizado a /src/services/ai/
 */

import { useState, useEffect, useCallback, useRef } from 'react';
// ✅ Importación de utilidades vinculadas al motor de inteligencia artificial
import { playTTS } from '../services/ai/ttsService'; 
import { logger } from '../utils/logger';

export const useSessionVoice = (initialSeconds: number = 1200) => {
  // --- ⏳ ESTADOS DE TIEMPO Y SESIÓN ---
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTurnTime, setCurrentTurnTime] = useState(0);
  const [lastNeuralSync, setLastNeuralSync] = useState(0);

  // --- 🎧 REFS PARA CONTROL DE AUDIO (DUCKING) ---
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const turnIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 🛠️ INICIALIZACIÓN DE AUDIO CONTEXT
   * Configura el nodo de ganancia para el efecto Ducking (atenuación inteligente).
   */
  const initAudio = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }
      
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch (error) {
      logger.error("AUDIO_INIT_FAIL", `Error al inicializar hardware de audio: ${error}`);
    }
  }, []);

  /**
   * 🕒 RELOJ MAESTRO (Bloque de 20 min)
   * Sincroniza la expiración del bloque con el HUD OLED.
   */
  useEffect(() => {
    if (timeLeft <= 0) {
      logger.warn("SESSION", "Bloque de tiempo agotado.");
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
      // Acumulador para el ciclo de 19s (Modo Intérprete Ultra)
      setLastNeuralSync(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  /**
   * 🎤 CONTROL DE TURNO (6 Segundos - Protocolo Aprendizaje)
   * Gestiona la ventana de escucha activa para evitar captación de ruido infinito.
   */
  const startTurnTimer = useCallback(() => {
    if (turnIntervalRef.current) clearInterval(turnIntervalRef.current);
    
    setCurrentTurnTime(6);
    turnIntervalRef.current = setInterval(() => {
      setCurrentTurnTime(prev => {
        if (prev <= 1) {
          if (turnIntervalRef.current) clearInterval(turnIntervalRef.current);
          setIsMicActive(false); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  /**
   * 🦆 AUDIO DUCKING & SÍNTESIS AOEDE
   * Reduce el volumen de otros procesos (música/ambiente) mientras la IA habla.
   */
  const triggerNeuralSync = useCallback(async (textToSpeak: string) => {
    if (isProcessing || !textToSpeak) return;

    setIsProcessing(true);
    initAudio(); 

    try {
      // 📉 DUCKING ON: Atenuación al 20% (Fade Out rápido en 0.2s para OLED Focus)
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.2, audioContextRef.current.currentTime, 0.2);
      }

      // Ejecución de Voz Aoede (1.15x para balance entre naturalidad y fluidez)
      await playTTS(textToSpeak, { 
        voice: 'Aoede', 
        speed: 1.15, 
        ducking: true 
      });

      // 📈 DUCKING OFF: Restaurar volumen (Fade In suave en 0.5s)
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(1.0, audioContextRef.current.currentTime, 0.5);
      }
    } catch (error) {
      logger.error("VOICE_SYNC_ERROR", `Fallo en síntesis Aoede: ${error}`);
    } finally {
      setIsProcessing(false);
      setLastNeuralSync(0); // Reset del ciclo neural tras la intervención
    }
  }, [isProcessing, initAudio]);

  /**
   * 🕒 FORMATEADOR DE TIEMPO OLED
   */
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Limpieza de hardware y procesos al desmontar para evitar Memory Leaks
  useEffect(() => {
    return () => {
      if (turnIntervalRef.current) clearInterval(turnIntervalRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => logger.error("AUDIO_CLEANUP", e));
      }
    };
  }, []);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isMicActive,
    setMicActive: (active: boolean) => {
      setIsMicActive(active);
      if (active) {
        initAudio();
        startTurnTimer();
      }
    },
    isProcessing,
    currentTurnTime,
    // Dispara efectos visuales de alerta cuando quedan 5 min (300s)
    isCritical: timeLeft <= 300 && timeLeft > 0, 
    triggerNeuralSync,
    lastNeuralSync 
  };
};

export default useSessionVoice;