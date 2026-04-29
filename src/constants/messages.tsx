/**
 * 📢 MENCIONAL | NEURAL_MESSAGING_SYSTEM v2026.12
 * Central de comunicación visual, alertas críticas y estados de IA.
 * Optimizado para pantallas OLED con animaciones de pulso y alto contraste.
 * Ubicación: /src/utils/messages.tsx
 * ✅ SINCRONIZADO: Referencias de motores actualizadas de /ia/ a /ai/
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CreditCard, ShieldAlert, WifiOff, CheckCircle2, Zap } from "lucide-react";

interface MessagesConfig {
  // Alertas de Tiempo y Conectividad
  ENDING_SOON: JSX.Element;
  SESSION_EXPIRED: JSX.Element;
  CONNECTION_LOST: JSX.Element;
  RENEWAL_PROMPT: JSX.Element;
  
  // Moderación y Seguridad
  YELLOW_CARD_WARNING: JSX.Element;
  GLOBAL_BLOCK_NOTICE: JSX.Element;
  AUTH_ERROR: JSX.Element; 
  
  // Estados de Procesamiento de IA (Sincronizados con /ai/)
  AWAITING_INPUT: string;
  PROCESSING_NEURAL: string;
  NEURAL_FIXATION: string; 
  AI_SYNC_SUCCESS: string;
  
  // Roles e Identidad
  WELCOME_ADMIN: string;
  GUEST_READY: string;
  VALIDATING_PAYMENT: string;
  PAYMENT_REQUIRED: JSX.Element; 
  TURN_INDICATOR: (data: string) => string;
  ROLE_ASSIGNMENT: (data: string) => string;
  
  // Modos Especiales
  ICEBREAKER_PROMPT: string;
  INTERPRETER_ACTIVE: string;
  ULTRA_MODE_SYNC: string;
  SESSION_READY: string;
  LANGUAGE_SYNC: (lang: string) => string; 
}

export const MESSAGES: MessagesConfig = {
  // --- ALERTAS CRÍTICAS (JSX) ---
  ENDING_SOON: (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e]" 
        />
        <span className="text-rose-500 font-black tracking-[0.4em] uppercase text-[11px] italic">
          ⚠️ CRÍTICO: VENTANA DE CIERRE
        </span>
      </div>
      <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">
        Bloque comercial de 20 min por finalizar.
      </span>
    </div>
  ),

  RENEWAL_PROMPT: (
    <div className="flex flex-col items-center gap-3 p-5 bg-zinc-900/40 border border-[#00FBFF]/20 rounded-[2rem] backdrop-blur-xl">
      <span className="text-white font-black tracking-[0.5em] uppercase text-[10px]">
        SESIÓN_AGOTADA
      </span>
      <motion.a 
        href="https://mpago.la/2fPScDJ"
        target="_blank"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="text-[#00FBFF] text-[10px] uppercase font-[1000] border-b-2 border-[#00FBFF] pb-1 hover:text-white transition-colors flex items-center gap-2"
      >
        <CreditCard size={12} /> $20 MXN • RENOVAR_ACCESO
      </motion.a>
    </div>
  ),

  AUTH_ERROR: (
    <div className="flex flex-col items-center gap-2 bg-rose-950/20 p-5 rounded-[2rem] border border-rose-500/30">
      <ShieldAlert className="text-rose-500" size={20} />
      <div className="text-center">
        <span className="text-rose-500 font-black tracking-[0.2em] uppercase text-[10px] block">
          CLAVE_INCORRECTA
        </span>
        <span className="text-white/40 text-[8px] uppercase font-bold tracking-widest mt-1 block">
          Acceso denegado al nodo maestro
        </span>
      </div>
    </div>
  ),

  PAYMENT_REQUIRED: (
    <div className="flex flex-col items-center gap-5 p-8 bg-zinc-950 rounded-[3rem] border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
      <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
        <Zap className="text-[#00FBFF]" size={28} />
      </div>
      <div className="text-center">
        <span className="text-white font-black italic tracking-tighter uppercase text-base block mb-1">
          Acceso_Restringido
        </span>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest leading-relaxed">
          Se requiere pago de $20 MXN <br /> para activar este protocolo.
        </p>
      </div>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-[#00FBFF] text-black rounded-2xl font-[1000] text-[10px] uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(0,251,255,0.2)]"
      >
        PAGAR_AHORA
      </motion.button>
    </div>
  ),

  // --- ESTADOS DE PROCESAMIENTO (Sincronizados con el directorio /ai/) ---
  AWAITING_INPUT: "ESCUCHANDO FRECUENCIA (6s)...",
  PROCESSING_NEURAL: "SINTETIZANDO RESPUESTA AI...",
  NEURAL_FIXATION: "FIJACIÓN NEURAL: REPETICIÓN 2/2",
  AI_SYNC_SUCCESS: "MOTOR GEMINI_AI_VINCULADO",

  // --- PROTOCOLOS DE IDENTIDAD ---
  WELCOME_ADMIN: "ADMINISTRADOR TÉCNICO • ACCESO_TOTAL",
  GUEST_READY: "PARTICIPANTE VINCULADO • MODO_APRENDIZAJE",
  VALIDATING_PAYMENT: "VERIFICANDO PAGO: $20.00 MXN...",
  ROLE_ASSIGNMENT: (data: string) => `NODO_ASIGNADO: ${data.toUpperCase()}`,
  TURN_INDICATOR: (data: string) => `TURNO_ACTUAL: ${data.toUpperCase()}`,
  LANGUAGE_SYNC: (lang: string) => `IDIOMA_PRIORITARIO: ${lang.toUpperCase()}`,

  // --- MODOS DE SESIÓN ---
  ICEBREAKER_PROMPT: "CICLO_ROMPEHIELO: VENTANA 4s",
  INTERPRETER_ACTIVE: "INTERPRETACIÓN_ACTIVA",
  ULTRA_MODE_SYNC: "SINCRONIZACIÓN_ULTRA 19s",
  SESSION_READY: "CONFIGURACIÓN LISTA. INICIA_PARA_TRADUCIR.",
  
  YELLOW_CARD_WARNING: (
    <div className="flex items-center gap-3 bg-amber-500/10 p-3 px-6 rounded-full border border-amber-500/30">
      <AlertTriangle className="text-amber-500" size={14} />
      <span className="text-amber-500 font-black tracking-[0.4em] uppercase text-[9px] italic">
        ADVERTENCIA_DE_CONDUCTA
      </span>
    </div>
  ),

  GLOBAL_BLOCK_NOTICE: (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 bg-red-600/20 border border-red-600 rounded-2xl flex items-center justify-center animate-pulse">
        <ShieldAlert className="text-white" size={24} />
      </div>
      <span className="text-red-600 font-black tracking-[0.5em] uppercase text-[10px]">NODO_BLOQUEADO</span>
    </div>
  ),

  SESSION_EXPIRED: (
    <div className="flex flex-col items-center gap-2 opacity-50">
      <CheckCircle2 className="text-zinc-500" size={24} />
      <span className="text-zinc-500 font-black tracking-[0.8em] uppercase text-[10px] ml-2">CICLO_COMPLETADO</span>
    </div>
  ),

  CONNECTION_LOST: (
    <div className="flex items-center gap-4 bg-zinc-950 p-3 px-6 rounded-full border border-white/5 shadow-2xl">
      <WifiOff className="text-amber-500 animate-pulse" size={14} />
      <span className="text-zinc-500 font-black tracking-[0.4em] uppercase text-[9px]">RECONECTANDO_MOTOR_AI...</span>
    </div>
  )
};

/**
 * 🛠️ COMPONENTE: NeuralMessage
 */
export const NeuralMessage: React.FC<{ 
  type: keyof MessagesConfig; 
  data?: any; 
  className?: string;
}> = ({ type, data, className }) => {
  const content = MESSAGES[type];
  
  if (typeof content === "function") {
    return (
      <motion.div 
        initial={{ opacity: 0, x: -15 }} 
        animate={{ opacity: 1, x: 0 }} 
        className={`flex items-center gap-3 ${className}`}
      >
        <div 
          className="w-3 h-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors duration-700" 
          style={{ backgroundColor: data || '#00FBFF' }} 
        />
        <span className="text-zinc-300 text-[11px] font-[1000] uppercase tracking-[0.3em] italic">
          {content(data || 'USER')}
        </span>
      </motion.div>
    );
  }

  if (typeof content === "string") {
    return (
      <motion.div 
        initial={{ opacity: 0, filter: 'blur(10px)' }} 
        animate={{ opacity: 1, filter: 'blur(0px)' }} 
        className={`flex items-center gap-5 py-3 ${className}`}
      >
        <div className="flex gap-[4px] items-center">
          {[0, 1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              animate={{ height: [4, 18, 4], opacity: [0.2, 1, 0.2] }} 
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }} 
              className="w-[2px] bg-[#00FBFF] rounded-full" 
            />
          ))}
        </div>
        <span className="text-zinc-500 text-[10px] font-[1000] uppercase tracking-[0.4em] italic leading-none">
          {content}
        </span>
      </motion.div>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={type} 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={className}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
};

export default MESSAGES;