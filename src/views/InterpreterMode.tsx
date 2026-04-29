/**
 * ⚡ MENCIONAL | ULTRA-MENCIONAL (MODO INTÉRPRETE)
 * Ubicación: /src/views/InterpreterMode.tsx
 * ✅ UPDATE: Control de Audio (Mute) + Modo Auditoría (Invitado).
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  LogOut, 
  Activity, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  ShieldCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

import speechService from '../services/ai/speechService';
import translateService from '../services/ai/translateService';
import { logger } from '../utils/logger';
import { pdfExportService } from '../services/utils/pdfExportService';

const InterpreterMode: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lastTranslation, setLastTranslation] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(19);
  
  const [isMuted, setIsMuted] = useState(false);

  const fullOriginalHistory = useRef<string[]>([]);
  const cycleBuffer = useRef("");

  /** 🧪 TOGGLE AUDITORÍA: Cambia entre modo Personal y Demo */
  const toggleAuditoryMode = async () => {
    const newMode = !settings.isGuestMode;
    await updateSettings({ isGuestMode: newMode });
    
    if (newMode) {
      speechService.speak("Modo auditoría activado. Filtros de seguridad liberados.", 'es-MX');
      logger.info("SYSTEM", "Entrando en Modo Auditoría (Guest)");
    } else {
      speechService.speak("Mapa neural personal restaurado.", 'es-MX');
      logger.info("SYSTEM", "Saliendo de Modo Auditoría");
    }
  };

  /** 🧠 MOTOR DE INFERENCIA ULTRA */
  const handleInferenceCycle = useCallback(async (text: string) => {
    if (!text || text.trim().length < 5) return;

    setIsProcessing(true);
    try {
      const translation = await translateService.translate(text, settings.nativeLanguage, 'ultra');
      setLastTranslation(translation);

      // ✅ CONDICIONAL DE AUDIO
      if (!isMuted) {
        await speechService.speak(translation, settings.nativeLanguage, 2.0);
      }

      setTimeout(() => setLastTranslation(""), 5000);
    } catch (error) {
      logger.error("ULTRA_SYNC_ERROR", error);
    } finally {
      setIsProcessing(false);
    }
  }, [settings.nativeLanguage, isMuted]);

  /** ⏱️ CRONÓMETRO DE CICLO (19s) */
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          if (cycleBuffer.current) {
            handleInferenceCycle(cycleBuffer.current);
            cycleBuffer.current = "";
          }
          return 19;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [handleInferenceCycle]);

  /** 🎙️ ESCUCHA CONTINUA */
  useEffect(() => {
    speechService.startListening({
      language: settings.targetLanguage,
      onResult: (text) => {
        setLiveTranscript(text);
        cycleBuffer.current = text;
        if (!fullOriginalHistory.current.includes(text)) {
          fullOriginalHistory.current.push(text);
        }
      },
      onError: (err) => logger.error("MIC_ULTRA_FAIL", err)
    });
    return () => speechService.stopListening();
  }, [settings.targetLanguage]);

  const handleExportAndExit = async () => {
    if (fullOriginalHistory.current.length > 0) {
      await pdfExportService.generate(fullOriginalHistory.current, "Sesion_Ultra_Mencional");
    }
    navigate('/selector');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white p-8 flex flex-col font-sans italic select-none">
      
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {/* MODO AUDITORÍA / PERSONAL SWITCH */}
          <button 
            onClick={toggleAuditoryMode}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-500 ${
              settings.isGuestMode 
              ? 'border-[#39FF14] bg-[#39FF14]/5 text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.15)]' 
              : 'border-zinc-800 bg-transparent text-zinc-600'
            }`}
          >
            {settings.isGuestMode ? (
              <>
                <ShieldAlert size={14} className="animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Auditoría_Open</span>
              </>
            ) : (
              <>
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Neural_Locked</span>
              </>
            )}
          </button>

          {/* 🔊 BOTÓN AUDIO */}
          <button 
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted) speechService.stop();
            }}
            className={`flex items-center justify-center w-12 h-10 rounded-xl border transition-all duration-300 ${
              isMuted ? 'border-rose-900/50 text-rose-500' : 'border-[#00FBFF]/20 text-[#00FBFF]'
            }`}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-[1000] uppercase tracking-[0.6em] text-white/20">Mencional_System</h2>
          <div className="flex items-center gap-2 mt-1">
             <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-[#39FF14] animate-ping' : 'bg-zinc-800'}`} />
             <p className="text-[7px] text-zinc-600 uppercase tracking-widest font-black">Sync_Status: {isProcessing ? 'Active' : 'Standby'}</p>
          </div>
        </div>

        <button 
          onClick={handleExportAndExit}
          className="flex items-center gap-3 px-6 py-3 bg-zinc-950 border border-rose-900/30 text-rose-500 rounded-2xl hover:bg-rose-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <LogOut size={14} /> Salir_Y_PDF
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        {/* PANTALLA OLED DE TRANSCRIPCIÓN */}
        <div className="flex-1 bg-[#050505] border border-white/5 rounded-[40px] p-10 flex items-center justify-center text-center shadow-2xl relative overflow-hidden">
          {settings.isGuestMode && (
            <div className="absolute top-6 left-6 flex items-center gap-2 opacity-30">
               <Activity size={12} className="text-[#39FF14]" />
               <span className="text-[8px] font-black text-[#39FF14] uppercase tracking-widest">Guest_Live_Stream</span>
            </div>
          )}
          
          <motion.h1 
            key={liveTranscript}
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-100 uppercase"
          >
            {liveTranscript || "Aguardando_Input_Vocal..."}
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-1/3">
          <div className="bg-zinc-900/10 border border-white/5 rounded-[30px] p-6 overflow-hidden">
            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4 block">Log_Data_Original</span>
            <div className="text-[10px] text-zinc-500 font-mono space-y-1">
              {fullOriginalHistory.current.slice(-4).map((line, i) => (
                <p key={i} className="truncate text-zinc-600"> {`>> ${line}`}</p>
              ))}
            </div>
          </div>

          <div className="bg-[#020202] border border-[#39FF14]/10 rounded-[30px] p-8 flex flex-col justify-center relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-1 bg-[#39FF14] transition-all duration-100 shadow-[0_0_15px_#39FF14]" 
              style={{ width: `${(timeLeft/19)*100}%` }} 
            />
            <span className="text-[9px] font-black text-[#39FF14] uppercase tracking-[0.4em] mb-3">Inferencia_Espejo</span>
            <p className="text-2xl font-black text-[#39FF14] uppercase leading-none tracking-tighter">
              {lastTranslation || `Sincronizando en ${Math.ceil(timeLeft)}s...`}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterpreterMode;