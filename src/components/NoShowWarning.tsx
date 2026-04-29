/**
 * 🛰️ MENCIONAL | NO_SHOW_WARNING v2026.6
 * Ubicación: /src/components/NoShowWarning.tsx
 * Objetivo: Gestión de inasistencia, strikes y confiscación de saldo ($20 MXN).
 * ✅ DIRECTORIO AI: Alineado con /src/services/ai/
 * Foco: Producción 2026 | OLED OPTIMIZED
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Activity, Clock, ShieldAlert, AlertTriangle } from 'lucide-react';

interface NoShowWarningProps {
  /** Indica si la sesión debe cerrarse inmediatamente */
  isCritical?: boolean;
  /** Contador de faltas: 0 a 3 (3 = FORFEIT_SALDO) */
  strikeCount?: number; 
  /** Callback ejecutado al agotar los 5 minutos de tolerancia */
  onTimeout?: () => void;
}

const NoShowWarning: React.FC<NoShowWarningProps> = ({ 
  isCritical = false, 
  strikeCount = 0,
  onTimeout 
}) => {
  // Protocolo v2026.6: Tolerancia de 5 minutos (300 segundos)
  const [secondsLeft, setSecondsLeft] = useState(300); 

  /**
   * ⏲️ TIMER_ENGINE
   * Controla la cuenta regresiva. Si llega a 0, se dispara la lógica de liberación de cupo.
   */
  useEffect(() => {
    // Si ya perdió el saldo (Strike 3) o es crítico, el timer se detiene.
    if (strikeCount >= 3 || isCritical) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeout) onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout, strikeCount, isCritical]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const isForfeited = strikeCount >= 3;

  return (
    <div className="w-full flex items-center justify-center p-[5%] font-sans selection:bg-rose-500/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`
          relative overflow-hidden w-full max-w-[460px] rounded-[4rem] sm:rounded-[5rem] p-12 sm:p-16 text-center backdrop-blur-3xl transition-all duration-1000
          ${isForfeited 
            ? 'bg-black border-2 border-rose-600 shadow-[0_0_120px_rgba(225,29,72,0.25)]' 
            : 'bg-[#030303] border border-white/5 shadow-2xl'}
        `}
      >
        {/* 🧬 FX: RESPLANDOR AMBIENTAL (OLED OPTIMIZED) */}
        <div 
          className="absolute -top-40 -left-40 w-96 h-96 blur-[150px] pointer-events-none opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: isForfeited ? '#E11D48' : '#00FBFF' }} 
        />

        <div className="relative z-10">
          {/* 🔘 INDICADOR DE ESTADO CENTRAL */}
          <div className="flex justify-center mb-12">
            <div className={`p-10 sm:p-12 rounded-[3.5rem] bg-black/60 border transition-all duration-1000 ${
              isForfeited 
                ? 'text-rose-500 border-rose-900/50 shadow-[0_0_60px_rgba(244,63,94,0.3)]' 
                : 'text-[#00FBFF] border-white/5'
            }`}>
              <AnimatePresence mode="wait">
                {isForfeited ? (
                  <motion.div 
                    key="forfeit" 
                    initial={{ opacity: 0, rotate: -20 }} 
                    animate={{ opacity: 1, rotate: 0 }}
                  >
                    <ShieldAlert className="w-14 h-14 sm:w-20 sm:h-20" strokeWidth={1} />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="active" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <Radio className="w-14 h-14 sm:w-20 sm:h-20 animate-pulse" strokeWidth={1} />
                    <motion.div 
                      animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="absolute inset-0 border-2 border-[#00FBFF] rounded-full" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 🏷️ HEADER DE SISTEMA */}
          <header className="space-y-5 mb-12">
            <h3 className={`text-[12px] font-[1000] tracking-[0.8em] uppercase transition-colors duration-1000 ${
              isForfeited ? 'text-rose-500' : 'text-[#00FBFF]'
            }`}>
              {isForfeited ? 'SALDO_CONFISCADO' : 'SYNC_INTERRUMPIDA'}
            </h3>
            <div className={`h-[3px] w-20 mx-auto rounded-full transition-all duration-1000 ${
              isForfeited ? 'bg-rose-600' : 'bg-[#00FBFF]/30'
            }`} />
          </header>

          {/* 📄 MENSAJE LOGÍSTICO */}
          <div className="space-y-10 mb-14">
            <div className="flex flex-col gap-5 px-4">
               <p className={`text-[13px] font-black tracking-widest leading-relaxed uppercase transition-colors ${
                 isForfeited ? 'text-rose-200/50' : 'text-zinc-600'
               }`}>
                 {isForfeited 
                   ? "S3_CRITICAL: Se han agotado los intentos de enlace neural. El depósito de $20 MXN ha sido bloqueado permanentemente por inactividad recurrente." 
                   : "Falta de actividad detectada. El sistema liberará su nodo en 5 minutos para evitar un cargo por No-Show."}
               </p>
               {isForfeited && (
                 <div className="flex flex-col gap-2 italic">
                   <span className="text-[11px] text-rose-500 font-black tracking-[0.3em] uppercase animate-pulse">
                     Acceso Revocado
                   </span>
                   <span className="text-[9px] text-zinc-800 font-bold uppercase tracking-[0.2em]">
                     Código Error: FORFEIT_STRK_3
                   </span>
                 </div>
               )}
            </div>

            {!isForfeited && !isCritical && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex flex-col items-center gap-3 bg-black/40 border border-white/5 p-10 rounded-[3rem] w-full"
              >
                <div className="flex items-center gap-3 opacity-30 mb-2">
                  <Clock size={16} className="text-[#00FBFF]" />
                  <span className="text-[10px] font-[1000] uppercase tracking-[0.5em] text-white">Ventana_Tolerancia</span>
                </div>
                <span className="text-5xl sm:text-6xl font-[1000] font-mono text-white tracking-widest tabular-nums italic">
                  {formatTime(secondsLeft)}
                </span>
              </motion.div>
            )}
          </div>

          {/* 📊 DASHBOARD DE STRIKES (SISTEMA BINARIO) */}
          <footer className="space-y-12">
            <div className="flex flex-col items-center gap-8 w-full max-w-[300px] mx-auto">
              <div className="flex items-center gap-3">
                <AlertTriangle size={14} className={isForfeited ? 'text-rose-600' : 'text-zinc-900'} />
                <span className={`text-[11px] font-[1000] uppercase tracking-[0.6em] select-none ${isForfeited ? 'text-rose-900' : 'text-zinc-900'}`}>
                  Mencional_Strikes
                </span>
              </div>
              <div className="flex gap-5 w-full h-3">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s} 
                    className={`flex-1 rounded-full transition-all duration-1000 ${
                      s <= strikeCount 
                        ? 'bg-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.7)]' 
                        : 'bg-[#111111]'
                    }`} 
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 opacity-30">
               <div className="flex items-center gap-4">
                  <Activity size={16} className="text-zinc-700" />
                  <p className="text-[10px] font-[1000] tracking-[0.8em] uppercase text-zinc-700">
                    Sincronización_Nodo_Maestro
                  </p>
               </div>
            </div>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(NoShowWarning);