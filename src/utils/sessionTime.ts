/**
 * 🛰️ MENCIONAL | NEURAL_SESSION_DASHBOARD v2026.12
 * Ubicación: /src/components/SessionTime.tsx
 * Función: Dashboard de monitoreo, transcripción dual y ciclo de 19s (o 6s) con Audio Aoede.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Activity, ShieldCheck, LogOut, Zap } from 'lucide-react';

// ✅ MOTORES DE PRODUCCIÓN
import { useAuth } from '../context/AuthProvider';
import { useSettings } from '../context/SettingsContext';
import { startASR, stopASR } from '../services/ai/asr'; 
import { callGeminiTranslate } from '../services/ai/translateService';
import { speechService } from '../services/ai/geminiTTS';
import { CommitmentEngine } from '../services/logic/CommitmentEngine';
import TimerDisplay from './TimerDisplay';
import { logger } from '../utils/logger';
import { offlineData } from '../constants/offlineData';

export const SessionDashboard: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  
  // ⏱️ Sincronización MENCIONAL: Bloque exacto de 20 minutos (1200s)
  const [seconds, setSeconds] = useState(1200); 
  const [isListening, setIsListening] = useState(true);
  
  // Transcripción Dual Neural
  const [transcriptOriginal, setTranscriptOriginal] = useState("SISTEMA_ESTABLE...");
  const [transcriptTarget, setTranscriptTarget] = useState("ESCUCHANDO_AUDIO...");
  const [supportPhrase, setSupportPhrase] = useState(""); 
  
  const cycleRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Alerta Visual "time-low-pulse" (< 5 min)
  const isTimeLow = seconds <= 300;

  /**
   * ⏲️ CONTROLADOR DE TIEMPO DE SESIÓN
   */
  useEffect(() => {
    if (!isListening || seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsListening(false);
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isListening, seconds]);

  const handleSessionEnd = () => {
    speechService.stop();
    logger.info("SESSION_COMPLETED", "Bloque de 20min finalizado.");
    navigate('/summary');
  };

  /**
   * 🎙️ PROTOCOLO NEURAL (19s INTÉRPRETE / 6s APRENDIZAJE)
   */
  const executeNeuralCycle = useCallback(async () => {
    if (!isListening) return;
    
    // Captura diferenciada: 18s efectivos para Admin, 5.5s para aprendizaje
    const captureTime = isAdmin ? 18000 : 5500; 

    // Rotar frase de apoyo para combatir nervios
    const phrases = offlineData.supportPhrases || ["Keep speaking...", "You are doing great"];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setSupportPhrase(randomPhrase);

    recognitionRef.current = startASR(async (textDetected, isFinal) => {
      if (!isFinal || !textDetected?.trim()) return;

      try {
        const translation = await callGeminiTranslate(
          textDetected, 
          isAdmin ? 'Spanish' : settings.targetLanguage
        );

        setTranscriptOriginal(textDetected.toUpperCase());
        setTranscriptTarget(translation.toUpperCase());

        if (isAdmin) {
          // Modo Maestro: Velocidad Ultra para interpretación en tiempo real
          await speechService.speak(translation, { speed: 1.5 });
        } else {
          // Modo Aprendizaje: Repetición auditiva para fijación neural
          await speechService.speak(translation, { speed: 1.0 });
        }
      } catch (err) {
        logger.error("CYCLE_EXECUTION", err);
      }
    }, settings.targetLanguage === 'en-US' ? 'en-US' : 'es-MX');

    // Cierre de ventana de escucha según el rol
    setTimeout(() => {
      if (recognitionRef.current) stopASR(recognitionRef.current);
    }, captureTime);

  }, [isListening, isAdmin, settings.targetLanguage]);

  // Orquestador del bucle táctico
  useEffect(() => {
    if (isListening) {
      executeNeuralCycle(); 
      const intervalTime = isAdmin ? 19000 : 6000; 
      cycleRef.current = setInterval(executeNeuralCycle, intervalTime); 
      
      return () => {
        if (cycleRef.current) clearInterval(cycleRef.current);
        if (recognitionRef.current) stopASR(recognitionRef.current);
        speechService.stop();
      };
    }
  }, [isListening, executeNeuralCycle, isAdmin]);

  const handleExitRequest = () => {
    if (window.confirm("ATENCIÓN: Si sales ahora, el bloque de 20 min se consumirá. ¿Deseas continuar?")) {
      CommitmentEngine.handlePrematureExit(); 
      logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-between overflow-hidden relative font-sans">
      
      {/* 🌌 GLOW DINÁMICO OLED */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 transition-all duration-1000"
        style={{ background: `radial-gradient(circle at center, ${settings.selectedColor?.hex || '#00FBFF'}, transparent 70%)` }}
      />

      {/* HEADER: TELEMETRÍA */}
      <header className="w-full max-w-7xl flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <Activity size={16} className="animate-pulse text-[#00FBFF]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase italic">
              {isAdmin ? 'OPERADOR_MASTER' : 'NODE_PARTICIPANT_LINK'}
            </span>
            <span className="text-[8px] text-zinc-700 font-mono tracking-tighter">NEURAL_SYNC_STABLE_v26</span>
          </div>
        </div>
        
        <div className={`flex items-center gap-3 px-6 py-2 rounded-full border-2 transition-all duration-500 ${isTimeLow ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-white/5 text-zinc-600'}`}>
          <ShieldCheck size={14} />
          <span className="text-[9px] font-[1000] uppercase tracking-widest italic">
            {isTimeLow ? 'CIERRE_INMINENTE' : 'PROTOCOLO_SEGURO_ACTIVO'}
          </span>
        </div>
      </header>

      {/* MAIN: VISUALIZADOR CENTRAL (TRANSCRIPCIÓN GIGANTE) */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-6xl text-center z-10">
        
        <TimerDisplay seconds={seconds} />
        
        <div className="w-full bg-zinc-900/30 backdrop-blur-3xl border-2 border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={transcriptTarget}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              className="flex flex-col gap-6"
            >
              <p className="text-xs md:text-sm text-zinc-600 uppercase tracking-[0.5em] font-black italic">
                {transcriptOriginal}
              </p>

              <h1 
                className={`font-[1000] italic uppercase leading-[0.9] tracking-tighter transition-all ${isAdmin ? 'text-4xl md:text-6xl text-white' : 'text-6xl md:text-8xl text-yellow-400'}`}
                style={!isAdmin ? { textShadow: `0 0 50px rgba(250, 204, 21, 0.4)` } : {}}
              >
                {transcriptTarget}
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* BARRA DE PROGRESO DEL CICLO NEURAL */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: '100%' }}
              transition={{ duration: isAdmin ? 19 : 6, ease: "linear" }}
              key={transcriptTarget} 
              className="h-full bg-[#00FBFF] shadow-[0_0_15px_#00FBFF]" 
            />
          </div>
        </div>

        {/* FRASES DE APOYO (NERVIOS) */}
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2 text-[#00FBFF]/40">
                <Zap size={10} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Tip_Neural:</span>
              </div>
              <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
                "{supportPhrase}"
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER: CONTROLES TÁCTICOS */}
      <footer className="w-full max-w-4xl pb-10 flex justify-center items-center gap-12 z-10">
        <button 
          onClick={() => setIsListening(!isListening)}
          className={`group relative p-10 rounded-full border-2 transition-all duration-500 ${isListening ? 'border-[#00FBFF] text-[#00FBFF] bg-[#00FBFF]/5 shadow-[0_0_40px_rgba(0,251,255,0.2)]' : 'bg-rose-600 border-rose-400 text-white shadow-[0_0_40px_rgba(225,29,72,0.4)]'}`}
        >
          {isListening ? <Mic size={40} /> : <MicOff size={40} />}
          <div className={`absolute -inset-1 rounded-full border border-white/10 animate-ping opacity-20 ${!isListening && 'hidden'}`} />
        </button>

        <button 
          onClick={handleExitRequest} 
          className="p-6 rounded-full border-2 border-white/5 text-zinc-700 hover:text-white hover:border-white/20 transition-all active:scale-90"
        >
          <LogOut size={28} />
        </button>
      </footer>
    </div>
  );
};

export default SessionDashboard;