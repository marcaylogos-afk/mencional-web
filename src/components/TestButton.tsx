/**
 * 🛰️ PRE_FLIGHT_PANEL v16.0 - STABLE PRODUCTION
 * Configuración de hardware e identidad protegida antes de la sesión.
 * Ubicación: /src/components/ai/PreFlightPanel.tsx
 * Estado: ZERO_DEVELOPMENT_LOGS | OLED OPTIMIZED
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, User, Volume2, Shield, 
  ChevronRight, Sparkles, Lock, Cpu
} from 'lucide-react';

interface UserSettings {
  name: string;
  privacy: 'protected' | 'anonymous';
  audioLevel: number;
  interfaceMode: 'ultra';
}

interface PreFlightPanelProps {
  onConfirm: (settings: UserSettings) => void;
  initialName?: string;
}

export const PreFlightPanel: React.FC<PreFlightPanelProps> = ({ 
  onConfirm, 
  initialName = "" 
}) => {
  const [name, setName] = useState(initialName);
  const [privacy, setPrivacy] = useState<'protected' | 'anonymous'>('protected');
  const [audioLevel, setAudioLevel] = useState(85);

  const handleComplete = () => {
    // Sincronización con el núcleo global de la sesión MENCIONAL
    onConfirm({
      name: name || "User_Node",
      privacy,
      audioLevel,
      interfaceMode: 'ultra'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="w-full max-w-2xl mx-auto select-none p-4 italic"
    >
      <div className="relative overflow-hidden bg-[#000000] border border-white/5 rounded-[3rem] md:rounded-[3.5rem] p-8 md:p-14 shadow-[0_50px_100px_rgba(0,0,0,1)]">
        
        {/* --- CAPA TÉCNICA: CARBON FIBER & GLOW --- */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#00FBFF]/5 via-transparent to-transparent pointer-events-none" />

        {/* --- HEADER DE CALIBRACIÓN --- */}
        <header className="flex items-center justify-between mb-12 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-3.5 bg-[#00FBFF]/10 rounded-2xl border border-[#00FBFF]/20 shadow-[0_0_20px_rgba(0,251,255,0.1)]">
              <Settings size={18} className="text-[#00FBFF] animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <h2 className="text-[11px] font-[1000] text-white uppercase tracking-[0.5em] leading-none">
                Pre_Flight_Sync
              </h2>
              <p className="text-[7px] text-zinc-600 font-black uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
                <Cpu size={8} /> Stable_Build_v16.PROD
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/5 bg-zinc-950/50">
            <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_8px_#39FF14]" />
            <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">Hardware: OK</span>
          </div>
        </header>

        <div className="space-y-10 relative z-10">
          
          {/* --- CAMPO: IDENTIDAD OPERATIVA --- */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <User size={10} className="text-[#00FBFF]" />
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Alias_Operativo</label>
            </div>
            <div className="relative group">
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="INGRESAR_ID_NODO"
                className="w-full bg-[#050505] border-2 border-white/5 rounded-[2rem] px-8 py-6 text-base md:text-lg font-black text-white placeholder:text-zinc-900 focus:outline-none focus:border-[#00FBFF]/30 transition-all duration-500 uppercase italic tracking-widest shadow-inner"
              />
              <Sparkles size={16} className="absolute right-8 top-1/2 -translate-y-1/2 text-[#00FBFF] opacity-10 group-focus-within:opacity-100 group-focus-within:animate-pulse transition-opacity" />
            </div>
          </section>

          {/* --- CAMPO: MASTER GAIN (AUDIO) --- */}
          <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <Volume2 size={10} className="text-[#00FBFF]" />
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Master_Gain</label>
              </div>
              <span className="font-mono text-[10px] font-black text-[#00FBFF] tracking-[0.2em]">{audioLevel}%</span>
            </div>
            <div className="px-2">
              <input 
                type="range" 
                min="0" max="100" 
                value={audioLevel}
                onChange={(e) => setAudioLevel(parseInt(e.target.value))}
                className="custom-range w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#00FBFF]"
              />
            </div>
          </section>

          {/* --- CAMPO: PROTOCOLO DE PRIVACIDAD --- */}
          <section className="grid grid-cols-2 gap-4">
            {[
              { id: 'protected', label: 'Protected', desc: 'E2E_Encrypted', icon: Lock },
              { id: 'anonymous', label: 'Ghost_Mode', desc: 'Zero_Metadata', icon: Shield }
            ].map((mode) => {
              const isSelected = privacy === mode.id;
              const isGhost = mode.id === 'anonymous';
              return (
                <button 
                  key={mode.id}
                  type="button"
                  onClick={() => setPrivacy(mode.id as any)}
                  className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col gap-4 items-start relative overflow-hidden group ${
                    isSelected 
                    ? isGhost 
                      ? 'bg-[#00FBFF] border-[#00FBFF] text-black shadow-[0_0_30px_rgba(0,251,255,0.2)]' 
                      : 'bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                    : 'bg-zinc-950 border-white/5 text-zinc-600 hover:border-white/10'
                  }`}
                >
                  <mode.icon size={16} className={isSelected ? 'animate-pulse' : 'opacity-40'} />
                  <div className="text-left relative z-10">
                    <p className="text-[10px] font-black uppercase italic tracking-tighter">{mode.label}</p>
                    <p className="text-[7px] font-black opacity-60 uppercase mt-1 tracking-widest">{mode.desc}</p>
                  </div>
                </button>
              );
            })}
          </section>
        </div>

        {/* --- ACCIÓN FINAL: LINK NEURAL --- */}
        <div className="mt-14">
          <button 
            type="button"
            onClick={handleComplete}
            disabled={!name}
            className={`w-full py-8 rounded-[2.5rem] flex items-center justify-center gap-4 font-[1000] uppercase tracking-[0.6em] text-[11px] transition-all duration-700 shadow-2xl relative overflow-hidden group border-2 ${
              name 
              ? 'bg-white text-black border-white hover:bg-[#00FBFF] hover:border-[#00FBFF] active:scale-[0.98]' 
              : 'bg-zinc-950 text-zinc-800 cursor-not-allowed border-white/5'
            }`}
          >
            {name && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            )}
            <span className="relative z-10">Confirm_Neural_Link</span>
            <ChevronRight size={18} className={name ? "animate-pulse relative z-10" : "relative z-10"} />
          </button>
        </div>

      </div>

      <footer className="mt-8 flex flex-col items-center gap-2 opacity-30">
        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[1em]">
          Identity_Verified_Secure_Boot
        </p>
      </footer>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .custom-range::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: #00FBFF;
          border-radius: 50%;
          border: 3px solid #000;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 251, 255, 0.5);
        }
        .custom-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #00FBFF;
          border-radius: 50%;
          border: 3px solid #000;
          cursor: pointer;
        }
      `}</style>
    </motion.div>
  );
};

export default PreFlightPanel;