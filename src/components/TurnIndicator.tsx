/**
 * 💡 MENCIONAL | TURN_INDICATOR v23.5.PROD
 * Estado: PRODUCCIÓN ESTABLE - OLED OPTIMIZED
 * Función: Visualización de turnos por color, barra de fijación de 6s y alertas.
 * Ubicación: /src/components/TurnIndicator.tsx
 */

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mic, Radio, Clock, AlertCircle, Zap } from "lucide-react";

interface TurnIndicatorProps {
  participantName: string;
  isActive?: boolean; // Opcional, controlado por isUserTurn
  isUserTurn: boolean;
  colorCode: string;    // Ejemplo: #00FBFF, #FF00FF, etc.
  remainingTime: number; // Tiempo total de la sesión en segundos
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  participantName,
  isUserTurn,
  colorCode,
  remainingTime,
}) => {
  
  // 🕒 Alertas de tiempo: 5 min (aviso) y 1 min (crítico)
  const isTimeLow = remainingTime <= 300;
  const isCritical = remainingTime <= 60;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Estilos de resplandor optimizados para pantallas OLED (Pure Black)
  const activeStyles = useMemo(() => ({
    boxShadow: `0 0 40px ${colorCode}33, inset 0 0 20px ${colorCode}11`,
    borderColor: `${colorCode}66`,
    glowBackground: `radial-gradient(circle at 0% 0%, ${colorCode}15, transparent 70%)`
  }), [colorCode]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: isUserTurn ? 1 : 0.98,
        borderColor: isUserTurn ? activeStyles.borderColor : "rgba(255,255,255,0.05)",
        backgroundColor: isUserTurn ? "#000000" : "rgba(5,5,5,0.4)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={`relative p-7 md:p-10 rounded-[2.5rem] border-2 transition-all duration-700 overflow-hidden backdrop-blur-xl italic ${
        isUserTurn 
          ? "z-20 shadow-2xl" 
          : "z-10 opacity-40 grayscale-[0.5] blur-[0.5px]"
      }`}
    >
      {/* 🌌 EFECTO DE PROFUNDIDAD NEURAL */}
      <AnimatePresence>
        {isUserTurn && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: activeStyles.glowBackground }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between relative z-10 gap-6">
        <div className="flex items-center gap-6">
          
          {/* 📡 NEURAL PULSE HUB */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            <AnimatePresence>
              {isUserTurn && (
                <>
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    className="absolute inline-flex h-full w-full rounded-2xl"
                    style={{ backgroundColor: colorCode }}
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-6px] border border-dashed rounded-2xl opacity-20"
                    style={{ borderColor: colorCode }}
                  />
                </>
              )}
            </AnimatePresence>
            
            <motion.div 
              animate={isUserTurn ? { y: [0, -4, 0] } : {}}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative flex items-center justify-center rounded-2xl h-12 w-12 shadow-2xl"
              style={{
                backgroundColor: isUserTurn ? colorCode : "#111",
                boxShadow: isUserTurn ? `0 0 30px ${colorCode}66` : "none",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              {isUserTurn ? (
                <Mic size={24} className="text-black stroke-[3px]" />
              ) : (
                <Radio size={20} className="text-zinc-700" />
              )}
            </motion.div>
          </div>

          {/* 👤 ETIQUETAS DE IDENTIDAD */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span 
                className="text-[10px] font-black tracking-[0.3em] uppercase"
                style={{ color: isUserTurn ? colorCode : "#52525b" }}
              >
                {isUserTurn ? "INTERVENCIÓN_ACTIVA" : "EN_ESPERA"}
              </span>
              {isUserTurn && (
                <Zap size={10} className="text-yellow-400 fill-yellow-400 animate-pulse" />
              )}
            </div>
            
            <h3 className={`text-2xl md:text-4xl font-[1000] uppercase tracking-tighter leading-none transition-all duration-500 ${
              isUserTurn ? "text-white" : "text-zinc-800"
            }`}>
              {isUserTurn ? "TU TURNO" : participantName}
            </h3>

            {isUserTurn && (
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck size={12} className="text-[#00FBFF]" />
                <span className="text-[9px] font-bold text-[#00FBFF]/70 uppercase tracking-[0.2em]">
                  Encrypted_Node_{participantName.slice(0,3).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 📟 CRONÓMETRO DE SESIÓN */}
        <div className="flex flex-col items-end gap-1.5">
          <motion.div 
            animate={isTimeLow ? { 
              boxShadow: isCritical ? ["0 0 0px #ef4444", "0 0 20px #ef4444", "0 0 0px #ef4444"] : "none" 
            } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-500 ${
              isTimeLow 
                ? 'bg-red-950/20 border-red-500/50 text-red-500 shadow-lg' 
                : 'bg-white/5 border-white/5 text-zinc-500'
            }`}
          >
            {isTimeLow ? <AlertCircle size={18} className="animate-bounce" /> : <Clock size={18} />}
            <span className="font-mono text-xl font-black tracking-tighter tabular-nums">
              {formatTime(remainingTime)}
            </span>
          </motion.div>
          
          <AnimatePresence>
            {isTimeLow && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[9px] font-black text-red-500/60 tracking-[0.3em] uppercase"
              >
                BLOQUE_30_MIN
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 〰️ PROGRESS BAR: PROTOCOLO 6 SEGUNDOS (Sincronización AI) */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/60 overflow-hidden">
        <AnimatePresence>
          {isUserTurn && (
            <motion.div
              key="cycle-bar-6s"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 6, // Protocolo exacto de 6 segundos
                ease: "linear",
                repeat: Infinity 
              }}
              className="h-full relative shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              style={{ backgroundColor: colorCode }}
            >
              {/* Flare de movimiento */}
              <div className="absolute right-0 top-0 h-full w-8 bg-white/40 blur-md" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TurnIndicator;