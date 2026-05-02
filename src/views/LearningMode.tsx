/** 🎓 MENCIONAL | LEARNING_NODE v2.6.PROD
 * ✅ PROTOCOLO: Aprendizaje (Traducción Total + Doble Impacto).
 * ✅ FLUJO: Liberación inmediata del micro (No bloquea por sugerencias).
 * ✅ OLED: Interfaz de contraste absoluto con resplandor dinámico.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Cpu } from 'lucide-react';

import speechService from '../services/ai/speechService'; 
import { translateService } from '../services/ai/translateService';
import neuralResponse from '../services/ai/NeuralResponse';
import NeuralMessage, { MessageType } from '../components/NeuralMessage';
import { useSettings } from '../context/SettingsContext';
import { logger } from '../utils/logger';

const LearningMode: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const themeColor = settings?.themeColor || '#00FBFF'; 
  
  const [isAutoActive, setIsAutoActive] = useState(false);
  const [neuralStatus, setNeuralStatus] = useState<MessageType>('STANDBY');
  const [transcript, setTranscript] = useState("");
  const [displayPhrase, setDisplayPhrase] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings?.sessionTimeLeft || 1800); 

  const bufferRef = useRef("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // 🛡️ Sincronización de Modo Segura
  useEffect(() => {
    isMounted.current = true;
    if (settings?.currentMode !== 'learning') {
      updateSettings({ currentMode: 'learning' });
    }
    return () => { isMounted.current = false; };
  }, []);

  const resetToListening = useCallback(() => {
    if (!isMounted.current || timeLeft <= 0) return;
    setDisplayPhrase("");
    setTranscript("");
    bufferRef.current = "";
    setIsProcessing(false);
    setIsAutoActive(true);
    startSequence(); 
  }, [timeLeft]);

  const executeMencionalCycle = useCallback(async () => {
    const inputText = bufferRef.current.trim();
    speechService.stop();
    setIsAutoActive(false);

    if (!inputText || !isMounted.current) {
      setNeuralStatus('STANDBY');
      resetToListening();
      return;
    }

    setNeuralStatus('DECODING');
    setIsProcessing(true);
    
    try {
      // 🟢 MENCIONAL CORE: Traducción Total
      const knownWords = settings?.knownVocabulary || [];
      const result = await translateService.translateText(inputText, 'learning', knownWords);
      
      if (!isMounted.current) return;

      setDisplayPhrase(result.translation.toUpperCase()); 
      setIsGlowing(true);
      setNeuralStatus('SPEAKING');

      // ✅ DOBLE IMPACTO AUDITIVO (Voz Aoede)
      await neuralResponse.executeLearningCycle(settings?.targetLanguage || 'en-US', result.translation);

      if (isMounted.current) {
        setIsGlowing(false);
        setNeuralStatus('TREND_SYNC');
        
        // ⚡ LIBERACIÓN INMEDIATA DEL MICRO
        resetToListening(); 

        // 🎤 APOYO KARAOKE (Segundo plano)
        translateService.getKeywords(result.translation).then(hints => {
          if (isMounted.current) setSuggestions(hints);
        });
      }
    } catch (error) {
      logger.error("CYCLE", "Error en ciclo neural");
      setNeuralStatus('ERROR');
      setTimeout(resetToListening, 1500);
    }
  }, [settings, resetToListening]);

  const startSequence = useCallback(() => {
    if (isProcessing || !isMounted.current || timeLeft <= 0) return;
    
    setNeuralStatus('AWAITING_INPUT');
    bufferRef.current = "";
    setTranscript("");
    setProgress(0);
    
    speechService.start(settings?.nativeLanguage || 'es-MX');

    const duration = 5000; 
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
  }, [isProcessing, timeLeft, executeMencionalCycle, settings?.nativeLanguage]);

  // Manejo de resultados parciales del micro
  useEffect(() => {
    const handlePartial = (text: string) => {
      setTranscript(text);
      bufferRef.current = text;
    };
    speechService.on('partial_result', handlePartial);
    return () => speechService.off('partial_result', handlePartial);
  }, []);

  // Cronómetro de Sesión
  useEffect(() => {
    const cTimer = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev <= 0 ? 0 : prev - 1;
        if (next % 30 === 0) updateSettings({ sessionTimeLeft: next });
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(cTimer);
      if (timerRef.current) clearInterval(timerRef.current);
      neuralResponse.killAllCycles();
    };
  }, [updateSettings]);

  return (
    <div className="min-h-[100dvh] bg-[#000000] text-white flex flex-col items-center p-8 select-none italic overflow-hidden font-sans">
      
      {/* HUD: CRONÓMETRO */}
      <div className={`fixed top-12 right-10 font-black flex flex-col items-end transition-colors duration-500 ${timeLeft < 300 ? 'text-rose-600 animate-pulse scale-110' : 'text-[#00FBFF] opacity-20'}`}>
        <span className="text-[10px] tracking-[0.2em] mb-1">{timeLeft < 300 ? 'LOW_TIME' : 'SESSION_REMAINING'}</span>
        <span className="tabular-nums text-lg">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </span>
      </div>

      <header className="w-full flex justify-between items-center opacity-30 text-[8px] font-black uppercase tracking-[0.5em] z-10">
        <div className="flex items-center gap-2"><Cpu size={12} style={{ color: themeColor }} /> Mencional_Kernel_v2.6</div>
        <div className="flex items-center gap-2"><Sparkles size={10} style={{ color: themeColor }} /> Aoede_Active</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl text-center z-10">
        <div className="h-10 mb-6 flex flex-wrap justify-center gap-2">
          <AnimatePresence>
            {suggestions.map((hint) => (
              <motion.span 
                key={hint}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="px-4 py-1 rounded-full border border-zinc-900 bg-zinc-950 text-[9px] font-black text-zinc-500 uppercase tracking-widest"
              >
                {hint}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <div className="w-full h-20 mb-8">
          <NeuralMessage type={neuralStatus} activeTurnColor={themeColor} />
        </div>

        <div className="relative min-h-[300px] flex items-center justify-center w-full px-4">
          <AnimatePresence mode="wait">
            {displayPhrase ? (
              <motion.div key="display" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-6xl md:text-9xl font-[1000] uppercase tracking-tighter leading-[0.8] text-center transition-all duration-300" 
                  style={{ 
                    color: isGlowing ? themeColor : '#111', 
                    textShadow: isGlowing ? `0 0 80px ${themeColor}AA` : 'none' 
                  }}>
                  {displayPhrase}
                </h2>
              </motion.div>
            ) : (
              <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
                <p className={`text-4xl md:text-6xl font-[1000] italic uppercase transition-all duration-700 leading-tight ${isAutoActive ? 'text-white' : 'text-zinc-900'}`}>
                  {isAutoActive ? (transcript || "Escuchando...") : "Protocolo_Standby"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ⚡ ACTIVADOR CENTRAL */}
      <div className="relative flex items-center justify-center mb-16">
        <svg width="240" height="240" className="rotate-[-90deg] absolute">
          <circle cx="120" cy="120" r="110" stroke="#0a0a0a" strokeWidth="2" fill="transparent" />
          {isAutoActive && (
            <motion.circle 
              cx="120" cy="120" r="110" stroke={themeColor} strokeWidth="4" fill="transparent" 
              strokeDasharray="691" animate={{ strokeDashoffset: 691 - (691 * progress) / 100 }} 
              transition={{ ease: "linear", duration: 0.1 }} strokeLinecap="round"
            />
          )}
        </svg>
        
        <button 
          onClick={() => {
            if (isAutoActive) {
              speechService.stop();
              setIsAutoActive(false);
              setNeuralStatus('STANDBY');
              if (timerRef.current) clearInterval(timerRef.current);
            } else {
              setIsAutoActive(true);
              startSequence();
            }
          }} 
          className={`w-40 h-40 rounded-full flex flex-col items-center justify-center z-20 transition-all duration-700 ${isAutoActive ? 'bg-white text-black scale-105 shadow-[0_0_80px_rgba(255,255,255,0.1)]' : 'bg-zinc-950 text-zinc-800 border border-zinc-900'}`}
        >
          <Zap size={48} className={isAutoActive ? 'fill-current animate-pulse' : ''} />
          <span className="text-[9px] font-[1000] mt-3 tracking-[0.3em] uppercase">{isAutoActive ? 'Terminar' : 'Iniciar'}</span>
        </button>
      </div>

      <footer className="mt-auto opacity-10 text-[7px] text-zinc-500 font-[1000] uppercase tracking-[1.5em] pb-6">
        Mencional_Immersion_Protocol_v2.6
      </footer>

      {/* VIÑETA OLED */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-50 z-[-1]" />
    </div>
  );
};

export default LearningMode;