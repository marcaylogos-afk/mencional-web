/**
 * ⏱️ MENCIONAL | TIMER_DISPLAY v2026.PROD
 * Visualizador de Sincronía Neural y Ciclos de Carga.
 * Protocolos: 19s (Ultra) | 6s (Mencional) | 4s (Rompehielo)
 * Ubicación: /src/components/TimerDisplay.tsx
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Activity, Zap } from 'lucide-react';

interface TimerDisplayProps {
  mode: 'LEARNING' | 'INTERPRETER' | 'REFLEX'; 
  isTranslating: boolean;
  accentColor?: string;
  initialMinutes?: number; // Por defecto 60 según protocolo de recaudación v2.6
  onFinish?: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  mode, 
  isTranslating, 
  accentColor = "#00FBFF", // Cian OLED
  initialMinutes = 60,      // Sesión completa de 1 hora ($50 MXN)
  onFinish
}) => {
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(initialMinutes * 60);

  /**
   * ⏱️ PROTOCOLO MENCIONAL DE CICLOS NEURALES:
   * Define la ráfaga de escucha antes de disparar Gemini/Cache.
   */
  const cycleTime = useMemo(() => {
    switch (mode) {
      case 'INTERPRETER': return 19; 
      case 'LEARNING':    return 6;  
      case 'REFLEX':      return 4;  
      default:            return 6;
    }
  }, [mode]);

  // 🔄 Manejador del Ciclo Neural (Progreso Circular)
  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();
    
    const updateTimer = () => {
      if (sessionSeconds <= 0) return;

      const elapsed = (Date.now() - startTime) / 1000;
      const currentCyclePosition = elapsed % cycleTime;
      const currentProgress = (currentCyclePosition / cycleTime) * 100;
      
      setProgress(currentProgress);
      setSecondsLeft(Math.ceil(cycleTime - currentCyclePosition));
      
      animationFrame = requestAnimationFrame(updateTimer);
    };

    animationFrame = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationFrame);
  }, [cycleTime, sessionSeconds]);

  // 🕒 Manejador de la Sesión Global (60 min)
  useEffect(() => {
    if (sessionSeconds <= 0) {
      onFinish?.();
      return;
    }
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionSeconds, onFinish]);

  // Alertas visuales de Telemetría
  const isWarningTime = sessionSeconds <= 600; // 10 min: Alerta Preventiva
  const isCriticalTime = sessionSeconds <= 300; // 5 min: Pulso Rosa (Crítico)
  
  const formatSessionTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'INTERPRETER': return 'ULTRA-MENCIONAL';
      case 'LEARNING':    return 'MENCIONAL';
      case 'REFLEX':      return 'ROMPEHIELO';
      default:            return 'SISTEMA';
    }
  };

  return (
    <div 
      className="flex flex-row items-center gap-8 select-none bg-[#000000] p-5 pl-8 rounded-[3rem] border-2 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,1)] transition-all duration-700 italic group"
      style={{ borderColor: isCriticalTime ? 'rgba(244,63,94,0.5)' : 'rgba(255,255,255,0.06)' }}
    >
      
      {/* 📊 INDICADOR CIRCULAR (AI PULSE) */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 scale-110">
          <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.02)" strokeWidth="4" fill="transparent" />
          <motion.circle
            cx="56" cy="56" r="48"
            stroke={isTranslating ? "#39FF14" : (isCriticalTime ? "#F43F5E" : accentColor)}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 48}
            animate={{ 
              strokeDashoffset: (2 * Math.PI * 48) - ((2 * Math.PI * 48) * progress) / 100,
            }}
            transition={{ ease: "linear", duration: 0.1 }}
            style={{ 
              filter: `drop-shadow(0 0 15px ${isTranslating ? "#39FF14" : (isCriticalTime ? "#F43F5E" : accentColor)})`,
            }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span 
              key={secondsLeft}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-4xl font-[1000] text-white tabular-nums leading-none tracking-tighter italic"
            >
              {secondsLeft}s
            </motion.span>
          </AnimatePresence>
          <span className="text-[8px] font-black text-zinc-600 tracking-[0.5em] mt-1 uppercase italic">Sync</span>
        </div>
      </div>

      {/* 📋 INFORMACIÓN DE ESTADO */}
      <div className="flex flex-col gap-1 pr-4">
        <div className="flex items-center gap-2 mb-1">
          {isWarningTime ? (
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 1 }}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isCriticalTime ? 'bg-rose-500/10 border-rose-500/40' : 'bg-orange-500/10 border-orange-500/40'}`}
            >
              <AlertTriangle size={10} className={isCriticalTime ? "text-rose-500" : "text-orange-500"} />
              <span className={`text-[8px] font-black uppercase tracking-widest italic ${isCriticalTime ? 'text-rose-500' : 'text-orange-500'}`}>
                {isCriticalTime ? 'Neural_Link_Expiring' : 'Session_Limit_Near'}
              </span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <Zap size={10} style={{ color: accentColor }} className="fill-current" />
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest italic">
                {getModeLabel()}_Mode
              </span>
            </div>
          )}

          {isTranslating && (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full shadow-[0_0_15px_rgba(57,255,20,0.1)]">
              <Activity size={10} className="text-[#39FF14] animate-pulse" />
              <span className="text-[8px] font-black text-[#39FF14] uppercase tracking-widest italic">Burst</span>
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-3">
          <span className={`text-6xl font-[1000] tracking-tighter tabular-nums leading-none transition-colors duration-1000 ${isCriticalTime ? 'text-rose-600' : 'text-white'}`}>
            {formatSessionTime(sessionSeconds)}
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] italic leading-none">Global</span>
            <span className="text-[8px] font-bold text-zinc-800 uppercase tracking-widest mt-1 italic">PROD_26</span>
          </div>
        </div>

        {/* 📊 BARRAS DE FRECUENCIA (NEURAL VISUALIZER) */}
        <div className="flex gap-1 mt-4 items-end h-4">
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i} 
              animate={isTranslating ? { 
                height: [4, Math.random() * 16 + 4, 4],
                backgroundColor: ["#18181b", "#39FF14", "#18181b"]
              } : { 
                height: (progress / 8.33) > i ? 8 : 4,
                backgroundColor: (progress / 8.33) > i ? accentColor : "#18181b"
              }}
              transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.03 }}
              className="w-2 rounded-full" 
              style={{ 
                boxShadow: (progress / 8.33) > i && !isTranslating 
                  ? `0 0 10px ${accentColor}33` 
                  : (isTranslating ? `0 0 12px #39FF1444` : 'none') 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;