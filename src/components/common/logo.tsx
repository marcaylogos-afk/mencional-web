/**
 * 🛰️ MENCIONAL NEURAL LINK | LOGO COMPONENT v2026.PROD
 * Identidad visual central del ecosistema.
 * Ubicación: /src/components/common/Logo.tsx
 */

import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  // Modos oficiales de la App MENCIONAL sincronizados con SettingsContext
  mode?: 'mencional' | 'ultra' | 'rompehielo'; 
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  showText = true,
  size = 'md',
  mode = 'mencional', 
  onClick
}) => {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-32 w-32",
    xl: "h-52 w-52"
  };

  const textClasses = {
    sm: "text-xl",
    md: "text-3xl md:text-4xl",
    lg: "text-5xl md:text-7xl",
    xl: "text-7xl md:text-[9.5rem]"
  };

  // Mapeo de taglines basado en la arquitectura de servicios detectada
  const modeTaglines = {
    'mencional': "NEURAL_CORE_v2.6_LEARNING",
    'ultra': "ULTRA-MENCIONAL_INTERPRETER_v2",
    'rompehielo': "ROMPEHIELO_SOCIAL_ENGINE_v1"
  };

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-6 transition-all duration-700 group select-none ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'} ${className}`}
    >
      
      {/* 🌌 CONTENEDOR DEL ISOTIPO CON EFECTO DE AURA NEURAL */}
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center shrink-0`}>
        
        {/* Efectos de brillo de fondo (Neon Cyan OLED) */}
        <div className="absolute -inset-10 bg-[#00FBFF]/5 blur-[45px] rounded-full pointer-events-none group-hover:bg-[#00FBFF]/15 transition-all duration-1000" />
        <div className="absolute inset-0 rounded-full border-2 border-[#00FBFF]/20 animate-[ping_3s_infinite] scale-125 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* 🚀 RUTA CORREGIDA: /logo_mencional.png.png (según captura de carpeta /public) */}
        <img 
          src="/logo_mencional.png.png" 
          alt="Mencional Logo" 
          className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(0,251,255,0.4)] transition-all duration-700 group-hover:scale-110 group-hover:rotate-[2deg] z-10"
        />
        
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-20" />
      </div>

      {showText && (
        <div className="flex flex-col border-l-2 border-white/5 pl-8 transition-all duration-500 group-hover:border-[#00FBFF]/40">
          <h1 className={`text-white font-[1000] italic tracking-tighter uppercase leading-none ${textClasses[size]}`}>
            MEN<span className="text-[#00FBFF] transition-all duration-500 group-hover:drop-shadow-[0_0_35px_rgba(0,251,255,0.8)]">CIONAL</span>
          </h1>
          
          <div className="flex items-center gap-4 mt-3">
            <span className="text-[9px] md:text-[10px] font-black tracking-[0.5em] text-zinc-700 uppercase italic transition-colors group-hover:text-zinc-400">
              {modeTaglines[mode]}
            </span>
            
            {/* Indicador de Estado LIVE (Sincronizado con speechService activo) */}
            <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-950/80 rounded-full border border-white/10 shadow-inner">
              <div className="relative flex items-center justify-center h-2.5 w-2.5">
                <div className="absolute inset-0 rounded-full bg-[#39FF14] animate-ping opacity-30" />
                <div className="relative h-1.5 w-1.5 rounded-full bg-[#39FF14] shadow-[0_0_12px_#39FF14]" />
              </div>
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">LIVE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;