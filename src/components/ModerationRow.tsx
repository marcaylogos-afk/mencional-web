/**
 * 🛡️ MENCIONAL | MODERATION_ROW v2026.12
 * Protocolo: Tarjeta Amarilla y Expulsión (Layout Horizontal Único)
 * Seguridad: Identificación por Fingerprint y Hash de Pago vinculado a Mercado Pago
 * ✅ DIRECTORIO AI: Alineado con /src/services/ai/
 * Foco: Producción 2026 | OLED OPTIMIZED
 */

import React, { useCallback } from 'react';
import { useAuth } from '../hooks/useAuth'; 
import { SecurityEngine } from '../services/data/SecurityEngine';
import { AlertTriangle, UserMinus, Shield, Fingerprint } from 'lucide-react';

interface ModerationProps {
  /** ID único del participante (SessionID/Fingerprint) a moderar */
  targetNodeId: string;
  /** Nombre o alias para el log de auditoría visual */
  targetName?: string;
}

export const ModerationRow: React.FC<ModerationProps> = ({ targetNodeId, targetName }) => {
  // Solo accesible mediante el rol validado (Password: "osos")
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  /**
   * 🛑 RESTRICCIÓN DE ROL:
   * Solo el Administrador puede ver esta fila de moderación.
   * Se oculta automáticamente para mantener la interfaz limpia para los participantes.
   */
  if (!isAdmin) return null;

  /**
   * ⚡ PROTOCOLOS DE SANCIÓN TÉCNICA
   */
  const handleModeration = useCallback(async (type: 'YELLOW' | 'EXPEL') => {
    try {
      if (type === 'EXPEL') {
        /**
         * 🔒 PROTOCOLO DE EXPULSIÓN:
         * 1. Registro de violación en el SecurityEngine (Blacklist).
         * 2. Emisión de evento de purga para desconexión inmediata del nodo.
         */
        await SecurityEngine.registerViolation(targetNodeId);
        
        console.warn(`[SECURITY] Nodo ${targetNodeId} expulsado del sistema Mencional.`);
        
        // Disparo de purga en tiempo real (Socket/Firebase)
        window.dispatchEvent(new CustomEvent('MENCIONAL_NODE_PURGE', { 
          detail: { nodeId: targetNodeId, reason: 'SECURITY_VIOLATION' } 
        }));
        
      } else {
        /**
         * ⚠️ ADVERTENCIA (TARJETA AMARILLA):
         * Marca al usuario visualmente sin interrumpir su flujo de 20 min.
         */
        console.log(`[MODERATION] Advertencia enviada a: ${targetName || targetNodeId}`);
        await SecurityEngine.flagNode(targetNodeId);
        
        window.dispatchEvent(new CustomEvent('MENCIONAL_NODE_FLAG', { 
          detail: { nodeId: targetNodeId, type: 'WARNING' } 
        }));
      }
    } catch (err) {
      console.error("Falla en el motor de moderación neural:", err);
    }
  }, [targetNodeId, targetName]);

  return (
    <div className="w-full bg-[#020202] border-y border-white/[0.03] py-3 px-6 flex items-center justify-between transition-all animate-in fade-in slide-in-from-top-1 duration-700 selection:bg-rose-500/30 group/row">
      
      {/* 📊 IDENTIFICACIÓN DEL NODO (IZQUIERDA) */}
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="hidden sm:flex p-2 bg-zinc-950 rounded-xl border border-white/5 group-hover/row:border-cyan-500/20 transition-colors">
          <Fingerprint size={14} className="text-cyan-400/30 group-hover/row:text-cyan-400 transition-colors" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-[1000] text-zinc-300 uppercase tracking-[0.2em] leading-none truncate max-w-[150px]">
            {targetName || 'Unidentified_Node'}
          </span>
          <span className="text-[7px] font-mono text-zinc-700 uppercase tracking-tighter">
            NODE_ID: {targetNodeId.substring(0, 14)}...
          </span>
        </div>
      </div>

      {/* 🎮 CONTROLES DE ACCIÓN (DERECHA) */}
      <div className="flex flex-row gap-3">
        
        {/* BOTÓN: ADVERTIR (YELLOW CARD) */}
        <button 
          onClick={() => handleModeration('YELLOW')}
          className="group flex items-center gap-2 px-4 py-2 bg-[#080808] border border-amber-500/10 rounded-full transition-all hover:bg-amber-500/10 hover:border-amber-500/40 active:scale-90"
        >
          <AlertTriangle size={11} className="text-amber-500/20 group-hover:text-amber-500 transition-colors" />
          <span className="text-amber-500/20 group-hover:text-amber-500 text-[8px] font-black uppercase tracking-[0.1em]">
            Advertir
          </span>
        </button>

        {/* BOTÓN: EXPULSAR (FORFEIT PROTOCOL) */}
        <button 
          onClick={() => handleModeration('EXPEL')}
          className="group flex items-center gap-2 px-4 py-2 bg-[#080808] border border-rose-600/10 rounded-full transition-all hover:bg-rose-600/10 hover:border-rose-600/40 active:scale-90"
        >
          <UserMinus size={11} className="text-rose-600/20 group-hover:text-rose-600 transition-colors" />
          <span className="text-rose-600/20 group-hover:text-rose-600 text-[8px] font-black uppercase tracking-[0.1em]">
            Expulsar
          </span>
        </button>

        {/* INDICADOR DE PROTECCIÓN SHIELD */}
        <div className="flex items-center ml-2 pl-4 border-l border-white/5 opacity-20">
          <Shield size={14} className="text-[#00FBFF]" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ModerationRow);