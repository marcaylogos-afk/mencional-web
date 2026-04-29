/**
 * 🕹️ MENCIONAL | REFLEX_PANEL v2026.PROD
 * Panel de control táctico para sesiones de interpretación neural y moderación.
 * Ubicación: /src/components/ReflexPanel.tsx
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pause, 
  FastForward, 
  LogOut, 
  Loader2, 
  Activity, 
  ShieldCheck, 
  Play,
  AlertCircle,
  UserX,
  Clock
} from 'lucide-react';

export type LearningSessionState = 'idle' | 'running' | 'paused' | 'finished';

interface ReflexPanelProps {
  state: LearningSessionState;
  loading: boolean;
  appMode?: 'LEARNING' | 'INTERPRETER' | 'ROMPEHIELO';
  timeLeft: number; // Segundos restantes sincronizados con el backend
  isAdmin?: boolean;
  onStart: () => void;
  onPause: () => void;
  onNext: () => void;
  onExit: () => void;
  onYellowCard?: () => void; 
  onExpel?: () => void;      
}

const ReflexPanel: React.FC<ReflexPanelProps> = ({
  state,
  loading,
  appMode = 'LEARNING',
  timeLeft,
  isAdmin = false,
  onStart,
  onPause,
  onNext,
  onExit,
  onYellowCard,
  onExpel,
}) => {
  const isPaused = state === 'paused' || state === 'idle';
  const isFinished = state === 'finished';
  const isRunning = state === 'running';

  /**
   * 🧠 PROTOCOLO DE TIEMPOS MENCIONAL
   * 6s: Impacto Visual (Modo Aprendizaje)
   * 19s: Ciclo de Sugerencias (Ideas/Rompehielo)
   */
  const progressDuration = appMode === 'LEARNING' ? 6 : 19;

  // Alerta visual OLED: Rojo Neón en los últimos 5 minutos
  const isTimeLow = timeLeft <= 300; 
  
  const formattedTime = useMemo(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }, [timeLeft]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto select-none font-sans relative px-4 pb-10">
      
      {/* ⏳ RELOJ DE SINCRONIZACIÓN (SINCRO_NODE) */}
      <div className="flex justify-center">
        <motion.div 
          animate={isTimeLow ? { scale: [1, 1.05, 1], opacity: [1, 0.7, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`flex items-center gap-3 px-6 py-2 rounded-full border-2 transition-all duration-700 ${
          isTimeLow 
            ? 'bg-rose-600/10 border-rose-500 text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]' 
            : 'bg-black border-white/10 text-zinc-500'
        }`}>
          <Clock size={14} className={isRunning ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-black font-mono tracking-[0.3em] italic">
            {isFinished ? 'NODO_FINALIZADO' : `SYNC_TIME: ${formattedTime}`}
          </span>
        </motion.div>
      </div>

      {/* 🧊 CONTENEDOR TÁCTICO OLED */}
      <div className="relative p-2 bg-black border border-white/5 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden transition-all duration-500 hover:border-white/20">
        
        {/* BARRA DE PROGRESO NEURAL (Sincronizada 6s/19s) */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              key={appMode} // Reiniciar si cambia el modo
              initial={{ width: "0%", opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: progressDuration, ease: "linear", repeat: Infinity }}
              className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-cyan-900 via-cyan-400 to-cyan-900 shadow-[0_0_15px_#00FBFF] z-0"
            />
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 relative z-10">
          {/* 🔘 ACCIÓN MAESTRA */}
          <button
            onClick={isPaused ? onStart : onPause}
            disabled={loading || isFinished}
            className={`flex-[4] flex items-center justify-center gap-4 py-10 rounded-[3.5rem] font-black text-[10px] uppercase tracking-[0.5em] transition-all duration-700 relative group
              ${isPaused 
                ? 'bg-white text-black hover:bg-cyan-400 hover:scale-[1.02]' 
                : 'bg-[#0A0A0A] text-zinc-600 border border-white/5 hover:border-cyan-400/20'} 
              disabled:opacity-20 active:scale-95`}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin text-cyan-400" />
            ) : isPaused ? (
              <>
                <Play size={18} fill="currentColor" className="transition-transform group-hover:scale-110" /> 
                <span className="italic">{state === 'idle' ? 'Vincular_Nodo' : 'Reanudar'}</span>
              </>
            ) : (
              <>
                <Pause size={18} fill="currentColor" className="animate-pulse" /> 
                <span className="italic text-cyan-400">Sincronizando...</span>
              </>
            )}
          </button>

          {/* ⏭️ MANUAL BYPASS */}
          <button
            onClick={onNext}
            disabled={loading || isFinished || state === 'idle'}
            className="flex-1 flex items-center justify-center py-10 rounded-[3.5rem] bg-[#050505] border border-white/5 text-zinc-800 hover:text-white hover:border-white/20 active:scale-90 transition-all"
          >
            <FastForward size={20} />
          </button>

          {/* 🚪 TERMINATE (Desconexión Segura) */}
          <button
            onClick={onExit}
            className="p-10 rounded-[3.5rem] bg-transparent hover:bg-rose-500/5 group transition-all"
          >
            <LogOut size={20} className="text-zinc-900 group-hover:text-rose-500 group-hover:rotate-12 transition-all duration-500" />
          </button>
        </div>
      </div>

      {/* 🛡️ SECCIÓN DE INTEGRIDAD (ADMIN ONLY) */}
      <AnimatePresence>
        {isAdmin && isRunning && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-row justify-center gap-3"
          >
            <button 
              onClick={onYellowCard}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#080808] border border-yellow-500/10 rounded-3xl text-[9px] font-black text-yellow-500/40 uppercase tracking-[0.3em] hover:bg-yellow-500/10 hover:text-yellow-500 transition-all duration-500"
            >
              <AlertCircle size={14} /> Advertencia
            </button>
            
            <button 
              onClick={onExpel}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#080808] border border-rose-500/10 rounded-3xl text-[9px] font-black text-rose-500/40 uppercase tracking-[0.3em] hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-500"
            >
              <UserX size={14} /> Bloquear_Nodo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📊 TELEMETRÍA DE ESTADO */}
      <div className="flex flex-row justify-between items-center px-12 mt-2 opacity-20">
        <div className="flex items-center gap-3">
          <Activity size={12} className="text-cyan-400" />
          <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">CORE: {appMode}</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">SYNC: ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ReflexPanel);