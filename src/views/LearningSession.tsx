/** 🎓 MENCIONAL | FUNCIÓN: APRENDIZAJE (PRINCIPAL)
 * Protocolo: Ventana 6s | Doble Fijación Aoede (1.0x -> 0.85x)
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 * ✅ ESTÉTICA: OLED Black #000000 | Máximo Contraste
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Waves, Activity, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useSettings } from '../context/SettingsContext';
import { useTimer } from '../hooks/useTimer';
import { logger } from '../utils/logger';

// ✅ SERVICIOS CENTRALIZADOS
import { speechService } from '../services/ai/speechService';
import { translateService } from '../services/ai/translateService';

const LearningSession: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings(); 
  
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const accentColor = settings.themeColor || '#00FBFF'; 
  const isMounted = useRef(true);

  /**
   * ⏱️ PROTOCOLO 6 SEGUNDOS: DISPARADOR AUTOMÁTICO
   * Ventana de silencio para procesar el impacto neural.
   */
  const { timeLeft, progress, resetTimer, stopTimer, startTimer } = useTimer(async () => {
    if (!transcript || transcript.trim().length < 2 || isAiProcessing) {
      resetSessionFlow();
      return;
    }

    setIsAiProcessing(true);
    speechService.stop(); // 🛑 Pausa de captación para procesar

    try {
      // 1. Traducción Neural (Modo Learning)
      const result = await translateService.translateText(transcript, 'learning');
      
      if (!isMounted.current) return;
      setTranslation(result.translation.toUpperCase());

      // 2. Protocolo Aoede x2 (Fijación 1.0x -> 0.85x)
      await speechService.speakLearning(result.translation, result.targetLang);

      // 3. Absorción Sináptica (Pausa visual de 4.5s antes de re-abrir micro)
      setTimeout(() => {
        if (isMounted.current) resetSessionFlow();
      }, 4500);

    } catch (error) {
      logger.error("AI_FLOW_ERROR", "Fallo en ciclo de aprendizaje", error);
      resetSessionFlow();
    }
  }, 6000); 

  const resetSessionFlow = useCallback(() => {
    if (!isMounted.current) return;
    setTranscript('');
    setTranslation('');
    setIsAiProcessing(false);
    
    // Protocolo de Reinicio: Micro + Timer
    speechService.start(settings.nativeLanguage || 'es-MX');
    resetTimer();
  }, [settings.nativeLanguage, resetTimer]);

  /** 🧠 ACORDEÓN COGNITIVO (Sugerencias dinámicas de Gemini) */
  const fetchDynamicSuggestions = useCallback(async () => {
    try {
      const hints = await translateService.getKeywords(
        transcript || "conversación casual", 
        settings.targetLanguage || 'en-US'
      );
      setSuggestions(hints);
    } catch (e) {
      setSuggestions(["KEEP GOING", "CONTINUE", "TE ESCUCHO"]);
    }
  }, [transcript, settings.targetLanguage]);

  useEffect(() => {
    fetchDynamicSuggestions();
    const interval = setInterval(fetchDynamicSuggestions, 19000); // Rotación cada 19s
    return () => clearInterval(interval);
  }, [fetchDynamicSuggestions]);

  /** 🎙️ GESTIÓN DE HARDWARE (Stream de Voz) */
  useEffect(() => {
    isMounted.current = true;

    const handlePartial = (text: string) => {
      setTranscript(text);
      if (text.length > 1) resetTimer(); // Reiniciar radar mientras el usuario hable
    };

    speechService.on('partial_result', handlePartial);
    
    // Inicio asíncrono de sesión
    speechService.start(settings.nativeLanguage || 'es-MX');
    startTimer();

    return () => {
      isMounted.current = false;
      speechService.off('partial_result');
      speechService.stopAll();
      stopTimer();
    };
  }, [settings.nativeLanguage, startTimer, stopTimer, resetTimer]);

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6 flex flex-col overflow-hidden italic select-none font-sans">
      
      {/* HUD SUPERIOR */}
      <header className="flex justify-between items-center mb-6 relative z-50">
        <button 
          onClick={() => navigate('/selector')} 
          className="p-4 bg-zinc-950 rounded-2xl text-zinc-700 hover:text-white transition-all border border-white/5 active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Sparkles size={12} style={{ color: accentColor }} className="animate-pulse" />
            <h2 className="text-sm font-[1000] tracking-[0.4em] uppercase leading-none" style={{ color: accentColor }}>
              MENCIONAL
            </h2>
          </div>
          <span className="text-[8px] text-zinc-800 uppercase font-black tracking-[0.5em] mt-1.5">
            NODE_v2.6 // {settings.targetLanguage}
          </span>
        </div>
      </header>

      {/* ⏱️ RADAR RADIAL OLED */}
      <div className="flex justify-center mb-8">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="56" cy="56" r="50" stroke="#080808" strokeWidth="1.5" fill="transparent" />
            {!isAiProcessing && (
              <motion.circle 
                cx="56" cy="56" r="50" 
                stroke={accentColor} strokeWidth="4" fill="transparent"
                strokeDasharray="314.15"
                animate={{ strokeDashoffset: 314.15 - (314.15 * progress) / 100 }}
                transition={{ ease: "linear", duration: 0.1 }}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 15px ${accentColor}66)` }}
              />
            )}
          </svg>
          <div className="flex flex-col items-center">
             <span className="text-3xl font-[1000] tabular-nums tracking-tighter" style={{ color: isAiProcessing ? '#111' : 'white' }}>
                {isAiProcessing ? 'AI' : timeLeft}
             </span>
             <span className="text-[7px] font-black text-zinc-700 tracking-[0.3em] uppercase">Sec/Radar</span>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center space-y-16">
        
        {/* ACORDEÓN COGNITIVO (Chips de sugerencia) */}
        <div className="w-full max-w-2xl flex flex-wrap justify-center gap-3 px-4">
          <AnimatePresence mode="popLayout">
            {!isAiProcessing && suggestions.map((hint, idx) => (
              <motion.div
                key={`${hint}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="px-5 py-2 bg-[#050505] border border-white/5 rounded-full"
              >
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
                  {hint}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ÁREA DE IMPACTO CENTRAL */}
        <div className="w-full text-center min-h-[400px] flex flex-col justify-center px-6 relative">
          <p className="text-zinc-800 text-3xl mb-16 font-bold tracking-tighter transition-all duration-700 uppercase">
            {transcript || "ESCUCHANDO_FRECUENCIA..."}
          </p>

          <AnimatePresence mode="wait">
            {translation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                className="relative"
              >
                <h1 
                  className="text-6xl md:text-9xl font-[1000] leading-[0.85] tracking-tighter uppercase italic"
                  style={{ 
                    color: accentColor,
                    textShadow: `0 0 60px ${accentColor}33`
                  }}
                >
                  {translation}
                </h1>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center gap-5 mt-16"
                >
                  <Waves size={24} style={{ color: accentColor }} className="animate-pulse" />
                  <span className="text-[11px] text-zinc-600 uppercase font-black tracking-[0.8em]">
                    IMPACTO_AOEDE_SYNC
                  </span>
                  <Waves size={24} style={{ color: accentColor }} className="animate-pulse" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER HUD */}
      <footer className="py-10 flex flex-col items-center">
        <div className="flex items-center gap-5 px-10 py-4 bg-[#030303] rounded-full border border-white/5 shadow-2xl">
            <Activity size={16} className={transcript ? 'text-[#39FF14] animate-pulse' : 'text-zinc-900'} />
            <div className="flex flex-col">
              <span className="text-[9px] font-[1000] text-zinc-500 uppercase tracking-[0.4em]">
                Neural_Core: {isAiProcessing ? 'PROCESANDO' : 'LIVE'}
              </span>
              <span className="text-[7px] font-bold text-zinc-800 uppercase tracking-[0.2em]">
                Context: {settings.currentTopic || 'Inmersión_Directa'}
              </span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LearningSession;