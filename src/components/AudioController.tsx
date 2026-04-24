/**
 * 🎙️ AUDIO_CONTROLLER v2026.PROD - MENCIONAL
 * Ubicación: /src/components/AudioController.tsx
 * Función: Gestión de salida de audio y visualización de sincronía neural.
 * Protocolo: Auto-detección de hardware y visualización de ducking (Voz Aoede).
 */

import React, { useEffect, useCallback, useMemo } from "react";
import { Volume2, Headphones, Activity, Waves, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioControllerProps {
  outputMode: "ambient" | "private";
  setOutputMode: (mode: "ambient" | "private") => void;
  isDucking?: boolean; // Se activa cuando el motor de IA (ai/geminiTTS.ts) está hablando
}

export const AudioController: React.FC<AudioControllerProps> = ({
  outputMode = "ambient",
  setOutputMode,
  isDucking = false
}) => {
  
  // Identidad visual MENCIONAL (Turquesa Neón #00FBFF)
  const themeColor = '#00FBFF';

  /**
   * 📡 DETECCIÓN DE HARDWARE NEURAL
   * Forzado automático a "Secure" si se detectan periféricos para evitar feedback.
   */
  const checkAudioDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();

      // Detección 2026: Bluetooth, USB-C Buds y Auriculares Neurales
      const hasHeadphones = devices.some(
        (device) =>
          device.kind === "audiooutput" &&
          device.label !== "" && 
          /(headphone|audífono|hands-free|earbuds|bluetooth|airpods|buds|sony|bose|jbl|beats|sennheiser|galaxy|pixel|neural)/i.test(
            device.label
          )
      );

      if (hasHeadphones && outputMode !== "private") {
        console.log(`%c 🎧 [AUDIO_CORE]: Hardware detectado. Protocolo SECURE activado. `, `color: ${themeColor}; font-weight: bold; background: #000; padding: 4px;`);
        setOutputMode("private");
      }
    } catch (err) {
      // Silencio operativo: No interrumpir la inmersión
    }
  }, [outputMode, setOutputMode, themeColor]);

  useEffect(() => {
    checkAudioDevices();
    
    // Escucha de cambios en caliente (Hot-plug)
    navigator.mediaDevices?.addEventListener("devicechange", checkAudioDevices);
    return () =>
      navigator.mediaDevices?.removeEventListener("devicechange", checkAudioDevices);
  }, [checkAudioDevices]);

  // Memorización de bandas (14 canales) para performance OLED
  const bars = useMemo(() => [...Array(14)], []); 

  return (
    <div className="flex flex-col items-center select-none p-6 relative z-50 w-full max-w-sm mx-auto italic">
      
      {/* 🟠 HUD DE SALIDA (CANDY GLASS CONTAINER) */}
      <div className="relative flex bg-black p-2.5 rounded-[4rem] border-2 border-white/5 shadow-[0_50px_100px_rgba(0,0,0,1)] backdrop-blur-3xl overflow-hidden w-full transition-all duration-700 hover:border-white/10">
        
        {/* Aura de Ducking: Resplandor reactivo a la voz de la IA */}
        <AnimatePresence>
          {isDucking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ 
                background: `linear-gradient(90deg, ${themeColor}15 0%, transparent 50%, ${themeColor}15 100%)` 
              }}
            />
          )}
        </AnimatePresence>

        {/* MODO AMBIENT (Altavoces) */}
        <button
          onClick={() => setOutputMode("ambient")}
          className={`flex-1 relative z-10 py-6 rounded-[3.2rem] transition-all duration-500 flex items-center justify-center gap-4 active:scale-95 border-2 ${
            outputMode === "ambient"
              ? "bg-white text-black border-transparent shadow-2xl"
              : "text-zinc-700 border-transparent hover:bg-white/5"
          }`}
        >
          <div className="flex flex-col items-start leading-none text-left">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-50">Output</span>
            <span className="text-sm font-[1000] uppercase tracking-tighter">Ambient</span>
          </div>
          <Volume2 
            size={20} 
            strokeWidth={3} 
            className={outputMode === "ambient" ? (isDucking ? "animate-bounce" : "") : "opacity-20"} 
          />
        </button>

        {/* MODO SECURE (Privacidad - Forzado con Auriculares) */}
        <button
          onClick={() => setOutputMode("private")}
          className={`flex-1 relative z-10 py-6 rounded-[3.2rem] transition-all duration-700 flex items-center justify-center gap-4 active:scale-95 border-2 ${
            outputMode === "private"
              ? "text-black border-transparent shadow-[0_0_50px_rgba(0,251,255,0.3)]"
              : "text-zinc-700 border-transparent hover:bg-white/5"
          }`}
          style={{ 
            backgroundColor: outputMode === "private" ? themeColor : 'transparent',
          }}
        >
          <div className="flex flex-col items-start leading-none text-left">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-50">Neural</span>
            <span className="text-sm font-[1000] uppercase tracking-tighter">Secure</span>
          </div>
          <div className="relative">
            <AnimatePresence mode="wait">
              {isDucking ? (
                <motion.div
                  key="zap"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <Zap size={20} fill="currentColor" className="animate-pulse text-black" />
                </motion.div>
              ) : (
                <motion.div
                  key="head"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <Headphones 
                    size={20} 
                    strokeWidth={3} 
                    className={outputMode === "private" ? "opacity-100" : "opacity-20"} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
      </div>

      {/* 🔴 MONITOR DE ONDA (TELEMETRÍA VISUAL) */}
      <div className="mt-12 flex flex-col items-center gap-8 w-full">
        <div 
          className="flex items-center gap-5 px-8 py-3 rounded-full bg-black border-2 backdrop-blur-xl transition-all duration-1000"
          style={{ borderColor: isDucking ? `${themeColor}40` : 'rgba(255,255,255,0.02)' }}
        >
          <Activity 
            size={14} 
            className={isDucking ? "animate-pulse" : "text-zinc-900"} 
            style={{ color: isDucking ? themeColor : '' }} 
          />
          <p className={`text-[10px] font-[1000] tracking-[0.6em] uppercase transition-all duration-700 ${
            isDucking ? "opacity-100" : "opacity-10"
          }`}
          style={{ color: isDucking ? themeColor : '#fff' }}>
            {isDucking ? "VOICE_SYNTH_ACTIVE" : "ENGINE_STANDBY"}
          </p>
          <Waves 
            size={16} 
            className={isDucking ? "animate-pulse" : "text-zinc-900"} 
            style={{ color: isDucking ? themeColor : '' }} 
          />
        </div>

        {/* FRECUENCIÓMETRO OLED */}
        <div className="flex items-end gap-[6px] h-16 px-6">
          {bars.map((_, i) => (
            <motion.div
              key={i}
              className={`w-[5px] rounded-full transition-colors duration-1000 ${
                isDucking ? "opacity-100" : "opacity-5"
              }`}
              style={{ 
                backgroundColor: isDucking ? themeColor : '#27272a',
                boxShadow: isDucking ? `0 0 20px ${themeColor}90` : 'none'
              }}
              animate={
                isDucking
                  ? { height: [10, Math.random() * 50 + 15, 10] }
                  : { height: 6 }
              }
              transition={{
                repeat: Infinity,
                duration: 0.2 + Math.random() * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
      
      {/* 🏷️ FOOTER SYSTEM */}
      <div className="mt-8">
        <span className="text-[8px] font-black text-zinc-900 uppercase tracking-[1em]">
          MENCIONAL_NEURAL_LINK_STABLE
        </span>
      </div>
    </div>
  );
};

export default AudioController;