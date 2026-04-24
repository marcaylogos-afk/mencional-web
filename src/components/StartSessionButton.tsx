/**
 * 🛰️ MENCIONAL | START_SESSION_BUTTON v2026.PROD
 * Protocolo: Reconocimiento de Privilegios y Salto de Pasarela (Bypass).
 * Ubicación: /src/components/StartSessionButton.tsx
 * ✅ ESTÁNDAR: Sincronizado con v2.6 (OLED High-Contrast)
 */

import React from "react";
import { ArrowUpRight, Zap, Settings, ShieldCheck, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

interface StartSessionButtonProps {
  /** Acción disparada para usuarios estándar para abrir el flujo de pago */
  onStart?: () => void;
}

export const StartSessionButton: React.FC<StartSessionButtonProps> = ({ onStart }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // Sincronizado con el estado global
  
  const handleAction = () => {
    if (isAdmin) {
      /**
       * 🟢 PROTOCOLO MAESTRO (ADMIN):
       * Bypass total de pasarela comercial. Acceso directo al selector neural.
       */
      navigate('/selector');
    } else {
      /**
       * 🔵 PROTOCOLO PARTICIPANTE:
       * Requiere validación de pasarela comercial (Mercado Pago).
       */
      if (onStart) {
        onStart();
      } else {
        // Enlace directo al checkout de la sesión sincronizada de $20 MXN
        window.location.href = "https://link.mercadopago.com.mx/mencional_session";
      }
    }
  };

  return (
    <div className="w-full flex justify-center py-8 px-4 relative z-20 font-sans">
      <motion.button
        onClick={handleAction}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.97 }}
        className={`
          w-full max-w-[520px] h-[100px] md:h-[120px] 
          flex items-center justify-between px-10 md:px-14
          rounded-[3rem] md:rounded-[4rem] transition-all duration-700
          group relative overflow-hidden select-none border-[3px]
          ${isAdmin 
            ? "bg-[#00FBFF] border-[#00FBFF] shadow-[0_25px_70px_rgba(0,251,255,0.35)]" 
            : "bg-white border-white shadow-[0_25px_60px_rgba(255,255,255,0.1)]"}
        `}
      >
        {/* --- CAPA DE TEXTO E INFORMACIÓN --- */}
        <div className="flex flex-col items-start z-20 text-black text-left">
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <div className="relative">
                <Settings size={28} className="animate-spin-slow text-black" />
                <motion.div 
                   animate={{ y: [-2, 2, -2] }} 
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute -top-3 -right-3"
                >
                  <Crown size={16} className="text-black fill-black" />
                </motion.div>
              </div>
            ) : (
              <div className="bg-black rounded-full p-2.5 flex items-center justify-center">
                <Zap size={18} className="fill-[#00FBFF] text-[#00FBFF]" />
              </div>
            )}
            <span className="font-[1000] text-2xl md:text-4xl italic tracking-tighter leading-none uppercase">
              {isAdmin ? "Acceso_Maestro" : "Comenzar_Sesión"}
            </span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 mt-2.5">
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] ${isAdmin ? 'opacity-90' : 'opacity-60'}`}>
              {isAdmin ? "UNLIMITED_BYPASS_ACTIVE" : "SESIÓN_ÚNICA: $20.00 MXN"}
            </span>
            <div className={`h-[2px] w-6 md:w-12 ${isAdmin ? 'bg-black/30' : 'bg-black/10'}`} />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 italic">
              SECURE_GATE_v2.6
            </span>
          </div>
        </div>
        
        {/* --- ICONO DINÁMICO DE ESTADO --- */}
        <div className={`
          rounded-full p-5 md:p-6 transition-all duration-500 shadow-2xl z-20
          flex items-center justify-center border-2
          ${isAdmin ? 'bg-black border-black' : 'bg-zinc-900 border-zinc-900'}
          group-hover:rotate-[360deg] group-hover:scale-110
        `}>
          {isAdmin ? (
            <ShieldCheck className="text-[#00FBFF] w-7 h-7 md:w-9 md:h-9" strokeWidth={2.5} />
          ) : (
            <ArrowUpRight className="text-white w-7 h-7 md:w-9 md:h-9" strokeWidth={2.5} />
          )}
        </div>

        {/* --- EFECTOS VISUALES PREMIUM --- */}
        
        {/* Barrido de luz (Shimmer) */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none opacity-50 z-10" />
        
        {/* Textura sutil para modo Administrador */}
        {isAdmin && (
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-zinc-900 mix-blend-overlay" />
        )}
      </motion.button>
      
      {/* Animaciones de CSS Inyectadas */}
      <style>{`
        @keyframes spin-slow { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        .animate-spin-slow { 
          animation: spin-slow 12s linear infinite; 
        }
        @keyframes shimmer { 
          0% { transform: translateX(-100%); } 
          100% { transform: translateX(100%); } 
        }
        .group-hover\\:animate-shimmer { 
          animation: shimmer 0.8s cubic-bezier(0.2, 1, 0.3, 1); 
        }
      `}</style>
    </div>
  );
};

export default StartSessionButton;