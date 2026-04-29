/**
 * 🛰️ MENCIONAL | NEURAL_MESSAGE v16.0
 * Feedback de estado táctico para Modos: 6s, 19s y Rompehielo.
 * ✅ DIRECTORIO AI: /src/services/ai/
 * Foco: Producción 2026 | OLED OPTIMIZED
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type MessageType = 
  | 'AWAITING_INPUT'    // Escucha activa (Ventana crítica 6s)
  | 'DECODING'          // Procesando traducción inmediata
  | 'ROMPEHIELO_SYNC'   // Búsqueda de 3 respuestas (Ventana 4s)
  | 'SPEAKING'          // Salida voz Aoede (Repetición x2)
  | 'SUPPORT_CLOUD'     // Nube de ideas cada 19s (Apoyo en español)
  | 'TREND_SYNC'        // Registro de frase emulada a Tendencias Globales
  | 'ERROR'
  | 'STANDBY';

interface NeuralMessageProps {
  type: MessageType | string;
  activeTurnColor?: string; // Color dinámico (Rosa, Verde, Azul, etc.)
}

const NeuralMessage: React.FC<NeuralMessageProps> = ({ 
  type, 
  activeTurnColor = '#00FBFF' 
}) => {
  
  /**
   * 🎨 DICCIONARIO DE ESTADOS NEURALES
   * Ajustado para cumplir con la dinámica de 6s y 19s.
   */
  const statusConfig: Record<string, { label: string; color: string; pulse: boolean }> = {
    'AWAITING_INPUT': { 
      label: 'ESCUCHANDO_6S_ACTIVO', 
      color: activeTurnColor, 
      pulse: true 
    },
    'DECODING': { 
      label: 'TRADUCIENDO_KARAOKE', 
      color: '#FFFFFF', 
      pulse: true 
    },
    'ROMPEHIELO_SYNC': { 
      label: 'SINC_RESPUESTAS_4S', 
      color: '#F59E0B', 
      pulse: true 
    },
    'SPEAKING': { 
      label: 'VOZ_AOEDE_X2', 
      color: activeTurnColor, 
      pulse: true 
    },
    'SUPPORT_CLOUD': { 
      label: 'APOYO_DINÁMICO_19S', 
      color: '#7000FF', // Violeta para nube de ideas
      pulse: false 
    },
    'TREND_SYNC': { 
      label: '¡NUEVA_TENDENCIA_MÉXICO!', 
      color: '#10B981', // Verde éxito
      pulse: true 
    },
    'ERROR': { 
      label: 'ERROR_DE_ENLACE', 
      color: '#EF4444', 
      pulse: true 
    },
    'STANDBY': { 
      label: 'SISTEMA_STANDBY', 
      color: '#3F3F46', 
      pulse: false 
    },
  };

  const config = statusConfig[type] || statusConfig['STANDBY'];

  return (
    <div className="h-20 flex items-center justify-center pointer-events-none z-50">
      <AnimatePresence mode="wait">
        <motion.div 
          key={type}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-6 bg-black/90 px-10 py-5 rounded-[2rem] border border-white/5 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] transition-all duration-1000"
        >
          {/* 🔴 INDICADOR LED (PULSO NEURAL) */}
          <div className="relative flex items-center justify-center w-5 h-5">
            {config.pulse && (
              <motion.span 
                animate={{ scale: [1, 3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute h-full w-full rounded-full"
                style={{ backgroundColor: config.color }}
              />
            )}
            <span 
              className="relative h-3.5 w-3.5 rounded-full transition-colors duration-700"
              style={{ 
                backgroundColor: config.color,
                boxShadow: config.pulse ? `0 0 20px ${config.color}` : 'none'
              }}
            />
          </div>
          
          {/* 🏷️ CONSOLA DE ESTADO */}
          <div className="flex flex-col border-l border-white/10 pl-6 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[8px] font-[1000] text-zinc-700 uppercase tracking-[0.8em] font-mono">
                Neural_Core
              </span>
              {type === 'TREND_SYNC' && (
                <span className="bg-emerald-500/10 text-emerald-500 text-[6px] px-2 py-0.5 rounded-full font-black animate-bounce">
                  AUTO_SAVED
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span 
                className="font-[1000] uppercase tracking-[0.3em] text-[13px] italic transition-colors duration-700 leading-none"
                style={{ color: config.color }}
              >
                {config.label}
              </span>
            </div>
          </div>

          {/* 🧬 VISUALIZADOR DE FRECUENCIA (Solo en captura/voz) */}
          {(type === 'AWAITING_INPUT' || type === 'SPEAKING' || type === 'DECODING') && (
            <div className="flex gap-2 items-end border-l border-white/10 pl-6 h-7">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    height: [8, 24, 10, 20, 8],
                    opacity: [0.4, 1, 0.6, 1, 0.4]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 0.6, 
                    delay: i * 0.1,
                    ease: "easeInOut" 
                  }}
                  className="w-[4px] rounded-full"
                  style={{ backgroundColor: config.color }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default React.memo(NeuralMessage);