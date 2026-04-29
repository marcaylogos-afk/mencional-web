/**
 * 🛰️ INTERPRETER_SESSION v16.0 - MENCIONAL (STABLE PRODUCTION)
 * Función: Orquestador maestro de modos con lógica de tiempos y gestión de hardware.
 * Ubicación: /src/views/InterpreterSession.tsx
 * ✅ SERVICIOS AI: /src/services/ai/ (Sincronizado)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

// ✅ Vistas de Modo
import LearningMode from './LearningMode'; 
import InterpreterMode from './InterpreterMode'; 
import RompehieloMode from './RompehieloMode';

// ✅ Componentes de Control
import AudioController from '../components/AudioController';
import TimerDisplay from '../components/TimerDisplay';

import { 
  Menu, X, LayoutGrid, Languages, Waves, LogOut,
  Headphones, Mic2, Activity, ChevronRight, ShieldCheck, Cpu
} from 'lucide-react';

export const InterpreterSession: React.FC = () => {
  const { logout, isAdmin, user } = useAuth(); 
  
  // --- 🎛️ ESTADOS MAESTROS DE SESIÓN ---
  const [activeMode, setActiveMode] = useState<'learn' | 'interpreter' | 'rompehielo'>('learn');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [outputMode, setOutputMode] = useState<'headphones' | 'live'>('live');
  const [isSyncing, setIsSyncing] = useState(true);

  /**
   * ⚙️ PROTOCOLOS MENCIONAL v2026
   * Configuración de tiempos y energía visual por modo.
   */
  const sessionConfig = {
    learn: { 
      timer: 6, 
      color: '#00FBFF', // Turquesa Neón (Default)
      label: 'Aprendizaje_Mencional',
      desc: 'Ciclos de 6s | 100% Manos Libres' 
    },
    interpreter: { 
      timer: 19, 
      color: '#39FF14', // Verde Neón (Master)
      label: 'Intérprete_Ultra',
      desc: 'Bloques de 19s | Modo Fluidez' 
    },
    rompehielo: { 
      timer: 4, 
      color: '#FF007A', // Magenta Neón
      label: 'Rompehielo_Social',
      desc: 'Ventana de 4s | Sugerencias' 
    }
  };

  useEffect(() => {
    // Calibración de bus de datos para servicios en /src/services/ai/
    const timer = setTimeout(() => setIsSyncing(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isSyncing) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Activity size={40} className="text-[#00FBFF] animate-pulse" />
          <div className="absolute inset-0 bg-[#00FBFF]/25 blur-2xl animate-pulse" />
        </div>
        <p className="text-[#00FBFF] font-[1000] text-[10px] uppercase tracking-[1em] animate-pulse">
          Sincronizando_Servicios_AI...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col font-sans overflow-hidden select-none relative italic">
      
      {/* 🧭 NAV: BRANDING & HARDWARE TOGGLE */}
      <nav className="h-24 border-b border-white/[0.03] bg-black px-8 flex items-center justify-between relative z-[100]">
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
              <span className="white font-[1000] uppercase tracking-[0.6em] text-[12px]">MENCIONAL</span>
              {isAdmin && (
                <div className="flex items-center gap-1 bg-[#39FF14]/10 px-2 py-0.5 rounded border border-[#39FF14]/20">
                  <ShieldCheck size={9} className="text-[#39FF14]" />
                  <span className="text-[7px] font-black text-[#39FF14] uppercase tracking-widest">Master_Node</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest opacity-60">
                {sessionConfig[activeMode].label}
              </span>
              <ChevronRight size={8} className="text-zinc-800" />
              <span className="text-[#00FBFF] text-[8px] font-black uppercase tracking-widest italic">
                {outputMode === 'live' ? 'Speaker_Ambiente' : 'Headset_Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* SELECTOR DE SALIDA DE AUDIO */}
        <div className="hidden md:flex items-center gap-2 bg-zinc-950 p-1.5 rounded-[2rem] border border-white/5">
          <button 
            onClick={() => setOutputMode('live')}
            className={`px-8 py-3 rounded-[1.5rem] flex items-center gap-3 transition-all duration-500 ${outputMode === 'live' ? 'bg-white text-black font-[1000]' : 'text-zinc-700 hover:text-zinc-400'}`}
          >
            <Mic2 size={14} /> <span className="text-[10px] uppercase tracking-widest">Speaker</span>
          </button>
          <button 
            onClick={() => setOutputMode('headphones')}
            className={`px-8 py-3 rounded-[1.5rem] flex items-center gap-3 transition-all duration-500 ${outputMode === 'headphones' ? 'bg-[#00FBFF] text-black font-[1000] shadow-[0_0_20px_#00FBFF]' : 'text-zinc-700 hover:text-zinc-400'}`}
          >
            <Headphones size={14} /> <span className="text-[10px] uppercase tracking-widest">Headset</span>
          </button>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => logout()}
          className="px-6 py-4 border border-rose-900/30 text-rose-500 rounded-2xl hover:bg-rose-600 hover:text-white transition-all flex items-center gap-3 font-black text-[10px] uppercase italic"
        >
          <span className="hidden sm:inline tracking-widest">Desconectar</span>
          <LogOut size={18} />
        </motion.button>
      </nav>

      <main className="flex-grow flex relative overflow-hidden">
        
        {/* 🛠️ SIDEBAR: MODOS AI */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth > 1024) && (
            <motion.aside 
              initial={{ x: -350 }}
              animate={{ x: 0 }}
              exit={{ x: -350 }}
              className="absolute lg:relative z-[90] w-80 h-full border-r border-white/[0.03] bg-black p-8 flex flex-col gap-6"
            >
              <div className="mb-4">
                <p className="text-[10px] font-[1000] text-zinc-800 uppercase tracking-[0.5em] ml-2">Protocol_Sync</p>
                <div className="h-[2px] w-20 mt-3 rounded-full transition-colors duration-700" style={{ backgroundColor: sessionConfig[activeMode].color }} />
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => { setActiveMode('learn'); setIsSidebarOpen(false); }}
                  className={`group w-full flex items-center gap-5 p-7 rounded-[3rem] border-2 transition-all duration-500 ${activeMode === 'learn' ? 'border-[#00FBFF] bg-[#00FBFF]/5 text-[#00FBFF]' : 'border-white/[0.03] text-zinc-700 hover:border-white/10'}`}
                >
                  <div className={`p-4 rounded-2xl ${activeMode === 'learn' ? 'bg-[#00FBFF] text-black shadow-[0_0_20px_#00FBFF]' : 'bg-zinc-900'}`}>
                    <LayoutGrid size={22} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-[1000] text-[13px] uppercase tracking-tighter">Learning</span>
                    <span className="text-[8px] font-black opacity-40 uppercase tracking-widest">6s_Loop</span>
                  </div>
                </button>

                {isAdmin && (
                  <>
                    <button 
                      onClick={() => { setActiveMode('interpreter'); setIsSidebarOpen(false); }}
                      className={`group w-full flex items-center gap-5 p-7 rounded-[3rem] border-2 transition-all duration-500 ${activeMode === 'interpreter' ? 'border-[#39FF14] bg-[#39FF14]/5 text-[#39FF14]' : 'border-white/[0.03] text-zinc-700 hover:border-white/10'}`}
                    >
                      <div className={`p-4 rounded-2xl ${activeMode === 'interpreter' ? 'bg-[#39FF14] text-black shadow-[0_0_20px_#39FF14]' : 'bg-zinc-900'}`}>
                        <Languages size={22} />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="font-[1000] text-[13px] uppercase tracking-tighter">Ultra_Intérprete</span>
                        <span className="text-[8px] font-black opacity-40 uppercase tracking-widest">19s_Master</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setActiveMode('rompehielo'); setIsSidebarOpen(false); }}
                      className={`group w-full flex items-center gap-5 p-7 rounded-[3rem] border-2 transition-all duration-500 ${activeMode === 'rompehielo' ? 'border-[#FF007A] bg-[#FF007A]/5 text-[#FF007A]' : 'border-white/[0.03] text-zinc-700 hover:border-white/10'}`}
                    >
                      <div className={`p-4 rounded-2xl ${activeMode === 'rompehielo' ? 'bg-[#FF007A] text-white shadow-[0_0_20px_#FF007A]' : 'bg-zinc-900'}`}>
                        <Waves size={22} />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="font-[1000] text-[13px] uppercase tracking-tighter">Rompehielo</span>
                        <span className="text-[8px] font-black opacity-40 uppercase tracking-widest">4s_Snap</span>
                      </div>
                    </button>
                  </>
                )}
              </div>

              <div className="mt-auto space-y-8">
                <div className="p-8 bg-zinc-950 rounded-[3.5rem] border border-white/[0.02]">
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

        {/* 💻 VISTA ACTIVA: Renderizado Dinámico */}
        <section className="flex-grow relative bg-[#010101] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full relative z-10"
            >
              {activeMode === 'learn' && <LearningMode />}
              {activeMode === 'interpreter' && <InterpreterMode />}
              {activeMode === 'rompehielo' && <RompehieloMode />}
            </motion.div>
          </AnimatePresence>
          
          {/* Ambient Glow OLED Adaptativo */}
          <div 
            className="absolute inset-0 opacity-10 transition-colors duration-[1500ms] pointer-events-none blur-[200px]"
            style={{ backgroundColor: sessionConfig[activeMode].color }}
          />
        </section>
      </main>

      {/* 🛰️ STATUS BAR (LOGS & SERVICES) */}
      <footer className="h-14 bg-black border-t border-white/[0.03] px-10 flex items-center justify-between z-[100]">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${outputMode === 'headphones' ? 'text-[#00FBFF]' : 'text-[#39FF14]'}`} />
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">
              {outputMode === 'headphones' ? 'CRYPTED_HEADSET_LINK' : 'LIVE_CORE_ACTIVE'}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-8 border-l border-zinc-900 pl-10">
            <span className="text-[9px] font-black text-zinc-800 uppercase italic">Buffer: {sessionConfig[activeMode].timer}s</span>
            <span className="text-[9px] font-black text-[#00FBFF]/30 uppercase tracking-[0.6em]">Services: /src/services/ai/</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-zinc-950 border border-white/5">
          <Activity size={12} className="text-zinc-800" />
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">
            {user?.displayName || 'TERMINAL_01'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default InterpreterSession;