/**
 * 🛡️ MENCIONAL | FAILSAFE_PROTOCOL v2026.12
 * Pantalla de protección del núcleo de renderizado ante excepciones críticas.
 * Función: Purga de estado corrupto y reinicio de nodos AI sin pérdida de Auth.
 * Ubicación: /src/components/FailsafeProtocol.tsx
 */

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, ShieldOff, ZapOff, Terminal } from "lucide-react";

export default function FailsafeProtocol() {
  
  const handleReload = () => {
    /**
     * ⚡ PROTOCOLO DE PURGA SELECTIVA:
     * Limpia configuraciones de sesión volátiles pero preserva las llaves maestras de MENCIONAL.
     */
    try {
      // 1. Respaldar llaves de persistencia vitales (Identidad y Autoridad)
      const mencionalRole = localStorage.getItem('mencional_role');
      const mencionalAuth = localStorage.getItem('mencional_auth');
      const mencionalPaid = localStorage.getItem('mencional_paid'); 
      const mencionalConfig = localStorage.getItem('mencional_active_config'); 
      
      // 2. Ejecutar purga total (Elimina buffers de audio bloqueados y estados de IA corruptos)
      // Nota: Esto limpia el rastro de /services/ai/ en memoria.
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. Restauración inmediata del Handshake
      if (mencionalRole) localStorage.setItem('mencional_role', mencionalRole);
      if (mencionalAuth) localStorage.setItem('mencional_auth', mencionalAuth);
      if (mencionalPaid) localStorage.setItem('mencional_paid', mencionalPaid);
      
      if (mencionalConfig) {
        // Restauramos solo la configuración de idioma prioritario para un booteo limpio
        try {
          const config = JSON.parse(mencionalConfig);
          localStorage.setItem('mencional_active_config', JSON.stringify({
            targetLanguage: config.targetLanguage || 'en-US',
            uiMode: 'OLED_PURE'
          }));
        } catch (e) {
          // JSON corrupto ignorado para evitar bucles de excepción
        }
      }
      
      // 4. Hard Reset: Forzamos navegación a raíz para reconstruir el Virtual DOM
      window.location.href = '/?status=rebooted_failsafe';
    } catch (e) {
      // Failsafe de emergencia: si el acceso a storage falla, recarga simple del motor
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 z-[9999] font-sans select-none overflow-hidden text-white italic">
      
      {/* 🌌 AMBIENTE DE ADVERTENCIA (Glow Rose OLED) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.12),transparent_75%)] animate-pulse" />

      {/* HEADER DE TELEMETRÍA */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-12 flex items-center gap-4 px-8 py-3 border border-rose-600/30 rounded-full bg-rose-950/20 backdrop-blur-3xl z-10"
      >
        <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
        <span className="text-[10px] font-[1000] text-rose-500 uppercase tracking-[0.5em]">
          CORE_EXCEPTION_TRAPPED_2026
        </span>
      </motion.div>

      {/* IMPACTO VISUAL: TITULAR INDUSTRIAL */}
      <div className="text-center mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute -inset-24 bg-rose-600/5 blur-[120px] rounded-full" 
        />
        <h1 className="text-8xl md:text-[13rem] font-[1000] tracking-tighter leading-[0.75] mb-4 relative uppercase text-white">
          System
        </h1>
        <h2 className="text-5xl md:text-8xl font-[1000] text-rose-900/30 tracking-tighter leading-none relative uppercase">
          _Halted
        </h2>
      </div>

      {/* CARD DE DIAGNÓSTICO (CandyGlass Style) */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl bg-zinc-950/90 border-t border-x border-rose-600/20 rounded-[4rem] p-12 md:p-16 flex flex-col items-center gap-12 shadow-[0_50px_120px_rgba(0,0,0,1)] backdrop-blur-3xl relative z-10"
      >
        {/* Glow de línea superior de integridad */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-rose-600 shadow-[0_0_30px_rgba(225,29,72,1)]" />
        
        <div className="relative">
            <div className="absolute inset-0 bg-rose-600 blur-3xl opacity-10 animate-pulse" />
            <div className="w-28 h-28 bg-zinc-900/50 rounded-[2.5rem] flex items-center justify-center border border-rose-500/30 relative shadow-inner">
              <ZapOff size={42} className="text-rose-500 animate-pulse" />
            </div>
        </div>

        <div className="space-y-5 text-center">
          <h3 className="text-white font-[1000] text-3xl uppercase tracking-tighter leading-tight">Anomalía_Link_Neural</h3>
          <p className="text-zinc-600 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
            El procesador <span className="text-rose-600">Mencional_Core</span> ha detectado una fuga de buffer en los servicios <span className="text-white">AI</span>. 
            <br/><br/>
            Se requiere un <span className="text-zinc-400">Flush_Neural</span> para restaurar la sincronización de los nodos.
          </p>
        </div>

        {/* ACCIONES DE RECUPERACIÓN */}
        <div className="flex flex-col gap-5 w-full mt-4">
          <button 
            onClick={handleReload}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white py-8 rounded-[2.5rem] flex items-center justify-center gap-5 transition-all active:scale-[0.97] group border-b-[8px] border-rose-900 shadow-2xl"
          >
            <RefreshCcw size={22} className="group-hover:rotate-180 transition-transform duration-1000" strokeWidth={3} />
            <span className="text-[12px] font-[1000] uppercase tracking-[0.4em]">Reiniciar_Handshake</span>
          </button>

          <div className="flex gap-5">
             <div className="flex-1 bg-zinc-900/50 border border-white/[0.03] py-5 rounded-3xl flex items-center justify-center gap-3 opacity-30">
               <Terminal size={16} className="text-zinc-600" />
               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Log_Dump: OK</span>
             </div>
             <div className="flex-1 bg-zinc-900/50 border border-white/[0.03] py-5 rounded-3xl flex items-center justify-center gap-3 opacity-30">
               <ShieldOff size={16} className="text-zinc-600" />
               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Auth_Stable</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* FOOTER DE ESTADO */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="mt-16 flex items-center gap-8 z-10"
      >
          <div className="flex flex-col items-end">
             <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em]">Neural_Failsafe</span>
             <span className="text-[11px] font-[1000] text-white uppercase tracking-tighter italic">V2026.12_STABLE</span>
          </div>
          <div className="h-10 w-px bg-rose-600/20" />
          <AlertTriangle size={28} className="text-rose-900" />
      </motion.footer>

      {/* EFECTO SCANLINE CRT (PROTECTOR DE PANTALLA OLED) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
}