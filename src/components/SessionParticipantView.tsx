/**
 * 🎙️ MENCIONAL | NEURAL_SESSION_INTERFACE v2026.PROD
 * Componente: Vista Principal del Participante (SessionParticipantView)
 * Función: Orquestador de protocolos (6s/19s), Feedback visual por color y Reloj OLED.
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Waves, ShieldCheck, Terminal, Cpu, Info, LogOut, Headphones, Radio } from 'lucide-react';

// Componentes y Hooks Sincronizados
import { useSettings } from '../../context/SettingsContext';
import { useSessionLogic } from '../../hooks/useSessionLogic'; // Orquestador 6s/19s
import { logger } from '../../utils/logger';

const SessionParticipantView: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { 
    sourceText, 
    translatedText, 
    isProcessing, 
    playManualAudio,
    suggestions 
  } = useSessionLogic(settings.activeMode, settings.targetLanguage);

  // --- ESTADOS DE SESIÓN ---
  const [isListening, setIsListening] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(1200); // 20 min iniciales
  const [audioMode, setAudioMode] = useState<'headphones' | 'live'>('headphones');

  // --- 🕒 LÓGICA DEL RELOJ DISCRETO (OLED Optimized) ---
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isEnding = secondsRemaining <= 300; // Últimos 5 minutos

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6 overflow-hidden relative font-sans italic">
      
      {/* 🌌 AURA REACTIVA (Color según el participante/configuración) */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            opacity: isListening ? [0.1, 0.25, 0.1] : 0.05,
            scale: isListening ? [1, 1.05, 1] : 1 
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[160px]"
          style={{ backgroundColor: settings.themeColor }}
        />
      </div>

      {/* 🛰️ HEADER: TELEMETRÍA Y RELOJ PARPADEANTE */}
      <header className="w-full max-w-7xl flex justify-between items-start z-20">
        <div className="flex gap-4">
          <div className="p-3 bg-zinc-900/50 rounded-2xl border border-white/10 backdrop-blur-xl">
            <Terminal size={18} style={{ color: settings.themeColor }} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-1">Mencional_Node_v2.6</h1>
            <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest italic">Encrypted_Session_Active</p>
          </div>
        </div>

        {/* RELOJ DISCRETO: Se agranda y parpadea a los 5min */}
        <motion.div 
          animate={isEnding ? { scale: [1, 1.1, 1], opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className={`flex flex-col items-end px-6 py-3 rounded-2xl border backdrop-blur-md transition-all ${
            isEnding ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 bg-zinc-900/20'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Tiempo_Restante</span>
          <span className="text-3xl font-[1000] tracking-tighter" style={{ color: isEnding ? '#FF3131' : settings.themeColor }}>
            {formatTime(secondsRemaining)}
          </span>
        </motion.div>
      </header>

      {/* 🎙️ ÁREA CENTRAL: FEEDBACK KARAOKE Y TRADUCCIÓN (Protocolo 6s/19s) */}
      <main className="relative flex flex-col items-center justify-center z-10 w-full max-w-4xl flex-1 gap-8">
        
        {/* BLOQUE DE TRADUCCIÓN (2 REPETICIONES / TEXTO GRANDE / NEGRITAS) */}
        <div className="w-full text-center space-y-6">
          <AnimatePresence mode="wait">
            {translatedText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none" style={{ color: settings.themeColor }}>
                  {translatedText}
                </h2>
                {/* Estilo Karaoke / Repetición Visual */}
                <p className="text-lg opacity-40 font-bold uppercase tracking-widest">
                  {translatedText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TEXTO DE ORIGEN (FEEDBACK EN TIEMPO REAL) */}
          <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.4em] animate-pulse">
            {sourceText}
          </p>
        </div>

        {/* ORBE DE CAPTURA REACTIVO */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsListening(!isListening)}
          className={`w-48 h-48 rounded-full flex items-center justify-center border-[10px] transition-all duration-700 ${
            isListening ? 'bg-white border-white shadow-[0_0_80px_rgba(255,255,255,0.2)]' : 'bg-zinc-950 border-zinc-900'
          }`}
        >
          {isListening ? (
            <Waves size={60} className="text-black animate-pulse" />
          ) : (
            <Mic size={60} className="text-zinc-800" />
          )}
        </motion.button>

        {/* ACORDEÓN DE APOYO (MINÚSCULAS/MAYÚSCULAS - CADA 19s) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {suggestions.map((phrase, i) => (
            <button
              key={i}
              onClick={() => playManualAudio(phrase)}
              className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-white/20 transition-all text-left group"
            >
              <span className="text-[10px] block opacity-40 uppercase font-black mb-1">Sugerencia_{i+1}</span>
              <p className="text-sm font-medium text-zinc-300 group-hover:text-white">
                {phrase} {/* Renderizado en Mixto: Mayúsculas y minúsculas */}
              </p>
            </button>
          ))}
        </div>
      </main>

      {/* 🎨 FOOTER: CONTROLES DE AUDIO Y SALIDA */}
      <footer className="w-full max-w-7xl flex justify-between items-center z-20 pt-6 border-t border-white/5">
        
        {/* SELECTOR DE AUDIO: Audífonos vs En Vivo */}
        <div className="flex bg-zinc-950 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setAudioMode('headphones')}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
              audioMode === 'headphones' ? 'bg-white text-black' : 'text-zinc-500'
            }`}
          >
            <Headphones size={14} /> Audífonos
          </button>
          <button 
            onClick={() => setAudioMode('live')}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
              audioMode === 'live' ? 'bg-white text-black' : 'text-zinc-500'
            }`}
          >
            <Radio size={14} /> En Vivo
          </button>
        </div>

        {/* BOTÓN DE SALIDA PROFESIONAL */}
        <button 
          onClick={() => { logger.info("SESSION", "Cierre manual"); window.location.href = '/'; }}
          className="flex items-center gap-3 px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Finalizar_Nodo</span>
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

      </footer>

      {/* AVISO DE FINALIZACIÓN (20 MIN) */}
      <AnimatePresence>
        {isEnding && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-zinc-900 border-2 border-red-500 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-500 p-2 rounded-full text-black"><Info size={20} /></div>
              <h3 className="font-black uppercase text-sm tracking-tighter">Sesión por agotar tiempo</h3>
            </div>
            <p className="text-[11px] text-zinc-400 mb-6 italic">Sincroniza otros 20 minutos para continuar la conversación sin interrupciones.</p>
            <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all">
              Añadir 20 Minutos ($20 MXN)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SessionParticipantView;