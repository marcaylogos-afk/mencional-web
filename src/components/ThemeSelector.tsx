/**
 * 🎨 MENCIONAL | NEURAL_INTERFACE v16.0
 * Componente: Selector de Temas, Idiomas y Protocolos (ThemeSelector)
 * Estado: PRODUCCIÓN FINAL | Optimizado para Protocolo Aoede 2026
 * Ubicación: /src/components/ThemeSelector.tsx
 */

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette, ChevronRight, Users, Flame, Zap } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

// 🌈 Paleta de 10 colores oficiales OLED Optimized (Neon Spectrum)
const COLOR_PALETTE = [
  { name: 'Turquesa', hex: '#00FBFF' },
  { name: 'Esmeralda', hex: '#10B981' },
  { name: 'Violeta', hex: '#8B5CF6' },
  { name: 'Rosa', hex: '#F472B6' },
  { name: 'Ámbar', hex: '#F59E0B' },
  { name: 'Carmesí', hex: '#EF4444' },
  { name: 'Cobalto', hex: '#3B82F6' },
  { name: 'Lima', hex: '#84CC16' },
  { name: 'Naranja', hex: '#F97316' },
  { name: 'Nieve', hex: '#F4F4F5' }
];

const TREND_TOPICS = [
  'Cafetería', 'Call Center', 'Aeropuerto', 'IT Meeting', 'Hotel Check-in', 'Entrevista'
];

interface ThemeSelectorProps {
  onComplete?: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onComplete }) => {
  const { settings, updateSettings } = useSettings();
  
  // Sincronización con el estado global de Mencional
  const selectedColor = settings.themeColor 
    ? COLOR_PALETTE.find(c => c.hex === settings.themeColor) || COLOR_PALETTE[0]
    : COLOR_PALETTE[0];
    
  const targetLanguage = settings.targetLang || 'en-US';
  const participantMode = settings.modality || 'individual';
  const [sessionAlias, setSessionAlias] = useState(settings.lastSessionId || '');

  const languages = [
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'es-MX', label: 'Español', flag: '🇲🇽' },
    { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
    { code: 'it-IT', label: 'Italiano', flag: '🇮🇹' },
    { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt-BR', label: 'Portugués', flag: '🇧🇷' }
  ];

  const handleUpdate = useCallback((key: string, value: any) => {
    updateSettings({ [key]: value });
  }, [updateSettings]);

  const selectTrend = (topic: string) => {
    const formattedTopic = topic.toUpperCase();
    setSessionAlias(formattedTopic);
    handleUpdate('lastSessionId', formattedTopic);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#000000] border-2 border-white/10 backdrop-blur-3xl rounded-[3.5rem] p-8 md:p-12 w-full max-w-[750px] shadow-[0_60px_120px_rgba(0,0,0,1)] relative overflow-hidden mx-auto selection:bg-white/20 italic"
    >
      
      {/* 🔮 SECCIÓN 1: NEURAL_AURA (Sincronización de Color) */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-6">
          <motion.div 
            animate={{ 
              backgroundColor: `${selectedColor.hex}15`,
              borderColor: `${selectedColor.hex}40`,
              boxShadow: `0 0 40px ${selectedColor.hex}20`
            }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700"
            style={{ color: selectedColor.hex }}
          >
            <Palette size={24} />
          </motion.div>
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white leading-none">Configuración_Nodo</h3>
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Personalización_Estética_OLED</span>
          </div>
        </div>
        <Zap size={20} className="text-zinc-800 animate-pulse" />
      </div>

      {/* GRID DE COLORES (Neon Spectrum) */}
      <div className="grid grid-cols-5 gap-4 mb-10">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color.name}
            onClick={() => handleUpdate('themeColor', color.hex)}
            className={`aspect-square rounded-2xl transition-all duration-500 border-2 relative group active:scale-90 ${
              selectedColor.hex === color.hex ? 'scale-110 border-white' : 'border-white/5 grayscale-[0.4] hover:grayscale-0'
            }`}
            style={{ 
              backgroundColor: color.hex, 
              boxShadow: selectedColor.hex === color.hex ? `0 15px 40px ${color.hex}50` : '' 
            }}
          >
            <AnimatePresence>
              {selectedColor.hex === color.hex && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Check size={22} className="text-black drop-shadow-md" strokeWidth={4} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* 🌍 SECCIÓN 2: LINGUISTIC_CORE */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleUpdate('targetLang', lang.code)}
            className={`py-4 rounded-2xl text-[10px] font-black border-2 flex items-center justify-center gap-3 transition-all duration-300 ${
              targetLanguage === lang.code 
                ? 'bg-white text-black border-white shadow-xl scale-105' 
                : 'bg-zinc-950 text-zinc-600 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            <span className="text-sm">{lang.flag}</span>
            <span className="tracking-widest uppercase italic">{lang.label}</span>
          </button>
        ))}
      </div>

      {/* 👥 SECCIÓN 3: PARTICIPANT_MODE */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5 opacity-40">
          <Users size={16} className="text-zinc-500" />
          <h4 className="text-[10px] font-[1000] uppercase tracking-[0.6em] text-white leading-none">Protocolo_De_Acceso</h4>
        </div>
        <div className="flex gap-3">
          {[
            { id: 'individual', label: 'Solo' },
            { id: 'duo', label: 'Dúo' },
            { id: 'trio', label: 'Trío' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleUpdate('modality', mode.id)}
              className={`flex-1 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] border-2 transition-all duration-500 italic ${
                participantMode === mode.id 
                  ? 'bg-white text-black border-white shadow-2xl scale-[1.02]' 
                  : 'bg-transparent text-zinc-700 border-white/10 hover:border-white/30 hover:text-zinc-300'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🔥 SECCIÓN 4: TRENDS_AUTOFILL */}
      <div className="mb-12 space-y-6">
        <div className="flex items-center gap-3 opacity-40">
          <Flame size={16} className="text-orange-500" />
          <h4 className="text-[10px] font-[1000] uppercase tracking-[0.6em] text-white leading-none">Trends_Sincronizados</h4>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {TREND_TOPICS.map(topic => (
            <button
              key={topic}
              onClick={() => selectTrend(topic)}
              className={`px-6 py-3 rounded-full text-[9px] font-black border-2 transition-all duration-500 tracking-widest italic ${
                sessionAlias === topic.toUpperCase() 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)]' 
                  : 'bg-zinc-950 text-zinc-800 border-white/5 hover:border-white/20 hover:text-zinc-400'
              }`}
            >
              #{topic.toUpperCase().replace(' ', '_')}
            </button>
          ))}
        </div>
        <input 
          type="text"
          value={sessionAlias}
          onChange={(e) => { 
            const val = e.target.value.toUpperCase();
            setSessionAlias(val); 
            handleUpdate('lastSessionId', val); 
          }}
          placeholder="IDENTIFICADOR_DE_SESIÓN..."
          className="w-full bg-[#050505] border-2 border-white/5 p-6 rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] focus:border-white/30 focus:bg-black outline-none transition-all text-white placeholder:text-zinc-900 shadow-inner"
        />
      </div>

      {/* ⚡ BOTÓN DE ACCIÓN: INICIAR PROTOCOLO */}
      <motion.button 
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onComplete}
        className="w-full py-8 rounded-[3rem] flex items-center justify-center gap-6 group relative overflow-hidden shadow-3xl transition-all duration-700 border-2"
        style={{ 
          backgroundColor: selectedColor.hex,
          borderColor: selectedColor.hex,
          boxShadow: `0 20px 60px ${selectedColor.hex}40`
        }}
      >
        <span className="text-black font-[1000] uppercase text-sm tracking-[0.6em]">Iniciar_Protocolo</span>
        <ChevronRight size={24} className="text-black group-hover:translate-x-2 transition-transform duration-500" strokeWidth={3} />
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
      </motion.button>
      
      <style>{`
        @keyframes shimmer { 
          0% { transform: translateX(-100%); } 
          100% { transform: translateX(100%); } 
        }
        .group-hover\\:animate-shimmer { 
          animation: shimmer 0.9s cubic-bezier(0.2, 1, 0.3, 1); 
        }
      `}</style>
    </motion.div>
  );
};

export default ThemeSelector;