/**
 * 🛰️ MENCIONAL | INTERPRETER_SESSION v2026.12
 * Ubicación: /src/pages/InterpreterPage.tsx
 * Protocolo Master: Transcripción Dual RT + Audio Sintetizado 2x cada 19s.
 * ✅ SERVICIOS AI: /src/services/ai/ (Actualizado conforme a directiva)
 * Objetivo: Referencia visual masiva + Refuerzo auditivo técnico.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Settings, Shield, 
  Activity, Cpu, X, Download, Zap, Save
} from 'lucide-react';

import { useSettings } from '../context/SettingsContext';
import { SessionTime } from '../utils/SessionTime';
import { formatTranscriptForTTS } from '../utils/audioUtils';

// 🔄 Importaciones actualizadas al directorio /ai/
import { startASR, stopASR, callGeminiTranslate } from '../services/ai/asr';
import { interpreterBuffer } from '../services/ai/buffermanager';
import { speakNeural, stopNeural } from '../api/tts';
import sessionService from '../services/SessionService';

const DualNeuralMessage: React.FC<{ 
  sourceText: string; 
  translatedText: string; 
  color: string; 
}> = ({ sourceText, translatedText, color }) => (
  <motion.div 
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex flex-col gap-10 mb-48 last:mb-20 group"
  >
    <div className="flex items-start gap-10">
      <div className="h-40 w-2.5 rounded-full opacity-60 shrink-0 shadow-[0_0_20px_rgba(0,251,255,0.3)]" style={{ backgroundColor: color }} />
      <p className="text-7xl md:text-[10rem] font-[1000] leading-[0.8] tracking-tighter italic uppercase text-white break-words drop-shadow-2xl">
        {sourceText}
      </p>
    </div>

    <div className="flex items-center gap-8 ml-20">
      <div className="px-5 py-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl">
        <span className="text-xs font-black text-[#00FBFF] uppercase tracking-[0.4em]">SINC_NEURAL_v26</span>
      </div>
      <p className="text-2xl md:text-4xl font-bold text-zinc-500 italic uppercase tracking-tight opacity-60 group-hover:opacity-100 transition-all duration-700">
        {translatedText === "..." ? "Procesando flujo..." : translatedText}
      </p>
    </div>
  </motion.div>
);

const InterpreterSession: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [msRemaining, setMsRemaining] = useState<number>(settings.sessionTimeRemaining * 1000 || 1200000);
  const [history, setHistory] = useState<{ id: string; source: string; target: string }[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const auraColor = settings.selectedColor?.hex || '#00FBFF';

  // --- ⏳ RELOJ DE SESIÓN ---
  useEffect(() => {
    const timer = setInterval(() => {
      setMsRemaining(prev => {
        const next = prev <= 1000 ? 0 : prev - 1000;
        if (next % 5000 === 0) updateSettings({ sessionTimeRemaining: next / 1000 });
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [updateSettings]);

  // --- 📜 AUTO-SCROLL ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [history]);

  // --- 🧠 MOTOR ULTRA-INTERPRETER (Protocolo 19s) ---
  useEffect(() => {
    if (isListening) {
      interpreterBuffer.setCycleDuration(19000); // Sincronización 19 Segundos

      recognitionRef.current = startASR((text, isFinal) => {
        if (isFinal) {
          setHistory(prev => {
            const last = prev[prev.length - 1];
            if (last && last.target === "...") {
              return [...prev.slice(0, -1), { ...last, source: last.source + " " + text }];
            }
            return [...prev, { id: Date.now().toString(), source: text, target: "..." }];
          });
          interpreterBuffer.addText(text);
        }
      });

      interpreterBuffer.start(async (finalText) => {
        try {
          const translated = await callGeminiTranslate(finalText, settings.nativeLanguage);
          if (translated) {
            const cleanText = formatTranscriptForTTS(translated);
            setHistory(prev => prev.map(m => m.target === "..." ? { ...m, target: cleanText } : m));
            
            setIsSpeaking(true);
            // Velocidad 2.0x para procesamiento técnico masivo
            await speakNeural(cleanText, settings.nativeLanguage, { rate: 2.0 }); 
            setIsSpeaking(false);
          }
        } catch (err) {
          setIsSpeaking(false);
        }
      });
    } else {
      if (recognitionRef.current) stopASR(recognitionRef.current);
      interpreterBuffer.stop();
      stopNeural();
    }
    return () => {
      if (recognitionRef.current) stopASR(recognitionRef.current);
      interpreterBuffer.stop();
    };
  }, [isListening, settings.nativeLanguage]);

  const handleTerminate = async () => {
    if (window.confirm("¿FINALIZAR ENLACE NEURAL?")) {
      if (settings.sessionId) await sessionService.end(settings.sessionId, 'completed');
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden select-none italic">
      
      {/* 🟢 HEADER TÉCNICO */}
      <header className="h-32 border-b border-white/5 flex items-center justify-between px-16 bg-black/50 backdrop-blur-3xl z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 px-6 py-3 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl">
            <Shield size={20} className="text-[#39FF14]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase">Master_Node</span>
              <span className="text-[13px] font-black text-white uppercase italic">Ultra_Interpreter_v26</span>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-700 flex flex-col items-center ${msRemaining < 300000 ? 'text-rose-500 scale-110' : 'text-zinc-500'}`}>
          <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-1 text-center font-sans">Remaining_Time</span>
          <span className="text-6xl tabular-nums font-[1000] italic leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            {SessionTime.formatMMSS(msRemaining)}
          </span>
        </div>

        <button 
          onClick={handleTerminate} 
          className="group flex items-center gap-4 px-12 py-6 bg-rose-600/10 border border-rose-600/20 rounded-[2rem] text-rose-500 text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-2xl"
        >
          <X size={20} /> Abortar
        </button>
      </header>

      {/* 🔵 VIEWPORT MASIVO (OLED RADIAL) */}
      <main 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto px-12 md:px-40 py-40 custom-scrollbar bg-black"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, ${auraColor}10 0%, transparent 70%)`
        }}
      >
        <div className="max-w-[1800px] mx-auto">
          <AnimatePresence mode="popLayout">
            {history.length > 0 ? (
              history.map((msg) => (
                <DualNeuralMessage 
                  key={msg.id} 
                  sourceText={msg.source} 
                  translatedText={msg.target} 
                  color={auraColor} 
                />
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} className="h-[50vh] flex flex-col items-center justify-center text-center">
                <Cpu size={140} className="mb-10 animate-pulse text-[#00FBFF]" />
                <p className="text-5xl font-[1000] tracking-tighter uppercase leading-none">Standby_Link_Ready</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 🔴 FOOTER DE CONTROL */}
      <footer className="h-56 bg-gradient-to-t from-black via-black/95 to-transparent flex items-center justify-between px-24 relative z-50">
        <div className="flex items-center gap-6">
          <button className="p-7 bg-zinc-900/40 border border-white/5 rounded-3xl text-zinc-700 hover:text-white transition-all shadow-2xl hover:bg-zinc-800"><Download size={28} /></button>
          <button className="p-7 bg-zinc-900/40 border border-white/5 rounded-3xl text-zinc-700 hover:text-white transition-all shadow-2xl hover:bg-zinc-800"><Save size={28} /></button>
        </div>

        {/* Mic Master Controller */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-16">
          <button 
            onClick={() => setIsListening(!isListening)}
            className={`group relative w-44 h-44 rounded-full flex items-center justify-center transition-all duration-1000 ${isListening ? 'bg-white shadow-[0_0_150px_rgba(0,251,255,0.3)] scale-110' : 'bg-zinc-950 border border-white/10 shadow-inner'}`}
          >
            {isListening ? <Mic size={64} className="text-black" /> : <MicOff size={64} className="text-zinc-800" />}
            {isListening && (
              <motion.div 
                animate={{ scale: [1, 2], opacity: [0.3, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }} 
                className="absolute inset-0 rounded-full border-2 border-[#00FBFF]" 
              />
            )}
          </button>
        </div>

        <div className="flex items-center gap-8 bg-zinc-900/40 px-12 py-8 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em]">Neural_Engine</span>
            <span className={`text-lg font-[1000] uppercase tracking-tighter ${isSpeaking ? "text-[#00FBFF]" : isListening ? "text-[#39FF14]" : "text-zinc-800"}`}>
              {isSpeaking ? "SYNTH_2X" : isListening ? "STREAMING" : "OFFLINE"}
            </span>
          </div>
          <Activity size={36} className={isListening ? "text-[#39FF14] animate-pulse" : "text-zinc-900"} />
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0a0a0a; border-radius: 20px; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #0a0a0a transparent; }
      `}</style>
    </div>
  );
};

export default InterpreterSession;