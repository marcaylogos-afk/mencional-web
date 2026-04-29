/** * ⚡ MENCIONAL | WELCOME_SELECTOR v2026.PROD
 * Protocolo: Participante -> Pasarela MP | Nodo Maestro -> Validación "osos"
 * Ubicación: /src/views/WelcomeSelector.tsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { CreditCard, Zap, Lock, Eye, EyeOff, Shield, ChevronRight } from 'lucide-react';
import speechService from '../services/ai/speechService';
import { logger } from '../utils/logger';

const WelcomeSelector: React.FC = () => {
  const navigate = useNavigate();
  const { updateSettings, settings } = useSettings();
  
  const [bypassKey, setBypassKey] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  
  // 💳 Pasarela oficial de Mercado Pago para bloques de 30 min ($50 MXN)
  const MP_PAYMENT_URL = "https://mpago.la/1isA1oL";

  useEffect(() => {
    // 🔐 Persistencia: Si ya es Admin, saltamos directo al selector de sesión
    if (settings?.role === 'admin') {
      navigate('/selector', { replace: true });
    }
  }, [settings?.role, navigate]);

  /**
   * 🔑 ACCESO NODO MAESTRO (Administrador)
   */
  const handleAdminAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (bypassKey.toLowerCase().trim() === 'osos') {
      logger.info("AUTH", "Acceso concedido: Nodo Maestro Validado.");
      
      await updateSettings({ 
        userAlias: "OPERADOR_MASTER",
        role: 'admin',
        isPaid: true, 
        isUnlimited: true,
        themeColor: '#39FF14' // Verde Neón Oficial Admin
      });

      speechService.speak("Bienvenido, Nodo Maestro. Sistema desbloqueado.", 'es-MX');
      navigate('/selector', { replace: true }); 
    } else {
      setError(true);
      setBypassKey('');
      speechService.speak("Acceso denegado. Credenciales inválidas.", 'es-MX');
      setTimeout(() => setError(false), 2000);
    }
  };

  /**
   * 🎟️ FLUJO PARTICIPANTE
   */
  const handleParticipantClick = async () => {
    speechService.speak("Redirigiendo a pasarela de pago segura.", 'es-MX');
    
    // Guardamos estado preliminar antes del salto
    await updateSettings({
      userAlias: "INVITADO_MENCIONAL",
      role: 'participant',
      isPaid: false,
      themeColor: '#00FBFF' 
    });

    // Pequeño delay para dejar que el audio se escuche antes de salir
    setTimeout(() => {
        window.location.href = MP_PAYMENT_URL;
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 bg-black min-h-screen relative overflow-hidden text-white font-sans select-none italic">
      
      {/* 🌌 FONDO OLED NEURAL */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,251,255,0.03),transparent_80%)] pointer-events-none" />

      {/* 🖼️ BRANDING MENCIONAL */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-14 z-20 flex flex-col items-center gap-6"
      >
        <div className="relative group">
          <motion.div 
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ duration: 5, repeat: Infinity }}
             className="absolute -inset-4 bg-[#00FBFF]/10 rounded-full blur-2xl group-hover:bg-[#00FBFF]/20 transition-all" 
          />
          <img 
            src="/logo.png" 
            alt="Mencional Logo" 
            className="w-28 h-28 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          />
        </div>
        
        <div className="text-center space-y-1">
          <h2 className="text-5xl font-[1000] tracking-tighter uppercase leading-none italic">
            MEN<span className="text-[#00FBFF]">CIONAL</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
             <div className="h-[1px] w-4 bg-zinc-800" />
             <p className="text-[7px] font-black tracking-[1em] text-zinc-600 uppercase">Gateway_v2.6_PROD</p>
             <div className="h-[1px] w-4 bg-zinc-800" />
          </div>
        </div>
      </motion.div>

      <div className="w-full max-w-sm flex flex-col gap-8 z-10">
        
        {/* 🔘 ACCESO PARTICIPANTE */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleParticipantClick}
          className="group relative flex flex-col items-center justify-center bg-white py-14 rounded-[3rem] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-100 group-hover:rotate-12 transition-all">
            <CreditCard size={24} className="text-black" />
          </div>
          <div className="flex items-center gap-3 text-black font-[1000] text-3xl italic tracking-tighter uppercase">
            <Zap size={28} fill="black" />
            Participar
          </div>
          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.4em] mt-3">
             30_MIN_BLOCK // $50_MXN
          </span>
        </motion.button>

        {/* Divisor OLED */}
        <div className="flex items-center gap-6 px-4">
          <div className="h-[1px] flex-1 bg-zinc-900" />
          <Shield size={12} className="text-zinc-800" />
          <div className="h-[1px] flex-1 bg-zinc-900" />
        </div>

        {/* 🔐 ACCESO TÉCNICO - Protocolo "osos" */}
        <form onSubmit={handleAdminAccess} className="space-y-4">
          <div className={`relative border border-zinc-900 rounded-[2rem] p-1 bg-zinc-950/50 backdrop-blur-xl transition-all duration-500 focus-within:border-[#00FBFF]/40 ${error ? 'border-red-600 animate-shake' : ''}`}>
            <input 
              type={showPass ? "text" : "password"}
              placeholder="OPERADOR_KEY"
              value={bypassKey}
              onChange={(e) => setBypassKey(e.target.value)}
              className="w-full bg-transparent py-5 text-center text-lg font-black tracking-[0.6em] outline-none uppercase text-[#00FBFF] placeholder:text-zinc-900 placeholder:tracking-widest"
              autoComplete="off"
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 hover:text-white transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-900" size={16} />
          </div>
          
          <button 
            type="submit"
            className={`w-full py-5 text-[9px] font-black tracking-[0.5em] rounded-[2rem] transition-all uppercase flex items-center justify-center gap-3 border ${
              error 
              ? 'bg-rose-950/20 text-rose-600 border-rose-900' 
              : 'bg-black text-zinc-700 hover:text-[#00FBFF] border-zinc-900 hover:border-[#00FBFF]/30'
            }`}
          >
            {error ? 'Acceso_Denegado' : 'Validar_Protocolo'} <ChevronRight size={14} />
          </button>
        </form>
      </div>

      <footer className="absolute bottom-10 w-full text-center opacity-20">
        <p className="text-[8px] font-black tracking-[1.5em] text-zinc-600 uppercase">
          Neural_Link_Status: Online
        </p>
      </footer>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default WelcomeSelector;