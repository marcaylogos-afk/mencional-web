/** 🎭 MENCIONAL | ULTRA_INTERPRETER v2026.PROD
 * ✅ FIX: Sincronización de burbujas con el "Filtro Evolutivo".
 * ✅ FIX: Prevención de colisiones de IDs mediante crypto.randomUUID.
 * ✅ OLED: Interfaz Púrpura Neón (#A855F7) para diferenciar del Modo Learning.
 */

import React, { forwardRef, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { Mic, Zap, VolumeX, Sparkles } from 'lucide-react';
import speechService from '../services/ai/speechService'; 
import { translateService } from '../services/ai/translateService';
import { logger } from '../utils/logger';

interface BubbleData {
  id: string;
  translation: string;
  original: string;
  targetLang: string;
}

const TranslationBubble = forwardRef<HTMLDivElement, { data: BubbleData }>(({ data }, ref) => (
  <motion.div
    ref={ref}
    layout
    initial={{ opacity: 0, x: 40, scale: 0.8, filter: "blur(10px)" }}
    animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, x: 15, scale: 0.9, transition: { duration: 0.3 } }}
    className="mb-6 flex flex-col items-end w-full px-6"
  >
    <div className="bg-[#050505] border-2 border-[#A855F7]/30 p-6 rounded-[32px] rounded-tr-none max-w-[90%] shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
      <div className="flex justify-between items-center mb-3 gap-10">
        <div className="flex items-center gap-2">
          <Sparkles size={10} className="text-[#A855F7]" />
          <span className="text-[9px] text-[#A855F7] font-[1000] uppercase tracking-[0.4em]">
            NEURAL_DECODE // {data.targetLang}
          </span>
        </div>
        <span className="text-[8px] text-zinc-700 font-black uppercase italic tracking-widest">Ultra_Interpreter</span>
      </div>
      
      <p className="text-white text-2xl font-black leading-[1.1] tracking-tight uppercase italic">
        {data.translation}
      </p>
      
      <p className="text-zinc-600 text-[11px] mt-3 font-black leading-none tracking-tighter opacity-40 border-t border-white/5 pt-3 uppercase">
        {data.original}
      </p>

      {/* Barra de vida de la burbuja (4 segundos) */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        className="absolute bottom-0 left-0 h-[2px] bg-[#A855F7]/50"
      />
    </div>
  </motion.div>
));

TranslationBubble.displayName = "TranslationBubble";

export const UltraInterpreter: React.FC = () => {
  const { settings } = useSettings();
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const [liveText, setLiveText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const isMounted = useRef(true);

  const processInboundSpeech = useCallback(async (payload: { transcription: string }) => {
    const text = payload.transcription.trim();
    if (!text || text.length < 3) return;

    // Lógica del Filtro Evolutivo de Mencional
    const knownWords = settings.knownVocabulary || [];
    const cleanWords = text.toLowerCase().replace(/[.,!?;:]/g, "").split(" ");
    
    // Solo procesamos si detectamos que el usuario necesita ayuda (palabras no dominadas)
    const hasUnknownContent = cleanWords.some(word => word.length > 2 && !knownWords.includes(word));

    if (hasUnknownContent) {
      try {
        // Llamada al motor de traducción en modo 'interpreter' (Selectivo)
        const result = await translateService.translateText(text, 'interpreter');
        
        if (!isMounted.current) return;

        // Modo Resiliencia: Si el API devuelve eco (404 o fallback), lo marcamos discretamente
        const isEco = result.translation.toLowerCase().trim() === text.toLowerCase().trim();
        const displayTranslation = isEco ? `[SYNC...]: ${result.translation}` : result.translation;

        const newId = crypto.randomUUID();
        const newBubble: BubbleData = {
          id: newId,
          translation: displayTranslation.toUpperCase(),
          original: text,
          targetLang: result.targetLang || 'ES',
        };

        // Mantener el stack de burbujas limpio (máximo 2 para evitar scroll infinito)
        setBubbles(prev => [...prev.slice(-1), newBubble]); 

        // Auto-destrucción de burbuja tras 4 segundos
        setTimeout(() => {
          if (isMounted.current) {
            setBubbles(prev => prev.filter(b => b.id !== newId));
          }
        }, 4000);

      } catch (err) {
        logger.error("ULTRA_TRANS_FAIL", "Error en el pipeline del intérprete", err);
      }
    }
  }, [settings.knownVocabulary]);

  useEffect(() => {
    isMounted.current = true;

    const handlePartial = (text: string) => setLiveText(text);
    const handleFinal = (data: any) => {
      setLiveText(""); 
      processInboundSpeech(data);
    };

    speechService.on('partial_result', handlePartial);
    speechService.on('final_result', handleFinal);

    return () => {
      isMounted.current = false;
      speechService.off('partial_result');
      speechService.off('final_result');
      speechService.stop();
    };
  }, [processInboundSpeech]);

  const toggleMic = async () => {
    if (!isListening) {
      // El Modo Ultra siempre escucha Inglés para traducir al Español
      const ok = await speechService.start('en-US'); 
      if (ok) setIsListening(true);
    } else {
      speechService.stop();
      setIsListening(false);
      setLiveText("");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#000000] text-white flex flex-col overflow-hidden select-none italic font-sans">
      
      {/* HUD SUPERIOR */}
      <header className="flex justify-between items-center p-6 border-b border-white/5 bg-black/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-[#A855F7] animate-pulse shadow-[0_0_15px_#A855F7]' : 'bg-zinc-900'}`} />
          <h1 className="text-[10px] font-[1000] tracking-[0.4em] uppercase text-zinc-600">ULTRA_INTERPRETER_v2.6</h1>
        </div>
        <div className="flex items-center gap-6">
            <VolumeX size={16} className="text-zinc-800" />
            <Zap size={16} className={isListening ? "text-[#A855F7]" : "text-zinc-900"} />
        </div>
      </header>

      {/* ÁREA DE TRANSCRIPCIÓN EN VIVO */}
      <section className="h-40 flex items-center justify-center px-10">
        <AnimatePresence mode="wait">
          <motion.p 
            key={liveText || 'idle'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-zinc-500 text-2xl font-black text-center max-w-lg leading-tight tracking-tighter uppercase"
          >
            {liveText || (isListening ? "ESCANEANDO_FRECUENCIA..." : "SISTEMA_OFFLINE")}
          </motion.p>
        </AnimatePresence>
      </section>

      {/* STACK DE BURBUJAS DE TRADUCCIÓN */}
      <main className="flex-1 flex flex-col justify-end pb-12 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {bubbles.map((b) => (
            <TranslationBubble key={b.id} data={b} />
          ))}
        </AnimatePresence>
      </main>

      {/* FOOTER: CONTROLES NEURALES */}
      <footer className="flex flex-col items-center gap-10 pb-12 pt-6 bg-gradient-to-t from-black via-black to-transparent">
        <div className="relative">
          <AnimatePresence>
            {isListening && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -inset-14 bg-[#A855F7] rounded-full blur-[60px]" 
              />
            )}
          </AnimatePresence>
          
          <button 
            onClick={toggleMic}
            className={`relative w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all duration-500 active:scale-90 ${
              isListening 
                ? 'border-[#A855F7] bg-black text-[#A855F7] shadow-[0_0_60px_rgba(168,85,247,0.3)]' 
                : 'border-zinc-900 bg-zinc-950 text-zinc-900'
            }`}
          >
            <Mic size={40} className={isListening ? "animate-pulse" : ""} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 px-8 text-center">
          <p className="text-[9px] font-[1000] text-zinc-800 uppercase tracking-[0.8em]">Neural_Inbound_Protocol</p>
          <div className="px-8 py-2 bg-[#050505] rounded-full border border-white/5">
            <span className="text-[10px] text-zinc-600 font-black tracking-widest uppercase">
              Base_Léxica: {settings.knownVocabulary?.length || 0} Dominadas
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UltraInterpreter;