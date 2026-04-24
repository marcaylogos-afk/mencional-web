/**
 * 🧊 MENCIONAL v2026.PROD | RESPONSE_PAGE
 * Función: Inmersión Lingüística con Refuerzo Auditivo 2x.
 * Protocolo: Fijación Neural rítmica (Impacto inicial + Repetición 2.8s).
 * Ubicación: /src/pages/ResponsePage.tsx
 * ✅ SERVICIOS AI: Sincronizados en /src/services/ai/
 */

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Activity } from "lucide-react";
import { useSettings } from '../context/SettingsContext'; 
import { useAudioAoede } from '../hooks/useAudioAoede'; 
import { useInterpreter } from '../hooks/useInterpreter'; 
// @ts-ignore - Assets logic
import logoIcon from '../assets/logo-ultra.png'; 

export const ResponsePage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { playSynthesis } = useAudioAoede(); // Conectado a /services/ai/geminiTTS.ts
  const { translatedText, isListening } = useInterpreter(); 
  
  const [displayStep, setDisplayStep] = useState(0);

  /**
   * 🛡️ CONTROL DE SEGURIDAD
   * Redirección si se detecta pérdida de configuración o sesión expirada.
   */
  useEffect(() => {
    if (!settings.targetLanguage || !settings.userName) {
      navigate('/login');
    }
  }, [settings, navigate]);

  /**
   * 🔄 PROTOCOLO DE FIJACIÓN NEURAL (Doble Impacto)
   * Orquestación: Impacto visual/auditivo inmediato + Repetición tras 2.8s.
   * Sincronizado con el motor centralizado en /services/ai/
   */
  useEffect(() => {
    if (translatedText && (settings.mode === 'learning' || settings.mode === 'rompehielo')) {
      // IMPACTO 1: Inmediato (Velocidad 1.1x para fluidez natural)
      setDisplayStep(1);
      playSynthesis(translatedText, 1.1); 

      // IMPACTO 2: Repetición táctica a los 2.8s (Fijación en memoria a largo plazo)
      const timer = setTimeout(() => {
        setDisplayStep(2); 
        playSynthesis(translatedText, 1.1);
      }, 2800);

      return () => {
        clearTimeout(timer);
        setDisplayStep(0);
      };
    }
  }, [translatedText, settings.mode, playSynthesis]);

  // Alerta de tiempo crítico (Menos de 5 minutos / 300s)
  const isTimeLow = useMemo(() => (settings.sessionTimeLeft || 0) <= 300, [settings.sessionTimeLeft]);

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6 flex flex-col items-center justify-between overflow-hidden relative font-sans select-none italic">
      
      {/* 🌌 GLOW OLED DINÁMICO */}
      <div 
        className="absolute inset-0 opacity-10 transition-all duration-1000 pointer-events-none" 
        style={{ 
          background: `radial-gradient(circle at center, ${settings.themeColor || '#00FBFF'} 0%, transparent 70%)` 
        }} 
      />

      {/* --- HEADER: CRONÓMETRO DE SESIÓN --- */}
      <header className="w-full flex justify-between items-center px-4 pt-4 z-50">
        <motion.div 
          animate={isTimeLow ? { scale: [1, 1.05, 1], borderColor: ['#3f3f46', '#dc2626', '#3f3f46'] } : {}}
          className={`flex items-center gap-4 px-6 py-2 rounded-full border-2 transition-all duration-700 ${
            isTimeLow ? 'bg-red-600/10' : 'border-white/10 bg-zinc-950/50 backdrop-blur-md'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isTimeLow ? 'bg-red-500 animate-pulse' : 'bg-[#39FF14] shadow-[0_0_10px_#39FF14]'}`} />
          <span className={`font-mono font-[1000] italic text-xl tracking-tighter tabular-nums ${isTimeLow ? 'text-red-500' : 'text-zinc-300'}`}>
            {Math.floor((settings.sessionTimeLeft || 0) / 60)}:
            {((settings.sessionTimeLeft || 0) % 60).toString().padStart(2, '0')}
          </span>
        </motion.div>
        
        <div className="flex flex-col items-end">
          <img src={logoIcon} alt="Mencional" className="w-10 h-10 opacity-60 drop-shadow-[0_0_15px_rgba(0,251,255,0.4)]" />
          <span className="text-[7px] font-black text-zinc-600 tracking-[0.4em] uppercase mt-1 italic">ULTRA_CORE_AI_LINK</span>
        </div>
      </header>

      {/* --- MAIN: TRADUCCIÓN INMERSIVA (REFUERZO VISUAL) --- */}
      <main className="flex-grow flex flex-col items-center justify-center text-center z-10 w-full max-w-6xl px-4">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${translatedText}-${displayStep}`}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ type: "spring", stiffness: 150, damping: 25 }}
            className="flex flex-col items-center"
          >
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.6em] mb-12 italic opacity-60">
              {isListening ? "📡 CAPTANDO_FRECUENCIA..." : "🧠 FIJACIÓN_NEURAL_ACTIVA"}
            </p>
            
            <h1 
              className="font-[1000] italic uppercase text-5xl md:text-[8rem] leading-[0.8] tracking-tighter transition-all duration-700"
              style={{ 
                color: settings.themeColor || '#00FBFF',
                textShadow: `0 0 80px ${settings.themeColor}55`
              }}
            >
              {translatedText || "READY_FOR_LINK"}
            </h1>
            
            {/* INDICADOR DE PASOS DE REPETICIÓN */}
            <div className="mt-20 flex gap-4">
              <div className={`h-1 w-24 rounded-full transition-all duration-1000 ${displayStep >= 1 ? 'shadow-[0_0_20px_#00FBFF]' : 'bg-zinc-900'}`} 
                style={{ backgroundColor: displayStep >= 1 ? settings.themeColor : '#18181b' }}
              />
              <div className={`h-1 w-24 rounded-full transition-all duration-1000 ${displayStep === 2 ? 'shadow-[0_0_20px_#00FBFF]' : 'bg-zinc-900'}`} 
                style={{ backgroundColor: displayStep === 2 ? settings.themeColor : '#18181b' }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- FOOTER: MODO ROMPEHIELO (SUGERENCIAS) --- */}
      <footer className="w-full flex flex-col items-center pb-12 z-50">
        <AnimatePresence>
          {settings.mode === 'rompehielo' && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 px-10 py-6 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-2 max-w-2xl border-b-[#00FBFF]/20"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FBFF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FBFF]"></span>
                </span>
                <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em] italic">Response_Engine_Active:</span>
              </div>
              <span className="text-white text-xl md:text-3xl font-[1000] italic uppercase tracking-tighter text-center leading-none">
                {settings.lastSuggestion || "Detectando_Matriz..."}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-12 flex flex-col items-center gap-2">
           <p className="text-[8px] font-[1000] text-zinc-800 uppercase tracking-[1.5em] opacity-30 italic">
            MENCIONAL_ULTRA_CORE // {settings.targetLanguage?.toUpperCase() || 'EN'}
          </p>
          <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>
      </footer>

      {/* --- PROTECCIÓN: SENSOR DE AUDIO --- */}
      <AnimatePresence>
        {!settings.micAuthorized && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-10 text-center"
          >
            <div className="max-w-md space-y-8">
              <div className="w-24 h-24 bg-rose-600/10 border-2 border-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto animate-pulse">
                <AlertTriangle className="text-rose-600" size={48} />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-rose-500">Error_Hardware</h2>
                <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest leading-loose">
                  El sistema requiere autorización del sensor de audio para iniciar la sincronización neural.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResponsePage;