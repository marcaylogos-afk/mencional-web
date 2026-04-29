/**
 * 🛰️ MENCIONAL | AUDIO_DUCKING_HOOK v2026.PROD
 * Ubicación: /src/hooks/useAudioDucking.ts
 * Función: Control de volumen inteligente y bloqueo de micro para evitar eco.
 * Protocolo: Reducción al 15% durante síntesis neural Aoede.
 * ✅ DIRECTORIO AI: Sincronizado con /services/ai/
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '../utils/logger'; 

export const useAudioDucking = (initialVolume: number = 1.0) => {
  const [isDucking, setIsDucking] = useState(false);
  const [duckingVolume, setDuckingVolume] = useState(initialVolume);
  
  // Referencia para gestionar transiciones suaves sin colisiones de hilos
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * 📉 applyPhysicalDucking
   * Modifica el volumen real de todos los elementos multimedia en el DOM con fade-in/out.
   */
  const applyPhysicalDucking = useCallback((targetVolume: number) => {
    if (typeof document === 'undefined') return;
    
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const mediaElements = document.querySelectorAll('video, audio');
    
    mediaElements.forEach((el) => {
      const media = el as HTMLMediaElement;
      const startVol = media.volume;
      const steps = 10;
      const stepValue = (targetVolume - startVol) / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const newVal = startVol + (stepValue * currentStep);
        
        // Clamp del valor entre 0 y 1 para estabilidad del hardware
        media.volume = Math.max(0, Math.min(1, newVal));
        
        if (currentStep >= steps) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          media.volume = targetVolume;
        }
      }, 20); // Transición de 200ms para evitar clics de audio (pop noise)
    });
  }, []);

  /**
   * 📉 duckAudio
   * Baja el volumen ambiental y activa el flag de "IA hablando".
   */
  const duckAudio = useCallback(() => {
    try {
      setIsDucking(true);
      setDuckingVolume(0.15); // Nivel de seguridad para evitar feedback del micro
      applyPhysicalDucking(0.15);
      
      // 🛡️ FLAG DE SEGURIDAD: Bloquea el procesamiento ASR mientras la IA habla
      sessionStorage.setItem('mencional_is_speaking', 'true');
      
      logger.info("DUCKING", "Prioridad: Voz Aoede Activa (Atenuación 15%)");
    } catch (error) {
      logger.error("DUCKING_START_ERROR", `Error al iniciar atenuación: ${error}`);
    }
  }, [applyPhysicalDucking]);

  /**
   * 📈 restoreAudio
   * Restablece niveles tras la intervención de la IA con delay de seguridad.
   */
  const restoreAudio = useCallback(() => {
    // Delay de 400ms para evitar solapamiento con la cola del audio
    setTimeout(() => {
      setDuckingVolume(initialVolume);
      setIsDucking(false);
      applyPhysicalDucking(initialVolume);
      
      // Liberamos el flujo para el siguiente ciclo de escucha (ASR habilitado)
      sessionStorage.setItem('mencional_is_speaking', 'false');
      
      logger.info("DUCKING", "Niveles normalizados. Hardware de escucha liberado.");
    }, 400); 
  }, [initialVolume, applyPhysicalDucking]);

  /**
   * 🧠 Listener de Eventos Globales
   * Sincronizado con el nuevo directorio /services/ai/
   */
  useEffect(() => {
    const handleStart = () => duckAudio();
    const handleEnd = () => restoreAudio();

    // Eventos emitidos por el SpeechService centralizado en /ai/
    window.addEventListener('ai-speech-start', handleStart);
    window.addEventListener('ai-speech-end', handleEnd);

    return () => {
      window.removeEventListener('ai-speech-start', handleStart);
      window.removeEventListener('ai-speech-end', handleEnd);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [duckAudio, restoreAudio]);

  return { isDucking, duckingVolume, duckAudio, restoreAudio };
};

/**
 * ✨ DuckingIndicator (Componente UI HUD)
 * Renderiza el ecualizador cian neón optimizado para OLED.
 */
export const DuckingIndicator: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  
  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] pointer-events-none px-4">
      <div className="bg-black/90 backdrop-blur-3xl border border-[#00FBFF]/40 px-5 py-2.5 rounded-full flex items-center gap-4 shadow-[0_0_50px_rgba(0,251,255,0.2)]">
        
        {/* Ecualizador Animado Cian Neón */}
        <div className="flex gap-1.5 items-end h-3 mb-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="w-1 bg-[#00FBFF] rounded-full animate-audio-pulse"
              style={{ 
                animationDelay: `${i * 0.12}s`,
                boxShadow: '0 0 12px rgba(0, 251, 255, 0.8)'
              }}
            />
          ))}
        </div>

        <span className="text-[10px] font-black text-[#00FBFF] uppercase tracking-[0.4em] italic leading-none">
          Prioridad_Voz
        </span>
      </div>
      
      <style>{`
        @keyframes audio-pulse {
          0%, 100% { height: 4px; opacity: 0.3; }
          50% { height: 14px; opacity: 1; }
        }
        .animate-audio-pulse {
          animation: audio-pulse 0.6s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
    </div>
  );
};