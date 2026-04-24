/**
 * 🗂️ MENCIONAL | PHRASE_ACCORDION v2026.PROD
 * Registro de telemetría vocal con soporte Mixed Case y estética OLED.
 * Ubicación: /src/components/PhraseAccordion.tsx
 * ✅ DIRECTORIO AI: Sincronizado con arquitectura /src/services/ai/
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Zap, 
  Clock, 
  Disc, 
  Languages, 
  Activity, 
  Layers 
} from 'lucide-react';

interface Phrase {
  original: string;    // Input detectado por ASR
  translated: string;  // Salida procesada por Gemini en /ai/
  timestamp: string;
}

interface PhraseAccordionProps {
  phrases: Phrase[];
  mode?: 'learning' | 'ultra' | 'rompehielo';
}

/**
 * ✨ toMixedCase
 * Transforma el "Screaming Case" del reconocimiento de voz a lectura natural.
 * Vital para reducir la fatiga visual en fondos #000000.
 */
const toMixedCase = (text: string) => {
  if (!text) return "";
  const cleaned = text.trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
};

const PhraseAccordion: React.FC<PhraseAccordionProps> = ({ 
  phrases, 
  mode = 'learning' 
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = useCallback((index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  }, []);

  // Etiquetas de Nodo Maestro sincronizadas con instructionEngine
  const modeLabels = {
    learning: "Mencional_Aprendizaje",
    ultra: "Ultra-Mencional_Intérprete",
    rompehielo: "Rompehielo_Social"
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-sans select-none pb-32 px-4 relative">
      
      {/* --- HEADER DE TELEMETRÍA --- */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 px-8 gap-6 relative z-20">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-[#050505] rounded-2xl border border-white/5 shadow-2xl relative group">
            <Disc size={20} className="text-[#00FBFF] animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-0 bg-[#00FBFF]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[13px] font-[1000] uppercase tracking-[0.7em] text-white italic leading-none">
              Registro_Vocal
            </h3>
            <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-[0.5em] mt-2.5">
              Protocolo_AI: {modeLabels[mode]}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 px-8 py-3.5 bg-[#00FBFF]/5 border border-[#00FBFF]/10 rounded-full backdrop-blur-3xl">
          <Languages size={14} className="text-[#00FBFF]" />
          <span className="text-[10px] font-black text-[#00FBFF] uppercase tracking-[0.25em]">
            Neural_Link_Activo
          </span>
        </div>
      </header>

      {/* --- LISTA DE INTERVENCIONES --- */}
      <div className="space-y-5 relative z-10">
        <AnimatePresence mode="popLayout">
          {phrases.length === 0 ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 text-center border border-dashed border-white/5 rounded-[4rem] bg-zinc-950/10"
            >
              <Activity size={32} className="mx-auto text-zinc-900 mb-8 animate-pulse" />
              <p className="text-[10px] font-black uppercase text-zinc-800 tracking-[0.8em]">
                Aguardando_Input_Vocal...
              </p>
            </motion.div>
          ) : (
            phrases.map((phrase, index) => (
              <motion.div 
                key={`${phrase.timestamp}-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  overflow-hidden transition-all duration-700 rounded-[3rem] border
                  ${openIndex === index 
                    ? 'bg-[#060606] border-[#00FBFF]/30 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] z-20 scale-[1.02]' 
                    : 'bg-black border-white/[0.02] hover:border-white/10 z-10'}
                `}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex items-center justify-between px-10 py-10 outline-none group"
                >
                  <div className="flex items-center gap-8 overflow-hidden text-left">
                    <div className="flex flex-col items-center">
                      <Clock size={12} className={openIndex === index ? 'text-[#00FBFF]' : 'text-zinc-800'} />
                      <span className={`text-[11px] font-mono font-black mt-1 ${openIndex === index ? 'text-[#00FBFF]' : 'text-zinc-700'}`}>
                        {phrase.timestamp}
                      </span>
                    </div>
                    
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] mb-2">
                        {mode === 'learning' ? 'Tu_Voz_Natal' : 'Input_Original'}
                      </span>
                      <span className={`text-lg md:text-2xl font-bold truncate max-w-xl italic ${openIndex === index ? 'text-white' : 'text-zinc-600'}`}>
                        "{toMixedCase(phrase.original)}"
                      </span>
                    </div>
                  </div>
                  
                  <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }}>
                    <ChevronDown size={28} className={openIndex === index ? "text-[#00FBFF]" : "text-zinc-900"} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <div className="px-8 pb-10 md:px-12 md:pb-12 pt-0">
                        <div className="p-10 md:p-14 bg-black rounded-[3.5rem] border border-[#00FBFF]/10 relative overflow-hidden shadow-inner ring-1 ring-[#00FBFF]/5">
                          
                          <div className="relative z-10 text-left">
                            <div className="flex items-center gap-5 mb-10">
                              <div className="p-4 rounded-2xl bg-[#00FBFF]/10 border border-[#00FBFF]/20 shadow-[0_0_20px_rgba(0,251,255,0.1)]">
                                <Zap size={20} className="text-[#00FBFF] fill-[#00FBFF]" />
                              </div>
                              <div className="flex flex-col">
                                <p className="text-[11px] font-[1000] text-[#00FBFF] uppercase tracking-[0.7em] leading-none">
                                  {mode === 'learning' ? 'Inferencia_Mencional' : mode === 'ultra' ? 'Ultra_Fidelity' : 'Social_Output'}
                                </p>
                                <span className="text-[8px] text-zinc-700 uppercase font-bold mt-2.5 tracking-widest">
                                  {mode === 'learning' ? 'Procesado_en_ai/translateService' : 'Motor_Ultra_Activo'}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-4xl md:text-6xl font-[1000] text-white leading-[1] tracking-tighter italic mb-12">
                              {toMixedCase(phrase.translated)}
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                               <div className="px-6 py-3 bg-zinc-900/40 rounded-full border border-white/5 flex items-center gap-3">
                                 <Layers size={10} className="text-zinc-600" />
                                 <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Sync_Verified</span>
                               </div>
                               <div className="px-6 py-3 bg-[#00FBFF]/5 rounded-full border border-[#00FBFF]/10 flex items-center gap-3">
                                 <Activity size={10} className="text-[#00FBFF]/50" />
                                 <span className="text-[9px] font-black text-[#00FBFF]/50 uppercase tracking-widest italic">OLED_Optimized</span>
                               </div>
                            </div>
                          </div>

                          {/* Aura de profundidad para paneles OLED */}
                          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#00FBFF]/5 blur-[100px] rounded-full pointer-events-none" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <footer className="pt-32 flex flex-col items-center gap-4 opacity-20">
        <span className="text-[9px] font-black uppercase tracking-[1.5em] text-zinc-800">
          Neural_Log_Terminated // Mencional_Core_v2.6
        </span>
      </footer>

      {/* Glow de fondo constante para contraste neón */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00FBFF]/1 blur-[180px] pointer-events-none -z-10" />
    </div>
  );
};

export default React.memo(PhraseAccordion);