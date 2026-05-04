/** 🎓 MENCIONAL | FUNCIÓN: APRENDIZAJE (PRINCIPAL)
 * Protocolo: Ventana 6s | Doble Fijación Aoede (1.0x -> 0.85x)
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 * ✅ ESTÉTICA: OLED Black #000000 | Acento Dinámico
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Waves, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useSettings } from '../context/SettingsContext';
import { useTimer } from '../hooks/useTimer';
import { logger } from '../utils/logger';

// ✅ INTEGRACIÓN CON EXPORTACIONES NOMBRADAS DESDE /ai/
import { speechService } from '../services/ai/speechService';
import { translateService } from '../services/ai/translateService';

const LearningSession: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings(); 
  
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Estética OLED: Negro absoluto y color de acento neon
  const accentColor = settings.themeColor || '#00FBFF'; 

  /**
   * ⏱️ PROTOCOLO 6 SEGUNDOS & DOBLE REPETICIÓN
   * Se dispara automáticamente tras el silencio del usuario.
   */
  const { timeLeft, progress, resetTimer, stopTimer } = useTimer(async () => {
    if (!transcript || transcript.length < 3 || isAiProcessing) return;

    setIsAiProcessing(true);
    try {
      // 1. Obtención de traducción contextual (Limpia de prefijos como "TRANSLATED:")
      const result = await translateService.translateText(
        transcript, 
        'learning'
      );
      
      setTranslation(result.translation);

      // 2. --- PROTOCOLO AOEDE: DOBLE FIJACIÓN ---
      // El método speakLearning ya maneja internamente las 2 repeticiones (1.0x y 0.85x)
      await speechService.speakLearning(result.translation, settings.targetLanguage || 'en-US');

    } catch (error) {
      logger.error("AI_SERVICE_ERROR", "Fallo en flujo de Aprendizaje en /ai/", error);
    } finally {
      // Limpieza visual tras absorción sináptica (4.5s después de terminar el audio)
      setTimeout(() => {
        setTranscript('');
        setTranslation('');
        setIsAiProcessing(false);
      }, 4500);
    }
  }, 6000); 

  /**
   * 🧠 ACORDEÓN COGNITIVO (Ciclo 19s)
   */
  const fetchDynamicSuggestions = useCallback(async () => {
    try {
      // Usamos el nuevo método del translateService optimizado para sugerencias
      const hints = await translateService.getKeywords(
        transcript || "conversación casual", 
        settings.targetLanguage
      );
      setSuggestions(hints);
    } catch (e) {
      setSuggestions(["¿Podrías repetir eso?", "Todo va fluyendo bien", "Me gusta este tema"]);
    }
  }, [transcript, settings.targetLanguage]);

  useEffect(() => {
    fetchDynamicSuggestions();
    const interval = setInterval(fetchDynamicSuggestions, 19000);
    return () => clearInterval(interval);
  }, [fetchDynamicSuggestions]);

  /**
   * 🎙️ ESCUCHA ACTIVA (100% Manos Libres)
   */
  useEffect(() => {
    const handlePartial = (text: string) => {
      setTranscript(text);
      resetTimer(); // Reinicia la ventana de 6s mientras detecte actividad
    };

    const handleFinal = (data: { transcription: string }) => {
        // La lógica principal se dispara por el useTimer (6s de silencio),
        // pero podemos usar el resultado final para asegurar precisión inmediata.
        setTranscript(data.transcription);
    };

    speechService.on('partial_result', handlePartial);
    speechService.on('final_result', handleFinal);
    
    // Inicia hardware con el idioma nativo configurado
    speechService.start(settings.nativeLanguage || 'es-MX');

    return () => {
      speechService.off('partial_result');
      speechService.off('final_result');
      speechService.stopAll();
      stopTimer();
    };
  }, [resetTimer, stopTimer, settings.nativeLanguage]);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col overflow-hidden italic select-none font-sans">
      
      {/* 🟢 HEADER MENCIONAL */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <button 
          onClick={() => navigate('/selector')} 
          className="p-4 bg-zinc-900/40 rounded-2xl text-zinc-500 hover:text-white transition-all border border-white/5"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-end">
          <h2 className="text-sm font-black tracking-[0.3em] uppercase leading-none" style={{ color: accentColor }}>
            MENCIONAL<span className="opacity-50 text-white">.</span>
          </h2>
          <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mt-1">
            Learning_Core // AI_SYNC_v2.6
          </span>
        </div>
      </header>

      {/* ⏱️ RADAR OLED (Sincronizado con Timer 6s) */}
      <div className="flex justify-center mb-12">
        <motion.div 
          animate={timeLeft <= 2 && transcript ? { scale: 1.1, opacity: [1, 0.6, 1] } : {}}
          className="relative w-24 h-24 flex items-center justify-center"
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="48" cy="48" r="45" stroke="#050505" strokeWidth="1" fill="transparent" />
            <motion.circle 
              cx="48" cy="48" r="45" 
              stroke={accentColor} strokeWidth="2" fill="transparent"
              strokeDasharray="282.7"
              animate={{ strokeDashoffset: 282.7 - (282.7 * progress) / 100 }}
              transition={{ ease: "linear", duration: 0.1 }}
              style={{ filter: `drop-shadow(0 0 8px ${accentColor}66)` }}
            />
          </svg>
          <span className="text-2xl font-black tabular-nums" style={{ color: accentColor }}>
            {timeLeft}s
          </span>
        </motion.div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center space-y-12">
        
        {/* 🍬 ACORDEÓN DE APOYO (Sugerencias dinámicas) */}
        <div className="w-full max-w-2xl flex flex-wrap justify-center gap-3">
          <AnimatePresence mode="popLayout">
            {suggestions.map((hint, idx) => (
              <motion.div
                key={`${hint}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-6 py-2.5 bg-zinc-900/30 border border-white/5 rounded-full"
              >
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                  {hint}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ⚡ OUTPUT DE TRADUCCIÓN (Máximo Contraste OLED) */}
        <div className="w-full text-center min-h-[300px] flex flex-col justify-center px-4">
          <p className="text-zinc-700 text-xl mb-8 font-medium italic transition-all duration-500">
            {transcript || "Escuchando señal..."}
          </p>

          <AnimatePresence mode="wait">
            {translation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="relative"
              >
                <h1 
                  className="text-5xl md:text-8xl font-[1000] px-4 leading-[1.1] tracking-tighter uppercase"
                  style={{ 
                    color: accentColor,
                    textShadow: `0 0 40px ${accentColor}33`
                  }}
                >
                  {translation}
                </h1>
                <div className="flex justify-center items-center gap-3 mt-8 opacity-40">
                  <Waves size={18} style={{ color: accentColor }} className="animate-pulse" />
                  <span className="text-[9px] uppercase font-black tracking-[0.5em]">Aoede_Double_Fixation</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 📊 FOOTER DE STATUS AI */}
      <footer className="py-8 flex flex-col items-center">
        <div className="flex items-center gap-3 px-6 py-2 bg-zinc-950 rounded-full border border-zinc-900">
            <Activity size={12} className={transcript ? 'text-[#39FF14] animate-pulse' : 'text-zinc-800'} />
            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">
              Node_Sync: {settings.currentTopic || 'General'}
            </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningSession;