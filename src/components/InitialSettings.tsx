/**
 * 🛰️ MENCIONAL | INITIAL_SETTINGS v2026.PROD
 * Ubicación: /src/components/InitialSettings.tsx
 * Objetivo: Configuración previa de sesión con lógica de permisos y estética OLED.
 * ✅ DIRECTORIO AI: Sincronizado a /services/ai/
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, User, Users2, Headphones, 
  Mic2, Palette, Globe, ChevronRight, Sparkles, Activity, ShieldCheck
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";

// ✅ Espectro Cromático Oficial Mencional (Optimizado para Negros Puros)
const MENCIONAL_COLORS = [
  "#00FBFF", // 0. Cian (Default)
  "#39FF14", // 1. Verde Neón (Master Node)
  "#FF00F5", // 2. Fucsia
  "#FFFF00", // 3. Amarillo
  "#FF3131", // 4. Rojo Neón
  "#A855F7", // 5. Púrpura Ultra
  "#FF9900", // 6. Naranja
  "#00FFAB", // 7. Aquamarina
  "#FFFFFF", // 8. Blanco Puro
  "#18181B"  // 9. Zinc
];

const InitialSettings: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'MODE' | 'CONFIG'>('MODE');

  // Identificación de Nodo Maestro (Acceso Root)
  const isMaster = useMemo(() => 
    settings.userAlias?.toLowerCase() === 'osos' || settings.role === 'admin', 
  [settings]);

  // ✅ Auto-configuración Maestro: Color y Target predeterminado
  useEffect(() => {
    if (isMaster && settings.themeColor !== '#39FF14') {
      updateSettings({ themeColor: '#39FF14' });
    }
    if (!settings.targetLanguage) {
      updateSettings({ targetLanguage: 'en-US' });
    }
  }, [isMaster, settings.targetLanguage, settings.themeColor, updateSettings]);

  const participationModes = [
    { id: 'individual', label: 'INDIVIDUAL', icon: <User size={22} />, desc: 'Vínculo Único' },
    { id: 'duo', label: 'DÚO', icon: <Users size={22} />, desc: 'Cluster Dual' },
    { id: 'trio', label: 'TRÍO', icon: <Users2 size={22} />, desc: 'Red Tripartita' },
  ];

  const languages = [
    { id: 'en-US', label: 'Inglés', flag: '🇺🇸' },
    { id: 'es-MX', label: 'Español', flag: '🇲🇽' },
    { id: 'fr-FR', label: 'Francés', flag: '🇫🇷' },
    { id: 'de-DE', label: 'Alemán', flag: '🇩🇪' },
    { id: 'it-IT', label: 'Italiano', flag: '🇮🇹' },
    { id: 'pt-BR', label: 'Portugués', flag: '🇧🇷' },
    { id: 'ja-JP', label: 'Japonés', flag: '🇯🇵' },
    { id: 'auto', label: 'Detectar', flag: '🛰️' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-black border border-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,1)] relative z-50 italic">
      
      {/* 🟢 HEADER: IDENTIDAD DE NODO */}
      <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center bg-zinc-950/20 gap-8">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div 
            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-black border transition-all duration-700"
            style={{ borderColor: `${settings.themeColor}44`, boxShadow: `0 0 30px ${settings.themeColor}11` }}
          >
             <Activity size={32} style={{ color: settings.themeColor }} className="animate-pulse" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-[1000] tracking-tighter text-white uppercase leading-none">
              {isMaster ? 'MAESTRO_INTERFACE' : 'TERMINAL_SESSION'}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck size={10} style={{ color: settings.themeColor }} />
              <p className="text-[10px] text-zinc-600 font-black tracking-[0.3em] uppercase">
                {isMaster ? 'BYPASS_ENABLED // ROOT_OSOS' : 'PROTOCOL_V2.6 // MX_NODE'}
              </p>
            </div>
          </div>
        </div>
        
        {/* NAVEGACIÓN TÁCTICA */}
        <div className="flex bg-[#050505] p-1.5 rounded-full border border-white/10">
          {[
            { id: 'MODE', label: '1. CAPACIDAD' },
            { id: 'CONFIG', label: '2. PROTOCOLO' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3 rounded-full text-[11px] font-[1000] transition-all uppercase tracking-[0.2em] ${
                activeTab === tab.id 
                ? 'bg-white text-black shadow-xl scale-105' 
                : 'text-zinc-700 hover:text-zinc-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🔴 CONTENIDOR DINÁMICO */}
      <div className="p-12 min-h-[480px] bg-black">
        <AnimatePresence mode="wait">
          {activeTab === 'MODE' ? (
            <motion.div 
              key="mode-tab"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {participationModes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    updateSettings({ groupMode: m.id as any });
                    setActiveTab('CONFIG');
                  }}
                  className={`flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-2 transition-all duration-500 group relative ${
                    settings.groupMode === m.id 
                    ? 'bg-zinc-950/40' 
                    : 'border-white/5 bg-black hover:border-white/10'
                  }`}
                  style={{ borderColor: settings.groupMode === m.id ? settings.themeColor : '' }}
                >
                  <div 
                    className={`p-6 rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110 ${
                      settings.groupMode === m.id ? 'text-black' : 'bg-zinc-900 text-zinc-700'
                    }`}
                    style={{ 
                      backgroundColor: settings.groupMode === m.id ? settings.themeColor : '',
                      boxShadow: settings.groupMode === m.id ? `0 0 50px ${settings.themeColor}33` : ''
                    }}
                  >
                    {m.icon}
                  </div>
                  <span className="text-sm font-[1000] uppercase tracking-[0.3em] mb-1">{m.label}</span>
                  <span className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">{m.desc}</span>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="config-tab"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-16"
            >
              {/* TARGET LANGUAGE SELECTION */}
              <section className="text-left">
                <div className="flex items-center gap-3 mb-8">
                  <Globe size={16} style={{ color: settings.themeColor }} />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-700">IA_Target_Focus</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => updateSettings({ targetLanguage: lang.id })}
                      className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 text-[11px] font-black uppercase tracking-wider ${
                        settings.targetLanguage === lang.id 
                        ? 'bg-zinc-900 text-white shadow-2xl' 
                        : 'border-white/5 bg-black text-zinc-700 hover:border-white/10'
                      }`}
                      style={{ borderColor: settings.targetLanguage === lang.id ? settings.themeColor : '' }}
                    >
                      <span className="text-xl grayscale-[0.4]">{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
                {/* COLOR PALETTE */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <Palette size={16} style={{ color: settings.themeColor }} />
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-700">Hardware_Accent</span>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {MENCIONAL_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateSettings({ themeColor: color })}
                        className="w-full aspect-square rounded-xl border-2 transition-all hover:scale-110"
                        style={{ 
                          backgroundColor: color,
                          borderColor: settings.themeColor === color ? '#FFF' : 'transparent',
                          boxShadow: settings.themeColor === color ? `0 0 25px ${color}55` : 'none'
                        }}
                      />
                    ))}
                  </div>
                </section>

                {/* AUDIO ROUTING */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <Mic2 size={16} style={{ color: settings.themeColor }} />
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-700">Audio_Output_Node</span>
                  </div>
                  <div className="flex gap-4">
                    {[
                      { id: 'headphones', label: 'Monitorizado', icon: <Headphones size={20} /> },
                      { id: 'live', label: 'Ambiente', icon: <Sparkles size={20} /> }
                    ].map((audio) => (
                      <button
                        key={audio.id}
                        onClick={() => updateSettings({ audioOutput: audio.id as any })}
                        className={`flex-1 flex flex-col items-center gap-4 py-8 rounded-[2rem] border-2 transition-all ${
                          settings.audioOutput === audio.id 
                          ? 'bg-zinc-950 text-white' 
                          : 'border-white/5 bg-black text-zinc-700 hover:border-white/10'
                        }`}
                        style={{ borderColor: settings.audioOutput === audio.id ? settings.themeColor : '' }}
                      >
                        {audio.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest">{audio.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🔵 FOOTER: ACCIÓN DE INMERSIÓN */}
      <div className="p-10 bg-[#020202] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <ActivityStatus isMaster={isMaster} themeColor={settings.themeColor} />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          disabled={!settings.groupMode}
          className={`group flex items-center gap-10 px-16 py-8 rounded-full font-[1000] uppercase tracking-tighter italic transition-all ${
            !settings.groupMode
            ? 'opacity-20 cursor-not-allowed bg-zinc-900 text-zinc-700' 
            : 'text-black shadow-2xl'
          }`}
          style={{ 
            backgroundColor: !settings.groupMode ? '' : settings.themeColor,
            boxShadow: !settings.groupMode ? '' : `0 15px 40px ${settings.themeColor}44`
          }}
        >
          <div className="flex flex-col items-end">
            <span className="text-xl leading-none">Activar Inmersión</span>
            <span className="text-[9px] opacity-70 uppercase font-black tracking-[0.2em] mt-1">
                {isMaster ? 'Root_Access_Ready' : 'Block_Session_Secure'}
            </span>
          </div>
          <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
        </motion.button>
      </div>
    </div>
  );
};

const ActivityStatus: React.FC<{ isMaster: boolean; themeColor: string }> = ({ isMaster, themeColor }) => (
  <div className="flex flex-col text-left">
    <span className="text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-3 text-zinc-800 mb-2">
      <Activity size={12} style={{ color: themeColor }} className="animate-pulse" /> Core_Diagnostics
    </span>
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="w-1.5 h-1.5 rounded-full animate-pulse" 
            style={{ backgroundColor: isMaster ? themeColor : '#00FBFF', animationDelay: `${i * 0.2}s` }} 
          />
        ))}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
        {isMaster ? 'MASTER_OSOS_IDENTIFIED_SECURE' : 'PARTICIPANT_LINK_STABLE'}
      </span>
    </div>
  </div>
);

export default InitialSettings;