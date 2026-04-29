/**
 * ⚙️ MENCIONAL | SETTINGS_PANEL v2026.2
 * Ubicación: /src/components/interpreter/SettingsPanel.tsx
 * Estética: Turquesa Neón | OLED Black | Responsive
 * Sincronizado con: /src/services/ai/
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Headphones, Speaker, Globe, Palette, 
  ChevronRight, Zap, Target, Activity, ShieldCheck
} from 'lucide-react';
import { COLOR_PALETTE, LANGUAGE_PRIORITY } from '../../constants/theme';
import { saveUserConfig, getFromDisk, offlineData } from '../../constants/offlineData';

interface SettingsPanelProps {
  mode: 'LEARNING' | 'ULTRA_MENCIONAL' | 'ROMPEHIELO';
  onStart: (config: any) => void;
  onClose?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ mode, onStart, onClose }) => {
  // Estados de Configuración
  const [selectedColor, setSelectedColor] = useState('#00FBFF');
  const [output, setOutput] = useState<'HEADPHONES' | 'LIVE'>('HEADPHONES');
  const [language, setLanguage] = useState('en-US'); // Inglés prioritario por defecto
  const [trends, setTrends] = useState<string[]>([]);

  // Cargar tendencias dinámicas (Actualización cada 19s en sesión)
  useEffect(() => {
    const savedTrends = getFromDisk<string[]>(offlineData.keys.trends) || [];
    setTrends(savedTrends.length > 0 ? savedTrends : ["ENTREVISTAS IT", "VIAJES EUROPA", "NEGOCIOS B2B"]);
  }, []);

  const handleStart = () => {
    const config = {
      color: selectedColor,
      output,
      language,
      timestamp: Date.now(),
      // Protocolos oficiales de Mencional
      protocol: mode === 'LEARNING' ? 'INMERSIÓN_6S' : 'SINCRO_19S',
      mode: mode.toLowerCase()
    };

    // Persistencia en SettingsContext/OfflineData
    saveUserConfig({
      practiceLanguage: language, // Mapeado para useInterpreter.ts
      mode: mode.toLowerCase() as any,
      groupMode: 'individual',
      isConfigured: true,
      themeColor: selectedColor
    });

    onStart(config);
  };

  return (
    <motion.div 
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-3xl mx-auto bg-[#050505] border-t-2 border-[#00FBFF]/40 rounded-t-[40px] md:rounded-t-[60px] p-8 md:p-12 shadow-[0_-40px_100px_rgba(0,0,0,0.9)] overflow-hidden font-sans"
    >
      {/* Glow Ambiental Superior */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] blur-sm transition-colors duration-1000"
        style={{ backgroundColor: selectedColor }}
      />

      {/* Header: Modo y Protocolo */}
      <div className="flex justify-between items-start mb-12">
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-[#00FBFF] animate-pulse" size={16} />
            <span className="text-[#00FBFF] text-[9px] font-[1000] tracking-[0.5em] uppercase">Sistema_Activo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-[1000] text-white tracking-tighter uppercase italic leading-none">
            {mode.replace('_', ' ')}
          </h2>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] mt-2 uppercase">
            {mode === 'LEARNING' ? 'Protocolo Inmersión 6s' : 'Sincronización Neural 19s'}
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="p-3 bg-zinc-900/50 rounded-full border border-white/5 text-zinc-500 hover:text-white transition-colors"
        >
          <ChevronRight className="rotate-90" size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* COLUMNA ALFA: AUDIO Y LENGUAJE */}
        <div className="space-y-10">
          <section>
            <label className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-5">
              <Target size={14} className="text-[#00FBFF]" /> Salida de Audio
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'HEADPHONES', icon: Headphones, label: 'AUDÍFONOS' },
                { id: 'LIVE', icon: Speaker, label: 'ALTAVOZ' }
              ].map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setOutput(opt.id as any)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border-2 transition-all duration-300 ${output === opt.id ? 'border-[#00FBFF] bg-[#00FBFF]/10 text-white shadow-[0_0_20px_rgba(0,251,255,0.1)]' : 'border-white/5 bg-zinc-900/30 text-zinc-600 grayscale hover:grayscale-0'}`}
                >
                  <opt.icon size={28} strokeWidth={2} />
                  <span className="text-[10px] font-black tracking-widest uppercase italic">{opt.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-5">
              <Globe size={14} className="text-[#00FBFF]" /> Motor Lingüístico
            </label>
            <div className="relative group">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-zinc-900/80 border-2 border-white/5 p-5 rounded-2xl text-[13px] font-black text-white focus:border-[#00FBFF] outline-none appearance-none cursor-pointer transition-all hover:bg-zinc-800"
              >
                {/* Opción prioritaria de detección automática */}
                <option value="auto">✨ DETECTAR IDIOMA</option>
                {LANGUAGE_PRIORITY.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.flag} {lang.name.toUpperCase()}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-[#00FBFF] transition-colors">
                 <ChevronRight size={18} className="rotate-90 text-zinc-600" />
              </div>
            </div>
          </section>
        </div>

        {/* COLUMNA BETA: IDENTIDAD Y CONTEXTO */}
        <div className="space-y-10">
          <section>
            <div className="flex justify-between items-center mb-5">
              <label className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">
                <Palette size={14} className="text-[#00FBFF]" /> Espectro de Turno
              </label>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">
                {COLOR_PALETTE.find(c => c.hex === selectedColor)?.name}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {COLOR_PALETTE.map(color => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.hex)}
                  style={{ backgroundColor: color.hex }}
                  className={`h-10 w-full rounded-xl border-2 transition-all duration-500 transform ${selectedColor === color.hex ? 'border-white scale-110 shadow-[0_0_25px_rgba(255,255,255,0.25)]' : 'border-transparent opacity-30 hover:opacity-100 hover:scale-105'}`}
                />
              ))}
            </div>
          </section>

          <section>
            <label className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-5">
              <Zap size={14} className="text-[#00FBFF]" /> Nube de Contexto (Trends)
            </label>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {trends.map((topic, i) => (
                  <motion.div 
                    key={topic + i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-full text-[9px] font-black text-zinc-400 hover:text-[#00FBFF] hover:border-[#00FBFF] transition-all cursor-default select-none uppercase tracking-widest"
                  >
                    {topic}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>

      {/* ACCIÓN: INICIAR SESIÓN */}
      <div className="mt-14 relative group">
        <div 
          className="absolute -inset-1 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"
          style={{ backgroundColor: selectedColor }}
        />
        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="relative w-full bg-white text-black py-7 rounded-[2.5rem] font-[1000] uppercase tracking-[0.6em] text-[13px] flex items-center justify-center gap-4 transition-all"
        >
          <span>Establecer Sincronía</span>
          <ChevronRight size={22} strokeWidth={4} />
        </motion.button>
        
        <div className="flex items-center justify-center gap-3 mt-6 opacity-30">
          <ShieldCheck size={12} className="text-zinc-500" />
          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">
            Cifrado de canal neural habilitado | Motor AI Activo
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPanel;