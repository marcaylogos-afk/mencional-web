/**
 * 🟠 ROMPEHIELO | SOCIAL_WINGMAN v2.6.PROD
 * Protocolo: Inferencia Inmediata | Doble Fijación Aoede | Ciclo 4s.
 * Estética: CandyGlass OLED High-Contrast (#FF8800).
 * Ubicación: /src/views/RompehieloMode.tsx
 * ✅ DIRECTORIO: Sincronizado a /src/services/ai/
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Zap, LogOut, Volume2, Globe } from 'lucide-react';

// ✅ SERVICIOS SINCRONIZADOS (Carpeta: ai)
import { useSettings } from '../context/SettingsContext';
import speechService from '../services/ai/speechService';
import { suggestionEngine } from '../services/ai/suggestionEngine'; 
import { logger } from '../utils/logger';

const RompehieloMode: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  
  const [transcript, setTranscript] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const transcriptBuffer = useRef("");

  /** 🧠 LÓGICA DE REACCIÓN SOCIAL (Ventana Crítica 4s) */
  useEffect(() => {
    const socialTimer = setInterval(async () => {
      // 1. Detección de entrada: Ventana crítica de 4 segundos
      if (transcriptBuffer.current.trim().length > 2 && !isProcessing) {
        setIsProcessing(true);
        const textToAnalyze = transcriptBuffer.current;
        transcriptBuffer.current = ""; 

        try {
          // 2. Obtener 3 respuestas sugeridas (Evita bloqueos)
          // @ts-ignore - Método implementado en suggestionEngine para Rompehielo
          const responses = suggestionEngine.getRompehieloResponses(textToAnalyze);
          setSuggestions(responses);

          // 3. FIJACIÓN AUTOMÁTICA (Protocolo Aoede)
          if (responses.length > 0) {
            const topResponse = responses[0];
            
            // Reproduce 2 veces la respuesta más lógica automáticamente
            // Esto permite que el usuario la aprenda y use al instante.
            await speechService.speak(topResponse, {
              lang: settings.targetLanguage === 'auto' ? 'en-US' : settings.targetLanguage,
              mode: 'rompehielo',
              repeat: 2 // Doble fijación
            });
          }
        } catch (err) {
          logger.error("ROMPEHIELO_AUTO_FAIL", err);
        } finally {
          setIsProcessing(false);
        }
      }
    }, 4000); // Ciclo de 4 segundos

    return () => clearInterval(socialTimer);
  }, [settings.targetLanguage, isProcessing]);

  /** 🎙️ CAPTURA DE VOZ (Transcripción sin traducción audible) */
  useEffect(() => {
    speechService.startListening({
      // Soporta "Modo Detectar Idioma" y opciones directas
      language: settings.targetLanguage === 'auto' ? 'en-US' : settings.targetLanguage,
      onResult: (text) => {
        // Se ve la transcripción pero no se traduce el audio del interlocutor
        setTranscript(text); 
        transcriptBuffer.current = text;
      },
      onError: (err) => logger.error("SOCIAL_MIC_ERR", err)
    });

    return () => speechService.stopListening();
  }, [settings.targetLanguage]);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans italic flex flex-col select-none overflow-hidden">
      
      {/* SCANLINES OLED */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-scanlines" />

      {/* HEADER: CONTROL DIRECTO (Sin configuración previa densa) */}
      <header className="flex justify-between items-center mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-xl border border-orange-500/40 shadow-[0_0_15px_rgba(255,136,0,0.1)]">
            <MessageCircle className="text-orange-500" size={18} />
          </div>
          <div className="text-left">
            <h1 className="text-[10px] font-black tracking-[0.3em] text-orange-400 uppercase">Modo_Rompehielo</h1>
            <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">Mencional_Social_IA</p>
          </div>
        </div>

        {/* SELECTOR RÁPIDO DE IDIOMA */}
        <div className="flex gap-2 items-center bg-zinc-950 p-1 rounded-2xl border border-zinc-900 shadow-2xl">
          {['en-US', 'fr-FR', 'de-DE'].map((lang) => (
            <button 
              key={lang}
              onClick={() => updateSettings({ targetLanguage: lang })}
              className={`px-3 py-1 rounded-xl text-[9px] font-bold uppercase transition-all ${settings.targetLanguage === lang ? 'bg-orange-500 text-black' : 'text-zinc-600'}`}
            >
              {lang.split('-')[0]}
            </button>
          ))}
          <button 
            onClick={() => updateSettings({ targetLanguage: 'auto' })}
            className={`px-3 py-1 rounded-xl text-[9px] font-bold uppercase transition-all ${settings.targetLanguage === 'auto' ? 'bg-cyan-500 text-black' : 'text-zinc-600'}`}
          >
            <Globe size={10} className="inline mr-1" /> Detectar
          </button>
          <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
          <button onClick={() => navigate('/selector')} className="p-2 text-zinc-700 hover:text-red-500 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full space-y-12 relative z-10">
        
        {/* TRANSCRIPCIÓN LITERAL */}
        <section className="space-y-4 text-left">
          <div className="flex items-center gap-2 text-zinc-600 uppercase text-[8px] font-black tracking-[0.4em]">
            <Zap size={10} className="text-orange-500" /> Transcripción_En_Vivo (Visual)
          </div>
          <div className="min-h-[120px] flex items-center">
            <p className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tighter leading-tight">
              {transcript || "Esperando interlocutor..."}
            </p>
          </div>
        </section>

        {/* 3 RESPUESTAS SUGERIDAS */}
        <section className="space-y-6 text-left">
          <div className="text-zinc-800 text-[8px] font-black uppercase tracking-[0.6em]">
            Sugerencias_Doble_Fijación_Aoede
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {suggestions.map((phrase, i) => (
                <motion.button
                  key={phrase + i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => speechService.speak(phrase, { lang: settings.targetLanguage, mode: 'rompehielo', repeat: 1 })}
                  className={`group flex justify-between items-center p-6 rounded-[30px] border transition-all ${
                    i === 0 
                      ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_0_40px_rgba(255,136,0,0.1)] scale-[1.02]' 
                      : 'bg-zinc-950 border-zinc-900 active:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md ${i === 0 ? 'bg-orange-500 text-black' : 'bg-zinc-900 text-zinc-500'}`}>
                      0{i + 1}
                    </span>
                    <span className={`text-xl font-bold tracking-tight ${i === 0 ? 'text-orange-400' : 'text-zinc-300'}`}>
                      {phrase}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Volume2 size={18} className={i === 0 ? 'text-orange-500 animate-pulse' : 'text-zinc-800'} />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <footer className="py-6 flex justify-between items-center opacity-40 mt-auto border-t border-zinc-900/50">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Ventana_Crítica: 4.0s</span>
        </div>
        <div className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">
          Mencional_v2.6_Core
        </div>
      </footer>
    </div>
  );
};

export default RompehieloMode;