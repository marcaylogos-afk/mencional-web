/**
 * 📡 MENCIONAL | PHRASE_DISPLAY v2026
 * Visualizador de inferencia neural con jerarquía profesional.
 * Optimizado para pantallas OLED (Black-Pure) y legibilidad masiva.
 * ✅ DIRECTORIO AI: Sincronizado con servicios en /src/services/ai/
 */
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhraseDisplayProps {
  /** Texto procesado (Traducción o Sugerencia dinámica cada 19s) */
  phrase: string;          
  /** Texto capturado por el micro (Transcripción Original) */
  originalPhrase?: string; 
  /** Estado activo de síntesis de voz (Aoede pulsando) */
  isEchoing?: boolean;     
  /** * MODOS DE SESIÓN MENCIONAL:
   * 'learning': Modo Aprendizaje. Texto GIGANTE, blanco, impacto total (Eco 1.0x/0.85x).
   * 'ultra': Modo Intérprete. Foco en precisión técnica (Cian Eléctrico).
   * 'icebreaker': Modo Rompehielo. Enfoque en dinamismo social (Magenta).
   */
  mode?: 'learning' | 'ultra' | 'icebreaker';
}

export const PhraseDisplay: React.FC<PhraseDisplayProps> = ({ 
  phrase, 
  originalPhrase,
  isEchoing = false,
  mode = 'learning'
}) => {
  
  const phraseKey = useMemo(() => phrase?.trim() || "waiting", [phrase]);

  // Identidad Visual por Nodo Maestro
  const themeColor = useMemo(() => {
    switch(mode) {
      case 'ultra': return "#00FBFF"; // Cian Eléctrico (Ultra-Mencional)
      case 'icebreaker': return "#FF00F5"; // Magenta Social (Rompehielo)
      default: return "#FFFFFF"; // Blanco Puro (Mencional / Aprendizaje)
    }
  }, [mode]);

  // --- PANTALLA DE SINCRONIZACIÓN (SYNC) ---
  if (!phrase && !originalPhrase) return (
    <div className="h-[65vh] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-10">
        {/* Línea de pulso OLED */}
        <motion.div 
          animate={{ 
            width: [40, 240, 40], 
            opacity: [0.1, 0.5, 0.1],
            backgroundColor: [themeColor, "#fff", themeColor] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="h-[1px] shadow-[0_0_40px_rgba(255,255,255,0.15)]" 
        />
        <p className="text-[10px] font-black uppercase tracking-[2.2em] text-zinc-900 animate-pulse ml-[2.2em]">
          MENCIONAL_NEURAL_SYNC
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-screen-2xl mx-auto select-none relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden py-16 bg-black">
      
      {/* --- AURA REACTIVA AOEDE (Pulsación Neural) --- */}
      <motion.div 
        animate={{ 
          opacity: isEchoing ? 0.28 : 0.04,
          scale: isEchoing ? 1.5 : 1,
          backgroundColor: themeColor
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0 blur-[140px] rounded-full pointer-events-none z-0" 
      />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full text-center px-8 md:px-24 flex flex-col gap-12 md:gap-20"
      >
        
        {/* --- 1. BLOQUE DE ENTRADA (TRANSCRIPCIÓN ES-MX) --- */}
        <div className="min-h-[140px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {originalPhrase && (
              <motion.div
                key={`orig-${originalPhrase}`}
                initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
                className="flex flex-col gap-4"
              >
                <span className="text-zinc-700 text-[10px] font-black uppercase tracking-[1em] opacity-50">
                  {mode === 'learning' ? 'Mencional_Input' : mode === 'ultra' ? 'Ultra_Feed_Link' : 'Social_Context'}
                </span>
                
                <p className={`tracking-tight leading-snug max-w-6xl mx-auto transition-all duration-700 ${
                  mode === 'ultra' 
                    ? 'text-5xl md:text-7xl text-white font-black' 
                    : 'text-3xl md:text-5xl text-zinc-600 font-bold italic'
                }`}>
                  {originalPhrase}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- 2. BLOQUE MAESTRO (SALIDA AOEDE / TRADUCCIÓN) --- */}
        <div className="min-h-[260px] md:min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseKey}
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.08, y: -40 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full"
            >
              <h2 className={`italic tracking-tighter transition-all duration-1000 ${
                mode === 'learning'
                  ? 'text-7xl sm:text-[10rem] md:text-[13rem] lg:text-[16rem] font-[1000] text-white leading-[0.75] drop-shadow-[0_15px_80px_rgba(255,255,255,0.12)] uppercase'
                  : mode === 'icebreaker'
                    ? 'text-6xl md:text-9xl font-black text-[#FF00F5] uppercase tracking-tighter'
                    : 'text-5xl md:text-8xl font-black text-[#00FBFF] uppercase tracking-[0.15em] drop-shadow-[0_0_50px_rgba(0,251,255,0.25)]'
              }`}>
                {phrase}
              </h2>
              
              {/* REFLEJO OLED PROFUNDO (Efecto CandyGlass para Aprendizaje) */}
              {mode === 'learning' && (
                <div className="absolute top-[100%] left-0 right-0 opacity-[0.02] scale-y-[-0.6] blur-4xl pointer-events-none select-none hidden lg:block">
                  <h2 className="text-[14rem] font-[1000] text-white italic tracking-tighter uppercase">
                    {phrase}
                  </h2>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- 3. WAVEFORM Y STATUS --- */}
        <div className="flex flex-col items-center gap-12 mt-6">
          {/* Visualizador de Ondas Aoede */}
          <div className="flex gap-2 h-20 items-center">
            {[...Array(28)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: isEchoing ? [10, 75, 20, 85, 10] : [4, 12, 4],
                  backgroundColor: isEchoing ? themeColor : "#151515",
                  opacity: isEchoing ? 1 : 0.2
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.35 + (Math.random() * 0.4), 
                  delay: i * 0.015 
                }}
                className="w-[5px] rounded-full"
              />
            ))}
          </div>
          
          {/* STATUS BADGE OLED-READY */}
          <div className="flex items-center gap-8 bg-zinc-950/40 px-10 py-4 rounded-full border border-white/5 backdrop-blur-4xl shadow-2xl">
            <motion.div 
              animate={isEchoing ? { 
                scale: [1, 2.5, 1], 
                backgroundColor: themeColor,
                boxShadow: `0 0 25px ${themeColor}`
              } : {}}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className={`w-3 h-3 rounded-full ${isEchoing ? '' : 'bg-zinc-900'}`} 
            />
            <span className={`text-[10px] font-black tracking-[1.4em] uppercase transition-all duration-700 ${
              isEchoing ? 'text-white' : 'text-zinc-800'
            }`}>
              {isEchoing ? 'Aoede_Active_Pulse' : 'Link_Waiting'}
            </span>
          </div>
        </div>

      </motion.div>

      {/* VIGNETTE OLED FOCUS (Protección de bordes) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)] pointer-events-none opacity-90" />
    </div>
  );
};

export default React.memo(PhraseDisplay);