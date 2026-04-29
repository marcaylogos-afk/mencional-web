/**
 * 🛰️ MENCIONAL UI | TOAST WARNING SYSTEM v20.0
 * Componente de alertas críticas y pago instantáneo.
 * Diseñado para hardware OLED: Negro puro y turquesa neón.
 * Ubicación: /src/components/ui/ToastWarning.tsx
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';

interface ToastWarningProps {
  show: boolean;      // Sincronizado con isTimeLow (5 min o menos)
  message?: string;   // Mensaje dinámico de advertencia
}

/**
 * ✅ EXPORTACIÓN NOMBRADA Y DEFAULT: 
 * Resuelve el SyntaxError detectado en el Router y vistas de sesión.
 */
export const ToastWarning: React.FC<ToastWarningProps> = ({ show, message }) => {
  
  // Link de pago directo de Mercado Pago (Prod 2026 - $20 MXN / 20 min)
  const PAYMENT_URL = "https://mpago.la/2fPScDJ";

  const handlePaymentRedirect = () => {
    // Redirección directa para evitar fricción en la sesión activa
    window.open(PAYMENT_URL, '_blank');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-10 left-1/2 z-[100] w-[92%] max-w-[400px]"
        >
          {/* Contenedor CandyGlass con borde Turquesa Neón (#00FBFF) */}
          <div className="relative overflow-hidden bg-black/95 backdrop-blur-3xl border-2 border-[#00FBFF]/40 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(0,251,255,0.15)]">
            
            {/* Destello de luz ambiental interno */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00FBFF]/10 blur-[50px] rounded-full" />

            <div className="flex items-start gap-5 mb-5">
              {/* Icono de Alerta con pulso de advertencia */}
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-[#00FBFF]/20 rounded-2xl blur-md"
                />
                <div className="relative bg-zinc-900 border border-[#00FBFF]/30 p-3.5 rounded-2xl flex-shrink-0">
                  <AlertTriangle className="text-[#00FBFF]" size={24} />
                </div>
              </div>
              
              <div className="flex-grow pt-1">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00FBFF]/80 mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FBFF] rounded-full animate-pulse" />
                  Sincronización_Crítica
                </h4>
                <p className="text-white font-bold italic text-sm tracking-tight leading-snug">
                  {message || "Ciclo de 20 min por finalizar. Asegura tu lugar en la red."}
                </p>
              </div>
            </div>

            {/* BOTÓN DE PAGO AUTOMÁTICO - $20 MXN */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePaymentRedirect}
              className="group relative w-full overflow-hidden bg-[#00FBFF] text-black py-4 rounded-2xl font-[1000] uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(0,251,255,0.3)]"
            >
              <CreditCard size={16} strokeWidth={3} />
              <span>Continuar Sesión ($20 MXN)</span>
              <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <div className="mt-4 flex items-center justify-center gap-2 opacity-40">
               <ShieldCheck size={10} className="text-zinc-400" />
               <p className="text-[8px] text-zinc-400 uppercase tracking-[0.2em] font-black">
                 Mercado Pago // Encriptación 256-bit
               </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastWarning;