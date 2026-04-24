/**
 * 🛰️ PARTICIPANT_SESSION_VOICE v2026.12 - MENCIONAL
 * Ubicación: /src/views/ParticipantSession.tsx
 * Protocolo: Turnos 6s | Repetición 2x2 | Reloj Crítico | Admin Bypass
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, UserX, LogOut, Mic, Volume2, CreditCard, Zap } from 'lucide-react';

// Contexto y Hooks
import { useAuth } from '../hooks/useAuth';
import { useAudioDucking } from '../hooks/useAudioDucking';
import { useSettings } from '../context/SettingsContext';
import { useSessionWatchdog } from '../hooks/useSessionWatchdog';

// Componentes Core
import TimerDisplay from '../components/TimerDisplay'; 
import PhraseAccordion from '../components/PhraseAccordion';

// ✅ SERVICIOS SINCRONIZADOS (Carpeta 'ai')
import { translateService } from '../services/ai/translateService';
import speechService from '../services/ai/speechService';
import { logger } from '../utils/logger';

const ParticipantSession: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { settings } = useSettings();
  const { duckAudio, restoreAudio } = useAudioDucking();
  
  // 🛰️ WATCHDOG: Control de tiempo y pago
  const { isWarning, isCritical, paymentLink, formattedTime } = useSessionWatchdog(
    settings?.sessionId || 'active', 
    () => navigate("/PostSessionRating")
  );

  // --- CONFIGURACIÓN DE IDENTIDAD & ESTADO OLED ---
  const userColor = isAdmin ? "#39FF14" : (settings?.themeColor || "#00FBFF"); 
  const targetLang = settings?.targetLanguage || "en-US"; 
  const natalLang = "es-MX"; 

  const [transcript, setTranscript] = useState(""); 
  const [translation, setTranslation] = useState("ESPERANDO...");
  const [secondsTalking, setSecondsTalking] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef<any>(null);
  const turnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. PROTOCOLO REPETICIÓN 2x2 (VISUAL Y AUDIO) ---
  const handleProcessSpeech = useCallback(async (text: string) => {
    if (!text || isProcessing) return;
    
    // Detener cronómetro de turno 6s
    if (turnTimerRef.current) {
      clearInterval(turnTimerRef.current);
      turnTimerRef.current = null;
    }

    setIsProcessing(true);
    logger.info("VOICE_CAPTURE", `Procesando: ${text}`);

    try {
      // 1. Traducción vía Motor AI
      const translatedText = await translateService.translate(text, natalLang, targetLang);
      setTranslation(translatedText.toUpperCase());

      // 2. Protocolo de Audio: Repetición 2x2 (Voz Aoede)
      await duckAudio(0.2); 
      
      for (let i = 0; i < 2; i++) {
        await speechService.speak(translatedText, targetLang);
        if (i === 0) await new Promise(resolve => setTimeout(resolve, 900)); 
      }

      await restoreAudio();
      resetTurn();
    } catch (error) {
      logger.error("PROCESS_SPEECH_FAILED", error);
      await restoreAudio();
      resetTurn();
    }
  }, [isProcessing, duckAudio, restoreAudio, targetLang]);

  // --- 2. MOTOR DE VOZ (PROTOCOLO 6s) ---
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = natalLang; 

    recognitionRef.current.onresult = (event: any) => {
      if (isProcessing) return;

      const current = event.resultIndex;
      const resultText = event.results[current][0].transcript;
      setTranscript(resultText);

      // Iniciar ventana de 6s al detectar sonido
      if (!turnTimerRef.current && resultText.length > 0) {
        setSecondsTalking(0);
        turnTimerRef.current = setInterval(() => {
          setSecondsTalking(prev => {
            if (prev >= 6) {
              recognitionRef.current?.stop();
              return 6;
            }
            return prev + 1;
          });
        }, 1000);
      }

      if (event.results[current].isFinal) {
        handleProcessSpeech(resultText.trim());
      }
    };

    recognitionRef.current.onend = () => { 
      if (!isProcessing) {
        try { recognitionRef.current.start(); } catch(e) {}
      } 
    };
    
    recognitionRef.current.start();

    return () => {
      recognitionRef.current?.stop();
      if (turnTimerRef.current) clearInterval(turnTimerRef.current);
    };
  }, [isProcessing, handleProcessSpeech]);

  const resetTurn = () => {
    setTimeout(() => {
      setIsProcessing(false);
      setTranscript("");
      setTranslation("SIGUIENTE TURNO");
      setSecondsTalking(0);
    }, 1200);
  };

  return (
    <div className={`h-screen w-full bg-[#000000] text-white flex flex-col items-center justify-between p-6 overflow-hidden relative font-sans select-none transition-all duration-700 ${isCritical ? 'shadow-[inset_0_0_100px_rgba(0,251,255,0.15)]' : ''}`}>
      
      {/* 🛰️ HUD SUPERIOR */}
      <header className="w-full max-w-6xl flex justify-between items-center z-50">
        <div className={`flex items-center gap-3 px-5 py-3 bg-zinc-900/40 backdrop-blur-xl rounded-2xl border ${isAdmin ? 'border-[#39FF14]/30' : 'border-white/5'}`}>
          <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-zinc-600' : isAdmin ? 'bg-[#39FF14] animate-pulse shadow-[0_0_10px_#39FF14]' : 'bg-[#00FBFF] animate-pulse'}`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] italic ${isAdmin ? 'text-[#39FF14]' : ''}`}>
            {isProcessing ? 'SYNCHRONIZING...' : isAdmin ? 'MASTER_MODE' : `LIVE: ${settings?.userAlias || 'USER'}`}
          </span>
        </div>

        <TimerDisplay displayTime={formattedTime} isCritical={isCritical} />

        <button onClick={() => navigate("/PostSessionRating")} className="p-4 bg-zinc-900/20 rounded-2xl border border-white/5 hover:text-rose-500 transition-all">
          <LogOut size={20} />
        </button>
      </header>

      {/* 💳 BANNER DE PAGO (Bloque de 20 min) */}
      <AnimatePresence>
        {isWarning && !isAdmin && (
          <motion.a 
            href={paymentLink}
            initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
            className="absolute top-24 z-[100] w-full max-w-sm bg-zinc-950 border border-[#00FBFF]/30 p-4 flex items-center justify-between border-l-4 border-l-[#00FBFF] cursor-pointer shadow-[0_0_40px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="text-[#00FBFF]" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase italic">Sesión por expirar</p>
                <p className="text-[9px] opacity-60">Renovar bloque $20 MXN / 20 Min</p>
              </div>
            </div>
            <Zap size={16} className="text-[#00FBFF] animate-bounce" />
          </motion.a>
        )}
      </AnimatePresence>

      {/* 🎙️ ÁREA CENTRAL: FEEDBACK VISUAL 2x2 */}
      <main className="flex flex-col items-center justify-center w-full flex-grow text-center px-6 relative">
        <div className="absolute top-10 flex flex-col items-center gap-3 opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] italic truncate max-w-md">
            {transcript || "Escuchando voz natal..."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={translation}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col gap-2"
          >
            {/* Repetición 1: Principal */}
            <h2 className="text-7xl md:text-9xl font-[1000] uppercase tracking-tighter italic leading-none"
                style={{ color: userColor, textShadow: `0 0 60px ${userColor}44` }}>
              {translation}
            </h2>
            {/* Repetición 2: Eco Visual */}
            <h2 className="text-7xl md:text-9xl font-[1000] uppercase tracking-tighter italic leading-none opacity-5 select-none"
                style={{ color: userColor }}>
              {translation}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* BARRA DE TURNO 6s */}
        <div className="mt-16 flex flex-col items-center gap-3">
            <div className="w-56 h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-white shadow-[0_0_15px_white]"
                initial={{ width: "0%" }}
                animate={{ width: `${(secondsTalking / 6) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-600 italic">
                Turn_Window: 0{Math.max(0, 6 - secondsTalking)}s
            </p>
        </div>
      </main>

      {/* 🛠️ FOOTER: CONTROLES */}
      <footer className="w-full max-w-xl pb-10 z-20 space-y-6 px-4">
        <PhraseAccordion />
        
        <div className="grid grid-cols-2 gap-4">
          <button className="py-5 bg-zinc-900/40 border border-white/5 rounded-[1.5rem] text-[9px] font-[1000] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-yellow-500/10 hover:text-yellow-500 transition-all">
            <AlertTriangle size={14} /> <span>Tarjeta Amarilla</span>
          </button>
          
          <button 
            onClick={() => navigate('/PostSessionRating')}
            className="py-5 bg-zinc-900/40 border border-white/5 rounded-[1.5rem] text-[9px] font-[1000] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
          >
            <UserX size={14} /> <span>Abandonar</span>
          </button>
        </div>
      </footer>

      {/* FX: Ambient Glow OLED */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ background: `radial-gradient(circle at 50% 50%, ${userColor} 0%, transparent 70%)` }} />
    </div>
  );
};

export default ParticipantSession;