/**
 * 🏁 FINALIZATION_NOTICE v2026.PROD (STABLE) - MENCIONAL
 * Ubicación: /src/views/FinalizationNotice.tsx
 * Objetivo: Calificación de afinidad, purga de sesión y renovación de bloque.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db as rtdb } from '../services/ai/firebaseConfig'; 
import { ref, set, serverTimestamp } from 'firebase/database';
import { 
  UserMinus, 
  UserPlus, 
  ShieldCheck,
  Activity,
  CheckCircle2,
  RefreshCcw,
  AlertCircle,
  LogOut,
  Zap
} from 'lucide-react';
import { logger } from '../utils/logger';
import { useSettings } from '../context/SettingsContext';
import { ttsService } from '../services/ai/geminiTTS';
import { useAuth } from '../context/AuthProvider';

interface Participant {
  id: string;
  name: string;
}

interface FinalizationNoticeProps {
  participants?: Participant[];
  currentUserId?: string;
  sessionId?: string;
  onFinish?: () => void;
}

export const FinalizationNotice: React.FC<FinalizationNoticeProps> = ({
  participants = [],
  currentUserId = "anon",
  sessionId = "SESS-UNKNOWN",
  onFinish
}) => {
  const { themeColor, resetSettings } = useSettings();
  const { logout } = useAuth(); // Integrado para cierre de sesión real
  const [ratings, setRatings] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  // Link oficial de renovación de sesión ($20 MXN / 20 Min)
  const RENEWAL_LINK = "https://mpago.la/2fPScDJ";

  /**
   * 🛡️ GESTIÓN DE AFINIDAD (Blacklist Proactiva)
   * Registra el bloqueo en Firebase para que el sistema de emparejamiento
   * no los vuelva a unir en el futuro.
   */
  const handleRate = async (targetId: string, isPositive: boolean) => {
    setRatings(prev => ({ ...prev, [targetId]: isPositive }));

    if (!isPositive && rtdb) {
      try {
        const blacklistRef = ref(rtdb, `users/${currentUserId}/blacklist/${targetId}`);
        await set(blacklistRef, {
          timestamp: serverTimestamp(),
          session: sessionId,
          protocol: "v2026_affinity_purge",
          reason: "negative_feedback_auto_block"
        });
        logger.info("AFFINITY", `Nodo ${targetId} bloqueado exitosamente.`);
      } catch (error) {
        logger.error("SYNC", "Fallo al registrar bloqueo en Firebase.");
      }
    }
  };

  const otherParticipants = participants.filter(p => p.id !== currentUserId);
  const allParticipantsRated = otherParticipants.length === Object.keys(ratings).length;

  /**
   * 🧹 PROTOCOLO DE PURGA FINAL
   * Detiene el audio, limpia el estado global y desconecta el nodo.
   */
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // 🔇 Silencio inmediato
    ttsService.stop();
    logger.info("PURGE", "Protocolo de silencio y purga iniciado.");

    // Simulación de "Handshake" final con el servidor
    setTimeout(async () => {
      setSyncComplete(true);
      
      // Limpieza de persistencia local
      localStorage.removeItem('payment_verified');
      localStorage.removeItem('active_node_session');
      
      // Reseteo de contexto global y Logout
      resetSettings();
      await logout();

      setTimeout(() => {
        if (onFinish) {
          onFinish();
        } else {
          window.location.href = '/';
        }
      }, 1200);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black flex items-center justify-center p-6 select-none overflow-hidden font-sans">
      
      {/* 🌌 FONDO NEURAL (Optimizado OLED) */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[100px] rounded-full" 
          style={{ backgroundColor: `${themeColor}` }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[440px] bg-[#050505] border border-white/10 rounded-[3.5rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative z-10"
      >
        <header className="text-center mb-10">
          <div className="flex justify-center gap-3 mb-6">
            <Zap style={{ color: themeColor }} className="w-5 h-5 fill-current" />
            <ShieldCheck className="text-zinc-800 w-5 h-5" />
          </div>
          <h2 className="text-white font-[1000] text-3xl uppercase tracking-tighter italic leading-none mb-3">
            SESIÓN <span style={{ color: themeColor }} className="block text-5xl not-italic">TERMINADA</span>
          </h2>
          <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.6em] italic">
            ID_PURGE_PROTOCOL_V.2.6
          </p>
        </header>

        {/* CALIFICACIÓN DE NODOS */}
        <div className="space-y-4 mb-10">
          {otherParticipants.length > 0 && (
            <p className="text-zinc-500 text-[9px] font-black uppercase italic text-center tracking-widest mb-4">
              Calidad de Sincronización:
            </p>
          )}
          
          {otherParticipants.length > 0 ? (
            otherParticipants.map((p) => (
              <div key={p.id} className="p-5 rounded-[2rem] border border-white/5 bg-zinc-950/50 backdrop-blur-md">
                <div className="flex justify-between items-center mb-4 px-2">
                  <span className="text-white font-black uppercase text-[10px] tracking-widest">{p.name}</span>
                  <span className="text-[7px] text-zinc-700 font-bold uppercase">NODE_{p.id.substring(0,6)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleRate(p.id, true)} 
                    className={`py-3 rounded-[1.2rem] text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                      ratings[p.id] === true ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-600'
                    }`}
                  >
                    <UserPlus size={12} /> Óptimo
                  </button>
                  <button 
                    onClick={() => handleRate(p.id, false)} 
                    className={`py-3 rounded-[1.2rem] text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                      ratings[p.id] === false ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-zinc-900 text-zinc-600'
                    }`}
                  >
                    <UserMinus size={12} /> Bloquear
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 border-2 border-dashed border-zinc-900 rounded-[2.5rem] text-center italic text-zinc-800 uppercase font-black text-[9px] tracking-[0.4em]">
              Solo_Node_Flow
            </div>
          )}
        </div>

        {/* ACCIONES DE SALIDA O RENOVACIÓN */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!allParticipantsRated && otherParticipants.length > 0}
            onClick={() => window.open(RENEWAL_LINK, '_blank')}
            style={{ backgroundColor: themeColor }}
            className="w-full py-6 rounded-[2rem] text-black font-[1000] uppercase italic text-[11px] flex items-center justify-center gap-4 transition-all shadow-xl disabled:opacity-20"
          >
            <RefreshCcw size={16} /> Renovar Bloque 20 Min
          </motion.button>

          <button
            disabled={(!allParticipantsRated && otherParticipants.length > 0) || isSubmitting}
            onClick={handleFinalSubmit}
            className={`w-full py-6 rounded-[2rem] font-black uppercase italic text-[11px] transition-all border-2 flex items-center justify-center gap-3 ${
              syncComplete 
                ? 'bg-green-500 border-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-500'
            } disabled:opacity-10`}
          >
            {isSubmitting ? (
              <Activity size={16} className="animate-spin" />
            ) : syncComplete ? (
              <CheckCircle2 size={16} /> Éxito
            ) : (
              <>
                <LogOut size={16} /> Finalizar y Salir
              </>
            )}
          </button>
        </div>

        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-rose-500/60"
        >
          <AlertCircle size={10} />
          <p className="text-[7px] font-black uppercase tracking-[0.2em] italic">
            El nodo se desconectará permanentemente.
          </p>
        </motion.div>
      </motion.div>

      {/* SCANLINES (Efecto TV retro sutil) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
    </div>
  );
};

export default FinalizationNotice;