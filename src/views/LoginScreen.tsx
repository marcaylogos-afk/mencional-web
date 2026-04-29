/**
 * 🔐 MENCIONAL | LOGIN_SCREEN v2026.12
 * Protocolo: ID Anónimo | Mercado Pago Sync | Temas Trend Comunidad
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 * Ruta: /src/views/LoginScreen.tsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ShieldCheck, User, Crown, ChevronLeft, Lock, Zap 
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../context/SettingsContext';
import { logger } from '../utils/logger';

// Simulación de Temas Trend (Nutridos por sesiones previas)
const TREND_TOPICS = ["Negocios_IA", "Viaje_Tokyo", "Cena_Networking", "Arquitectura_Sustentable"];

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsAdmin, loginAsParticipant } = useAuth(); 
  const { updateSettings } = useSettings();
  
  const [pass, setPass] = useState("");
  const [userName, setUserName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [anonymousId, setAnonymousId] = useState("");
  const [viewMode, setViewMode] = useState<'CHOICE' | 'PARTICIPANTE_CONFIG' | 'ADMIN_INPUT'>('CHOICE');
  const [error, setError] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('mencional_device_id');
    const id = savedId || `NODE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    if (!savedId) localStorage.setItem('mencional_device_id', id);
    setAnonymousId(id);
    
    // Optimización OLED: Fondo Negro Puro
    document.body.style.backgroundColor = '#000000';
  }, []);

  /**
   * 👤 FLUJO PARTICIPANTE
   * Configura la sesión y redirige a la pasarela de pago ($20 MXN)
   */
  const handleParticipantEntry = useCallback(() => {
    setIsLoggingIn(true);
    updateSettings({ 
      userName: userName || "Anónimo", 
      sessionName: sessionName || "Sesión_Mencional" 
    });
    
    logger.info("LOGIN_PARTICIPANT", `Iniciando nodo: ${anonymousId}`);

    setTimeout(() => {
      loginAsParticipant(anonymousId);
      // Redirección directa al link oficial de Mercado Pago proporcionado
      window.location.href = "https://mpago.la/2fPScDJ"; 
    }, 1200);
  }, [userName, sessionName, anonymousId, loginAsParticipant, updateSettings]);

  /**
   * 🔑 FLUJO ADMIN (ACCESO MAESTRO)
   */
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'osos') { // Clave de acceso maestro
      setIsLoggingIn(true);
      loginAsAdmin();
      logger.info("LOGIN_ADMIN", "Acceso maestro verificado.");
      setTimeout(() => navigate('/selector'), 1000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      
      {/* 🌌 AMBIENTE OLED */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00FBFF]/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center">
        
        {/* BRANDING MENCIONAL */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center border border-white/5 mb-6 shadow-[0_0_30px_rgba(0,251,255,0.2)]">
             <span className="text-[#00FBFF] font-black text-3xl">M</span>
          </div>
          <h1 className="text-4xl font-[1000] tracking-tighter italic uppercase leading-none">
            MENCIONAL<span className="text-[#00FBFF]">.</span>
          </h1>
          <p className="text-[8px] tracking-[0.4em] font-black uppercase mt-3 text-zinc-600 italic">
            Neural_Core_v26.12_OLED
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === 'CHOICE' ? (
            <motion.div key="choice" className="w-full space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <button 
                onClick={() => setViewMode('PARTICIPANTE_CONFIG')}
                className="w-full py-6 bg-white text-black rounded-[2.5rem] font-[1000] uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-[#00FBFF] transition-all active:scale-95"
              >
                <User size={18} /> INICIAR APRENDIZAJE
              </button>
              <button 
                onClick={() => setViewMode('ADMIN_INPUT')}
                className="w-full py-5 bg-zinc-950/20 border-2 border-white/5 text-zinc-500 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[9px] flex items-center justify-center gap-4 hover:border-white/10 transition-all"
              >
                <Crown size={14} /> ACCESO_MASTER
              </button>
            </motion.div>
          ) : viewMode === 'PARTICIPANTE_CONFIG' ? (
            <motion.div key="config" className="w-full space-y-6" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <div className="space-y-2">
                <input 
                  type="text" placeholder="NOMBRE_FICTICIO" 
                  autoFocus
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-center font-black uppercase text-[10px] tracking-widest outline-none focus:border-[#00FBFF] transition-colors" 
                />
                <input 
                  type="text" placeholder="NOMBRE_DE_SESIÓN" 
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-center font-black uppercase text-[10px] tracking-widest outline-none focus:border-[#00FBFF] transition-colors" 
                />
              </div>

              {/* TEMAS TREND DE LA COMUNIDAD */}
              <div className="flex flex-wrap justify-center gap-2 py-2">
                {TREND_TOPICS.map(topic => (
                  <button 
                    key={topic} 
                    onClick={() => setSessionName(topic)}
                    className="text-[8px] font-black uppercase bg-zinc-950 border border-white/5 px-4 py-2 rounded-full text-zinc-500 hover:text-[#00FBFF] hover:border-[#00FBFF]/30 transition-all"
                  >
                    <Zap size={8} className="inline mr-1" /> {topic}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleParticipantEntry}
                disabled={isLoggingIn}
                className="w-full py-6 bg-[#00FBFF] text-black rounded-[2.5rem] font-[1000] uppercase text-xs shadow-[0_0_30px_rgba(0,251,255,0.3)]"
              >
                {isLoggingIn ? <Activity className="animate-spin mx-auto" /> : "IR A PAGO_SEGURO"}
              </button>
              
              <button onClick={() => setViewMode('CHOICE')} className="w-full text-[8px] font-black text-zinc-600 uppercase text-center tracking-[0.3em] hover:text-white transition-colors">
                <ChevronLeft size={10} className="inline mr-1" /> REGRESAR
              </button>
            </motion.div>
          ) : (
            /* Lógica Admin */
            <motion.form 
              key="admin" 
              onSubmit={handleAdminLogin} 
              className="w-full space-y-6"
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="CONTRASEÑA_MAESTRA"
                  autoFocus
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className={`w-full bg-zinc-900/50 border ${error ? 'border-red-500' : 'border-white/10'} p-5 rounded-2xl text-center font-black text-[12px] tracking-[0.5em] outline-none focus:border-[#39FF14] transition-all`}
                />
                {error && <p className="text-red-500 text-[8px] font-black uppercase text-center mt-2 tracking-widest">Credencial Incorrecta</p>}
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-[#39FF14] text-black rounded-[2.5rem] font-[1000] uppercase text-xs shadow-[0_0_30px_rgba(57,255,20,0.3)]"
              >
                {isLoggingIn ? <Activity className="animate-spin mx-auto" /> : "SINCRONIZAR_MODO_MAESTRO"}
              </button>

              <button onClick={() => setViewMode('CHOICE')} className="w-full text-[8px] font-black text-zinc-600 uppercase text-center tracking-[0.3em] hover:text-white transition-colors">
                <ChevronLeft size={10} className="inline mr-1" /> REGRESAR
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-10 flex flex-col items-center gap-4 opacity-30">
          <div className="flex items-center gap-3 px-4 py-2 bg-zinc-950 rounded-full border border-white/5">
            <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-[0.3em]">LINK_ID: {anonymousId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;