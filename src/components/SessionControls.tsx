/**
 * 🛰️ MENCIONAL | SESSION CONTROLS v2026.PROD
 * Protocolo: AOEDE_NEURAL_SYNC
 * Ubicación: /src/components/SessionControls.tsx
 * Función: Orquestador de entrada de voz, sugerencias dinámicas (19s) y feedback OLED.
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, RotateCcw, Sparkles, 
  XCircle, Zap, Shield, Waves 
} from 'lucide-react';

// Hooks sincronizados con la nueva estructura /ai/
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAuth } from '../hooks/useAuth'; // O useSettings si integraste auth ahí
import { logger } from '../utils/logger';

interface SessionControlsProps {
  mode: 'mencional' | 'ultra_mencional' | 'rompehielo';
  onTerminate: () => void;
  userColor?: string;
  selectedLang?: string;
}

export const SessionControls: React.FC<SessionControlsProps> = ({ 
  mode, 
  onTerminate,
  userColor = "#00FBFF", // Cian Neón por defecto
  selectedLang = 'en-US'
}) => {
  const { isAdmin } = useAuth(); // Asumiendo que useAuth extrae de SettingsContext
  const [isActive, setIsActive] = useState(true);
  const [suggestion, setSuggestion] = useState<string>("");
  const [isMatchActive, setIsMatchActive] = useState(false);
  const autoSelectTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * 🎤 NEURAL_MATCH: Detecta si el usuario vocaliza la sugerencia inyectada.
   */
  const handleFinalResult = useCallback((text: string) => {
    if (suggestion && text.toLowerCase().includes(suggestion.toLowerCase().slice(0, 5))) {
      setIsMatchActive(true);
      logger.info("SESSION", `Match Detectado: ${suggestion}`);
      
      if (autoSelectTimer.current) clearTimeout(autoSelectTimer.current);
      
      setTimeout(() => {
        setIsMatchActive(false);
        setSuggestion("");
      }, 3500);
    }
  }, [suggestion]);

  const { startListening, stopListening } = useSpeechRecognition(handleFinalResult);

  // Radar de voz persistente
  useEffect(() => {
    isActive ? startListening(selectedLang) : stopListening();
    return () => stopListening();
  }, [isActive, selectedLang, startListening, stopListening]);

  /**
   * 🍬 ENGINE DE SUGERENCIAS (19s Cycle)
   * Inyecta frases cada 19 segundos para el "Doble Impacto".
   */
  useEffect(() => {
    if (!isActive || mode === 'ultra_mencional') return; 

    const ideasPool = [
      "That's a great point, let's expand on that", 
      "I completely agree with your perspective", 
      "Actually, I was thinking the same thing",
      "Can you tell me more about that?",
      "Let's focus on the next steps"
    ];

    const ideaInterval = setInterval(() => {
      const randomIdea = ideasPool[Math.floor(Math.random() * ideasPool.length)];
      setSuggestion(randomIdea);
      
      // Auto-Match para Rompehielo (8.5s de gracia)
      if (mode === 'rompehielo') {
        autoSelectTimer.current = setTimeout(() => {
          handleFinalResult(randomIdea); 
        }, 8500);
      } else {
        // Desvanecimiento orgánico para modo Aprendizaje
        setTimeout(() => setSuggestion(""), 12000);
      }
    }, 19000); // Protocolo de 19 segundos

    return () => {
      clearInterval(ideaInterval);
      if (autoSelectTimer.current) clearTimeout(autoSelectTimer.current);
    };
  }, [isActive, mode, handleFinalResult]);

  return (
    <div className="fixed bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-[100]">
      <div className="max-w-2xl mx-auto flex flex-col gap-6 pointer-events-auto">
        
        {/* 🍬 NUBE DE SUGERENCIA (CARAMELO NEURAL) */}
        <AnimatePresence mode="wait">
          {suggestion && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto bg-zinc-950/90 border border-white/10 px-8 py-5 rounded-[2.5rem] flex items-center gap-5 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
              style={{ 
                borderBottomColor: isMatchActive ? userColor : "rgba(255,255,255,0.05)",
                borderBottomWidth: '2px',
                boxShadow: isMatchActive ? `0 0 40px ${userColor}20` : 'none'
              }}
            >
              <Sparkles size={18} style={{ color: userColor }} className={isMatchActive ? "animate-spin" : "animate-pulse"} />
              
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-[0.5em] text-zinc-600 font-black italic">Neural_Caramel</span>
                <p className="text-sm md:text-lg font-black text-white tracking-tight leading-none mt-1.5 italic transition-colors"
                   style={{ color: isMatchActive ? userColor : 'white' }}>
                  "{suggestion}"
                </p>
              </div>

              {isMatchActive && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-4">
                  <Zap size={14} style={{ color: userColor }} className="fill-current" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🕹️ CÁPSULA DE COMANDO */}
        <div className="relative max-w-lg mx-auto w-full">
          <div className="flex items-center justify-between bg-zinc-900/40 backdrop-blur-3xl border border-white/5 p-4 rounded-[4rem]">
            
            <button onClick={onTerminate} className="p-6 text-zinc-700 hover:text-red-500 transition-all group relative">
              <XCircle size={24} className="group-hover:rotate-90 transition-transform" />
            </button>

            <div className="relative flex items-center">
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`p-10 md:p-12 rounded-full transition-all duration-700 border-2 active:scale-95 ${
                  isActive ? 'bg-white text-black border-white shadow-xl' : 'bg-black text-zinc-800 border-white/5'
                }`}
              >
                {isActive ? <Mic size={32} strokeWidth={3} /> : <MicOff size={32} strokeWidth={3} />}
                
                {isActive && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1 h-4">
                    {[1,2,3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [2, 12, 2] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                        className="w-1 bg-black rounded-full"
                      />
                    ))}
                  </div>
                )}
              </button>
            </div>

            <button onClick={() => setSuggestion("")} className="p-6 text-zinc-700 hover:text-cyan-400 transition-all">
              {isAdmin && mode === 'ultra_mencional' ? <Shield size={24} className="text-cyan-500" /> : <RotateCcw size={24} />}
            </button>
          </div>
        </div>

        {/* 📊 TELEMETRÍA DISCRETA */}
        <div className="flex items-center justify-center gap-8 opacity-20">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-cyan-500 animate-pulse' : 'bg-zinc-800'}`} />
            <span className="text-[8px] font-black uppercase tracking-widest text-white italic">AI_NODE_LINKED</span>
          </div>
          <div className="flex items-center gap-2">
            <Waves size={10} className="text-white" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white italic">{mode.toUpperCase()}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(SessionControls);