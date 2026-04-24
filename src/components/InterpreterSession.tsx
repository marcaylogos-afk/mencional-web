/**
 * 🛰️ INTERPRETER_SESSION v16.0 - MENCIONAL (STABLE PRODUCTION)
 * Función: Orquestador maestro de modos con lógica de tiempos y gestión de hardware.
 * Ubicación: /src/views/InterpreterSession.tsx
 * ✅ SERVICIOS AI: /src/services/ai/ (Sincronizado)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext'; 

// ✅ Importación de Modos (Vistas)
import LearningMode from './LearningMode'; 
import UltraInterpreter from './UltraInterpreter'; 
import RompehieloMode from './RompehieloMode';

// ✅ Importación de Componentes de Interfaz
import AudioController from '../components/AudioController';
import TimerDisplay from '../components/TimerDisplay';

import { 
  Menu, X, LayoutGrid, Languages, Waves, LogOut,
  Headphones, Mic2, Activity, ChevronRight, ShieldCheck, Cpu
} from 'lucide-react';

export const InterpreterSession: React.FC = () => {
  const { settings, resetSettings } = useSettings(); 
  
  // --- 🎛️ CONTROL DE INTERFAZ Y ESTADOS MAESTROS ---
  const [activeMode, setActiveMode] = useState<'learn' | 'interpreter' | 'rompehielo'>('learn');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [outputMode, setOutputMode] = useState<'headphones' | 'live'>('live'); 
  const [isSyncing, setIsSyncing] = useState(true);

  const isAdmin = settings?.role === 'admin';

  /**
   * ⚙️ CONFIGURACIÓN DE PROTOCOLOS v16.0 
   * Tiempos críticos y estética OLED por modo.
   * Aprendizaje: 6s | Intérprete Ultra: 19s | Rompehielo: 4s
   */
  const sessionConfig = {
    learn: { 
      timer: 6, 
      color: '#00FBFF', // Turquesa Neón (Identidad Mencional)
      label: 'Aprendizaje_Mencional',
      desc: 'Ciclos de 6s | Traducción x2'
    },
    interpreter: { 
      timer: 19, 
      color: '#39FF14', // Verde Neón (Modo Master)
      label: 'Intérprete_Ultra',
      desc: 'Bloques de 19s | Ducking Activo'
    },
    rompehielo: { 
      timer: 4, 
      color: '#FF007A', // Magenta Neón
      label: 'Rompehielo_Social',
      desc: 'Sugerencias Dinámicas | Ventana 4s'
    }
  };

  useEffect(() => {
    // Calibración para estabilizar la carga del motor Aoede en /ai/
    const timer = setTimeout(() => setIsSyncing(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isSyncing) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Activity size={40} className="text-[#00FBFF] animate-pulse" />
          <div className="absolute inset-0 bg-[#00FBFF]/20 blur-xl animate-pulse" />
        </div>
        <p className="text-[#00FBFF] font-[1000] text-[10px] uppercase tracking-[1em] animate-pulse">
          Sincronizando_Servicios_AI...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col font-sans overflow-hidden select-none relative">
      
      {/* 🧭 NAV: BRANDING & HARDWARE TOGGLE */}
      <nav className="h-24 border-b border-white/[0.03] bg-black/40 backdrop-blur-3xl px-8 flex items-center justify-between relative z-[100]">
        <div className="flex items-center gap-8">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-4 border border-zinc-800 rounded-2xl text-white bg-zinc-950"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Cpu size={14} className="text-[#00FBFF]" />
              <span className="text-white font-[1000] uppercase tracking-[0.6em] text-[12px]">MENCIONAL</span>
              {isAdmin && (
                <div className="flex items-center gap-1 bg-[#39FF14]/10 px-2 py-0.5 rounded border border-[#39FF14]/20">
                  <ShieldCheck size={8} className="text-[#39FF14]" />
                  <span className="text-[7px] font-black text-[#39FF14] uppercase tracking-widest">Master_Node</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest italic opacity-60">
                {sessionConfig[activeMode].label}
              </span>
              <ChevronRight size={8} className="text-zinc-800" />
              <span className="text-[#00FBFF] text-[8px] font-black uppercase tracking-widest italic">
                {outputMode === 'live' ? 'Speaker_Ambiente' : 'Headset_OLED_Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* SELECTOR DE HARDWARE (OLED STYLE) */}
        <div className="hidden md:flex items-center gap-2 bg-zinc-950 p-1.5 rounded-[1.8rem] border border-white/5 shadow-2xl">
          <button 
            onClick={() => setOutputMode('live')}
            className={`px-6 py-3 rounded-[1.2rem] flex items-center gap-3 transition-all duration-500 ${outputMode === 'live' ? 'bg-white text-black font-[1000]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <Mic2 size={14} /> <span className="text-[10px] uppercase tracking-widest">Speaker</span>
          </button>
          <button 
            onClick={() => setOutputMode('headphones')}
            className={`px-6 py-3 rounded-[1.2rem] flex items-center gap-3 transition-all duration-500 ${outputMode === 'headphones' ? 'bg-[#00FBFF] text-black font-[1000] shadow-[0_0_25px_rgba(0,251,255,0.4)]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <Headphones size={14} /> <span className="text-[10px] uppercase tracking-widest">Headset</span>
          </button>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => resetSettings()}
          className="px-6 py-4 border border-rose-900/30 text-rose-500 rounded-2xl hover:bg-rose-600 hover:text-white transition-all flex items-center gap-3 font-black text-[10px] uppercase italic"
        >
          <span className="hidden sm:inline tracking-widest">Terminar_Sesión</span>
          <LogOut size={18} />
        </motion.button>
      </nav>

      <main className="flex-grow flex relative overflow-hidden">
        
        {/* 🛠️ SIDEBAR: PROTOCOLOS NEÓN */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth > 1024) && (
            <motion.aside 
              initial={{ x: -350 }}
              animate={{ x: 0 }}
              exit={{ x: -350 }}
              className="absolute lg:relative z-[90] w-80 h-full border-r border-white/[0.03] bg-[#030303] p-8 flex flex-col gap-6"
            >
              <div className="mb-4">
                <p className="text-[10px] font-[1000] text-zinc-700 uppercase tracking-[0.5em] ml-2">Protocol_Sync</p>
                <div className="h-[2px] w-16 mt-3 rounded-full transition-colors duration-700" style={{ backgroundColor: sessionConfig[activeMode].color }} />
              </div>
              
              <div className="space-y-4">
                {/* 1. APRENDIZAJE */}
                <button 
                  onClick={() => { setActiveMode('learn'); setIsSidebarOpen(false); }}
                  className={`group w-full flex items-center gap-5 p-7 rounded-[2.8rem] border-2 transition-all duration-500 ${activeMode === 'learn' ? 'border-[#00FBFF] bg-[#00FBFF]/5 text-[#00FBFF]' : 'border-white/[0.03] text-zinc-600 hover:border-white/10'}`}
                >
                  <div className={`p-3.5 rounded-2xl ${activeMode === 'learn' ? 'bg-[#00FBFF] text-black shadow-[0_0_15px_#00FBFF]' : 'bg-zinc-900'}`}>
                    <LayoutGrid size={22} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-[1000] text-[12px] uppercase tracking-tight">Aprendizaje</span>
                    <span className="text-[8px] font-black opacity-50 uppercase tracking-[0.2em] mt-1">6s_Cycle</span>
                  </div>
                </button>

                {/* 2. MODOS MAESTROS (Solo si isAdmin) */}
                {isAdmin && (
                  <>
                    <button 
                      onClick={() => { setActiveMode('interpreter'); setIsSidebarOpen(false); }}
                      className={`group w-full flex items-center gap-5 p-7 rounded-[2.8rem] border-2 transition-all duration-500 ${activeMode === 'interpreter' ? 'border-[#39FF14] bg-[#39FF14]/5 text-[#39FF14]' : 'border-white/[0.03] text-zinc-600 hover:border-white/10'}`}
                    >
                      <div className={`p-3.5 rounded-2xl ${activeMode === 'interpreter' ? 'bg-[#39FF14] text-black shadow-[0_0_15px_#39FF14]' : 'bg-zinc-900'}`}>
                        <Languages size={22} />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="font-[1000] text-[12px] uppercase tracking-tight">Ultra_Intérprete</span>
                        <span className="text-[8px] font-black opacity-50 uppercase tracking-[0.2em] mt-1">19s_Protocol</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setActiveMode('rompehielo'); setIsSidebarOpen(false); }}
                      className={`group w-full flex items-center gap-5 p-7 rounded-[2.8rem] border-2 transition-all duration-500 ${activeMode === 'rompehielo' ? 'border-[#FF007A] bg-[#FF007A]/5 text-[#FF007A]' : 'border-white/[0.03] text-zinc-600 hover:border-white/10'}`}
                    >
                      <div className={`p-3.5 rounded-2xl ${activeMode === 'rompehielo' ? 'bg-[#FF007A] text-white shadow-[0_0_15px_#FF007A]' : 'bg-zinc-900'}`}>
                        <Waves size={22} />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="font-[1000] text-[12px] uppercase tracking-tight">Rompehielo</span>
                        <span className="text-[8px] font-black opacity-50 uppercase tracking-[0.2em] mt-1">4s_Reaction</span>
                      </div>
                    </button>
                  </>
                )}
              </div>

              {/* ÁREA DE CONTROL INFERIOR (OLED Focus) */}
              <div className="mt-auto space-y-6">
                <div className="p-8 bg-zinc-950/50 rounded-[3rem] border border-white/[0.03] shadow-inner text-center">
                  <TimerDisplay 
                    mode={activeMode}
                    color={sessionConfig[activeMode].color}
                    limit={sessionConfig[activeMode].timer}
                  />
                </div>
                <AudioController outputMode={outputMode} activeMode={activeMode} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 💻 SESSION CORE: Renderizado Dinámico */}
        <section className="flex-grow relative bg-[#020202] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full w-full relative z-10"
            >
              {activeMode === 'learn' && <LearningMode />}
              {activeMode === 'interpreter' && <UltraInterpreter />}
              {activeMode === 'rompehielo' && <RompehieloMode />}
            </motion.div>
          </AnimatePresence>
          
          {/* Ambient Glow OLED */}
          <div 
            className="absolute inset-0 opacity-5 transition-colors duration-1000 pointer-events-none blur-[180px]"
            style={{ backgroundColor: sessionConfig[activeMode].color }}
          />
        </section>
      </main>

      {/* 🛰️ STATUS BAR */}
      <footer className="h-12 bg-black border-t border-white/[0.03] px-10 flex items-center justify-between z-[100]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse ${outputMode === 'headphones' ? 'text-[#00FBFF]' : 'text-[#39FF14]'}`} />
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
              {outputMode === 'headphones' ? 'LINK_HEADSET_ENCRYPTED' : 'LIVE_AMBIENT_ACTIVE'}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-6 border-l border-white/5 pl-8">
            <span className="text-[9px] font-black text-zinc-800 uppercase italic">Buffer: {sessionConfig[activeMode].timer}s</span>
            <span className="text-[9px] font-black text-[#00FBFF]/40 uppercase tracking-[0.5em]">Services: /src/services/ai/</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-950 border border-white/5">
          <Activity size={12} className="text-zinc-700" />
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">
            {isAdmin ? 'NODE_MASTER_ADMIN' : 'PARTICIPANT_USER'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default InterpreterSession;