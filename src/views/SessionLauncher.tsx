/** 🚀 MENCIONAL v2026.PROD | SESSION_LAUNCHER
 * Ubicación: /src/views/SessionLauncher.tsx
 * Ajuste: Sincronización con carpeta 'ai', lógica de bypass Master y Rutas Producidas.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, Globe, ChevronRight,
  Languages, GraduationCap, MessagesSquare, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ RUTAS SINCRONIZADAS
import speechService from '../services/ai/speechService'; 
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../context/SettingsContext';
import { logger } from '../utils/logger';

export const SessionLauncher: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsAdmin, isAdmin } = useAuth();
  const { updateSettings } = useSettings();

  const [selectedMode, setSelectedMode] = useState<'Individual' | 'Dúo' | 'Trío'>('Individual');
  const [practiceLanguage, setPracticeLanguage] = useState('en-US');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPass, setAdminPass] = useState("");

  const PAYMENT_LINK = "https://mpago.la/2fPScDJ";

  const handleLaunchProtocol = async (functionMode: 'learning' | 'ultra' | 'rompehielo') => {
    // 🛡️ Lógica de Bypass: Contraseña maestra "osos" o estado admin previo
    const isMaster = isAdmin || adminPass.toLowerCase().trim() === "osos";
    
    const modeColors = {
      learning: '#00FBFF',   // Mencional (Cian)
      ultra: '#A855F7',      // Ultra (Violeta)
      rompehielo: '#FF00F5'  // Rompehielo (Rosa)
    };

    // 1. Sincronizar estado global
    updateSettings({
      themeColor: modeColors[functionMode],
      groupMode: selectedMode as any,
      targetLanguage: practiceLanguage,
      activeMode: functionMode,
      sessionActive: true
    });
    
    // 2. 🗣️ PROTOCOLO DE VOZ AOEDE (Sincronizado con speechService.ts)
    const speechMap = {
      learning: "Iniciando Modo Aprendizaje Mencional",
      ultra: "Activando Sistema Intérprete Ultra-Mencional",
      rompehielo: "Iniciando Protocolo Rompehielo"
    };
    
    speechService.speak(speechMap[functionMode], 'es-MX');

    // 3. 🚀 DIRECCIONAMIENTO
    if (isMaster) {
      if (!isAdmin) await loginAsAdmin("osos");
      
      // Rutas corregidas para coincidir con tu AppRouter
      const routeMap = {
        learning: '/learning',
        ultra: '/ultra',
        rompehielo: '/rompehielo'
      };
      
      logger.info("CORE", `Acceso Master: Redirigiendo a ${functionMode}`);
      navigate(routeMap[functionMode]); 
    } else {
      // Redirección a Mercado Pago para Participantes ($20 MXN)
      logger.info("PAYMENT", "Protocolo Participante: Redirección a Pasarela");
      window.location.href = PAYMENT_LINK;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col items-center overflow-x-hidden selection:bg-[#39FF14] selection:text-black italic">
      
      {/* 🛰️ HUD DE ESTADO */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-16 relative z-20">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
            NODE_MAESTRO: <span className="text-[#39FF14]">ACTIVO</span>
          </span>
        </div>

        <button 
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className={`p-4 rounded-2xl border transition-all duration-500 ${
            isAdmin || adminPass === "osos" ? "border-[#39FF14] bg-[#39FF14]/5" : "border-zinc-900 bg-zinc-950"
          }`}
        >
          <KeyRound size={18} className={isAdmin || adminPass === "osos" ? "text-[#39FF14]" : "text-zinc-700"} />
        </button>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 my-auto">
        
        {/* Branding e Idioma */}
        <section className="space-y-12">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl flex items-center justify-center">
                <Zap size={40} className="text-[#39FF14] fill-[#39FF14]" />
            </div>
            <h1 className="text-8xl md:text-9xl font-[1000] tracking-tighter uppercase leading-[0.8]">
              MENCIONAL<br/><span className="text-[#00FBFF]">HUB</span>
            </h1>
            <p className="text-zinc-700 text-[10px] font-black tracking-[0.6em] uppercase">
              Production_Node // v2.6.PROD
            </p>
          </div>

          <div className="space-y-4 max-w-sm">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 ml-2">
              <Globe size={12} /> Sincronización_Lingüística
            </label>
            <select 
              value={practiceLanguage}
              onChange={(e) => setPracticeLanguage(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 text-xs font-black text-white outline-none appearance-none cursor-pointer tracking-[0.2em] uppercase hover:border-[#00FBFF]/40 transition-all"
            >
              <option value="en-US">Inglés (Priority) 🇺🇸</option>
              <option value="fr-FR">Francés 🇫🇷</option>
              <option value="de-DE">Alemán 🇩🇪</option>
              <option value="it-IT">Italiano 🇮🇹</option>
            </select>
          </div>
        </section>

        {/* Selector de Nodos */}
        <section className="bg-zinc-950 border border-zinc-900 p-8 rounded-[3.5rem] space-y-4 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative">
          <AnimatePresence>
            {showAdminPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <input 
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full bg-black border-2 border-[#39FF14]/20 rounded-2xl px-6 py-5 text-center text-[#39FF14] font-mono tracking-[0.5em] mb-6 outline-none placeholder:text-zinc-800 uppercase"
                  placeholder="MASTER_KEY"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>

          <FunctionButton 
            icon={<GraduationCap />} 
            title="Mencional" 
            sub="Modo Aprendizaje Total"
            color="#00FBFF"
            onClick={() => handleLaunchProtocol('learning')}
          />

          <FunctionButton 
            icon={<Languages />} 
            title="Ultra-Mencional" 
            sub="Intérprete Neural Selectivo"
            color="#A855F7"
            onClick={() => handleLaunchProtocol('ultra')}
          />

          <FunctionButton 
            icon={<MessagesSquare />} 
            title="Rompehielo" 
            sub="Sugerencias Sociales AI"
            color="#FF00F5"
            onClick={() => handleLaunchProtocol('rompehielo')}
          />
        </section>
      </main>

      {/* Footer Estético */}
      <footer className="mt-auto opacity-20 flex flex-col items-center gap-2">
         <p className="text-[8px] font-black tracking-[1.5em] uppercase">Mencional_Neural_Network_v2.6</p>
         <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent" />
      </footer>
    </div>
  );
};

const FunctionButton = ({ icon, title, sub, onClick, color }: any) => (
  <motion.button
    whileHover={{ scale: 1.02, x: 8 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full group flex items-center justify-between p-8 bg-black/40 border border-zinc-900 rounded-[2.5rem] hover:border-white/20 transition-all duration-300"
  >
    <div className="flex items-center gap-6 text-left">
      <div 
        className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]" 
        style={{ color }}
      >
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div>
        <h3 className="text-2xl font-[1000] uppercase leading-none mb-1 tracking-tighter">{title}</h3>
        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{sub}</p>
      </div>
    </div>
    <ChevronRight size={20} className="text-zinc-800 group-hover:text-white transition-colors" />
  </motion.button>
);

export default SessionLauncher;