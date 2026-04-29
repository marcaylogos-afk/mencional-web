/**
 * 🎙️ MENCIONAL | NEURAL_SESSION_INTERFACE v2026.PROD
 * Componente: Vista Principal del Participante (SessionParticipantView)
 * Función: Orquestador de protocolos (6s/19s), Feedback visual por color y Reloj OLED.
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Waves, Terminal, LogOut, 
  Headphones, Radio, Info, Zap, Cpu 
} from 'lucide-react';

// Componentes y Hooks Sincronizados
import { useSettings } from '../../context/SettingsContext';
import { useSessionLogic } from '../../hooks/useSessionLogic'; 
import { logger } from '../../utils/logger';

const SessionParticipantView: React.FC = () => {
  const { settings } = useSettings();
  
  // Orquestador 6s/19s: Maneja la captura, traducción y el "doble impacto" de Voz Aoede
  const { 
    sourceText, 
    translatedText, 
    isProcessing, 
    playManualAudio,
    suggestions 
  } = useSessionLogic();

  // --- ESTADOS DE SESIÓN ---
  const [isListening, setIsListening] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(1800); // 30 min (v2.6 Protocol)
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

  const isEnding = secondsRemaining <= 300; // Alerta en los últimos 5 minutos

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-between p-6 overflow-hidden relative font-sans italic selection:bg-white/20">
      
      {/* 🌌 AURA REACTIVA (Color Sincronizado con Nodo) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            opacity: isListening ? [0.15, 0.35, 0.15] : 0.08,
            scale: isListening ? [1, 1.1, 1] : 1 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full blur-[180px]"
          style={{ backgroundColor: settings.themeColor || '#00FBFF' }}
        />
      </div>

      {/* 🛰️ HEADER: TELEMETRÍA Y RELOJ OLED */}
      <header className="w-full max-w-7xl flex justify-between items-start z-20">
        <div className="flex gap-5">
          <div 
            className="p-3.5 bg-zinc-900/30 rounded-2xl border transition-colors duration-700 backdrop-blur-2xl"
            style={{ borderColor: `${settings.themeColor}30` }}
          >
            <Terminal size={20} style={{ color: settings.themeColor }} className="animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-[10px] font-black uppercase tracking-[0.6em] text-white leading-none">Mencional_Node_v2.6</h1>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-2 flex items-center gap-2">
              <Cpu size={8} /> Neural_Link_Active
            </p>
          </div>
        </div>

        {/* RELOJ DISCRETO: Reactivo al tiempo crítico */}
        <motion.div 
          animate={isEnding ? { scale: [1, 1.05, 1] } : {}}
          className={`flex flex-col items-end px-8 py-4 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 ${
            isEnding ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_40px_rgba(239,68,68,0.1)]' : 'border-white/5 bg-zinc-950/40'
          }`}
        >
          <span className="text-[9px] font-[1000] uppercase tracking-[0.4em] opacity-30 mb-1">Session_Clock</span>
          <span className="text-4xl font-[1000] tracking-tighter" style={{ color: isEnding ? '#FF3131' : settings.themeColor }}>
            {formatTime(secondsRemaining)}
          </span>
        </motion.div>
      </header>

      {/* 🎙️ ÁREA CENTRAL: FEEDBACK KARAOKE (Protocolo 6s/19s) */}
      <main className="relative flex flex-col items-center justify-center z-10 w-full max-w-5xl flex-1 gap-12">
        
        <div className="w-full text-center min-h-[200px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {translatedText ? (
              <motion.div
                key={translatedText}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Doble impacto visual: Texto Principal y Eco Karaoke */}
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none" style={{ color: settings.themeColor }}>
                  {translatedText}
                </h2>
                <p className="text-xl md:text-2xl opacity-20 font-bold uppercase tracking-[0.5em] italic">
                  {translatedText}
                </p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}>
                <Zap size={48} className="mx-auto text-zinc-500 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600 italic">Esperando_Entrada_Neural</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback en tiempo real del input de voz */}
          <div className="mt-8 h-6">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] italic animate-pulse">
              {sourceText || (isProcessing ? "Procesando_Voz_Aoede..." : "")}
            </p>
          </div>
        </div>

        {/* ORBE DE CAPTURA REACTIVO */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsListening(!isListening)}
          className={`w-56 h-56 rounded-full flex items-center justify-center border-[12px] transition-all duration-1000 relative group ${
            isListening 
              ? 'bg-white border-white shadow-[0_0_100px_rgba(255,255,255,0.2)]' 
              : 'bg-[#050505] border-zinc-900 shadow-2xl hover:border-zinc-700'
          }`}
        >
          {isListening ? (
            <Waves size={70} className="text-black animate-[pulse_1.5s_infinite]" strokeWidth={2.5} />
          ) : (
            <Mic size={70} className="text-zinc-800 group-hover:text-zinc-500 transition-colors" strokeWidth={2.5} />
          )}
          
          {/* Anillo de progreso de procesamiento */}
          {isProcessing && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-18px] border-t-4 border-r-4 rounded-full opacity-50"
              style={{ borderColor: settings.themeColor }}
            />
          )}
        </motion.button>

        {/* ACORDEÓN DE APOYO: Frases Sugeridas cada 19s */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4">
          {suggestions.map((phrase, i) => (
            <motion.button
              key={phrase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => playManualAudio(phrase)}
              className="p-6 bg-zinc-950/50 border border-white/5 rounded-3xl hover:border-white/20 transition-all text-left group relative overflow-hidden backdrop-blur-md active:scale-95"
            >
              <span className="text-[9px] block opacity-30 uppercase font-black mb-2 tracking-widest">Neural_Sugg_{i+1}</span>
              <p className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors leading-relaxed">
                {phrase}
              </p>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap size={12} style={{ color: settings.themeColor }} />
              </div>
            </motion.button>
          ))}
        </div>
      </main>

      {/* 🎨 FOOTER: CONTROLES DE AUDIO Y PROTOCOLO DE SALIDA */}
      <footer className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center z-20 pt-8 border-t border-white/5 gap-6">
        
        <div className="flex bg-[#050505] p-1.5 rounded-[2rem] border border-white/10 shadow-inner">
          <button 
            onClick={() => setAudioMode('headphones')}
            className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all ${
              audioMode === 'headphones' ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <Headphones size={14} /> Audífonos_E2E
          </button>
          <button 
            onClick={() => setAudioMode('live')}
            className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all ${
              audioMode === 'live' ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <Radio size={14} /> Neural_Live
          </button>
        </div>

        <button 
          onClick={() => { 
            logger.info("SESSION", "Manual termination triggered"); 
            window.location.href = '/'; 
          }}
          className="flex items-center gap-4 px-10 py-5 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 group"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">Cerrar_Nodo</span>
          <LogOut size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>

      </footer>

      {/* PANEL DE RECARGA (Aparece a los 5min restantes) */}
      <AnimatePresence>
        {isEnding && (
          <motion.div 
            initial={{ y: 200, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-[#080808] border-2 border-red-600 p-8 rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-red-600 p-3 rounded-2xl text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                <Info size={22} />
              </div>
              <div>
                <h3 className="font-black uppercase text-sm tracking-tighter text-white">Sincronización Crítica</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Tiempo_Agotándose</p>
              </div>
            </div>
            <p className="text-[12px] text-zinc-400 mb-8 italic leading-relaxed">Sincroniza otros 30 minutos para mantener la inmersión sin interrupciones neurales.</p>
            <button className="w-full py-6 bg-white text-black rounded-[2rem] font-[1000] uppercase text-[11px] tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
              Extender Sesión ($50 MXN)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SessionParticipantView;