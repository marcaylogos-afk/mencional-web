/**
 * 🛰️ MENCIONAL | PARTICIPANTS_LIST v2026.5
 * Ubicación: /src/components/ParticipantsList.tsx
 * Objetivo: Monitoreo de nodos conectados y telemetría de latencia.
 * Foco: Producción 2026 | OLED OPTIMIZED
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, Wifi, ShieldCheck, Zap, Cpu } from 'lucide-react';

export interface Participant {
  id: string;
  name: string;
  role: 'admin' | 'student' | 'ai_guide';
  latency: number; // ms
  status: 'active' | 'idle' | 'linking';
}

interface ParticipantsListProps {
  participants: Participant[];
  maxParticipants?: number;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ 
  participants, 
  maxParticipants = 3 
}) => {
  return (
    <div className="w-full space-y-6 font-sans selection:bg-cyan-500/30">
      
      {/* 📊 HEADER DE TELEMETRÍA */}
      <div className="flex justify-between items-end px-4">
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-[1000] text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
            <Activity size={14} className="text-[#00FBFF] animate-pulse" /> 
            Nodos_Enlazados
          </h4>
          <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.2em] italic">
            Sync_Protocol: Mencional_v2.6
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-[#00FBFF]/40 font-[1000] italic tracking-tighter">
            {participants.length} / {maxParticipants} UNITS_SYNCED
          </span>
        </div>
      </div>

      {/* 🧬 LISTA DE NODOS (GRID DINÁMICO) */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {participants.map((p, index) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 30 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                delay: index * 0.08 
              }}
              className={`
                relative overflow-hidden flex items-center justify-between p-6 rounded-[2.5rem] border transition-all duration-1000
                ${p.role === 'admin' 
                  ? 'bg-[#050505] border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.08)]' 
                  : 'bg-black border-white/5 shadow-2xl hover:border-white/10'}
              `}
            >
              <div className="flex items-center gap-6 relative z-10">
                {/* 🔘 AVATAR TÉCNICO */}
                <div className="relative">
                  <div className={`
                    p-4 rounded-2xl border-2 transition-all duration-700
                    ${p.role === 'admin' 
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                      : 'bg-[#080808] text-zinc-600 border-white/5'}
                  `}>
                    {p.role === 'admin' ? <ShieldCheck size={20} strokeWidth={3} /> : <User size={20} />}
                  </div>
                  {p.status === 'active' && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00FBFF] rounded-full border-4 border-black animate-pulse" />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className={`text-[14px] font-[1000] uppercase tracking-widest ${p.role === 'admin' ? 'text-emerald-400 italic' : 'text-white'}`}>
                    {p.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${p.role === 'admin' ? 'text-emerald-500/40' : 'text-zinc-800'}`}>
                      {p.role === 'admin' ? 'MASTER_NODE' : 'NEURAL_UNIT_ACTIVE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 📡 TELEMETRÍA DE RED */}
              <div className="flex items-center gap-8 relative z-10">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-3">
                    <Wifi size={14} className={p.latency < 60 ? 'text-[#00FBFF]' : p.latency < 120 ? 'text-amber-500' : 'text-rose-600'} />
                    <span className="text-[12px] font-mono font-[1000] text-white italic tracking-tighter">
                      {p.latency}<span className="text-[8px] opacity-20 ml-1 font-sans">ms</span>
                    </span>
                  </div>
                  <p className="text-[8px] font-black text-zinc-900 uppercase tracking-widest mt-1">Ping_Protocol</p>
                </div>
                
                <div className="p-3 bg-zinc-950 rounded-full border border-white/5">
                  {p.status === 'active' ? (
                    <Zap size={18} className="text-[#00FBFF] fill-[#00FBFF] animate-pulse opacity-60" />
                  ) : (
                    <Cpu size={18} className="text-zinc-900" />
                  )}
                </div>
              </div>

              {/* FX: ESCANEO DE LÍNEA (Solo Admin) */}
              {p.role === 'admin' && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent"
                  animate={{ x: ['-150%', '150%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 🧩 SLOT DE ESPERA (Placeholder) */}
        {participants.length < maxParticipants && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-zinc-900 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-5 transition-all hover:border-zinc-800 group bg-black/20"
          >
            <div className="w-12 h-12 rounded-full border border-zinc-900 flex items-center justify-center group-hover:scale-110 group-hover:border-[#00FBFF]/30 transition-all duration-500">
              <span className="text-zinc-800 text-lg font-black group-hover:text-[#00FBFF]">+</span>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.5em] italic group-hover:text-zinc-700 transition-colors">
                Buscando_Nodo_Neural...
              </p>
              <p className="text-[8px] text-zinc-900 uppercase tracking-[0.2em]">Slot_{participants.length + 1}_Disponible</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 🛡️ FOOTER DE SEGURIDAD */}
      <footer className="pt-8 flex items-center justify-center gap-6 opacity-20">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-900" />
        <div className="flex items-center gap-3">
          <ShieldCheck size={10} className="text-zinc-700" />
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.8em]">Mencional_Sync_Guard</span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-900" />
      </footer>
    </div>
  );
};

export default ParticipantsList;