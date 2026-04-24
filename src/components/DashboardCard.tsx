/**
 * 🎴 DASHBOARD_CARD v2026.12 - MENCIONAL
 * Ubicación: /src/components/DashboardCard.tsx
 * Función: Punto de entrada táctil para los modos de sincronización (Learning, Ultra, Rompehielo).
 * ✅ OLED Optimized: Contrastes infinitos y glows dinámicos.
 */

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowUpRight, Lock } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: "cian" | "amber" | "rose" | "orange" | "lime" | "purple" | "blue" | "emerald" | "crimson" | "silver"; 
  onClick: () => void;
  buttonText: string;
  isAdminOnly?: boolean; // Restricción para nodos Master
  hasAccess?: boolean;   // Verificación de rol desde SettingsContext
  badge?: string; 
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  color = "cian",
  onClick,
  buttonText,
  isAdminOnly = false,
  hasAccess = true,
  badge
}) => {
  
  /**
   * 🎨 MAPEADO NEURAL DE COLORES (Protocolo 10-Tonos)
   * Configuración optimizada para pantallas OLED.
   */
  const colorMap = {
    cian: { accent: "#00FBFF", text: "text-black", btn: "bg-[#00FBFF]" },
    amber: { accent: "#EAB308", text: "text-black", btn: "bg-[#EAB308]" },
    rose: { accent: "#F43F5E", text: "text-white", btn: "bg-[#F43F5E]" },
    orange: { accent: "#F97316", text: "text-black", btn: "bg-[#F97316]" },
    lime: { accent: "#84CC16", text: "text-black", btn: "bg-[#84CC16]" },
    purple: { accent: "#A855F7", text: "text-white", btn: "bg-[#A855F7]" },
    blue: { accent: "#3B82F6", text: "text-white", btn: "bg-[#3B82F6]" },
    emerald: { accent: "#10B981", text: "text-black", btn: "bg-[#10B981]" },
    crimson: { accent: "#991B1B", text: "text-white", btn: "bg-[#991B1B]" },
    silver: { accent: "#E2E8F0", text: "text-black", btn: "bg-[#E2E8F0]" }
  };

  const style = colorMap[color as keyof typeof colorMap] || colorMap.cian;

  // Bloqueo físico y visual si el usuario no tiene permisos de Administrador
  const isDisabled = isAdminOnly && !hasAccess;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isDisabled ? { 
        y: -15, 
        transition: { type: "spring", stiffness: 400, damping: 10 } 
      } : {}}
      whileTap={!isDisabled ? { scale: 0.96 } : {}}
      onClick={!isDisabled ? onClick : undefined}
      className={`
        relative group p-8 md:p-10 rounded-[3.5rem] md:rounded-[4.5rem] border-2 backdrop-blur-3xl transition-all duration-700 
        flex flex-col h-full overflow-hidden select-none w-full max-w-[520px] mx-auto italic
        ${isDisabled ? 'cursor-not-allowed grayscale bg-zinc-950/50' : 'cursor-pointer border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40'}
        shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]
      `}
      style={{ 
        borderColor: isDisabled ? 'rgba(63, 63, 70, 0.2)' : `${style.accent}25`,
      }}
    >
      {/* 🏷️ SISTEMA DE BADGES (Master vs Restricted) */}
      <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-3">
        {isAdminOnly && (
          <div className={`flex items-center gap-3 px-5 py-2 rounded-full border ${isDisabled ? 'border-zinc-800 bg-zinc-900/80' : 'border-rose-500/40 bg-black/60'} backdrop-blur-2xl shadow-lg`}>
            {isDisabled ? <Lock size={14} className="text-zinc-600" /> : <ShieldCheck size={14} className="text-rose-500 animate-pulse" />}
            <span className={`text-[9px] font-[1000] uppercase tracking-[0.3em] ${isDisabled ? 'text-zinc-600' : 'text-rose-500'}`}>
              {isDisabled ? 'Nodo_Bloqueado' : 'Master_Protocol'}
            </span>
          </div>
        )}
        {badge && !isDisabled && (
          <div className="px-5 py-2 rounded-full border border-white/10 bg-[#00FBFF]/5 backdrop-blur-2xl">
             <span className="text-[9px] font-[1000] uppercase tracking-[0.3em] text-[#00FBFF]">{badge}</span>
          </div>
        )}
      </div>

      {/* 🔘 ICONO CON "AURORA" DINÁMICA */}
      <div className="relative w-20 h-20 md:w-28 md:h-28 mb-12 z-10 flex-shrink-0">
        {!isDisabled && (
          <div 
            className="absolute inset-0 rounded-[2.5rem] opacity-0 blur-[40px] group-hover:opacity-50 transition-opacity duration-1000" 
            style={{ backgroundColor: style.accent }}
          />
        )}
        <div className="relative z-10 w-full h-full bg-black/80 rounded-[2.5rem] border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-white/40 transition-all duration-700"
             style={{ color: isDisabled ? '#27272a' : style.accent }}>
          {React.isValidElement(icon) 
            ? React.cloneElement(icon as React.ReactElement, { size: 48, strokeWidth: 1.5 })
            : icon
          }
        </div>
      </div>

      {/* 📝 BLOQUE DE INFERENCIA (TEXTO) */}
      <div className="space-y-5 mb-8 relative z-10 flex-1">
        <div className="space-y-4">
          <h3 className={`text-5xl md:text-6xl font-[1000] uppercase tracking-tighter leading-[0.85] break-words transition-all duration-500 ${isDisabled ? 'text-zinc-800' : 'text-white group-hover:tracking-tight'}`}>
            {title.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h3>
          {!isDisabled && (
            <motion.div 
              className="h-[6px] rounded-full"
              initial={{ width: 40 }}
              whileHover={{ width: 120 }}
              style={{ 
                backgroundColor: style.accent,
                boxShadow: `0 0 25px ${style.accent}`
              }}
            />
          )}
        </div>

        <p className={`text-lg md:text-xl leading-snug font-bold tracking-tight transition-colors line-clamp-3 ${isDisabled ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
          {description}
        </p>
      </div>

      {/* ⚡ ACTIVADOR DE SINCRONIZACIÓN */}
      <div className="mt-auto relative z-10">
        <div className={`
          w-full py-8 rounded-[2.5rem] font-[1000] uppercase tracking-[0.4em] text-[12px] flex items-center justify-center gap-4
          transition-all duration-700 border border-white/5 shadow-3xl
          ${isDisabled ? 'bg-zinc-900 text-zinc-800' : `${style.btn} ${style.text} group-hover:shadow-[0_20px_50px_-10px_${style.accent}66] group-hover:scale-[1.02]`}
        `}>
          {isDisabled ? <Lock size={16} /> : <Zap size={16} fill="currentColor" />}
          {isDisabled ? "ACCESO_DENEGADO" : buttonText}
          {!isDisabled && <ArrowUpRight size={22} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />}
        </div>
      </div>

      {/* ✨ EFECTO DE ESCANEO CRT (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
      
      {/* 🌌 GLOW AMBIENTAL INFERIOR */}
      {!isDisabled && (
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 blur-[150px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 rounded-full pointer-events-none"
          style={{ backgroundColor: style.accent }}
        />
      )}
    </motion.div>
  );
};

export default DashboardCard;