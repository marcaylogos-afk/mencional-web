/**
 * 🛰️ MENCIONAL NEURAL LINK | AI CORE v2026.PROD
 * Componente: Selector de Ejes Neurales (TopicSelector)
 * Estética: Turquesa Neón & Carbon | Optimizado para OLED
 * Ubicación: /src/components/TopicSelector.tsx
 * ✅ SERVICIOS AI: Sincronizado con /src/services/ai/
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Target, Zap, Activity, ChevronRight, 
  X, Cpu, Hash, Globe 
} from 'lucide-react';

interface TopicSelectorProps {
  topics: string[];
  selectedTopic: string;
  onSelect: (topic: string) => void;
  title?: string;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ 
  topics, 
  selectedTopic, 
  onSelect,
  title = "EJES DE TENDENCIA" 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /**
   * 🧠 AUTO-SCROLL NEURAL:
   * Sincroniza la posición con el eje activo para visibilidad inmediata.
   */
  useEffect(() => {
    if (selectedTopic && scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedTopic]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      /**
       * ⚡ NORMALIZACIÓN MENCIONAL:
       * Limpia caracteres especiales para optimizar el motor de IA en la carpeta /ai/.
       */
      const normalized = customTopic
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
        .replace(/[^a-zA-Z0-9\s]/g, '') // Solo alfanuméricos
        .toUpperCase();
        
      onSelect(normalized);
      setCustomTopic("");
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full space-y-10 select-none bg-[#000000] p-8 md:p-14 rounded-[3.5rem] md:rounded-[5rem] border border-white/5 shadow-[0_60px_150px_rgba(0,0,0,0.95)] relative overflow-hidden max-w-5xl mx-auto group/container italic">
      
      {/* 🌌 FONDO HUD (OLED GRID) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity group-hover/container:opacity-[0.08] duration-1000" 
            style={{ backgroundImage: 'radial-gradient(#00FBFF 1.2px, transparent 1.2px)', backgroundSize: '40px 40px' }} 
      />

      {/* --- CABECERA --- */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 relative z-10 gap-8">
        <div className="flex items-center gap-6 md:gap-10">
          <div className="relative flex items-center justify-center shrink-0">
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-20 h-20 md:w-28 md:h-28 bg-[#00FBFF] rounded-full blur-[80px]" 
            />
            <div className="p-5 md:p-7 bg-black rounded-[1.8rem] md:rounded-[2.5rem] border border-[#00FBFF]/30 shadow-[0_0_60px_rgba(0,251,255,0.15)] relative z-10 backdrop-blur-3xl">
              <Target size={28} className="text-[#00FBFF]" />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.9em] text-zinc-800 leading-none mb-2 md:mb-4">
              Neural_Link // AI_Services_Root: /ai/
            </h3>
            <h2 className="text-3xl md:text-6xl font-[1000] text-white uppercase tracking-tighter flex items-center gap-4 md:gap-8">
              {title}
              <span className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#00FBFF] animate-pulse shadow-[0_0_25px_#00FBFF]" />
            </h2>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(0,251,255,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.8rem] border transition-all duration-700 shadow-2xl ${
            isAdding 
              ? 'bg-[#00FBFF] border-[#00FBFF] text-black shadow-[0_0_70px_rgba(0,251,255,0.6)]' 
              : 'bg-zinc-950/80 border-white/5 text-zinc-700 hover:border-[#00FBFF]/40 hover:text-white'
          }`}
        >
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={26} strokeWidth={4} />
              </motion.div>
            ) : (
              <motion.div key="plus" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}>
                <Plus size={26} strokeWidth={4} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* --- INPUT DE INYECCIÓN DE EJE --- */}
      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -30, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -30, height: 0 }}
            onSubmit={handleCustomSubmit}
            className="px-4 relative z-10 overflow-hidden mb-12"
          >
            <div className="relative group bg-black rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-[#00FBFF]/20 focus-within:border-[#00FBFF]/90 transition-all duration-700 p-1.5 shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
              <input 
                autoFocus
                type="text"
                placeholder="DEFINIR_NUEVO_EJE_NEURAL..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="w-full bg-transparent p-7 md:p-10 text-[16px] md:text-[22px] font-black uppercase tracking-[0.5em] text-[#00FBFF] outline-none placeholder:text-zinc-900 italic"
              />
              <div className="absolute right-10 md:right-16 top-1/2 -translate-y-1/2 flex items-center gap-10 pointer-events-none">
                <motion.div animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
                    <Zap size={24} className="text-[#00FBFF]" />
                </motion.div>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* --- GRID DE TÓPICOS --- */}
      <div 
        ref={scrollContainerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 relative z-10 max-h-[450px] md:max-h-[580px] overflow-y-auto pr-3 md:pr-6 custom-scrollbar"
      >
        {topics.map((topic, index) => {
          const isSelected = selectedTopic === topic;
          return (
            <motion.button
              key={`${topic}-${index}`}
              data-active={isSelected}
              whileHover={{ y: -8, backgroundColor: isSelected ? "#00FBFF" : "rgba(10, 10, 10, 0.9)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(topic)}
              className={`
                relative px-8 py-10 md:px-11 md:py-12 rounded-[2.5rem] md:rounded-[3.8rem] text-[12px] md:text-[14px] font-[1000] transition-all duration-500
                border flex items-center justify-between overflow-hidden group
                ${isSelected 
                  ? 'bg-[#00FBFF] border-[#00FBFF] text-black shadow-[0_40px_90px_rgba(0,251,255,0.5)]' 
                  : 'bg-zinc-950 border-white/5 text-zinc-700 hover:border-[#00FBFF]/50 hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-5 md:gap-7 truncate relative z-10">
                <Hash size={18} className={isSelected ? "text-black/30" : "text-zinc-900 group-hover:text-[#00FBFF]/50"} />
                <span className="uppercase tracking-[0.3em] md:tracking-[0.4em] truncate leading-none">
                  {topic.replace(/_/g, ' ')}
                </span>
              </div>
              
              <div className="relative z-10 flex items-center ml-5 md:ml-6">
                {isSelected ? (
                  <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                    <ChevronRight size={22} strokeWidth={5} />
                  </motion.div>
                ) : (
                  <Cpu size={22} className="opacity-0 group-hover:opacity-100 group-hover:text-[#00FBFF]/70 transition-all duration-500" />
                )}
              </div>

              {isSelected && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-white/15"
                  transition={{ type: "spring", bounce: 0.15, duration: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* --- TELEMETRÍA DE RED --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 md:px-10 pt-10 md:pt-14 border-t border-white/5 relative z-10 gap-8 md:gap-12 mt-8 md:mt-12">
        <div className="flex items-center gap-8 md:gap-10">
            <div className="flex gap-2 items-end h-7">
              {[1, 2, 3, 4].map(i => (
                <motion.div 
                  key={i}
                  animate={{ height: selectedTopic ? [8, 24, 8] : 5 }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.15 }}
                  className="w-1.5 md:w-2 bg-[#00FBFF]/40 rounded-full" 
                />
              ))}
            </div>
            <span className="text-[8px] md:text-[10px] font-black text-zinc-800 tracking-[0.5em] uppercase leading-none">
              {selectedTopic ? 'Neural_Axis_Confirmed' : 'Awaiting_Selection'}
            </span>
        </div>
        
        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex items-center gap-3">
            <Globe size={14} className="text-zinc-900" />
            <span className="text-[8px] md:text-[10px] font-bold text-zinc-600 tracking-widest uppercase">Global_Sync</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity size={14} className="text-[#39FF14]" />
            <span className="text-[8px] md:text-[10px] font-bold text-[#39FF14] tracking-widest uppercase shadow-[0_0_15px_rgba(57,255,20,0.2)]">Active</span>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.03); 
          border-radius: 30px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00FBFF; }
      `}</style>
    </div>
  );
};

export default TopicSelector;