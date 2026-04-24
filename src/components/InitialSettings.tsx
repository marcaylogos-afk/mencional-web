/**
 * 🛰️ MENCIONAL | INITIAL_SETTINGS v2026.PROD
 * Ubicación: /src/components/InitialSettings.tsx
 * Objetivo: Configuración previa de sesión con lógica de permisos.
 * ✅ DIRECTORIO AI: Sincronizado a /services/ai/
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, User, Users2, Headphones, 
  Mic2, Palette, Globe, ChevronRight, Sparkles, Activity 
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";

// ✅ Paleta Oficial de 10 Colores Neón (Optimizado para negros puros OLED)
const MENCIONAL_COLORS = [
  "#00FBFF", // 0. Cian (Mencional Default)
  "#39FF14", // 1. Verde Neón (Master Node / 'osos')
  "#FF00F5", // 2. Fucsia
  "#FFFF00", // 3. Amarillo
  "#FF3131", // 4. Rojo Neón (Failsafe)
  "#A855F7", // 5. Púrpura Ultra (Rompehielo)
  "#FF9900", // 6. Naranja
  "#00FFAB", // 7. Aquamarina
  "#FFFFFF", // 8. Blanco Puro
  "#71717A"  // 9. Zinc
];

const InitialSettings: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'MODE' | 'CONFIG'>('MODE');

  // Identificación del Nodo Maestro mediante alias "osos"
  const isAdmin = settings.userAlias?.toLowerCase() === 'osos' || settings.role === 'admin';

  // ✅ Prioridad: Inglés como Target Language Core tras migración /ai/
  useEffect(() => {
    if (!settings.targetLanguage) {
      updateSettings({ targetLanguage: 'en-US' });
    }
  }, [settings.targetLanguage, updateSettings]);

  const participationModes = [
    { id: 'individual', label: 'Individual', icon: <User size={20} /> },
    { id: 'duo', label: 'Dúo', icon: <Users size={20} /> },
    { id: 'trio', label: 'Trío', icon: <Users2 size={20} /> },
  ];

  const languages = [
    { id: 'en-US', label: 'Inglés', flag: '🇺🇸' },
    { id: 'fr-FR', label: 'Francés', flag: '🇫🇷' },
    { id: 'de-DE', label: 'Alemán', flag: '🇩🇪' },
    { id: 'it-IT', label: 'Italiano', flag: '🇮🇹' },
    { id: 'pt-BR', label: 'Portugués', flag: '🇧🇷' },
    { id: 'es-MX', label: 'Español', flag: '🇲🇽' },
    { id: 'auto', label: 'Detectar', flag: '🛰️' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-black border border-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl relative z-50 italic">
      
      {/* HEADER: ESTÉTICA MENCIONAL - SIN LOGOS LEGACY */}
      <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center bg-zinc-950/50 gap-6 text-left">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden shadow-[0_0_20px_rgba(0,251,255,0.2)]">
             <Activity size={24} style={{ color: settings.themeColor }} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-[1000] tracking-tighter text-white uppercase leading-none">
              {isAdmin ? 'CONFIG_MASTER' : 'CONFIG_NODO'}
            </h2>
            <p className="text-[9px] text-zinc-500 font-black tracking-widest uppercase mt-1">
              {isAdmin ? 'PROTOCOLO: ACCESO_TOTAL' : 'PROTOCOLO: BLOQUE_20m'}
            </p>
          </div>
        </div>
        
        {/* NAVEGACIÓN DE TABS: CAPACIDAD Y PROTOCOLO */}
        <div className="flex bg-zinc-900/30 p-1 rounded-full border border-white/5">
          {['MODE', 'CONFIG'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-full text-[10px] font-[1000] transition-all uppercase tracking-widest ${
                activeTab === tab 
                ? 'bg-white text-black shadow-lg scale-105' 
                : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              {tab === 'MODE' ? '1. CAPACIDAD' : '2. PROTOCOLOS'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-10 min-h-[420px]">
        <AnimatePresence mode="wait">
          {activeTab === 'MODE' ? (
            <motion.div 
              key="mode-tab"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {participationModes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    updateSettings({ groupMode: m.id as any });
                    setActiveTab('CONFIG');
                  }}
                  className={`flex flex-col items-center justify-center p-10 rounded-[2.8rem] border-2 transition-all duration-500 group relative overflow-hidden ${
                    settings.groupMode === m.id 
                    ? 'bg-zinc-900/40' 
                    : 'border-white/5 bg-zinc-950 hover:border-white/20'
                  }`}
                  style={{ borderColor: settings.groupMode === m.id ? settings.themeColor : '' }}
                >
                  <div 
                    className={`p-5 rounded-2xl mb-4 transition-all duration-500 group-hover:scale-110 z-10 ${
                      settings.groupMode === m.id ? 'text-black' : 'bg-zinc-900 text-zinc-600'
                    }`}
                    style={{ 
                      backgroundColor: settings.groupMode === m.id ? settings.themeColor : '',
                      boxShadow: settings.groupMode === m.id ? `0 0 40px ${settings.themeColor}55` : ''
                    }}
                  >
                    {m.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] z-10">{m.label}</span>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="config-tab"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* IDIOMAS: Integración con motor /ai/ */}
              <section className="text-left">
                <div className="flex items-center gap-3 mb-6">
                  <Globe size={14} style={{ color: settings.themeColor }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Target_Language_Core</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => updateSettings({ targetLanguage: lang.id })}
                      className={`p-4 rounded-2xl border transition-all flex items-center gap-3 text-[10px] font-bold uppercase ${
                        settings.targetLanguage === lang.id 
                        ? 'bg-white/10 text-white border-opacity-100 shadow-xl' 
                        : 'border-white/5 bg-zinc-950 text-zinc-500 hover:border-zinc-800'
                      }`}
                      style={{ borderColor: settings.targetLanguage === lang.id ? settings.themeColor : '' }}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                {/* COLORES: Espectro 10 Colores OLED */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Palette size={14} style={{ color: settings.themeColor }} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Espectro_Cromático_OLED</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {MENCIONAL_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateSettings({ themeColor: color })}
                        className="w-full aspect-square rounded-xl border-2 transition-all hover:scale-110 active:scale-90"
                        style={{ 
                          backgroundColor: color,
                          borderColor: settings.themeColor === color ? '#FFF' : 'transparent',
                          boxShadow: settings.themeColor === color ? `0 0 25px ${color}88` : 'none'
                        }}
                      />
                    ))}
                  </div>
                </section>

                {/* AUDIO: Sincronización Hardware desde /services/ai/ */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Mic2 size={14} style={{ color: settings.themeColor }} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Interface_Audio_Node</span>
                  </div>
                  <div className="flex gap-4">
                    {[
                      { id: 'headphones', label: 'Audífonos', icon: <Headphones size={16} /> },
                      { id: 'live', label: 'En Vivo', icon: <Sparkles size={16} /> }
                    ].map((audio) => (
                      <button
                        key={audio.id}
                        onClick={() => updateSettings({ audioOutput: audio.id as any })}
                        className={`flex-1 flex flex-col items-center gap-3 py-6 rounded-3xl border transition-all ${
                          settings.audioOutput === audio.id 
                          ? 'bg-white/5 text-white' 
                          : 'border-white/5 bg-zinc-950 text-zinc-600 hover:border-white/10'
                        }`}
                        style={{ borderColor: settings.audioOutput === audio.id ? settings.themeColor : '' }}
                      >
                        {audio.icon}
                        <span className="text-[9px] font-black uppercase tracking-widest">{audio.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER: DISPARADOR DE INMERSIÓN 100% REAL */}
      <div className="p-8 bg-zinc-950/80 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <ActivityStatus isAdmin={isAdmin} themeColor={settings.themeColor} />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          disabled={!settings.groupMode}
          className={`group flex items-center gap-6 px-12 py-6 rounded-full font-[1000] uppercase tracking-tighter italic transition-all ${
            !settings.groupMode
            ? 'opacity-20 cursor-not-allowed bg-zinc-900' 
            : 'text-black shadow-2xl hover:brightness-110 active:brightness-90'
          }`}
          style={{ 
            backgroundColor: !settings.groupMode ? '' : settings.themeColor,
            boxShadow: !settings.groupMode ? '' : `0 20px 50px ${settings.themeColor}44`
          }}
        >
          <div className="flex flex-col items-end">
            <span className="text-[12px] leading-none">Iniciar Inmersión</span>
            <span className="text-[8px] opacity-60 uppercase font-black tracking-widest mt-1">
                {settings.groupMode === 'individual' ? 'Modo_Solo_Activo' : 'Sincronizando_Nodos'}
            </span>
          </div>
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
};

const ActivityStatus: React.FC<{ isAdmin: boolean; themeColor: string }> = ({ isAdmin, themeColor }) => (
  <div className="flex flex-col text-left">
    <span className="text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-zinc-500">
      <Activity size={10} style={{ color: themeColor }} className="animate-pulse" /> Estado_Servicios_AI
    </span>
    <div className="flex items-center gap-2 mt-1">
      <div 
        className="w-2 h-2 rounded-full animate-ping" 
        style={{ backgroundColor: isAdmin ? themeColor : '#39FF14' }} 
      />
      <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">
        {isAdmin ? 'MENCIONAL_MASTER_NODE_ONLINE' : 'MENCIONAL_PARTICIPANT_LINKED'}
      </span>
    </div>
  </div>
);

export default InitialSettings;