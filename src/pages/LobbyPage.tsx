/**
 * 🛰️ MENCIONAL | LOBBY_PAGE v2026.12
 * Objetivo: Panel de control de selección de módulos neurales.
 * Ubicación: /src/pages/LobbyPage.tsx
 * ✅ SERVICIOS AI: Sincronizados en /src/services/ai/
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Mic2, Zap, ChevronRight, Crown, ShieldCheck } from 'lucide-react';
import { useAuth } from "../hooks/useAuth";

// ✅ Sincronización con arquitectura centralizada /ai/
import { speechService } from '../services/ai/speechService'; 
import { logger } from '../utils/logger';

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Definición de protocolos del ecosistema Mencional sincronizados con TIMING_CONFIG
  const modes = [
    {
      id: 'learning',
      title: 'Aprendizaje',
      desc: 'Fijación neural y sombreado de voz con motor Aoede (Ciclo 6s).',
      icon: <BookOpen className="text-[#00FBFF]" size={32} />,
      path: '/learning-live', 
      adminOnly: false,
      color: 'from-cyan-500/10 to-transparent',
      voicePrompt: 'Iniciando protocolo de aprendizaje neural.'
    },
    {
      id: 'interpreter',
      title: 'Ultra-Intérprete',
      desc: 'Traducción simultánea profesional (Protocolo 19s).',
      icon: <Mic2 className="text-amber-500" size={32} />,
      path: '/ultra-live',
      adminOnly: true,
      color: 'from-amber-500/10 to-transparent',
      voicePrompt: 'Modo Ultra Intérprete activado. Sincronía de diecinueve segundos.'
    },
    {
      id: 'rompehielo',
      title: 'Modo Rompehielo',
      desc: 'Respuestas sociales instantáneas (Ciclo crítico 4s).',
      icon: <Zap className="text-[#FF007A]" size={32} />,
      path: '/rompehielo-live',
      adminOnly: true,
      color: 'from-rose-500/10 to-transparent',
      voicePrompt: 'Rompehielo activo. Ventana de reacción de cuatro segundos.'
    }
  ];

  // Filtro de seguridad: Solo el administrador ve los modos Maestro
  const availableModes = modes.filter(mode => !mode.adminOnly || isAdmin);

  /** ⚡ Ejecución de acceso con feedback auditivo inmediato */
  const handleModeAccess = async (path: string, prompt: string) => {
    logger.info("LOBBY", `Accediendo a: ${path}`);
    
    // Feedback de voz para inmersión total antes de la transición
    try {
      await speechService.speak(prompt, { lang: 'es-MX' });
    } catch (e) {
      logger.error("LOBBY", "Fallo en feedback auditivo inicial");
    }
    
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white p-[5%] flex flex-col items-center justify-center relative overflow-hidden font-sans italic select-none">
      
      {/* 🌌 FONDO OLED DINÁMICO (Optimizado para consumo cero) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,251,255,0.02),transparent_75%)] pointer-events-none" />
      
      {/* 📟 HEADER: IDENTIDAD VISUAL */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl md:text-8xl font-[1000] tracking-tighter uppercase leading-[0.8]">
              Módulos <span className="text-[#00FBFF]">Neurales</span>
            </h1>
            {isAdmin && (
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 5 }}
              >
                <Crown className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" size={40} />
              </motion.div>
            )}
          </div>

          <div className={`px-8 py-2.5 rounded-full border-2 flex items-center gap-4 transition-all duration-1000 ${
            isAdmin 
              ? 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]' 
              : 'bg-zinc-950 border-white/5'
          }`}>
            {isAdmin ? (
              <ShieldCheck size={16} className="text-amber-500" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-[#00FBFF] animate-pulse shadow-[0_0_10px_#00FBFF]" />
            )}
            <p className={`text-[11px] uppercase tracking-[0.7em] font-[1000] ${isAdmin ? 'text-amber-500' : 'text-zinc-500'}`}>
              {isAdmin ? 'ADMIN_MASTER_PROTOCOL' : 'STANDARD_IMMERSION_ACTIVE'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 🎛️ GRID DE MODOS (Jerarquía Maestra) */}
      <div className={`grid gap-8 w-full max-w-7xl relative z-10 ${
        isAdmin ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 max-w-lg'
      }`}>
        {availableModes.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, cubicBezier: [0.19, 1, 0.22, 1] }}
            onClick={() => handleModeAccess(mode.path, mode.voicePrompt)}
            className="group relative flex flex-col items-start p-12 rounded-[4.5rem] bg-zinc-950/30 border border-white/5 backdrop-blur-3xl hover:border-[#00FBFF]/30 transition-all duration-700 text-left overflow-hidden h-full active:scale-[0.97] shadow-2xl"
          >
            {/* Efecto Glow de Identidad */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
            
            <div className="mb-12 p-7 rounded-[2.5rem] bg-black/80 border border-white/10 relative z-10 group-hover:border-[#00FBFF]/40 transition-all duration-500">
              {mode.icon}
            </div>

            <h3 className="text-4xl font-[1000] uppercase tracking-tighter mb-5 relative z-10 group-hover:text-white transition-colors leading-none">
              {mode.title}
            </h3>
            
            <p className="text-zinc-500 text-[15px] font-bold leading-tight mb-14 relative z-10 max-w-[260px] group-hover:text-zinc-300 transition-colors opacity-70">
              {mode.desc}
            </p>

            <div className="mt-auto flex items-center gap-5 text-[12px] font-[1000] uppercase tracking-[0.5em] text-[#00FBFF] relative z-10">
              <span className="group-hover:tracking-[0.8em] transition-all duration-700">Acceder</span>
              <ChevronRight size={20} className="group-hover:translate-x-3 transition-transform duration-700" />
            </div>
            
            {mode.adminOnly && (
              <div className="absolute top-10 right-10 px-5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] italic">ULTRA</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* 🛰️ FOOTER DE TELEMETRÍA */}
      <footer className="mt-28 flex flex-col items-center gap-6 relative z-10">
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#00FBFF]/30 to-transparent" />
        <div className="flex flex-col items-center opacity-30">
          <span className="text-[10px] font-black uppercase tracking-[1.2em] text-zinc-600 italic">
            MENCIONAL_NEURAL_INTERFACE_v16
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-zinc-800 mt-2">
            STABLE_SYNC_PRODUCTION
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LobbyPage;