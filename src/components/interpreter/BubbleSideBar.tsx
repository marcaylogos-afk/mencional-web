/** 🫧 MENCIONAL | BUBBLE_SIDEBAR v2026
 * Ubicación: /src/components/interpreter/BubbleSideBar.tsx
 * Función: Stack lateral de traducciones selectivas con auto-destrucción (4s).
 * ✅ Estilo: OLED Optimized (#000000) con bordes neón.
 * ✅ Tipografía: Ultra-Bold (font-black) para legibilidad en clases.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';

interface Bubble {
  id: string | number;
  text: string;
}

interface BubbleSideBarProps {
  bubbles: Bubble[];
  themeColor: string;
}

const BubbleSideBar: React.FC<BubbleSideBarProps> = ({ bubbles, themeColor }) => {
  return (
    <aside className="w-full max-w-[320px] flex flex-col justify-end h-full pr-4 pb-12 overflow-hidden">
      
      {/* 🛰️ INDICADOR DE CANAL NEURAL */}
      <div className="mb-8 flex items-center gap-4 justify-end opacity-50">
        <span className="text-[9px] font-[1000] uppercase tracking-[0.5em] text-right leading-relaxed">
          Neural_Output <br /> 
          <span style={{ color: themeColor }}>Filter: Active</span>
        </span>
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 shadow-[0_0_20px_rgba(0,0,0,1)]">
          <Sparkles size={16} style={{ color: themeColor }} className="animate-pulse" />
        </div>
      </div>

      {/* 🫧 STACK DE BURBUJAS (FLUJO ASCENDENTE) */}
      <div className="space-y-5 flex flex-col items-end">
        <AnimatePresence mode="popLayout">
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.7, filter: "blur(15px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 30, scale: 0.8, transition: { duration: 0.2 } }}
              className="relative group"
            >
              {/* GLOW DE FONDO (OLED NEON) */}
              <div 
                className="absolute -inset-1 rounded-[24px] blur-md opacity-10 group-hover:opacity-30 transition duration-700"
                style={{ backgroundColor: themeColor }}
              ></div>

              {/* CUERPO DE LA BURBUJA (CONTRASTE ABSOLUTO) */}
              <div 
                className="relative bg-[#000000] border-2 p-5 rounded-[22px] rounded-tr-none shadow-2xl backdrop-blur-xl max-w-[280px]"
                style={{ borderColor: `${themeColor}66` }}
              >
                <div className="flex gap-4 items-start">
                  <div className="mt-1 opacity-50">
                    <MessageSquare size={14} style={{ color: themeColor }} />
                  </div>
                  
                  {/* TEXTO EN BOLD (FONT-BLACK) */}
                  <p 
                    className="text-lg font-black leading-[1.1] italic tracking-tight uppercase"
                    style={{ color: 'white', textShadow: `0 0 10px ${themeColor}44` }}
                  >
                    {bubble.text}
                  </p>
                </div>
                
                {/* ⏱️ PROTOCOLO DE VIDA (BARRA DE 4s) */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-zinc-900 rounded-full overflow-hidden opacity-40">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* STATUS SCANNER (Sutil) */}
      {bubbles.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="text-right pr-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800"
        >
          Scanning_Neural_Stream...
        </motion.div>
      )}
    </aside>
  );
};

export default BubbleSideBar;