/**
 * 📊 CONFIG_SUMMARY v2026.PROD - MENCIONAL
 * Resumen de configuración, selección de color, modalidad y tendencias.
 * Ubicación: /src/components/ConfigSummary.tsx
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, User, Users2, Palette, 
  Globe2, Flame, CheckCircle2, Cpu
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const ConfigSummary: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  /**
   * 🎨 LOS 10 COLORES OFICIALES MENCIONAL v2026
   * Optimizados para contraste infinito en paneles OLED.
   */
  const MENCIONAL_PALETTE = [
    { name: 'Cian', hex: '#00FBFF' }, // Color Prioritario
    { name: 'Gold', hex: '#EAB308' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Rose', hex: '#F43F5E' },
    { name: 'Lime', hex: '#84CC16' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Silver', hex: '#E2E8F0' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Crimson', hex: '#991B1B' },
  ];

  // 📈 NEURAL CLOUD TRENDS (Tópicos proactivos del motor de sugerencias)
  const trendTopics = [
    "TECH ECONOMY", "GLOBAL NETWORKING", "ARTIFICIAL THOUGHT", 
    "SOCIAL DYNAMICS", "FUTURE SKILLS", "CREATIVE FLOW"
  ];

  const modes = [
    { id: 'INDIVIDUAL', label: 'Solo', icon: <User size={24} />, desc: '1 Usuario' },
    { id: 'DUO', label: 'Dúo', icon: <Users size={24} />, desc: '2 Usuarios' },
    { id: 'TRIO', label: 'Trío', icon: <Users2 size={24} />, desc: '3+ Usuarios' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 p-4 md:p-8 animate-in fade-in duration-700 italic">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* COLUMNA IZQUIERDA: MOTOR DE CONFIGURACIÓN */}
        <div className="space-y-10">
          
          {/* SELECCIÓN DE MODALIDAD */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 text-zinc-600">
              <Cpu size={18} className="text-zinc-800" />
              <span className="text-[10px] font-[1000] uppercase tracking-[0.5em]">Config_Session_Node</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modes.map((mode) => {
                const isActive = settings.sessionType === mode.id;
                return (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateSettings({ sessionType: mode.id as any })}
                    className={`
                      relative p-10 rounded-[3rem] border-2 flex flex-col items-center gap-4 transition-all duration-500 overflow-hidden
                      ${isActive 
                        ? 'bg-white text-black border-transparent shadow-[0_25px_50px_rgba(255,255,255,0.1)]' 
                        : 'bg-zinc-950 border-white/5 text-zinc-500 hover:border-white/10 hover:bg-zinc-900/40'}
                    `}
                  >
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className={isActive ? 'text-black' : 'text-zinc-700'}>
                        {mode.icon}
                      </div>
                      <div className="text-center">
                        <p className="font-[1000] uppercase tracking-tighter text-2xl leading-none">{mode.label}</p>
                        <p className={`text-[10px] font-black tracking-[0.2em] uppercase mt-2 ${isActive ? 'text-black/40' : 'text-zinc-800'}`}>
                          {mode.desc}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* SELECTOR DE 10 COLORES NEURALES */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 text-zinc-600">
              <Palette size={18} />
              <span className="text-[10px] font-[1000] uppercase tracking-[0.5em]">Espectro_Identidad_OLED</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-4 p-8 bg-zinc-950 rounded-[3rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden shadow-inner">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent)]" />
              {MENCIONAL_PALETTE.map((color) => (
                <motion.button
                  key={color.hex}
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  onClick={() => updateSettings({ selectedColor: color.hex })}
                  className="group relative aspect-square rounded-2xl border-2 transition-all shadow-2xl"
                  style={{ 
                    backgroundColor: color.hex, 
                    borderColor: settings.selectedColor === color.hex ? 'white' : 'transparent',
                    boxShadow: settings.selectedColor === color.hex ? `0 0 35px ${color.hex}88` : 'none'
                  }}
                  title={color.name}
                >
                  <AnimatePresence>
                    {settings.selectedColor === color.hex && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1 shadow-xl"
                      >
                        <CheckCircle2 size={12} fill="white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA: TENDENCIAS Y TELEMETRÍA */}
        <div className="space-y-10">
          
          {/* NUBE DE TENDENCIAS (TrendsWelcome Logic) */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 text-zinc-600">
              <Flame size={18} className="text-[#00FBFF] animate-pulse" />
              <span className="text-[10px] font-[1000] uppercase tracking-[0.5em]">Neural_Cloud_Inference</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {trendTopics.map((topic, i) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-8 py-6 bg-zinc-950 border border-white/5 rounded-[2rem] hover:border-[#00FBFF]/30 transition-all cursor-default group flex items-center justify-between shadow-2xl"
                >
                  <span className="text-[11px] font-[1000] tracking-[0.2em] text-zinc-700 group-hover:text-white transition-colors">
                    {topic}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 group-hover:bg-[#00FBFF] transition-all shadow-[0_0_10px_#00FBFF]" />
                </motion.div>
              ))}
            </div>
          </section>

          {/* RESUMEN DE PERSISTENCIA (Master Card) */}
          <div className="p-12 rounded-[4.5rem] bg-zinc-950 border-t border-x border-white/5 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,1)]">
            {/* Dinamic Glow Background - Sincronizado con el color de usuario */}
            <motion.div 
              animate={{ 
                backgroundColor: settings.selectedColor || '#00FBFF',
                opacity: [0.03, 0.08, 0.03]
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-80 h-80 blur-[120px] pointer-events-none"
            />
            
            <div className="relative z-10 space-y-12">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="text-5xl font-[1000] uppercase tracking-tighter text-white">Mencional_Sync</h4>
                  <p className="text-[10px] font-black text-zinc-800 tracking-[0.4em] uppercase italic">Core_Stability: 99.9% // Production_2026</p>
                </div>
                <div className="px-6 py-2.5 rounded-full bg-black border border-white/10 text-[10px] font-[1000] tracking-widest uppercase text-zinc-500 shadow-xl">
                  {settings.targetLanguage || 'EN-US'} <span className="text-[#00FBFF] ml-3 animate-pulse">●</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4 p-8 bg-zinc-900/30 rounded-[2.5rem] border border-white/[0.03]">
                  <p className="text-[10px] font-[1000] text-zinc-700 uppercase tracking-widest">Identificador</p>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ backgroundColor: settings.selectedColor }} />
                    <p className="text-2xl font-[1000] text-white uppercase tracking-tighter">
                      {MENCIONAL_PALETTE.find(c => c.hex === settings.selectedColor)?.name || 'Neutral'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 p-8 bg-zinc-900/30 rounded-[2.5rem] border border-white/[0.03]">
                  <p className="text-[10px] font-[1000] text-zinc-700 uppercase tracking-widest">Protocolo</p>
                  <p className="text-2xl font-[1000] text-white uppercase tracking-tighter">
                    {settings.sessionType || 'Individual'}
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5 text-zinc-500 italic text-sm">
                  <Globe2 size={20} style={{ color: settings.selectedColor }} className="animate-spin-slow opacity-50" />
                  <span className="font-[1000] tracking-tight uppercase text-[11px]">Enlace Neural Activo</span>
                </div>
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-4 border-black bg-zinc-900 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-tr from-zinc-800 to-zinc-700" />
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigSummary;