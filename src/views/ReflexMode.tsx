/**
 * ⚡ MENCIONAL | REFLEX_MODE v2026.12
 * Protocolo: Respuesta neuronal inmediata con validación de roles.
 * Ubicación: /src/views/ReflexMode.tsx
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mic, MicOff, X, Sparkles, Activity, Globe, ShieldCheck } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../context/SettingsContext';
import { asrService } from '../services/ai/asr';
import { speechService } from '../services/ai/speech';
import { translateService } from '../services/ai/translateService';
import { logger } from '../utils/logger';

const ReflexMode: React.FC = () => {
  const { isAdmin, isPaid } = useAuth();
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(''); 
  const [neuralResponse, setNeuralResponse] = useState('SISTEMA EN ESPERA');
  const [showConfig, setShowConfig] = useState(true); 
  
  const audioLocked = useRef(false);
  const cycleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 🛡️ PROTECCIÓN DE ACCESO Y LIMPIEZA
   */
  useEffect(() => {
    const hasAccess = isAdmin || isPaid;
    if (!hasAccess) {
      logger.warn("ACCESO_DENEGADO: Intento de entrada sin sesión válida.");
      navigate('/payment');
    }

    // Cleanup al desmontar el componente
    return () => {
      asrService.stopListening();
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
      audioLocked.current = false;
    };
  }, [isAdmin, isPaid, navigate]);

  /**
   * 🧠 PROTOCOLO DE INFERENCIA PROFUNDA
   */
  const handleDeepInference = useCallback(async (text: string) => {
    if (audioLocked.current || text.trim().length < 2) return;
    
    audioLocked.current = true;
    try {
      const isInterpreter = settings.mode === 'interpreter';
      
      // 1. Traducción Neural vía Gemini 2.0 Flash
      const translatedText = await translateService.translate(
        text, 
        settings.practiceLanguage,
        isInterpreter
      );
      
      setNeuralResponse(translatedText.toUpperCase());

      // 2. Ejecución de Audio Protocolar
      if (isInterpreter) {
        await speechService.ultraInterpreterSync(translatedText, 'es-MX');
      } else {
        await speechService.learningFocus(translatedText, settings.practiceLanguage as any);
      }

      // 3. Ventana de bloqueo técnica
      const windowMs = isInterpreter ? 12000 : 5000; // Ajuste de tiempos por feedback de usuario
      cycleTimeoutRef.current = setTimeout(() => {
        audioLocked.current = false;
        if (isListening) {
           setNeuralResponse(isInterpreter ? "READY_TO_SYNC" : "ESCUCHANDO...");
        }
      }, windowMs);

    } catch (error) {
      logger.error("REFLEX_ERROR:", error);
      setNeuralResponse("ERROR_DE_INFERENCIA");
      audioLocked.current = false;
    }
  }, [settings.practiceLanguage, settings.mode, isListening]);

  const toggleMic = () => {
    if (isListening) {
      asrService.stopListening();
      setIsListening(false);
      setNeuralResponse("SESIÓN PAUSADA");
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
      audioLocked.current = false;
    } else {
      setIsListening(true);
      setTranscript("");
      setNeuralResponse("INICIANDO...");
      asrService.startListening((text, isFinal) => {
        setTranscript(text);
        if (isFinal) handleDeepInference(text);
      }, settings.nativeLanguage);
    }
  };

  // --- VISTA DE CONFIGURACIÓN ---
  if (showConfig) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans selection:bg-[#00FBFF] selection:text-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-zinc-900/40 border border-[#00FBFF]/20 rounded-[3rem] p-10 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,251,255,0.1)]"
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-[#00FBFF]/10 rounded-3xl flex items-center justify-center mb-6 border border-[#00FBFF]/30">
              <Globe className="text-[#00FBFF] animate-pulse" size={40} />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Sincronización</h2>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck size={12} className="text-[#00FBFF]" />
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold">Protocolo_Inmersión_V26.12</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 italic">Idioma de Destino</label>
              <select 
                className="w-full bg-black border-2 border-white/5 p-6 rounded-2xl text-white font-black uppercase italic tracking-widest outline-none focus:border-[#00FBFF] transition-all appearance-none text-center cursor-pointer"
                value={settings.practiceLanguage}
                onChange={(e) => updateSettings({ practiceLanguage: e.target.value })}
              >
                <option value="en-US">🇺🇸 ENGLISH (US)</option>
                <option value="fr-FR">🇫🇷 FRANÇAIS</option>
                <option value="de-DE">🇩🇪 DEUTSCH</option>
                <option value="it-IT">🇮🇹 ITALIANO</option>
                <option value="pt-BR">🇧🇷 PORTUGUÊS</option>
              </select>
            </div>
            
            <button 
              onClick={() => setShowConfig(false)}
              className="w-full py-7 bg-[#00FBFF] text-black font-[1000] uppercase italic rounded-2xl shadow-[0_0_40px_rgba(0,251,255,0.4)] hover:shadow-[0_0_60px_rgba(0,251,255,0.6)] active:scale-95 transition-all text-lg"
            >
              Iniciar Ciclo Neuronal
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 flex flex-col font-sans relative overflow-hidden select-none">
      
      {/* 🌌 HUD SUPERIOR */}
      <header className="flex justify-between items-center mb-10 relative z-20">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${isListening ? 'bg-[#00FBFF]/10 border-[#00FBFF]/50 shadow-[0_0_30px_rgba(0,251,255,0.3)]' : 'bg-white/5 border-white/10 opacity-40'}`}>
            <Zap className={isListening ? "text-[#00FBFF]" : "text-zinc-600"} size={28} />
          </div>
          <div>
            <h1 className="text-[11px] font-black tracking-[0.5em] text-zinc-500 uppercase italic leading-none">
              {settings.mode === 'interpreter' ? 'ULTRA_INTERPRETER_SYNC' : 'LEARNING_REFLEX_ENGINE'}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Activity size={12} className={isListening ? "text-[#00FBFF] animate-pulse" : "text-zinc-800"} />
              <span className={`text-[9px] italic uppercase tracking-[0.2em] font-black ${isListening ? 'text-[#00FBFF]' : 'text-zinc-700'}`}>
                {isListening ? 'Neural_Link_Established' : 'Standby_Sequence'}
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/selector')} 
          className="w-14 h-14 flex items-center justify-center bg-zinc-900/50 rounded-full hover:bg-rose-600/20 text-zinc-500 hover:text-rose-500 transition-all border border-white/5 shadow-xl"
          aria-label="Cerrar modo réflex"
        >
          <X size={24} />
        </button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full flex flex-col gap-8 relative z-10 justify-between pb-10">
        
        {/* 🌠 PANEL A: NEURAL OUTPUT */}
        <section className={`flex-[4] rounded-[5rem] p-12 md:p-24 flex flex-col items-center justify-center border-2 transition-all duration-1000 relative ${
          isListening ? 'border-[#00FBFF]/30 bg-[#00FBFF]/[0.01] shadow-[inset_0_0_150px_rgba(0,251,255,0.08)]' : 'border-white/5 opacity-20 scale-95'
        }`}>
          <div className="absolute top-10 flex items-center gap-2 text-[10px] font-black text-[#00FBFF] tracking-[1em] uppercase opacity-40">
            <Sparkles size={12} /> Target_Output
          </div>
          
          <AnimatePresence mode="wait">
            <motion.h2 
              key={neuralResponse}
              initial={{ opacity: 0, y: 20, filter: 'blur(15px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(15px)' }}
              transition={{ duration: 0.4 }}
              className="text-5xl md:text-8xl font-[1000] uppercase italic text-center tracking-tighter leading-[0.85] text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              {neuralResponse}
            </motion.h2>
          </AnimatePresence>
        </section>

        {/* 🎙️ PANEL B: SOURCE INPUT */}
        <section className="bg-zinc-900/40 rounded-[3.5rem] border-2 border-white/5 p-10 flex flex-col items-center justify-center min-h-[200px] backdrop-blur-3xl relative">
          <div className="text-[10px] font-[1000] uppercase text-zinc-600 flex items-center gap-3 tracking-[0.6em] mb-6 italic">
            <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-[#00FBFF] animate-ping' : 'bg-zinc-800'}`} />
            {settings.mode === 'interpreter' ? 'INCOMING_SIGNAL' : 'REFERENCIA_NATAL'}
          </div>
          <p className="text-2xl md:text-3xl font-black text-zinc-400 uppercase text-center italic tracking-tight leading-tight max-w-3xl">
            {transcript || "SISTEMA_ESPERANDO_SEÑAL..."}
          </p>
        </section>

        {/* 🔘 CONTROL MAESTRO */}
        <button 
          onClick={toggleMic}
          className={`group w-full py-14 rounded-[4rem] flex flex-col items-center gap-4 transition-all active:scale-[0.97] border-4 shadow-3xl overflow-hidden relative ${
            isListening 
              ? 'bg-rose-600 border-rose-400 text-white' 
              : 'bg-white text-black border-transparent'
          }`}
        >
          {isListening ? <MicOff size={48} className="relative z-10" /> : <Mic size={48} className="relative z-10" />}
          <span className="text-sm font-black uppercase italic tracking-[0.3em] relative z-10">
            {isListening ? 'Terminar_Sincronización' : 'Iniciar_Captura_Neural'}
          </span>
          {isListening && (
             <motion.div 
               layoutId="pulse"
               className="absolute inset-0 bg-rose-500 opacity-20"
               animate={{ opacity: [0.2, 0.5, 0.2] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
             />
          )}
        </button>
      </main>

      {/* 🧬 DECORACIÓN NEURAL OLED */}
      <div className="fixed -bottom-20 -left-20 w-96 h-96 bg-[#00FBFF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -top-20 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default ReflexMode;