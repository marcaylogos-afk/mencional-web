/** 🚪 MENCIONAL | WELCOME_GATE v2.6.PROD 
 * ✅ FIX: Importación de useSettings corregida.
 * ✅ FIX: Scroll vertical liberado y eliminación de justify-center.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Activity, ShieldAlert, Key, Zap } from 'lucide-react';

// 🟢 CORRECCIÓN DE IMPORTACIONES (Sincronizado con tus otros servicios)
import speechService from '../services/ai/speechService'; 
import { useSettings } from '../context/SettingsContext'; // Asegúrate que sea exportación nombrada
import { logger } from '../utils/logger';

const WelcomeGate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, updateSettings } = useSettings(); 
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  
  const isNavigating = useRef(false);

  // Llave maestra centralizada
  const MASTER_KEY = (import.meta.env.VITE_APP_PASSWORD || "osos").toLowerCase().trim();
  
  // Sal de sesión única
  const guestKey = useMemo(() => Math.floor(1000 + Math.random() * 9000).toString(), []);

  /** 🔄 Sincronización de Motores de Voz */
  const syncHardware = async () => {
    logger.info("ENGINE", "Sincronizando Hardware AI...");
    try {
      await speechService.speak("Sistema Mencional sincronizado.", { lang: 'es-MX' }); 
      setIsSynced(true);
    } catch (err) {
      setIsSynced(true); 
    }
  };

  /** 🛡️ Guardián de Redirección Automática */
  useEffect(() => {
    if (isNavigating.current) return;
    
    const isAdmin = settings?.role === 'admin';
    const isPaidActive = settings?.isPaid === true && (settings?.sessionTimeLeft > 0 || settings?.isUnlimited);
    
    if ((isAdmin || isPaidActive) && location.pathname === '/') {
      isNavigating.current = true;
      navigate('/selector', { replace: true });
    }
  }, [settings, navigate, location.pathname]);

  /** 🔑 Procesador de Acceso Neural */
  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputKey = password.toLowerCase().trim();
    
    // Tokens de cortesía y bypass
    const GUEST_TOKENS = ['mencional30', 'trial_presencial', 'pago_cash', guestKey];

    if (inputKey === MASTER_KEY) {
      isNavigating.current = true;
      await updateSettings({ 
        userAlias: 'Admin', 
        role: 'admin', 
        isUnlimited: true, 
        isPaid: true, 
        themeColor: '#00FBFF' 
      });
      navigate('/selector', { replace: true }); 
    } 
    else if (GUEST_TOKENS.includes(inputKey)) {
      isNavigating.current = true;
      await updateSettings({ 
        userAlias: `User_${inputKey}`, 
        role: 'participant', 
        isPaid: true, 
        isUnlimited: false, 
        sessionTimeLeft: 1800, // 30 minutos
        themeColor: '#39FF14' 
      });
      navigate('/selector', { replace: true });
    }
    else {
      setError(true);
      setTimeout(() => setError(false), 1500);
      setPassword("");
      speechService.speak("Llave inválida.", { lang: 'es-MX' });
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#000000] text-white flex flex-col items-center pt-24 pb-20 px-6 italic select-none overflow-y-auto overflow-x-hidden relative">
      
      {/* 🌑 TEXTURA OLED */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80 z-0" />

      <AnimatePresence>
        {!isSynced && (
          <motion.button
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={syncHardware}
            className="fixed top-10 flex items-center gap-3 px-8 py-3 border border-[#00FBFF]/20 rounded-full text-[9px] font-black text-[#00FBFF] uppercase tracking-[0.4em] bg-black/60 backdrop-blur-xl z-50"
          >
            <Activity size={12} className="animate-pulse" />
            Inicializar_Nodo_v2026
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-14 z-10">
        <div className="px-6 py-2 border border-zinc-900 rounded-lg text-[9px] text-zinc-700 font-black tracking-[0.5em] uppercase">
          Neural_Vault_v2.6
        </div>
      </motion.div>

      <div className="w-full max-w-sm space-y-12 text-center z-10 flex flex-col items-center">
        <header className="space-y-2">
          <h1 className="text-7xl font-[1000] uppercase tracking-tighter italic leading-none">
            Mencional<span className="text-[#00FBFF]">.</span>
          </h1>
          <p className="text-[8px] text-zinc-800 uppercase tracking-[1.1em] font-black pl-[1.1em]">
            Immersion_Protocol
          </p>
        </header>

        <AnimatePresence mode="wait">
          {isAdminMode ? (
            <motion.form 
              key="auth-form" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} 
              onSubmit={handleAccessSubmit} 
              className="w-full space-y-4"
            >
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-zinc-950 border-2 ${error ? 'border-red-600 text-red-600' : 'border-zinc-900 text-[#39FF14]'} p-6 rounded-[2.5rem] text-sm text-center uppercase outline-none focus:border-[#39FF14] transition-all font-black tracking-[0.3em]`}
                  placeholder="LLAVE_DE_ACCESO" 
                  autoFocus
                />
                {error && <ShieldAlert className="absolute right-6 top-6 text-red-600 animate-bounce" size={20} />}
              </div>
              <button className="w-full py-6 bg-[#39FF14] text-black font-[1000] rounded-[2.5rem] uppercase italic text-[11px] tracking-widest active:scale-95 transition-transform">
                Validar_Protocolo
              </button>
              <button 
                type="button" 
                onClick={() => setIsAdminMode(false)} 
                className="text-[8px] text-zinc-700 uppercase tracking-widest pt-6 font-black"
              >
                ⟨ Volver_al_Inicio
              </button>
            </motion.form>
          ) : (
            <motion.div key="main-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-6">
              <button 
                onClick={() => window.location.href = "https://mpago.la/1isA1oL"} // URL de pago $50
                className="w-full py-8 bg-white text-black font-[1000] rounded-[3rem] flex items-center justify-center gap-4 uppercase italic text-sm tracking-tight hover:bg-[#00FBFF] transition-all"
              >
                Adquirir_Sesión_PRO <Zap size={18} fill="currentColor" />
              </button>
              
              <button 
                onClick={() => setIsAdminMode(true)} 
                className="group flex flex-col items-center gap-4 mx-auto pt-8"
              >
                <div className="flex items-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                   <Key size={12} className="text-zinc-500 group-hover:text-[#39FF14]" />
                   <span className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black group-hover:text-[#39FF14]">
                     Tengo_una_Llave
                   </span>
                </div>
                <div className="w-10 h-[1px] bg-zinc-900 group-hover:bg-[#39FF14] group-hover:w-20 transition-all duration-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto opacity-30 text-[7px] text-zinc-700 font-black uppercase tracking-[1em] flex flex-col items-center gap-3 pb-6">
        <span>Mencional_v2.6_System</span>
        <div className="flex items-center gap-4 text-zinc-800 tracking-normal font-mono">
           <span>NODE_SALT: <span className="text-[#39FF14]">{guestKey}</span></span>
           <span>SESSION: 30M / $50 MXN</span>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeGate;