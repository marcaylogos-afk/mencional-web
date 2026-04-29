/**
 * ✅ PAYMENT_SUCCESS v21.0 - MENCIONAL 2026.PROD
 * Nodo de Confirmación Post-Transacción y Selección de Aula.
 * Protocolo: Sincronización Forzada (Bloques de 20 min).
 * Ubicación: /src/pages/PaymentSuccess.tsx
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Clock,
  Mic2,
  Activity,
  Zap,
  Lock
} from 'lucide-react';

import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth'; 
import { logger } from '../utils/logger';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { isAdmin } = useAuth(); 

  // Sincronización visual con la estética OLED elegida (Turquesa, Rose o Ámbar)
  const themeColor = settings?.themeColor || "#00FBFF";

  // Bypass Maestro para administradores (Acceso a protocolos Pro)
  const isActuallyAdmin = isAdmin || localStorage.getItem('mencional_role') === 'admin';

  useEffect(() => {
    /**
     * 🛡️ PROTOCOLO DE ACTIVACIÓN NEURAL
     * Sincroniza el crédito de 20 min y resetea el entorno de sesión.
     */
    const activateNeuralAccess = async () => {
      try {
        // 1. Limpieza de caché de sesiones previas
        localStorage.removeItem('current_aula_id'); 
        
        // 2. Inyección de Tiempo (20 Minutos exactos)
        const SESSION_MINUTES = 20;
        const SESSION_MS = SESSION_MINUTES * 60 * 1000;
        
        localStorage.setItem('mencional_paid', 'true');
        localStorage.setItem('session_duration_ms', SESSION_MS.toString());
        localStorage.setItem('session_start_timestamp', Date.now().toString());
        
        // 3. Update Global Context para habilitar guardas
        if (updateSettings) {
          await updateSettings({ 
            isSessionActive: true,
            sessionTimeRemaining: SESSION_MINUTES * 60, 
            lastPaymentStatus: 'approved'
          });
        }

        logger.info("SYNC_SUCCESS: Nodo activado. Acceso de 20 min garantizado.");
      } catch (error) {
        logger.error("SYNC_FAULT: Error en la persistencia del protocolo.", error);
      }
    };

    activateNeuralAccess();
    
    // OLED Black Body
    document.body.style.backgroundColor = '#000000'; 
  }, [updateSettings]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden select-none">
      
      {/* 🌌 ATMÓSFERA REACTIVA */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none transition-all duration-1000" 
        style={{ background: `radial-gradient(circle at center, ${themeColor}, transparent 75%)` }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-12 text-center"
      >
        <div className="relative inline-block mb-10">
          <motion.div 
            animate={{ 
              boxShadow: [`0 0 20px ${themeColor}22`, `0 0 80px ${themeColor}44`, `0 0 20px ${themeColor}22`],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-32 h-32 bg-black border-2 rounded-[3.5rem] flex items-center justify-center relative z-10"
            style={{ borderColor: themeColor }}
          >
            <CheckCircle2 className="w-14 h-14" style={{ color: themeColor }} />
          </motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -bottom-2 -right-2 bg-[#39FF14] p-3 rounded-full border-[6px] border-black shadow-2xl"
          >
            <ShieldCheck size={20} className="text-black" />
          </motion.div>
        </div>

        <h1 className="text-6xl md:text-[8rem] font-[1000] italic uppercase tracking-tighter leading-[0.8] mb-8">
          ACCESO<br/>
          <span style={{ color: themeColor }}>VALIDADO</span>
        </h1>
        
        <div className="flex items-center gap-4 bg-zinc-950/80 px-10 py-4 rounded-full border border-white/10 inline-flex backdrop-blur-md">
          <Clock size={18} style={{ color: themeColor }} className="animate-pulse" />
          <p className="text-[11px] text-zinc-400 font-black uppercase tracking-[0.5em]">
            CRÉDITO DISPONIBLE: <span className="text-white">20:00 MIN</span>
          </p>
        </div>
      </motion.div>

      {/* 🛠️ SELECTOR DE PROTOCOLO DE ENTRADA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">
        
        {/* MODO: APRENDIZAJE (MIGUEL_FAV) */}
        <motion.button 
          whileHover={{ y: -8, borderColor: themeColor, backgroundColor: "rgba(255,255,255,0.02)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/learning')}
          className="group bg-zinc-950 border border-white/5 p-12 rounded-[4rem] text-left relative overflow-hidden flex flex-col justify-between transition-all"
        >
          <div className="mb-12">
            <div className="p-6 bg-zinc-900 rounded-2xl w-fit mb-8 border border-white/5 group-hover:bg-[#00FBFF] transition-all group-hover:shadow-[0_0_40px_#00FBFF66]">
              <Mic2 className="w-8 h-8 text-white group-hover:text-black" />
            </div>
            <h3 className="font-black italic uppercase text-5xl tracking-[ -0.05em] leading-[0.9]">Modo<br/>Aprendizaje</h3>
            <div className="flex items-center gap-2 mt-6 opacity-30 group-hover:opacity-100 transition-opacity">
               <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
               <p className="text-[10px] uppercase tracking-widest font-black italic">Sincronización Neural Activa</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest group-hover:text-zinc-400">Seleccionar Protocolo</span>
             <ArrowRight className="group-hover:translate-x-3 transition-transform text-zinc-500 group-hover:text-white" />
          </div>
        </motion.button>

        {/* MODO: ROMPEHIELO */}
        <motion.button 
          whileHover={{ y: -8, borderColor: "#FF00EA", backgroundColor: "rgba(255,255,255,0.02)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/rompehielo')}
          className="group bg-zinc-950 border border-white/5 p-12 rounded-[4rem] text-left relative overflow-hidden flex flex-col justify-between transition-all"
        >
          <div className="mb-12">
            <div className="p-6 bg-zinc-900 rounded-2xl w-fit mb-8 border border-white/5 group-hover:bg-[#FF00EA] transition-all group-hover:shadow-[0_0_40px_#FF00EA66]">
              <Sparkles className="w-8 h-8 text-white group-hover:text-black" />
            </div>
            <h3 className="font-black italic uppercase text-5xl tracking-[ -0.05em] leading-[0.9]">Modo<br/>Rompehielo</h3>
            <div className="flex items-center gap-2 mt-6 opacity-30 group-hover:opacity-100 transition-opacity">
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
               <p className="text-[10px] uppercase tracking-widest font-black italic">Conversación Fluida Asistida</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest group-hover:text-zinc-400">Iniciar Fluidez</span>
             <ArrowRight className="group-hover:translate-x-3 transition-transform text-zinc-500 group-hover:text-white" />
          </div>
        </motion.button>
      </div>

      {/* ⚡ ACCESO MAESTRO (ADMIN GATE) */}
      <AnimatePresence>
        {isActuallyAdmin && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            onClick={() => navigate('/interpreter')}
            className="mt-16 flex items-center gap-4 px-8 py-3 border border-zinc-800 rounded-2xl hover:bg-zinc-900 hover:border-zinc-700 transition-all group"
          >
            <Zap size={16} className="text-[#39FF14] group-hover:animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 group-hover:text-white">
              Bypass Maestro: Intérprete Ultra
            </span>
            <Lock size={12} className="text-zinc-800 group-hover:text-zinc-500" />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="mt-20 flex flex-col items-center opacity-20">
        <div className="flex items-center gap-4 px-8 py-2.5 bg-zinc-950 rounded-full border border-white/5">
          <Activity size={12} className="text-[#39FF14]" />
          <p className="text-[9px] font-[1000] uppercase tracking-[0.5em] italic">
            SECURE_NODE_SYNC // {new Date().getFullYear()}.PROD
          </p>
        </div>
      </footer>

      {/* Textura Carbon para profundidad OLED */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
};

export default PaymentSuccess;