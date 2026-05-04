/**
 * 🛰️ MENCIONAL | INITIAL_SETTINGS v2026.PROD
 * ✅ DIRECTORIO AI: /src/services/ai/ (Sincronizado: Es ai, no ia)
 * ✅ LOGO: /public/logo.png
 * ✅ ESTÉTICA: OLED Black & Neon Palette (10 Colores)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, User, Users2, Headphones, 
  Mic2, Palette, Globe, ChevronRight, Activity 
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { useNavigate } from 'react-router-dom';

const InitialSettings: React.FC = () => {
  const { settings, updateSettings, palette10 } = useSettings();
  const navigate = useNavigate();
  const [isActivating, setIsActivating] = useState(false);

  const handleStart = () => {
    setIsActivating(true);
    // Simulación de sincronización con el nodo /ai/
    setTimeout(() => {
      updateSettings({ isAuthenticated: true });
      navigate('/learning-live');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6 flex flex-col font-sans">
      
      {/* HEADER CON LOGO DE CARPETA PUBLIC */}
      <header className="flex flex-col items-center py-8">
        <img src="/logo.png" alt="Mencional Logo" className="w-16 h-16 mb-4" />
        <div className="text-center">
          <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter">Configuración_Sesión</h2>
          <p className="text-[8px] font-black text-[#39FF14] tracking-[0.4em] uppercase opacity-60">Nodo_AI_Activo</p>
        </div>
      </header>

      <div className="flex-1 max-w-xl mx-auto w-full space-y-10">
        
        {/* 1. MODO DE GRUPO */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 opacity-40">
            <Users size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Modo_de_Inmersión</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'Individual', icon: <User size={18} /> },
              { id: 'Dúo', icon: <Users size={18} /> },
              { id: 'Trío', icon: <Users2 size={18} /> }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => updateSettings({ groupMode: mode.id as any })}
                className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${
                  settings.groupMode === mode.id 
                  ? 'bg-white text-black border-white' 
                  : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                }`}
              >
                {mode.icon}
                <span className="text-[9px] font-black uppercase">{mode.id}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 2. SISTEMA DE AUDIO */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 opacity-40">
            <Headphones size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Salida_de_Audio</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'audífonos', label: 'Audífonos', icon: <Headphones size={18} /> },
              { id: 'envivo', label: 'En Vivo', icon: <Mic2 size={18} /> }
            ].map((sys) => (
              <button
                key={sys.id}
                onClick={() => updateSettings({ audioSystem: sys.id as any })}
                className={`p-6 rounded-3xl border transition-all flex items-center justify-center gap-4 ${
                  settings.audioSystem === sys.id 
                  ? 'bg-[#39FF14] text-black border-[#39FF14]' 
                  : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                }`}
              >
                {sys.icon}
                <span className="text-[9px] font-black uppercase">{sys.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. PERSONALIZACIÓN DE COLOR (PALETA 10) */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 opacity-40">
            <Palette size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Identidad_Visual_OLED</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {palette10.map((color) => (
              <button
                key={color}
                onClick={() => updateSettings({ themeColor: color })}
                className={`w-10 h-10 rounded-full transition-all ${
                  settings.themeColor === color ? 'scale-125 ring-2 ring-white ring-offset-4 ring-offset-black' : 'opacity-40 hover:opacity-100'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </section>

      </div>

      {/* BOTÓN DE LANZAMIENTO */}
      <div className="p-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          disabled={isActivating}
          className="w-full py-10 rounded-[3rem] flex items-center justify-center gap-6 group relative overflow-hidden transition-all duration-700"
          style={{ 
            backgroundColor: settings.themeColor,
            color: settings.themeColor === '#FFFFFF' ? '#000000' : '#000000',
            boxShadow: `0 20px 50px ${settings.themeColor}44`
          }}
        >
          <div className="flex flex-col items-end">
            <span className="text-xl font-[1000] uppercase italic tracking-tighter">
              {isActivating ? 'Sincronizando...' : 'Iniciar_Inmersión'}
            </span>
            <span className="text-[8px] opacity-60 uppercase font-black tracking-[0.3em] mt-1">
                {settings.groupMode === 'Individual' ? 'Modo_Solo_Activo' : 'Sincronizando_Nodos_AI'}
            </span>
          </div>
          <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
        </motion.button>
      </div>

      <footer className="py-6 flex justify-center gap-6 opacity-20">
         <div className="flex items-center gap-2">
            <Activity size={12} />
            <span className="text-[7px] font-black uppercase tracking-widest">Status: /ai/ Ready</span>
         </div>
      </footer>
    </div>
  );
};

export default InitialSettings;