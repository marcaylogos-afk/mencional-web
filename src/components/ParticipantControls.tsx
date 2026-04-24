/**
 * 🛠️ MENCIONAL | PARTICIPANT_CONTROLS v2026.5
 * Objetivo: Moderación horizontal y ejecución de sanciones por hardware.
 * Regla: 3 expulsiones = Bloqueo 7 días | 3 reportes = Baneo Global.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, UserX, Flag, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; 
import { SecurityEngine } from '../services/data/SecurityEngine';

interface ParticipantControlsProps {
  targetParticipantId: string;
  targetName: string;
}

const ParticipantControls: React.FC<ParticipantControlsProps> = ({ 
  targetParticipantId, 
  targetName 
}) => {
  const { isAdmin, deviceId } = useAuth(); // deviceId es el Fingerprint de hardware
  const [hasActioned, setHasActioned] = useState(false);

  // Los administradores ("osos") tienen inmunidad y no ven estos controles.
  if (isAdmin) return null;

  /**
   * 🚫 Protocolo Tarjeta Roja (Expulsión)
   * 3 expulsiones en 24h -> Bloqueo temporal de 7 días.
   */
  const handleExpulsion = async () => {
    const confirmMessage = `¿EXPULSAR A ${targetName.toUpperCase()}?\n\nAcción: Registro de Strike.\nRegla: 3 strikes en 24h resultan en baneo de 7 días.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await SecurityEngine.applyExpulsionStrike(targetParticipantId);
        // Veto silencioso inmediato para evitar re-emparejamiento.
        await SecurityEngine.registerNegativeRating(deviceId, targetParticipantId);
        setHasActioned(true);
      } catch (error) {
        console.error("Falla en el protocolo de expulsión:", error);
      }
    }
  };

  /**
   * 🚩 Protocolo Bloqueo Global (Reporte)
   * 3 reportes válidos -> Bloqueo permanente de dispositivo y método de pago.
   */
  const handleReport = async () => {
    const confirmReport = `¿REPORTAR PARA BLOQUEO GLOBAL?\n\nDestino: ${targetName.toUpperCase()}.\nRegla: 3 reportes = Baneo permanente de hardware y cuenta de Mercado Pago.`;
    
    if (window.confirm(confirmReport)) {
      try {
        await SecurityEngine.registerReportOrNoShow(targetParticipantId, 'REPORT');
        await SecurityEngine.registerNegativeRating(deviceId, targetParticipantId);
        setHasActioned(true);
      } catch (error) {
        console.error("Falla en el registro de reporte global:", error);
      }
    }
  };

  return (
    <AnimatePresence>
      {!hasActioned ? (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 p-3 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] z-50 shadow-2xl"
        >
          {/* Advertencia Preventiva (Normas de Convivencia) */}
          <button 
            className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-yellow-500/70 hover:text-yellow-400 px-4 py-2 transition-all"
            onClick={() => alert(`ADVERTENCIA ENVIADA A ${targetName.toUpperCase()}.\nNormas: Prohibido acoso, discriminación u ofensas.`)}
          >
            <AlertTriangle size={14} />
            <span className="hidden sm:inline">Advertir</span>
          </button>
          
          <div className="w-[1px] h-4 bg-white/10" />
          
          {/* Botón de Expulsión (Strike) */}
          <button 
            className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-600/10 px-4 py-2 rounded-xl transition-all"
            onClick={handleExpulsion}
          >
            <UserX size={14} />
            <span>Expulsar</span>
          </button>

          <div className="w-[1px] h-4 bg-white/10" />

          {/* Botón de Reporte (Baneo Permanente) */}
          <button 
            className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:text-white px-4 py-2 transition-all"
            onClick={handleReport}
          >
            <ShieldAlert size={14} />
            <span className="hidden sm:inline">Baneo Global</span>
            <span className="sm:hidden">Reportar</span>
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 rounded-full flex items-center gap-3 shadow-xl"
        >
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="text-[9px] font-black uppercase tracking-widest">Sanción Sincronizada</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ParticipantControls;