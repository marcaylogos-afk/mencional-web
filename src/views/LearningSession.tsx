/** 🎓 MENCIONAL | FUNCIÓN: APRENDIZAJE (PRINCIPAL)
 * Protocolo: Ventana 6s | Doble Fijación Aoede (1.0x -> 0.85x)
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 * ✅ ESTÉTICA: OLED Black #000000 | Máximo Contraste
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Waves, Activity, Sparkles, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useSettings } from '../context/SettingsContext';
import { useTimer } from '../hooks/useTimer';
import { logger } from '../utils/logger';

// ✅ SERVICIOS CENTRALIZADOS
import speechService from '../services/ai/speechService';
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
   * El cronómetro se reinicia mientras el usuario habla. 
   * Si hay silencio por 6s, se procesa la traducción automáticamente.
   */
  const { timeLeft, progress, resetTimer, stopTimer, startTimer } = useTimer(async () => {
    if (!transcript || transcript.trim().length < 2 || isAiProcessing) {
      resetSessionFlow();
      return;
    }

    setIsAiProcessing(true);
    speechService.stop(); // 🛑 Pausa de captación

    try {
      // 1. Traducción Neural (Modo Learning)
      const result = await translateService.translateText(transcript, 'learning');
      
      if (!isMounted.current) return;
      setTranslation(result.translation.toUpperCase());

      // 2. Protocolo Aoede x2 (Fijación 1.0x -> 0.85x)
      // Este método ya gestiona internamente la doble repetición.
      await speechService.speakLearning(result.translation, settings.targetLanguage);

      // 3. Absorción Sináptica (Pausa de 4.5s con la palabra en pantalla antes de reiniciar)
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
    
    // Protocolo de Reinicio: Micro + Radar
    speechService.start(settings.nativeLanguage || 'es-MX');
    resetTimer();
  }, [settings.nativeLanguage, resetTimer]);

  /** 🧠 ACORDEÓN COGNITIVO (Sugerencias dinámicas) */
  const fetchDynamicSuggestions = useCallback(async () => {
    try {
      const hints = await translateService.getKeywords(
        transcript || settings.currentTopic || "general", 
        settings.targetLanguage || 'en-US'
      );
      setSuggestions(hints);
    } catch (e) {
      setSuggestions(["KEEP GOING", "TE ESCUCHO", "CONTINUAR"]);
    }
  }, [transcript, settings.currentTopic, settings.targetLanguage]);

  useEffect(() => {
    fetchDynamicSuggestions();
    const interval = setInterval(fetchDynamicSuggestions, 19000);
    return () => clearInterval(interval);
  }, [fetchDynamicSuggestions]);

  /** 🎙️ GESTIÓN DE HARDWARE */
  useEffect(() => {
    isMounted.current = true;

    const handlePartial = (text: string) => {
      if (!isAiProcessing) {
        setTranscript(text);
        if (text.length > 1) resetTimer(); // Mientras hables, el radar no se agota
      }
    };

    speechService.on('partial_result', handlePartial);
    
    // Inicio de sesión
    speechService.start(settings.nativeLanguage || 'es-MX');
    startTimer();

    return () => {
      isMounted.current = false;
      speechService.off('partial_result');
      speechService.stopAll();
      stopTimer();
    };
  }, [settings.nativeLanguage, startTimer, stopTimer, resetTimer, isAiProcessing]);

  return (
    <div className="min-h-[100dvh] bg-[#000000] text-white p-6 flex flex-col overflow-hidden italic select-none">
      
      {/* HUD SUPERIOR */}
      <header className="flex justify-between items-center mb-6 relative z-50 opacity-80">
        <button 
          onClick={() => navigate('/selector')} 
          className="p-4 bg-zinc-950 rounded-[22px] text-zinc-600 hover:text-white transition-all border border-white/5 active:scale-95"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Cpu size={14} style={{ color: accentColor }} className="animate-pulse" />
            <h2 className="text-[10px] font-black tracking-[0.6em] uppercase leading-none" style={{ color: accentColor }}>
              MENCIONAL_AI
            </h2>
          </div>
          <span className="text-[7px] text-zinc-800 uppercase font-black tracking-[0.4em] mt-2">
            STABLE_PROD // {settings.targetLanguage?.split('-')[0]}
          </span>
        </div>
      </header>

      {/* ⏱️ RADAR RADIAL OLED */}
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="#050505" strokeWidth="1" fill="transparent" />
            {!isAiProcessing && (
              <motion.circle 
                cx="64" cy="64" r="58" 
                stroke={accentColor} strokeWidth="3" fill="transparent"
                strokeDasharray="364.4"
                animate={{ strokeDashoffset: 364.4 - (364.4 * progress) / 100 }}
                transition={{ ease: "linear", duration: 0.1 }}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 12px ${accentColor}44)` }}
              />
            )}
          </svg>
          <div className="flex flex-col items-center">
             <span className="text-4xl font-[1000] tabular-nums tracking-tighter" style={{ color: isAiProcessing ? '#111' : 'white' }}>
                {isAiProcessing ? '...' : timeLeft}
             </span>
             <span className="text-[6px] font-black text-zinc-700 tracking-[0.5em] uppercase">Radar_Sec</span>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center">
        
        {/* ACORDEÓN COGNITIVO */}
        <div className="h-10 mb-12 flex flex-wrap justify-center gap-2 px-4 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {!isAiProcessing && suggestions.slice(0, 3).map((hint, idx) => (
              <motion.div
                key={`${hint}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="px-4 py-1.5 bg-[#030303] border border-white/5 rounded-xl"
              >
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                  {hint}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ÁREA DE IMPACTO CENTRAL */}
        <div className="w-full text-center min-h-[350px] flex flex-col justify-center px-4 relative">
          <p className={`text-2xl md:text-3xl mb-12 font-bold tracking-tighter transition-all duration-1000 uppercase italic ${isAiProcessing ? 'opacity-0 scale-95' : 'text-zinc-800 opacity-100'}`}>
            {transcript || "ESCUCHANDO_FRECUENCIA..."}
          </p>

          <AnimatePresence mode="wait">
            {translation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, filter: "blur(20px)" }}
                className="relative"
              >
                <h1 
                  className="text-6xl md:text-9xl font-[1000] leading-[0.8] tracking-tighter uppercase italic"
                  style={{ 
                    color: accentColor,
                    textShadow: `0 0 70px ${accentColor}44`
                  }}
                >
                  {translation}
                </h1>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex justify-center items-center gap-6 mt-16"
                >
                  <Waves size={20} style={{ color: accentColor }} />
                  <span className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.7em]">
                    DOUBLE_IMPACT_SYNC
                  </span>
                  <Waves size={20} style={{ color: accentColor }} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER STATUS HUD */}
      <footer className="py-8 flex flex-col items-center">
        <div className="flex items-center gap-5 px-8 py-4 bg-[#030303] rounded-3xl border border-white/5 shadow-2xl">
            <Activity size={14} className={transcript ? 'text-[#39FF14] animate-pulse' : 'text-zinc-900'} />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.4em]">
                Neural_Core: {isAiProcessing ? 'ANALYZING' : 'READY'}
              </span>
              <span className="text-[6px] font-bold text-zinc-800 uppercase tracking-[0.3em]">
                Block_Session: $50 / 30m
              </span>
            </div>
            <Sparkles size={14} className="text-zinc-800" />
        </div>
      </footer>
    </div>
  );
};

export default LearningSession;