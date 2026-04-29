/** 🎛️ MENCIONAL | APP_SELECTOR v2026.PROD
 * Ubicación: /src/components/AppSelector.tsx
 * ✅ ACTUALIZACIÓN: Protocolo de Pago $50 MXN / 30 Minutos.
 * ✅ SEGURIDAD: Protección de Rol (Bypass Maestro) y Rutas Protegidas.
 */

import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Mic, 
  Sparkles, 
  ShieldCheck, 
  User, 
  CreditCard, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';
import { logger } from '../utils/logger';

const AppSelector: React.FC = () => {
  const context = useContext(SettingsContext);
  const { logout, isAdmin, isAuthenticated, userName } = useAuth();
  const navigate = useNavigate();

  // 🛡️ SEGURIDAD: Sincronización de Identidad
  const rawName = userName || localStorage.getItem('mencional_user_name') || 'USUARIO_NODE';
  const displayName = rawName.split('_')[0].toUpperCase();

  useEffect(() => {
    if (!isAuthenticated) {
      logger.warn("AUTH", "Acceso no autorizado al selector. Redirigiendo...");
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /**
   * 💳 PROTOCOLO RECAUDACIÓN v2.6
   * Actualizado: $50 MXN por bloque de 30 minutos.
   */
  const handleSubscription = () => {
    window.open('https://mpago.la/1isA1oL', '_blank');
  };

  const handleLogout = () => {
    logger.info("AUTH", `Cierre de sesión: ${displayName}`);
    logout();
    navigate('/', { replace: true });
  };

  const themeColor = context?.settings?.selectedColor || '#00FBFF';

  // Animaciones OLED Staggered
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 120, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 md:p-16 relative overflow-hidden font-sans select-none italic selection:bg-[#39FF14] selection:text-black">
      
      {/* 🌌 FONDO OLED DINÁMICO (Sin luz residual para negros puros) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ 
          background: `radial-gradient(circle at 50% 20%, ${themeColor}05 0%, transparent 70%)` 
        }} 
      />

      <div className="w-full max-w-7xl z-10">
        
        {/* --- HEADER HUD --- */}
        <header className="mb-24 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-4">
               <motion.div 
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
               >
                 <span className="text-black font-[1000] text-[10px]">M.</span>
               </motion.div>
               <span className="text-[8px] font-black tracking-[0.8em] text-zinc-800 uppercase">Neural_Link_v2.6</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-[1000] tracking-tighter uppercase leading-[0.75]">
              MODO_<span style={{ color: themeColor }}>AI</span>
            </h1>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex items-center gap-4 bg-zinc-950/50 px-6 py-3 rounded-2xl border border-zinc-900 backdrop-blur-3xl shadow-2xl">
              {isAdmin ? (
                <ShieldCheck size={14} className="text-[#39FF14] drop-shadow-[0_0_8px_#39FF14]" />
              ) : (
                <User size={14} className="text-zinc-600" />
              )}
              <span className="text-[9px] font-black tracking-[0.3em] text-zinc-500 uppercase">
                {isAdmin ? "MASTER_OPERATOR" : `${displayName}_NODE`}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-3 text-[8px] font-black text-zinc-800 hover:text-rose-600 transition-all uppercase tracking-[0.4em]"
            >
              <LogOut size={12} className="group-hover:translate-x-1 transition-transform" />
              Terminal_Exit
            </button>
          </div>
        </header>

        {/* --- GRILLA DE MODOS --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid gap-6 ${isAdmin ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'}`}
        >
          {/* 01. APRENDIZAJE (Core) */}
          <motion.button 
            variants={itemVariants}
            whileHover={{ y: -5, borderColor: themeColor }}
            onClick={() => navigate('/learning')}
            className="group p-10 bg-zinc-950 border border-zinc-900 rounded-[3rem] text-left flex flex-col justify-between min-h-[350px] relative transition-all"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-900 group-hover:bg-white group-hover:text-black transition-all">
              <BookOpen size={28} />
            </div>
            <div>
              <h3 className="text-4xl font-[1000] uppercase tracking-tighter leading-none">Aprendizaje</h3>
              <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] mt-5 leading-relaxed italic">
                Mencional_Core_Active <br /> Immersion_Mode: Hands_Free
              </p>
            </div>
            <ChevronRight className="absolute bottom-10 right-10 text-zinc-900 group-hover:text-white transition-all" />
          </motion.button>

          {/* 02. DINÁMICO: SUSCRIPCIÓN (User) o INTÉRPRETE (Admin) */}
          {!isAdmin ? (
            <motion.button 
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: '#00FBFF' }}
              onClick={handleSubscription}
              className="group p-10 bg-zinc-950 border border-zinc-900 rounded-[3rem] text-left flex flex-col justify-between min-h-[350px] relative transition-all shadow-[0_0_40px_rgba(0,0,0,1)]"
            >
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-[#00FBFF] group-hover:bg-[#00FBFF] group-hover:text-black transition-all">
                <CreditCard size={28} />
              </div>
              <div>
                <h3 className="text-4xl font-[1000] uppercase tracking-tighter leading-none text-[#00FBFF]">Sesión_Pro</h3>
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] mt-5 leading-relaxed italic">
                  Recaudación_v2.6_Protocol <br /> 30_Min_Block: $50_MXN
                </p>
              </div>
              <ChevronRight className="absolute bottom-10 right-10 text-zinc-900 group-hover:text-[#00FBFF] transition-all" />
            </motion.button>
          ) : (
            <motion.button 
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: '#39FF14' }}
              onClick={() => navigate('/interpreter')}
              className="group p-10 bg-zinc-950 border border-zinc-900 rounded-[3rem] text-left flex flex-col justify-between min-h-[350px] relative transition-all"
            >
              <div className="w-14 h-14 bg-[#39FF14]/10 rounded-2xl flex items-center justify-center text-[#39FF14] group-hover:bg-[#39FF14] group-hover:text-black transition-all">
                <Mic size={28} />
              </div>
              <div>
                <h3 className="text-4xl font-[1000] uppercase tracking-tighter leading-none text-[#39FF14]">Intérprete</h3>
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] mt-5 leading-relaxed italic">
                  Ultra_Mencional_Unlocked <br /> RealTime_Translation_Sync
                </p>
              </div>
              <ChevronRight className="absolute bottom-10 right-10 text-zinc-900 group-hover:text-[#39FF14] transition-all" />
            </motion.button>
          )}

          {/* 03. ROMPEHIELO (Admin Only) */}
          {isAdmin && (
            <motion.button 
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: '#A855F7' }}
              onClick={() => navigate('/rompehielo')} 
              className="group p-10 bg-zinc-950 border border-zinc-900 rounded-[3rem] text-left flex flex-col justify-between min-h-[350px] relative transition-all"
            >
              <div className="w-14 h-14 bg-[#A855F7]/10 rounded-2xl flex items-center justify-center text-[#A855F7] group-hover:bg-[#A855F7] group-hover:text-black transition-all">
                <Sparkles size={28} />
              </div>
              <div>
                <h3 className="text-4xl font-[1000] uppercase tracking-tighter text-[#A855F7] leading-none">Rompehielo</h3>
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] mt-5 leading-relaxed italic">
                  Social_Engine_Engaged <br /> Group_Dynamic_Active
                </p>
              </div>
              <ChevronRight className="absolute bottom-10 right-10 text-zinc-900 group-hover:text-[#A855F7] transition-all" />
            </motion.button>
          )}
        </motion.div>

        {/* --- FOOTER HUD --- */}
        <footer className="mt-32 pt-10 border-t border-zinc-900/50 flex flex-col items-center">
          <p className="text-[7px] font-black text-zinc-800 uppercase tracking-[1.5em] text-center italic">
            Mencional_OS_v2026 // Production_Core // {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AppSelector;