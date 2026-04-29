/**
 * 🛡️ POST_SESSION_RATING v20.0 - MENCIONAL
 * Estado: PRODUCCIÓN 2026 | OLED NEON
 * Protocolo: Moderación Neural y Aislamiento de Nodos.
 * Ubicación: /src/pages/PostSessionRating.tsx
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  UserX, 
  CheckCircle2, 
  ArrowRight, 
  ThumbsUp, 
  Cpu,
  Lock,
  Fingerprint
} from 'lucide-react';

// ✅ Sincronización con tu estructura de carpetas real
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth'; 
import { logger } from '../utils/logger';

// ✅ Estilos para OLED y Neón
import '../styles/OLED_Dynamics.css';

interface Participant {
  id: string;
  name: string;
}

const PostSessionRating: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const { ignoreParticipant } = useAuth(); 
  
  // Color de acento dinámico (Turquesa Neón por defecto)
  const themeColor = useMemo(() => settings?.selectedColor?.hex || '#00FBFF', [settings]);
  
  // Recuperación de participantes con nodos de respaldo
  const [participants] = useState<Participant[]>(() => {
    return location.state?.participants || [
      { id: "NODE_ALPHA_SYNC", name: "Alpha_Partner" },
      { id: "NODE_BETA_SYNC", name: "Beta_Collaborator" }
    ];
  });
  
  const [ratedParticipants, setRatedParticipants] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * 🛡️ MOTOR DE AISLAMIENTO PERSISTENTE
   */
  const handleRating = useCallback(async (participantId: string, isPositive: boolean) => {
    if (ratedParticipants.includes(participantId) || isProcessing) return;
    
    setIsProcessing(true);

    try {
      // Feedback táctil
      if (navigator.vibrate) navigator.vibrate(15);

      if (!isPositive) {
        // Bloqueo persistente
        await ignoreParticipant(participantId);
        logger.info(`NODE_ISOLATED: El nodo ${participantId} ha sido filtrado.`);
      } else {
        logger.info(`SYNERGY_UP: Feedback positivo para ${participantId}.`);
      }
      
      setRatedParticipants(prev => [...prev, participantId]);
    } catch (error) {
      logger.error("MODERATION_FAULT", error);
    } finally {
      setIsProcessing(false);
    }
  }, [ratedParticipants, isProcessing, ignoreParticipant]);

  const handleFinish = () => {
    logger.info("SESSION_CLOSED: Ciclo finalizado.");
    navigate('/selector', { replace: true }); 
  };

  const progress = (ratedParticipants.length / participants.length) * 100;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white select-none relative overflow-hidden font-sans">
      
      {/* 🌌 ATMÓSFERA OLED (Resplandor sutil de fondo) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(circle at center, ${themeColor}, transparent 70%)` }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-zinc-950/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] z-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]"
      >
        {/* Barra de Progreso Neural */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5">
          <motion.div 
            className="h-full"
            style={{ backgroundColor: themeColor, boxShadow: `0 0 15px ${themeColor}` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        </div>

        <header className="mb-12 text-center space-y-4">
          <motion.div 
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto border border-white/10 shadow-2xl"
          >
            <Cpu style={{ color: themeColor }} size={28} strokeWidth={1} />
          </motion.div>
          
          <div className="space-y-1">
            <h1 className="text-[28px] font-black uppercase italic tracking-tighter leading-none">
              SESIÓN_<span style={{ color: themeColor }}>OFFLINE</span>
            </h1>
            <div className="flex items-center justify-center gap-2 opacity-30 mt-2">
               <Fingerprint size={10} style={{ color: themeColor }} />
               <p className="text-[7px] uppercase tracking-[0.5em] font-black italic">
                 Moderation_Node_Validation
               </p>
            </div>
          </div>
        </header>

        {/* Lista de Nodos / Participantes */}
        <div className="space-y-3 mb-12 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {participants.map((p) => (
              <motion.div 
                key={p.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-5 rounded-[1.8rem] border transition-all duration-500 flex items-center justify-between ${
                  ratedParticipants.includes(p.id) 
                  ? 'bg-black/80 border-white/5 opacity-25 scale-[0.97]' 
                  : 'bg-zinc-900/20 border-white/5 hover:border-white/10 shadow-xl'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-black tracking-widest uppercase italic text-zinc-100">
                    {p.name}
                  </span>
                  <span className="text-[7px] font-mono text-zinc-700 uppercase tracking-[0.2em]">
                    NODE_ID // {p.id.substring(0, 14)}
                  </span>
                </div>

                {ratedParticipants.includes(p.id) ? (
                  <CheckCircle2 className="text-emerald-500/50" size={18} />
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleRating(p.id, true)}
                      className="w-11 h-11 bg-zinc-100 text-black rounded-2xl flex items-center justify-center hover:bg-emerald-400 transition-all active:scale-90"
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <button 
                      onClick={() => handleRating(p.id, false)}
                      className="w-11 h-11 bg-zinc-950 border border-white/5 text-zinc-600 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-90 group"
                    >
                      <UserX size={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer de Acción */}
        <footer className="relative">
          <button 
            onClick={handleFinish}
            disabled={ratedParticipants.length < participants.length}
            className={`w-full h-16 rounded-full transition-all duration-700 flex items-center justify-center font-black uppercase tracking-[0.4em] text-[9px] group ${
              ratedParticipants.length < participants.length 
              ? 'bg-zinc-900/50 text-zinc-700 cursor-not-allowed' 
              : 'text-black shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95'
            }`}
            style={{ 
              backgroundColor: ratedParticipants.length >= participants.length ? themeColor : undefined 
            }}
          >
            <span className="relative z-10 italic flex items-center gap-3">
              {ratedParticipants.length < participants.length ? (
                <>
                  <Lock size={12} className="opacity-30" />
                  Moderación_Pendiente
                </>
              ) : (
                <>
                  Sincronizar_y_Cerrar
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </footer>
      </motion.div>

      {/* Identificador de Seguridad v2026 */}
      <footer className="mt-12 flex flex-col items-center gap-2 opacity-20">
        <div className="flex items-center gap-3 px-6 py-2 bg-zinc-900/20 rounded-full border border-white/5">
          <ShieldAlert size={10} style={{ color: themeColor }} />
          <span className="text-[7px] uppercase tracking-[0.6em] font-black italic">
            Safety_Protocol_v26.PROD
          </span>
        </div>
      </footer>

      {/* Estilo para la scrollbar OLED */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${themeColor}; }
      `}</style>
    </div>
  );
};

export default PostSessionRating;