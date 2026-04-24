/** 🎓 MENCIONAL | LEARNING_NODE v2026.PROD
 * Ubicación: /src/views/LearningMode.tsx
 * ✅ UPDATE: Protocolo de Radar 6s (Escucha activa extendida).
 * ✅ UPDATE: Sesión de 30 minutos (1800s).
 * ✅ UPDATE: Estética OLED Black #000000.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Volume2, ShieldAlert, Languages, Sparkles } from 'lucide-react';

import { speechService } from '../services/ai/speechService'; 
import { translateService } from '../services/ai/translateService';
import { useSettings } from '../context/SettingsContext';
import { logger } from '../utils/logger';

const LearningMode: React.FC = () => {
  const { settings } = useSettings();
  const themeColor = settings.themeColor || '#00FBFF'; 
  
  const [isAutoActive, setIsAutoActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [displayPhrase, setDisplayPhrase] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  // ✅ MODIFICADO: 30 minutos = 1800 segundos
  const [timeLeft, setTimeLeft] = useState(1800); 

  const bufferRef = useRef("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  /** 🧠 ACORDEÓN COGNITIVO: Sugerencias dinámicas */
  const fetchDynamicSuggestions = useCallback(async () => {
    try {
      const hints = await translateService.getKeywords(
        settings.currentTopic || "general", 
        settings.targetLanguage || 'en-US'
      );
      setSuggestions(hints);
    } catch (e) {
      setSuggestions(["I like these colors", "Red and Blue", "What is this?"]);
    }
  }, [settings.currentTopic, settings.targetLanguage]);

  /** 🔄 CICLO MENCIONAL: PROTOCOLO ESPEJO x2 */
  const executeMencionalCycle = useCallback(async () => {
    const inputText = bufferRef.current.trim();
    
    speechService.stop();
    setIsAutoActive(false);

    if (!inputText || !isMounted.current) {
      resetToListening();
      return;
    }

    setIsProcessing(true);

    try {
      const result = await translateService.translateText(inputText, 'learning');
      if (!isMounted.current) return;

      setDisplayPhrase(result.translation.toUpperCase()); 
      setIsGlowing(true);

      // 🗣️ DOBLE IMPACTO (1.0x -> 0.85x)
      await speechService.speakLearning(result.translation, result.targetLang);

      if (isMounted.current) {
        setIsGlowing(false);
        setTimeout(resetToListening, 1200); 
      }
    } catch (error) {
      logger.error("AI_FLOW_FAIL", "Error en flujo Mencional_Cycle", error);
      resetToListening();
    }
  }, [settings.targetLanguage]);

  const resetToListening = useCallback(() => {
    if (!isMounted.current || timeLeft <= 0) return;
    setDisplayPhrase("");
    setTranscript("");
    bufferRef.current = "";
    setIsProcessing(false);
    setIsAutoActive(true);
    startSequence(); 
  }, [timeLeft]);

  const startSequence = useCallback(() => {
    if (isProcessing || !isMounted.current || timeLeft <= 0) return;
    
    bufferRef.current = "";
    setTranscript("");
    setProgress(0);
    
    speechService.start(settings.nativeLanguage || 'es-MX');

    // ✅ MODIFICADO: Protocolo de escucha de 6 segundos
    const duration = 6000; 
    const step = 50;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          executeMencionalCycle();
          return 100;
        }
        return prev + (100 / (duration / step));
      });
    }, step);
  }, [isProcessing, timeLeft, executeMencionalCycle, settings.nativeLanguage]);

  useEffect(() => {
    const handlePartial = (text: string) => {
      bufferRef.current = text;
      setTranscript(text);
    };
    speechService.on('partial_result', handlePartial);
    return () => speechService.off('partial_result');
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchDynamicSuggestions();
    
    suggestionTimerRef.current = setInterval(fetchDynamicSuggestions, 19000);
    sessionTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          speechService.stopAll();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMounted.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (suggestionTimerRef.current) clearInterval(suggestionTimerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      speechService.stopAll(); 
    };
  }, [fetchDynamicSuggestions]);

  const handleMicToggle = () => {
    if (isAutoActive || isProcessing || timeLeft <= 0) {
      speechService.stopAll();
      setIsAutoActive(false);
      setProgress(0);
    } else {
      setIsAutoActive(true);
      startSequence();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8 select-none italic overflow-hidden">
      
      {/* 🌑 CRONÓMETRO OLED */}
      <div className={`fixed top-10 right-10 font-black flex items-center gap-4 transition-all duration-700 ${timeLeft <= 180 ? 'text-6xl text-rose-600 animate-pulse' : 'text-xs opacity-40'}`} style={timeLeft > 180 ? { color: themeColor } : {}}>
        {timeLeft <= 180 && <ShieldAlert size={40} className="text-rose-600" />}
        <span className="tabular-nums tracking-tighter">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
      </div>

      <header className="w-full mb-4 flex justify-between items-center">
        <h2 className="text-[10px] font-black tracking-[0.5em] text-zinc-800 uppercase">Mencional_v2.6_ai/</h2>
        <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 tracking-widest uppercase">
          <Languages size={12} style={{ color: themeColor }} /> Espejo_Bidireccional
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl text-center">
        
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {!displayPhrase && suggestions.map((hint, i) => (
              <motion.span 
                key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="px-4 py-1 rounded-full border border-zinc-900 bg-zinc-950 text-[10px] font-bold text-zinc-600 uppercase tracking-widest"
              >
                {hint}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {displayPhrase ? (
            <motion.div key="display" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
              <h2 className="text-7xl md:text-9xl font-[1000] leading-none uppercase tracking-tighter transition-all duration-1000" 
                style={{ color: isGlowing ? themeColor : '#111', textShadow: isGlowing ? `0 0 70px ${themeColor}66` : 'none' }}>
                {displayPhrase}
              </h2>
              <div className="mt-8 flex justify-center items-center gap-3 opacity-40">
                <Volume2 size={16} style={{ color: themeColor }} className="animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase">Impacto_Aoede_x2</span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <p className="text-4xl md:text-6xl font-[1000] text-zinc-900 tracking-tighter leading-none italic uppercase">
                {isAutoActive ? (transcript || "Escuchando_Señal...") : "Iniciar_Aprendizaje"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="relative flex items-center justify-center mb-16">
        <svg width="240" height="240" className="rotate-[-90deg] absolute">
          <circle cx="120" cy="120" r="110" stroke="#080808" strokeWidth="2" fill="transparent" />
          {isAutoActive && (
            <motion.circle cx="120" cy="120" r="110" stroke={themeColor} strokeWidth="6" fill="transparent" strokeDasharray="691"
              animate={{ strokeDashoffset: 691 - (691 * progress) / 100 }} transition={{ ease: "linear", duration: 0.1 }} strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 15px ${themeColor})` }}
            />
          )}
        </svg>
        <button onClick={handleMicToggle} disabled={isProcessing || timeLeft <= 0} 
          className={`w-44 h-44 rounded-full flex items-center justify-center z-20 transition-all duration-700 ${isAutoActive ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-700'}`}>
          <Zap size={64} className={isAutoActive ? 'fill-current' : ''} />
        </button>
      </div>
    </div>
  );
};

export default LearningMode;