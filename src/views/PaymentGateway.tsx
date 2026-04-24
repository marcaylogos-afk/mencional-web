/** 💳 MENCIONAL | PAYMENT_GATEWAY v2026.PROD
 * Función: Validación de Acceso y Redirección de Pago (OLED Optimized).
 * Ubicación: /src/views/PaymentGateway.tsx
 * ✅ ACTUALIZACIÓN: Tarifa sincronizada a $50 MXN / 30 Minutos.
 * ✅ BYPASS: Salto automático para Operador Maestro.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Loader2, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

// 🔌 INTEGRACIÓN CON ARQUITECTURA EXISTENTE
import { useSettings } from '../context/SettingsContext'; 
import speechService from '../services/ai/speechService';
import { logger } from '../utils/logger';

const PaymentGateway: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings(); 
  const [isRedirecting, setIsRedirecting] = useState(true);

  // Identificación de Admin según el rol asignado
  const isAdmin = settings?.role === 'admin' || settings?.isUnlimited === true;

  // URL actualizada para bloques de 30min ($50 MXN)
  const MP_PAYMENT_LINK = "https://mpago.la/LINK_DE_50_MXN";

  useEffect(() => {
    const validateAccess = async () => {
      // 1. PROTOCOLO BYPASS: Si es Admin, saltar pago directamente al Selector
      if (isAdmin) {
        logger.info("GATEWAY_BYPASS", "Acceso autorizado para Operador Maestro.");
        
        // Feedback auditivo profesional sincronizado
        await speechService.speak("Acceso maestro verificado. Sincronizando sesión.", 'es-MX');

        const bypassTimer = setTimeout(() => {
          navigate('/selector', { replace: true }); 
        }, 2000);
        return () => clearTimeout(bypassTimer);
      }

      // 2. PROTOCOLO PARTICIPANTE: Simulación de enlace neural antes de mostrar pago
      const redirectTimer = setTimeout(() => {
        setIsRedirecting(false);
      }, 2500);

      return () => clearTimeout(redirectTimer);
    };

    validateAccess();
  }, [isAdmin, navigate]);

  const handleManualRedirect = () => {
    logger.info("PAYMENT", "Redirección a pasarela de Mercado Pago ($50 MXN).");
    window.location.href = MP_PAYMENT_LINK;
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* 🔮 ATMÓSFERA OLED */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00FBFF]/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#39FF14]/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-[460px] p-12 md:p-16 text-center bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,1)]"
      >
        <AnimatePresence mode="wait">
          {isAdmin ? (
            /* --- VISTA: BYPASS MAESTRO (NEÓN) --- */
            <motion.div 
              key="admin"
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-10"
            >
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-[#39FF14]/10 rounded-full animate-ping" />
                <div className="relative w-full h-full bg-zinc-900 border border-[#39FF14]/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(57,255,20,0.2)]">
                  <ShieldCheck size={56} className="text-[#39FF14]" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">
                  Acceso_Maestro
                </h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] italic leading-relaxed">
                  Bypass verificado <br /> Sincronizando_Protocolo_Ultra
                </p>
              </div>
              <div className="flex justify-center pt-4">
                <Loader2 className="animate-spin text-[#39FF14]" size={36} strokeWidth={3} />
              </div>
            </motion.div>
          ) : (
            /* --- VISTA: PASARELA PARTICIPANTE (CIAN) --- */
            <motion.div 
              key="participant"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-12"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-zinc-900 border border-white/10 rounded-[2rem] flex items-center justify-center rotate-6 shadow-xl">
                  <CreditCard size={36} className="text-white/90" />
                </div>
                <div className="flex items-center gap-3 px-5 py-2 bg-zinc-900/80 rounded-full border border-white/5 text-[#00FBFF] text-[9px] font-black tracking-[0.3em] uppercase italic">
                  <Lock size={12} className="animate-pulse" /> Seguridad_Protocolo_v4
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter leading-[0.8]">
                  Sesión <br /> <span className="text-[#00FBFF]">30 Minutos</span>
                </h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] italic">
                  Intercambio_Neural_Mencional
                </p>
              </div>

              <div className="py-8 border-y border-white/5 space-y-1 bg-zinc-900/20">
                <p className="text-6xl font-[1000] tracking-tighter text-white">
                  $50<span className="text-2xl text-zinc-500 font-black">.00</span>
                </p>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                  Pesos Mexicanos / MXN
                </p>
              </div>

              {isRedirecting ? (
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="flex items-end gap-2 h-8">
                    <motion.div animate={{ height: [6, 24, 6] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 bg-[#00FBFF] rounded-full" />
                    <motion.div animate={{ height: [6, 36, 6] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 bg-[#00FBFF] rounded-full" />
                    <motion.div animate={{ height: [6, 18, 6] }} transition={{ repeat: Infinity, duration: 1, delay: 0.1 }} className="w-1.5 bg-[#00FBFF] rounded-full" />
                  </div>
                  <p className="text-[10px] font-[1000] uppercase tracking-[0.6em] text-zinc-600 animate-pulse">
                    Enlazando_Pasarela...
                  </p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <button
                    onClick={handleManualRedirect}
                    className="w-full py-7 bg-white text-black rounded-[2rem] text-[12px] font-[1000] uppercase tracking-[0.3em] italic flex items-center justify-center gap-4 hover:bg-[#00FBFF] transition-all group"
                  >
                    Iniciar Pago
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest leading-relaxed italic opacity-60 text-center px-6">
                    Sesión de 30 minutos optimizada para aprendizaje neural. <br />
                    Confirmación inmediata vía Mercado Pago.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* FOOTER TÉCNICO */}
      <footer className="absolute bottom-10 left-0 w-full px-16 flex justify-between items-center opacity-20 pointer-events-none">
        <div className="text-[9px] font-black uppercase tracking-[0.8em] italic text-zinc-500">
          Mencional_Neural_Vault_2026
        </div>
        <div className="flex gap-4">
          <div className="w-2 h-2 bg-[#00FBFF] rounded-full animate-ping shadow-[0_0_15px_#00FBFF]" />
          <div className="w-2 h-2 bg-zinc-800 rounded-full" />
        </div>
      </footer>
    </div>
  );
};

export default PaymentGateway;