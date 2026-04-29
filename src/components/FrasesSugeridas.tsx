/**
 * 💡 FRASES_SUGERIDAS v2026.12 - MENCIONAL CORE
 * Ubicación: /src/components/FrasesSugeridas.tsx
 * Función: Generador de inmersión pasiva y activa (Acordeón Rompehielo).
 * ✅ SERVICIOS AI: Rutas actualizadas a /services/ai/
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestionEngine } from '../services/ai/suggestionEngine'; 
import speechService from '../services/ai/speechService'; // ✅ Ruta corregida: ai
import { RefreshCcw, Sparkles, Volume2, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface FrasesSugeridasProps {
  lastTranscript: string;
  targetLang?: string;
  // Modos: LEARNING (6s), ULTRA (19s), SOCIAL (Rompehielo)
  mode?: 'LEARNING' | 'ULTRA' | 'SOCIAL'; 
  topic?: string;
}

const FrasesSugeridas: React.FC<FrasesSugeridasProps> = ({ 
  lastTranscript, 
  targetLang = 'en-US',
  mode = 'LEARNING',
  topic = 'GENERAL'
}) => {
  const { isAdmin } = useAuth();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePhrase, setActivePhrase] = useState<string | null>(null);
  const hasAutoPlayed = useRef(false);

  /**
   * ⚡ PROTOCOLO DE ANCLAJE NEURAL
   * Ejecuta el TTS según el modo seleccionado (Mencional/Ultra/Rompehielo)
   */
  const handleSelection = async (phrase: string, isAuto = false) => {
    if (isAuto && hasAutoPlayed.current) return;
    if (isAuto) hasAutoPlayed.current = true;

    setActivePhrase(phrase);
    
    try {
      await speechService.speak(phrase, { 
        lang: targetLang,
        // Mapeo técnico de protocolos de tiempo
        mode: mode === 'LEARNING' ? 'mencional' : mode === 'ULTRA' ? 'ultra-mencional' : 'rompehielo'
      });
      
      console.log(`%c[NEURAL_LINK_ACTIVE]%c ${phrase}`, "color: #00FBFF; font-weight: bold", "color: gray");
    } catch (error) {
      console.error("🚨 [TTS_ANCHOR_ERROR]:", error);
    }
  };

  /**
   * 🧠 GENERACIÓN DE INFERENCIA (Engine AI)
   */
  const generateNewSuggestions = useCallback(async () => {
    if (!lastTranscript || lastTranscript.trim().length < 5) return;
    
    setLoading(true);
    hasAutoPlayed.current = false; 
    try {
      const newPhrases = await suggestionEngine.getSuggestions(lastTranscript, topic, targetLang); 
      setSuggestions(newPhrases.map(s => s.text));
      setActivePhrase(null);

      // 🧊 Lógica Rompehielo: Auto-reproducción si es SOCIAL o cuenta Admin
      if ((mode === 'SOCIAL' || isAdmin) && newPhrases.length > 0) {
        handleSelection(newPhrases[0].text, true);
      }
    } catch (error) {
      console.error("🚨 [SUGGESTION_ENGINE_ERROR]:", error);
    } finally {
      setLoading(false);
    }
  }, [lastTranscript, mode, isAdmin, topic, targetLang]);

  // Refresco reactivo inicial (latencia de 850ms para evitar parpadeo)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateNewSuggestions();
    }, 850); 
    return () => clearTimeout(timeoutId);
  }, [lastTranscript, generateNewSuggestions]);

  // 🔄 CICLO DE SINCRONIZACIÓN NEURAL (Cada 19 segundos)
  useEffect(() => {
    const intervalId = setInterval(() => {
      generateNewSuggestions();
    }, 19000); 
    return () => clearInterval(intervalId);
  }, [generateNewSuggestions]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-transparent select-none italic">
      <header className="flex items-center justify-between mb-8 px-6">
        <div className="flex items-center gap-4 opacity-40">
          <Zap size={14} className={isAdmin ? 'text-amber-500 animate-pulse' : 'text-[#00FBFF]'} />
          <span className="text-[10px] font-[1000] text-white uppercase tracking-[0.4em]">
            {mode === 'ULTRA' ? 'Protocol_Ultra_19s' : mode === 'SOCIAL' ? 'Icebreaker_Node' : 'Mencional_v26_Learning'}
          </span>
          {isAdmin && <ShieldCheck size={12} className="text-amber-500" />}
        </div>
        
        {loading && (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
            <RefreshCcw size={14} className="text-[#00FBFF]/30" />
          </motion.div>
        )}
      </header>

      <div className="grid gap-5">
        <AnimatePresence mode="popLayout">
          {suggestions.map((phrase, index) => (
            <motion.button
              key={`${phrase}-${index}`}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: activePhrase === phrase ? 1.03 : 1,
                borderColor: activePhrase === phrase ? 'rgba(0, 251, 255, 0.5)' : 'rgba(255, 255, 255, 0.03)'
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelection(phrase)}
              className={`group relative w-full text-left p-8 rounded-[2.5rem] border-2 transition-all duration-500 backdrop-blur-3xl
                ${activePhrase === phrase 
                  ? 'bg-[#00FBFF]/10 shadow-[0_0_60px_rgba(0,251,255,0.1)]' 
                  : 'bg-zinc-950/40 border-white/5 hover:bg-zinc-900/40'}`}
            >
              <div className="flex items-center justify-between gap-8 relative z-10">
                <span className={`text-xl md:text-3xl font-[1000] tracking-tighter leading-[1.1] transition-all duration-700
                  ${activePhrase === phrase ? 'text-white' : 'text-zinc-600'}`}>
                  {phrase}
                </span>
                
                <div className={`p-4 rounded-2xl transition-all duration-700 shrink-0
                  ${activePhrase === phrase ? 'bg-[#00FBFF] text-black shadow-[0_0_30px_#00FBFF]' : 'bg-black text-zinc-800'}`}>
                  {mode === 'SOCIAL' && index === 0 ? <Volume2 size={20} /> : <Sparkles size={20} />}
                </div>
              </div>

              {/* Tag de Auto-reproducción para Admin/Social */}
              {(mode === 'SOCIAL' || isAdmin) && index === 0 && (
                <div className="absolute -top-3 -left-2 bg-amber-500 text-black text-[8px] font-[1000] px-4 py-1 rounded-full uppercase tracking-widest shadow-xl">
                  Neural_Auto_Pick
                </div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* ⏳ HUD DE PROGRESO DE CICLO NEURAL */}
      {suggestions.length > 0 && (
        <div className="mt-12 px-6">
          <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              key={lastTranscript} 
              initial={{ width: "0%" }} 
              animate={{ width: "100%" }} 
              transition={{ duration: 4, ease: "linear" }} 
              className={`h-full ${mode === 'ULTRA' ? 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-[#00FBFF] shadow-[0_0_15px_rgba(0,251,255,0.5)]'}`} 
            />
          </div>
          <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] mt-4 text-center">
            Buffer_Sync_Active
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(FrasesSugeridas);