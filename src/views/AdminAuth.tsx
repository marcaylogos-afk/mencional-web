/**
 * 🔐 MENCIONAL | ADMIN_AUTH v2026.12 - STABLE PRODUCTION
 * Protocolo: Inyección de bypass "osos" y desbloqueo de triple función.
 * Ubicación: /src/views/AdminAuth.tsx
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Terminal, Activity, ChevronRight, AlertCircle, Fingerprint } from 'lucide-react';

// --- 🛠️ VINCULACIÓN CON LA ARQUITECTURA ---
import { useSettings } from '../context/SettingsContext';
import { logger } from '../utils/logger';

const AdminAuth: React.FC = () => {
  const [masterCode, setMasterCode] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { updateSettings, setIsAdmin } = useSettings(); 

  /**
   * 🛠️ GENERACIÓN DE FINGERPRINT 2026
   * Crea un ID único de sesión para auditoría interna del sistema.
   */
  useEffect(() => {
    const generateFingerprint = () => {
      const platform = window.navigator.platform;
      const cores = window.navigator.hardwareConcurrency || 0;
      const screen = `${window.screen.width}x${window.screen.height}`;
      return btoa(`${platform}-${cores}-${screen}`).substring(0, 12).toUpperCase();
    };
    setDeviceId(generateFingerprint());
    
    // Forzar estética OLED (Negro Absoluto)
    document.body.style.backgroundColor = '#000000';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  /**
   * 💉 PROTOCOLO DE INYECCIÓN "OSOS"
   * Bypass total: Desbloquea Aprendizaje, Intérprete y Rompehielo.
   */
  const handleAdminLogin = useCallback(async () => {
    const secretKey = "osos"; 
    setIsLoading(true);
    setError(false);
    
    // Simulación de descifrado visual (Estética Cyberpunk)
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (masterCode.toLowerCase().trim() === secretKey) {
      try {
        // --- 💉 PERSISTENCIA CRÍTICA ---
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('mencional_role', 'admin');
        localStorage.setItem('auth_timestamp', new Date().toISOString());
        
        // Actualizamos el estado global del sistema
        setIsAdmin(true); 
        updateSettings({ 
          isUserAdmin: true,
          isSessionActive: true,
          sessionType: 'unlimited',
          theme: 'oled'
        });

        logger.info("ADMIN_ACCESS_GRANTED", { sid: deviceId });

        // Redirección limpia al selector
        navigate('/selector', { replace: true }); 

      } catch (err) {
        logger.error("CRITICAL_AUTH_ERROR", err);
        setError(true);
      }
    } else {
      setError(true);
      setMasterCode(""); 
      logger.warn("UNAUTHORIZED_ACCESS_ATTEMPT", { attempt: masterCode });
    }
    setIsLoading(false);
  }, [masterCode, updateSettings, setIsAdmin, navigate, deviceId]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans select-none relative overflow-hidden">
      
      {/* 🌌 EFECTO AMBIENTE NEÓN (Turquesa Neón / Cyan) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,251,255,0.08),transparent_70%)] pointer-events-none" />
      
      {/* 🧬 LÍNEAS DE ESCANEO OLED SUTILES */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <header className="mb-14 text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative inline-block mb-10"
        >
          <div className="w-28 h-28 bg-zinc-900/50 rounded-[2.5rem] border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-2xl">
            <Fingerprint size={48} className="text-[#00FBFF] animate-pulse" />
          </div>
          <div className="absolute -inset-6 bg-[#00FBFF]/20 rounded-full blur-3xl animate-pulse -z-10" />
        </motion.div>
        
        <h1 className="text-5xl md:text-6xl font-[1000] italic tracking-tighter text-white uppercase leading-none">
          MENCIONAL<span className="text-[#00FBFF]">_ADMIN</span>
        </h1>
        
        <div className="flex items-center justify-center gap-4 mt-6">
          <Activity size={14} className="text-[#39FF14] animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.6em] uppercase text-zinc-600">
            Secure_Access_v2026.12
          </span>
        </div>
      </header>

      <div className="w-full max-w-[360px] space-y-8 z-10">
        <div className="relative group">
          <Terminal 
            className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500 ${
              error ? 'text-rose-500' : 'text-zinc-700 group-focus-within:text-[#00FBFF]'
            }`} 
            size={20} 
          />
          <input 
            type="password"
            placeholder="MASTER_KEY"
            className={`w-full bg-zinc-900/20 backdrop-blur-3xl border-2 p-7 pl-16 rounded-[2.5rem] text-center font-mono font-black tracking-[0.8em] outline-none transition-all placeholder:text-zinc-800 text-base ${
              error 
                ? 'border-rose-600 animate-shake bg-rose-500/5 text-rose-500' 
                : 'border-white/5 focus:border-[#00FBFF]/40 focus:bg-zinc-900/40 text-[#00FBFF]'
            }`}
            value={masterCode}
            onChange={(e) => {
                setError(false);
                setMasterCode(e.target.value);
            }}
            onKeyDown={(e) => e.key === 'Enter' && masterCode && !isLoading && handleAdminLogin()}
            autoFocus
            disabled={isLoading}
          />
        </div>
        
        <button 
          onClick={handleAdminLogin}
          disabled={isLoading || !masterCode}
          className={`w-full h-[85px] rounded-[2.5rem] font-[1000] uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-4 active:scale-95 group disabled:opacity-20 shadow-2xl ${
            error 
              ? 'bg-rose-600 text-white' 
              : 'bg-white text-black hover:bg-[#00FBFF]'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-4">
               <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
               INYECTANDO_BYPASS...
            </span>
          ) : (
            <>
              <ShieldCheck size={22} /> 
              <span>DESBLOQUEAR SISTEMA</span>
              <ChevronRight size={18} className="opacity-30 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 text-rose-500"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest italic">
                  ACCESO_DENEGADO
                </span>
              </div>
              <p className="text-[8px] text-rose-800 font-bold uppercase tracking-tighter">
                CLAVE_MAESTRA_INVÁLIDA_O_EXPIRADA
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-24 opacity-40 z-10">
        <div className="px-8 py-4 border border-white/5 rounded-3xl bg-zinc-950/60 backdrop-blur-2xl">
          <p className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase italic flex items-center gap-5">
            <span className="text-[#00FBFF] animate-pulse">●</span> 
            SYS_FINGERPRINT: <span className="text-zinc-300">{deviceId}</span>
            <span className="text-zinc-800">|</span> 
            AUTH: OSOS_STABLE_v16
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default AdminAuth;