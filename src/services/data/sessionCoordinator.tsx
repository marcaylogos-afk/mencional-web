/**
 * 🛰️ MENCIONAL | SESSION_COORDINATOR v2026.12
 * Gestión de Ciclo de Vida, Seguridad Anti-Abuso y Protocolos de Tiempo Sincronizado.
 * Ubicación: /src/services/data/sessionCoordinator.tsx
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Mic2, Zap, Lock, ShieldCheck, Users, User, ChevronRight, Palette, Cpu
} from 'lucide-react';

// --- 1. COMPONENTE: SESSION_SELECTOR (OLED Optimized) ---
/**
 * Interfaz que consume el Administrador tras ingresar "osos" 
 * o el Participante tras realizar su pago exitoso vía Mercado Pago.
 */
export const SessionSelector: React.FC<{ 
  onSelectMode: (mode: string, config: any) => void,
  isAdmin: boolean,
  accentColor: string
}> = ({ onSelectMode, isAdmin, accentColor }) => {
  
  const [groupSize, setGroupSize] = useState<'Individual' | 'Dúo' | 'Trío'>('Individual');

  const modes = [
    { 
      id: 'learning', 
      name: 'MODO_APRENDIZAJE', 
      icon: <BookOpen />, 
      desc: 'Inmersión 20 min. Turnos 6s. Karaoke cada 19s. Doble Audio Aoede.',
      available: true,
      tag: 'STANDARD'
    },
    { 
      id: 'interpreter', 
      name: 'ULTRA_MENCIONAL', 
      icon: <Mic2 />, 
      desc: 'Conferencias Pro. Audio ES cada 19s (Ducking 0.15 / Vel. 2x).',
      available: isAdmin,
      tag: 'ADMIN_ONLY'
    },
    { 
      id: 'icebreaker', 
      name: 'ROMPEHIELO', 
      icon: <Zap />, 
      desc: 'Social Express. Ventana 4s. 3 sugerencias proactivas e inmediatas.',
      available: isAdmin,
      tag: 'BETA_ADMIN'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center w-full max-w-6xl mx-auto p-6 space-y-10"
    >
      {/* 🟢 HEADER TECNOLÓGICO */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-zinc-950 border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,1)]">
          <Cpu size={14} style={{ color: accentColor }} className="animate-pulse" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] italic">
            {isAdmin ? 'MENCIONAL_MASTER_ACCESS' : 'PARTICIPANT_NODE_READY'}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-[1000] text-white italic tracking-tighter uppercase leading-tight">
          Selección de <span style={{ color: accentColor }}>Protocolo</span>
        </h2>
      </div>

      {/* 🟠 SELECTOR DE MODALIDAD (Aulas Individual / Dúo / Trío) */}
      <div className="flex flex-col items-center gap-6 w-full max-w-xl">
        <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] italic">
          <Palette size={12} /> Capacidad del Aula
        </div>
        
        <div className="relative flex gap-2 p-1.5 bg-zinc-950 border border-white/5 rounded-[2.5rem] w-full">
          {(['Individual', 'Dúo', 'Trío'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setGroupSize(opt)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] transition-all duration-500 font-[1000] text-[11px] uppercase tracking-[0.2em] z-10
                ${groupSize === opt 
                  ? 'text-black' 
                  : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              {opt === 'Individual' ? <User size={14}/> : <Users size={14}/>}
              {opt}
              {groupSize === opt && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-[2rem] -z-10 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 🔴 GRID DE MODOS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {modes.map((mode) => (
          <button 
            key={mode.id} 
            disabled={!mode.available}
            onClick={() => onSelectMode(mode.id, { groupSize })} 
            className={`group relative flex flex-col items-start text-left gap-8 bg-[#030303] border-2 p-8 rounded-[3.5rem] transition-all duration-500 active:scale-95
              ${mode.available 
                ? 'border-white/5 hover:border-white/20 cursor-pointer shadow-[0_30px_60px_rgba(0,0,0,0.8)]' 
                : 'border-white/[0.02] opacity-30 cursor-not-allowed'}`}
          >
            {/* Status Tag */}
            <div className="absolute top-8 right-8 flex items-center gap-2">
               <span className="text-[8px] font-black text-zinc-600 tracking-widest">{mode.tag}</span>
              {mode.available ? (
                <ShieldCheck size={16} style={{ color: accentColor }} />
              ) : (
                <Lock size={16} className="text-zinc-800" />
              )}
            </div>

            {/* Icono con Glow Dinámico */}
            <div 
              className="p-6 rounded-[1.8rem] bg-zinc-900/50 border border-white/5 transition-all duration-500 group-hover:scale-110"
              style={{ color: mode.available ? accentColor : '#18181b', boxShadow: mode.available ? `0 0 30px ${accentColor}11` : 'none' }}
            >
              {React.cloneElement(mode.icon as React.ReactElement, { size: 32, strokeWidth: 2.5 })}
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-[1000] uppercase text-2xl tracking-tighter italic leading-none group-hover:tracking-normal transition-all">
                {mode.id === 'learning' ? (
                  <>MODO_<span style={{ color: accentColor }}>APRENDIZAJE</span></>
                ) : mode.name.replace('_', ' ')}
              </h3>
              <p className="text-[12px] text-zinc-500 font-bold uppercase leading-relaxed tracking-[0.1em]">
                {mode.desc}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0"
                 style={{ color: accentColor }}>
              Inyectar_Protocolo <ChevronRight size={14} />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// --- 2. LÓGICA DE COORDINACIÓN (Reglas de Negocio) ---
export const sessionCoordinator = {
  /**
   * Obtiene las constantes de tiempo y repetición según modo.
   */
  getModeSettings: (mode: string) => {
    const protocols = {
      learning: { 
        blockDuration: 20,     // Bloque Mercado Pago (Mins)
        speechLimit: 6,        // Ventana de habla (s)
        ttsRepeats: 2,         // Doble audio Aoede
        visualRepeats: 2,      // Persistencia doble en HUD
        karaokeInterval: 19,   // Frase de apoyo técnica
        priorityLanguage: 'en-US'
      },
      interpreter: { 
        realTimeSource: true,
        ttsSpeed: 2.0,         // Ultra velocidad
        duckingRatio: 0.15,    // Mantiene original de fondo al 15%
        karaokeInterval: 19,
        retentionMode: 'HIGH'
      },
      icebreaker: {
        listeningWindow: 4,    // Dinámica social rápida
        suggestionCount: 3,    // 3 opciones de respuesta AI
        ttsRepeats: 2,
        aiProactivity: 1.0     // Máximo nivel de sugerencia
      }
    };

    return protocols[mode as keyof typeof protocols] || protocols.learning;
  },

  /**
   * Colores de identidad para participantes (OLED Ready)
   */
  getParticipantColor: (index: number): string => {
    const colors = ['#FF007A', '#39FF14', '#00FBFF', '#FFCF00'];
    return colors[index % colors.length];
  },

  /**
   * Cierre de emergencia y liquidación de créditos.
   */
  handleSessionTermination: (nodeId: string) => {
    console.warn(`[MENCIONAL_CORE] Terminando sesión forzada para: ${nodeId}`);
    return { 
      currentCredit: 0, 
      status: 'TERMINATED',
      timestamp: Date.now(),
      reason: 'BLOCK_TIME_EXPIRED'
    };
  }
};

export default sessionCoordinator;