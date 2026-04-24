/** 🚪 MENCIONAL | WELCOME_GATE v2.6.PROD
 * ✅ FIX: Almacenamiento volátil de GUEST_KEY y ruta de activos.
 * ✅ DIRECTORIO AI: Sincronizado a /src/services/ai/
 * ✅ NAVEGACIÓN: Bypass para Nodo Maestro activo y Bloqueo de Acceso Libre.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Activity, ShieldAlert, Key } from 'lucide-react';

import { speechService } from '../services/ai/speechService'; 
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

  // 🔑 Llave dinámica de 4 dígitos para Clase Muestra (Session Salt)
  const guestKey = useMemo(() => Math.floor(1000 + Math.random() * 9000).toString(), []);

  /** ⚡ SINCRONIZACIÓN DE HARDWARE AI */
  const syncHardware = async () => {
    logger.info("ENGINE", "Sincronizando Hardware AI...");
    try {
      // Sincronización con el servicio centralizado de voz Aoede
      await speechService.speak("Sistema Mencional listo.", { lang: 'es-MX' }); 
      setIsSynced(true);
    } catch (err) {
      setIsSynced(true); 
    }
  };

  /** ⚡ BYPASS NODO MAESTRO & PAID ACCESS
   * Si el sistema detecta acceso previo (admin o pago), redirige automáticamente.
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
    
    // 🛡️ DICCIONARIO DE TOKENS (Sincronizado con SettingsContext)
    const MASTER_KEY = "osos";
    const GUEST_TOKENS = ['mencional30', 'trial_presencial', 'pago_cash', guestKey];

    if (inputKey === MASTER_KEY) {
      // PERFIL: ADMINISTRADOR (Acceso Maestro)
      await updateSettings({ 
        userAlias: 'osos', 
        role: 'admin', 
        isUnlimited: true, 
        isPaid: true
      });
      logger.info("AUTH", "Acceso Maestro concedido.");
      navigate('/selector'); 
    } 
    else if (GUEST_TOKENS.includes(inputKey)) {
      // PERFIL: PARTICIPANTE (Cortesía o Pago en Efectivo)
      await updateSettings({ 
        userAlias: inputKey, 
        role: 'participant', 
        isPaid: true,
        isUnlimited: false 
      });
      logger.info("AUTH", `Acceso concedido vía token: ${inputKey}`);
      navigate('/selector');
    }
    else {
      setError(true);
      speechService.speak("Acceso denegado.", { lang: 'es-MX' }).catch(() => {});
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
            className="fixed top-12 flex items-center gap-2 px-8 py-3 border border-[#00FBFF]/40 rounded-full text-[9px] font-black text-[#00FBFF] uppercase tracking-[0.4em] bg-black/80 backdrop-blur-xl z-50 hover:bg-[#00FBFF]/10 transition-all shadow-[0_0_20px_rgba(0,251,255,0.1)]"
          >
            <Activity size={12} className="animate-pulse" />
            Inicializar_Nodo_V2.6
          </motion.button>
        )}
      </AnimatePresence>

      {/* 🛸 LOGO CENTRAL (Ruta corregida: logo_mencional.png) */}
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-10 z-10">
        <img 
          src="/logo_mencional.png" 
          alt="Mencional" 
          className="w-40 h-auto drop-shadow-[0_0_25px_rgba(0,251,255,0.15)]" 
        />
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
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleAccessSubmit} 
              className="space-y-4"
            >
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-zinc-950 border-2 ${error ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'border-zinc-900'} p-6 rounded-[30px] text-sm text-[#39FF14] text-center uppercase outline-none focus:border-[#39FF14] transition-all font-black tracking-widest`}
                  placeholder="INTRODUCIR_LLAVE" 
                  autoFocus
                />
                {error && <ShieldAlert className="absolute right-6 top-6 text-red-600 animate-bounce" size={20} />}
              </div>
              <button className="w-full py-6 bg-[#39FF14] text-black font-[1000] rounded-[30px] uppercase italic text-[10px] tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(57,255,20,0.2)]">
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
            <motion.div key="main-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* 💳 BOTÓN DE PAGO ($90 MXN) */}
              <button 
                onClick={() => {
                  logger.info("PAYMENT", "Iniciando pasarela de $90 MXN.");
                  window.location.href = "https://mpago.la/1isA1oL"; 
                }}
                className="w-full py-8 bg-white text-black font-[1000] rounded-[40px] flex items-center justify-center gap-3 uppercase italic text-sm tracking-tight hover:bg-[#00FBFF] transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
              >
                Adquirir_Sesión_PRO <ChevronRight size={18} />
              </button>
              
              {/* 🔑 ACCESO PROTEGIDO */}
              <button onClick={() => setIsAdminMode(true)} className="group flex flex-col items-center gap-4 mx-auto pt-4 transition-all">
                <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                   <Key size={10} className="text-zinc-500 group-hover:text-[#39FF14]" />
                   <span className="text-[8px] text-zinc-600 uppercase tracking-[0.5em] font-black group-hover:text-[#39FF14]">
                     Llave_de_Acceso
                   </span>
                </div>
                <div className="w-8 h-[1px] bg-zinc-900 group-hover:bg-[#39FF14] group-hover:w-16 transition-all" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🔐 IDENTIFICADOR DE SESIÓN */}
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