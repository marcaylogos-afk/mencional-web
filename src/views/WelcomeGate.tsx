/** 🚪 MENCIONAL | WELCOME_GATE v2.6.PROD
 * ✅ FIX: Almacenamiento de GUEST_KEY en SettingsContext.
 * ✅ DIRECTORIO AI: Sincronizado a /src/services/ai/
 * ✅ NAVEGACIÓN: Bypass para Nodo Maestro activo y Bloqueo de Acceso Libre.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Activity, ShieldAlert, Key } from 'lucide-react';

import speechService from '../services/ai/speechService'; 
import { useSettings } from '../context/SettingsContext';
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

  // 🔑 Llave dinámica de 4 dígitos para Clase Muestra
  const guestKey = useMemo(() => Math.floor(1000 + Math.random() * 9000).toString(), []);

  /** ⚡ SINCRONIZACIÓN DE HARDWARE AI */
  const syncHardware = async () => {
    logger.info("ENGINE", "Sincronizando Hardware AI...");
    try {
      await speechService.speak("Sistema Mencional listo.", 'es-MX'); 
      setIsSynced(true);
    } catch (err) {
      setIsSynced(true); 
    }
  };

  /** ⚡ BYPASS NODO MAESTRO
   * Si el sistema ya reconoce el rol de admin o pago activo, saltamos al selector.
   */
  useEffect(() => {
    const hasAccess = settings?.role === 'admin' || settings?.isPaid === true;
    if (hasAccess && location.pathname === '/' && !isNavigating.current) {
      isNavigating.current = true;
      logger.info("NAV", "Acceso autorizado detectado. Redirigiendo a Selector.");
      navigate('/selector', { replace: true });
    }
  }, [settings.role, settings.isPaid, navigate, location.pathname]);

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputKey = password.toLowerCase().trim();
    const masterKey = "osos"; //

    if (inputKey === masterKey) {
      // PERFIL: ADMINISTRADOR (Acceso Total e Ilimitado)
      await updateSettings({ 
        role: 'admin', 
        isUnlimited: true, 
        isPaid: true,
        userAlias: 'NODO_MAESTRO',
        themeColor: '#39FF14' 
      });
      logger.info("AUTH", "Acceso Maestro concedido.");
      navigate('/selector'); 
    } 
    else if (inputKey === guestKey) {
      // PERFIL: CLASE MUESTRA (Acceso de Cortesía Temporal)
      await updateSettings({ 
        role: 'guest', 
        isPaid: true,
        isUnlimited: false, 
        userAlias: `INVITADO_${guestKey}`,
        themeColor: '#00FBFF' 
      });
      logger.info("AUTH", "Acceso de Cortesía concedido.");
      navigate('/selector');
    }
    else {
      setError(true);
      speechService.speak("Acceso denegado.", 'es-MX').catch(() => {});
      setTimeout(() => setError(false), 1500);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 italic select-none font-sans overflow-hidden">
      
      {/* 🟢 INDICADOR DE ESTADO AI */}
      <AnimatePresence>
        {!isSynced && (
          <motion.button
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={syncHardware}
            className="fixed top-12 flex items-center gap-2 px-8 py-3 border border-[#00FBFF]/40 rounded-full text-[9px] font-black text-[#00FBFF] uppercase tracking-[0.4em] bg-black/80 backdrop-blur-xl z-50"
          >
            <Activity size={12} className="animate-pulse" />
            Inicializar_Nodo_V2.6
          </motion.button>
        )}
      </AnimatePresence>

      {/* 🛸 LOGO CENTRAL */}
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-10">
        <img src="/logo.png" alt="Mencional" className="w-40 h-auto drop-shadow-[0_0_25px_rgba(0,251,255,0.15)]" />
      </motion.div>

      <div className="w-full max-w-sm space-y-10 text-center z-10">
        <header className="space-y-1">
          <h1 className="text-5xl font-[1000] uppercase tracking-tighter italic leading-none">
            Mencional<span className="text-[#00FBFF]">.</span>
          </h1>
          <p className="text-[7px] text-zinc-700 uppercase tracking-[1.2em] font-black">Neural_Immersion_Vault</p>
        </header>

        <AnimatePresence mode="wait">
          {isAdminMode ? (
            <motion.form 
              key="auth-form" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              onSubmit={handleAccessSubmit} 
              className="space-y-4"
            >
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-zinc-950 border-2 ${error ? 'border-red-600' : 'border-zinc-900'} p-6 rounded-[30px] text-sm text-[#39FF14] text-center uppercase outline-none focus:border-[#39FF14] transition-all font-black tracking-widest`}
                  placeholder="INTRODUCIR_LLAVE" 
                  autoFocus
                />
                {error && <ShieldAlert className="absolute right-6 top-6 text-red-600" size={20} />}
              </div>
              <button className="w-full py-6 bg-[#39FF14] text-black font-[1000] rounded-[30px] uppercase italic text-[10px] tracking-widest hover:scale-[1.02] transition-all">
                Verificar_Credenciales
              </button>
              <button 
                type="button" 
                onClick={() => setIsAdminMode(false)} 
                className="text-[8px] text-zinc-700 uppercase tracking-widest pt-4 hover:text-white transition-colors font-bold"
              >
                ⟨ Regresar al Inicio
              </button>
            </motion.form>
          ) : (
            <motion.div key="main-actions" className="space-y-6">
              {/* 💳 BOTÓN DE PAGO: Único acceso para alumnos ($90 MXN) */}
              <button 
                onClick={() => {
                  logger.info("PAYMENT", "Redirigiendo a Pasarela Mercado Pago.");
                  window.location.href = "https://mpago.la/1HJRXhD"; 
                }}
                className="w-full py-8 bg-white text-black font-[1000] rounded-[40px] flex items-center justify-center gap-3 uppercase italic text-sm tracking-tight hover:bg-[#00FBFF] transition-all shadow-[0_0_40px_rgba(255,255,255,0.05)]"
              >
                Adquirir_Sesión_PRO <ChevronRight size={18} />
              </button>
              
              {/* 🔑 ACCESO PROTEGIDO */}
              <button onClick={() => setIsAdminMode(true)} className="group flex flex-col items-center gap-4 mx-auto pt-4">
                <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                   <Key size={10} className="text-zinc-500 group-hover:text-[#39FF14]" />
                   <span className="text-[8px] text-zinc-600 uppercase tracking-[0.5em] font-black group-hover:text-[#39FF14]">
                     Llave_de_Acceso
                   </span>
                </div>
                <div className="w-8 h-[1px] bg-zinc-900 group-hover:bg-[#39FF14] transition-all" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🔐 IDENTIFICADOR DE SESIÓN (Casi invisible, útil para soporte) */}
      <footer className="fixed bottom-8 opacity-10 text-[6px] text-zinc-600 font-black uppercase tracking-[1em] hover:opacity-100 transition-opacity duration-1000 cursor-default flex flex-col items-center gap-2">
        <span>Mencional_System_v2.6_PROD</span>
        <span className="text-zinc-800 tracking-normal font-mono">
            SESSION_SALT: <span className="text-[#39FF14]">{guestKey}</span>
        </span>
      </footer>

      {/* 🌑 CAPA OLED */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60 z-0" />
    </div>
  );
};

export default WelcomeGate;