/**
 * 🛰️ MENCIONAL | MODAL_FRECUENCIA v22.0.4
 * Ubicación: /src/components/ModalFrecuencia.tsx
 * Función: Sincronización de protocolos 6s/19s y Rompehielo Inteligente (Auto-Launch).
 * ✅ SERVICIOS AI: /src/services/ai/ (Actualizado conforme a directiva)
 * Foco: Producción 2026 | ZERO_LATENCY_UI
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Headphones, Activity, 
  X, Radio, Globe, Shield, Cpu 
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from 'react-router-dom';

interface ModalFrecuenciaProps {
  onSelect?: (lang: string, settings: any) => void; 
  onClose?: () => void;
}

export const ModalFrecuencia: React.FC<ModalFrecuenciaProps> = ({ onSelect, onClose }) => {
  const { settings } = useSettings();
  const location = useLocation();
  
  const [countdown, setCountdown] = useState(4); 
  const [isAutoSelecting, setIsAutoSelecting] = useState(false);
  const [selectedOutput, setSelectedOutput] = useState<'headphones' | 'live'>('headphones');
  const [autoDetect, setAutoDetect] = useState(true);

  // 📝 Detección de Modo por Ruta
  const isLearningMode = useMemo(() => location.pathname.includes('learning'), [location.pathname]);

  /**
   * ⚙️ GENERADOR DE PROTOCOLO TÉCNICO
   * Sincronizado con el nuevo path /src/services/ai/
   */
  const getProtocol = useCallback(() => {
    if (isLearningMode) {
      return {
        mode: 'LEARNING',
        interval: 6000,      // Protocolo 6 Segundos
        repetitions: 2, 
        ducking: false,
        output: selectedOutput,
        color: '#00FBFF'     // Turquesa Neón
      };
    }
    return {
      mode: 'INTERPRETER',
      interval: 19000,     // Protocolo 19 Segundos
      repetitions: 1,
      ducking: true, 
      duckingLevel: 0.15,
      output: selectedOutput, 
      color: '#39FF14',    // Verde Neón
      autoDetect: autoDetect 
    };
  }, [isLearningMode, selectedOutput, autoDetect]);

  const executeSelection = useCallback((langId: string) => {
    if (isAutoSelecting) return;
    setIsAutoSelecting(true);
    
    const finalProtocol = getProtocol();

    // ⚡ Efecto de Calibración Neural (1.2s)
    setTimeout(() => {
      if (onSelect) {
        onSelect(langId, finalProtocol);
      } else if (onClose) {
        onClose();
      }
    }, 1200);
  }, [onSelect, onClose, isAutoSelecting, getProtocol]);

  /**
   * ⏲️ ROMPEHIELO INTELIGENTE (Auto-Launch)
   * Prioridad: Inglés por defecto si no hay selección manual.
   */
  useEffect(() => {
    if (isAutoSelecting) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const targetLang = autoDetect ? 'auto' : (settings?.targetLanguage || 'en-US');
          executeSelection(targetLang);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings, executeSelection, autoDetect, isAutoSelecting]);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 selection:bg-[#00FBFF]/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#020202] border border-white/[0.05] p-10 sm:p-14 rounded-[4.5rem] max-w-[480px] w-full relative shadow-[0_50px_120px_-20px_rgba(0,0,0,1)] overflow-hidden italic"
      >
        {/* ✨ GLOW DE ESTADO (OLED Friendly) */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] transition-colors duration-1000 ${isLearningMode ? 'bg-[#00FBFF]' : 'bg-[#39FF14]'}`} />

        {/* BOTÓN CERRAR */}
        <button 
          onClick={onClose} 
          className="absolute top-12 right-12 text-zinc-800 hover:text-white transition-all p-3 z-10 bg-zinc-950 rounded-full border border-white/5 hover:scale-110"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-[9px] font-[1000] uppercase tracking-[0.4em] border mb-10 ${
              isLearningMode ? 'border-[#00FBFF]/20 text-[#00FBFF] bg-[#00FBFF]/5' : 'border-[#39FF14]/20 text-[#39FF14] bg-[#39FF14]/5'
            }`}
          >
            <Cpu size={12} className="animate-pulse" />
            {isLearningMode ? 'Neural_6S_Active' : 'Ultra_19S_Link'}
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-[1000] uppercase text-white tracking-tighter leading-[0.8] mb-4">
            LINK_<span className={isLearningMode ? 'text-[#00FBFF]' : 'text-[#39FF14]'}>SYNC</span>
          </h2>
          <div className="flex items-center justify-center gap-3 opacity-30">
             <Shield size={10} className="text-zinc-500" />
             <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.5em]">Mencional_Master_Core</p>
          </div>
        </div>

        {/* SELECTOR DE IA (Directorio /ai/) */}
        <button 
          onClick={() => setAutoDetect(!autoDetect)}
          className={`w-full mb-6 p-7 rounded-[3rem] border-2 transition-all duration-700 flex items-center justify-between group ${
            autoDetect ? 'border-[#00FBFF] bg-[#00FBFF]/5 text-white shadow-[0_0_50px_rgba(0,251,255,0.03)]' : 'border-white/[0.03] bg-zinc-950 text-zinc-700'
          }`}
        >
          <div className="flex items-center gap-6 text-left">
            <Globe size={24} className={autoDetect ? 'text-[#00FBFF]' : 'opacity-10'} />
            <div>
              <span className="block text-[11px] font-[1000] uppercase tracking-widest leading-none mb-2">Motor AI</span>
              <span className="text-[8px] font-black opacity-40 uppercase tracking-[0.3em] italic">
                {autoDetect ? 'Path: /services/ai/ (Online)' : 'Manual_Lock_Mode'}
              </span>
            </div>
          </div>
          <div className={`w-7 h-7 rounded-full border-2 transition-all duration-700 flex items-center justify-center ${autoDetect ? 'bg-[#00FBFF] border-[#00FBFF] shadow-[0_0_20px_#00FBFF]' : 'border-zinc-900'}`}>
              {autoDetect && <Activity size={14} className="text-black" />}
          </div>
        </button>

        {/* GRID SALIDA AUDIO */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          <button 
            onClick={() => setSelectedOutput('live')}
            className={`p-9 rounded-[3rem] border-2 flex flex-col items-center gap-5 transition-all duration-700 group ${
              selectedOutput === 'live' 
                ? 'border-white bg-white text-black font-[1000]' 
                : 'border-white/[0.03] text-zinc-800 hover:border-zinc-700 hover:text-zinc-400'
            }`}
          >
            <Radio size={32} className={selectedOutput === 'live' ? 'animate-pulse' : 'opacity-20'} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Altavoz</span>
          </button>
          
          <button 
            onClick={() => setSelectedOutput('headphones')}
            className={`p-9 rounded-[3rem] border-2 flex flex-col items-center gap-5 transition-all duration-700 group ${
              selectedOutput === 'headphones' 
                ? 'border-[#00FBFF] bg-[#00FBFF]/5 text-white shadow-[0_0_40px_rgba(0,251,255,0.1)]' 
                : 'border-white/[0.03] text-zinc-800 hover:border-zinc-700 hover:text-zinc-400'
            }`}
          >
            <Headphones size={32} className={selectedOutput === 'headphones' ? 'animate-bounce-subtle text-[#00FBFF]' : 'opacity-20'} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#00FBFF]">Headset</span>
          </button>
        </div>

        {/* BOTÓN DE ACCIÓN PRINCIPAL */}
        <button 
          onClick={() => executeSelection(autoDetect ? 'auto' : (settings?.targetLanguage || 'en-US'))}
          disabled={isAutoSelecting}
          className={`group relative overflow-hidden w-full py-9 rounded-[2.5rem] font-[1000] uppercase text-[11px] tracking-[0.6em] transition-all active:scale-95 border-2 shadow-2xl ${
            isLearningMode 
              ? 'bg-[#00FBFF] border-cyan-400 text-black shadow-[#00FBFF]/20' 
              : 'bg-[#39FF14] border-green-400 text-black shadow-[#39FF14]/20'
          }`}
        >
          <span className="relative z-10">{isAutoSelecting ? 'SINCRONIZANDO...' : 'ESTABLECER_FRECUENCIA'}</span>
        </button>

        <footer className="mt-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-5">
            <div className="h-[1px] w-10 bg-zinc-900" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">
              Auto_Launch: <span className={isLearningMode ? 'text-[#00FBFF]' : 'text-[#39FF14]'}>{countdown}S</span>
            </p>
            <div className="h-[1px] w-10 bg-zinc-900" />
          </div>
          <p className="text-[7px] font-black uppercase tracking-[1em] text-zinc-800 select-none opacity-50 tracking-[1.5em]">MENCIONAL_2026</p>
        </footer>

        {/* 🧠 OVERLAY CANDYGLASS DE CARGA */}
        <AnimatePresence>
          {isAutoSelecting && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center p-14 backdrop-blur-3xl"
            >
              <div className="relative mb-14">
                <motion.div 
                  animate={{ scale: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`absolute inset-0 blur-[60px] rounded-full ${isLearningMode ? 'bg-[#00FBFF]' : 'bg-[#39FF14]'}`}
                />
                <Activity size={64} className={`relative z-10 animate-pulse ${isLearningMode ? 'text-[#00FBFF]' : 'text-[#39FF14]'}`} />
              </div>
              <h3 className="text-white font-[1000] italic uppercase tracking-[0.8em] text-[10px] mb-6">Neural_Calibration</h3>
              <div className="w-48 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className={`w-full h-full ${isLearningMode ? 'bg-[#00FBFF]' : 'bg-[#39FF14]'}`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default React.memo(ModalFrecuencia);