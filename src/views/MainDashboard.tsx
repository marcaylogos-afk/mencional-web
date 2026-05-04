/** 🎛️ MENCIONAL | MAIN_DASHBOARD v2026.PROD
 * ✅ DIRECTORIO AI: /src/services/ai/ (Sincronizado: Es ai, no ia)
 * 🛡️ PROTOCOLO DE ACCESO: 
 * - Admin: 4 funciones (Aprendizaje, Test, Rompehielo, Ultra)
 * - Participante: 2 funciones (Aprendizaje, Test)
 * 🖼️ LOGO: /public/logo.png (Carga desde carpeta public)
 * 📱 ESTÉTICA: OLED Black (#000000)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Zap, 
  MessageSquare, 
  Award, 
  ShieldCheck, 
  Cpu, 
  ChevronRight,
  Activity
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { logger } from '../utils/logger';

const MainDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const isAdmin = settings.role === 'admin';
  const themeColor = settings.themeColor || '#39FF14'; // Verde Neón por defecto

  /**
   * DEFINICIÓN DE NODOS DE FUNCIÓN
   * Sincronizado con las rutas de AppRouter.tsx
   */
  const modes = [
    { 
      id: 'learning', 
      name: 'Modo Aprendizaje', 
      desc: 'Inmersión Lingüística Neural',
      icon: <BookOpen size={28} />, 
      path: '/learning-live', // Ruta directa al core de inmersión
      allowed: true 
    },
    { 
      id: 'test', 
      name: 'Modo Test', 
      desc: 'Validación de Competencias',
      icon: <Award size={28} />, 
      path: '/evaluation', 
      allowed: true 
    },
    { 
      id: 'rompehielo', 
      name: 'Rompehielo', 
      desc: 'Interacción Social Reactiva',
      icon: <MessageSquare size={28} />, 
      path: '/icebreaker-live', 
      allowed: isAdmin // Bloqueado para participantes
    },
    { 
      id: 'ultra', 
      name: 'Ultra-Mencional', 
      desc: 'Inferencia Neural Máxima',
      icon: <Zap size={28} />, 
      path: '/ultra-live', 
      allowed: isAdmin // Bloqueado para participantes
    }
  ];

  const handleNavigation = (path: string) => {
    logger.info("DASHBOARD_NAV", `Accediendo a: ${path} desde nodo /ai/`);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center font-sans p-6 lg:p-12 overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* 📡 HEADER & IDENTITY */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-16">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl">
            {/* Logo oficial de la carpeta public */}
            <img src="/logo.png" alt="Mencional Logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-[1000] italic uppercase tracking-tighter leading-none">Mencional</h1>
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em]">Core_System_v2.6</span>
          </div>
        </div>

        <div className="flex items-center gap-4 px-6 py-2 bg-zinc-950 border border-zinc-900 rounded-full">
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Identidad:</span>
            <span className="text-[9px] font-[1000] italic uppercase" style={{ color: themeColor }}>
              {isAdmin ? 'ADMIN_ROOT' : 'PARTICIPANT_NODE'}
            </span>
          </div>
          {isAdmin ? <ShieldCheck size={18} style={{ color: themeColor }} /> : <Activity size={18} className="text-zinc-800" />}
        </div>
      </header>

      {/* 🎛️ GRID DE FUNCIONES FILTRADAS POR ROL */}
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {modes.filter(m => m.allowed).map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5, borderColor: themeColor + '40' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavigation(mode.path)}
            className="group relative p-10 rounded-[3rem] bg-zinc-950 border border-zinc-900 flex flex-col items-start gap-4 transition-all text-left"
          >
            <div 
              className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center transition-all group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]" 
              style={{ color: themeColor }}
            >
              {mode.icon}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter text-white">
                {mode.name}
              </h3>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">
                {mode.desc}
              </p>
            </div>

            <ChevronRight 
              className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-800 group-hover:text-white group-hover:translate-x-2 transition-all" 
              size={24} 
            />
          </motion.button>
        ))}
      </main>

      {/* 📟 STATUS FOOTER (AI SYNC) */}
      <footer className="mt-auto w-full max-w-5xl pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-20">
        <div className="flex items-center gap-4">
          <Cpu size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">Services: /src/services/ai/</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest">Neural_Sync_Active</span>
          </div>
          <p className="text-[7px] font-black text-zinc-800 uppercase tracking-[1em] italic">
            MENCIONAL_PROD_2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainDashboard;