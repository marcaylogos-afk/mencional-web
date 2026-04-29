/**
 * 🚀 MENCIONAL v2026.12 | MAIN_DASHBOARD
 * Protocolo: Acceso Diferenciado por Roles (ADMIN/PARTICIPANT)
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 * Ubicación: /src/views/MainDashboard.tsx
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lock, Unlock, Zap, Shield, ChevronRight, 
  Layers, Globe, UserCheck, Activity, CreditCard 
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../context/SettingsContext';
import { logger } from '../utils/logger';

interface TrendFrase {
  id: string;
  text: string;
  category: string;
}

export const MainDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const { settings, updateSettings } = useSettings();
  
  // 🔑 Lógica de Roles: Identifica si es el Nodo Maestro (Admin)
  const isAdmin = useMemo(() => 
    user?.role === 'admin' || settings?.role === 'admin', 
  [user, settings]);

  const [deviceId] = useState("MNC_" + Math.random().toString(36).substring(2, 6).toUpperCase());
  
  // 💳 Verificación de pago para Participantes ($20 MXN / 20 Min)
  const isPaid = useMemo(() => 
    localStorage.getItem('payment_status') === 'verified' || isAdmin, 
  [isAdmin]);

  const [trends] = useState<TrendFrase[]>([
    { id: '1', text: "¿PODRÍAS REPETIR ESO?", category: 'ASISTENCIA' },
    { id: '2', text: "TRANSFERENCIA EXITOSA", category: 'TRABAJO' },
    { id: '3', text: "¿ACEPTAN TARJETA?", category: 'COMERCIO' },
  ]);

  /**
   * Maneja el acceso a los módulos de IA ubicados en /src/services/ai/
   */
  const handleModuleAccess = (path: string, requiresAdmin: boolean) => {
    // 1. Si la función es exclusiva de Admin y no lo es, bloqueamos acción
    if (requiresAdmin && !isAdmin) {
      logger.warn("ACCESS_DENIED", `Intento de acceso a módulo restringido: ${path}`);
      return;
    }

    // 2. Control de flujo para Aprendizaje (Participante debe tener pago activo)
    if (path === '/learning-session' && !isPaid) {
      navigate('/payment-gateway');
      return;
    }

    // Redirección al Setup de sesión (donde se eligen idiomas y colores OLED)
    navigate('/session-setup', { state: { targetPath: path } });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6 md:p-10 font-sans select-none overflow-x-hidden italic">
      
      {/* 🌌 ATMÓSFERA OLED: Optimización de Negro Puro #000000 */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FBFF]/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <header className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5 shadow-[0_0_20px_rgba(0,251,255,0.2)]">
            <span className="text-[#00FBFF] font-black text-2xl">M</span>
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-[1000] italic tracking-tighter uppercase leading-none">
              MENCIONAL<span className="text-[#00FBFF]">.</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 opacity-50">
              <Activity size={12} className="text-[#00FBFF]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                {isAdmin ? 'MASTER_NODE' : 'PARTICIPANT_NODE'} // {deviceId}
              </span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#39FF14]/10 border border-[#39FF14]/40 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(57,255,20,0.1)]"
          >
            <UserCheck size={16} className="text-[#39FF14]" />
            <span className="text-[11px] font-black text-[#39FF14] uppercase tracking-widest">Acceso Maestro Autorizado</span>
          </motion.div>
        )}
      </header>

      {/* SUGERENCIAS (TRENDS) */}
      <section className="relative z-10 mb-16">
        <div className="flex items-center gap-3 mb-8 opacity-40">
          <Layers size={14} />
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">Insumos de Voz</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {trends.map((trend) => (
            <button
              key={trend.id}
              className="bg-zinc-900/40 border border-white/5 px-8 py-5 rounded-[1.8rem] hover:bg-zinc-800 transition-all active:scale-95 text-left"
              onClick={() => updateSettings({ lastQuery: trend.text })}
            >
              <p className="text-[9px] font-black text-zinc-500 uppercase mb-1 tracking-[0.2em]">{trend.category}</p>
              <p className="text-base font-bold italic uppercase tracking-tight text-zinc-400">"{trend.text}"</p>
            </button>
          ))}
        </div>
      </section>

      {/* GRID DE MÓDULOS DE IA (Sincronizado /ai/) */}
      <main className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
        
        {/* MODO APRENDIZAJE (Participante) */}
        <div 
          onClick={() => handleModuleAccess('/learning-session', false)}
          className="relative p-10 rounded-[3rem] bg-zinc-900/20 border-2 border-zinc-800 hover:border-[#00FBFF]/50 transition-all cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex justify-between items-start mb-12">
            <div className="p-5 bg-zinc-800 rounded-[2rem] text-white group-hover:bg-[#00FBFF] group-hover:text-black transition-colors">
              <Globe size={32} />
            </div>
            <Unlock size={20} className="text-zinc-600" />
          </div>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-3 group-hover:text-[#00FBFF] transition-colors">Aprendizaje</h3>
          <p className="text-zinc-500 text-[11px] font-bold leading-relaxed uppercase tracking-wider">
            Inmersión Lingüística: Protocolo Aoede Repetición x2.
          </p>
        </div>

        {/* INTÉRPRETE ULTRA (Admin Only) */}
        <div 
          onClick={() => handleModuleAccess('/ultra-mencional', true)}
          className={`relative p-10 rounded-[3rem] border-2 transition-all ${
            isAdmin ? 'bg-zinc-900/20 border-zinc-800 hover:border-[#A855F7] cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'bg-zinc-950 border-zinc-900 opacity-20 cursor-not-allowed'
          }`}
        >
          <div className="flex justify-between items-start mb-12">
            <div className={`p-5 rounded-[2rem] ${isAdmin ? 'bg-zinc-800 text-[#A855F7] group-hover:bg-[#A855F7] group-hover:text-black transition-colors' : 'bg-zinc-900 text-zinc-700'}`}>
              <Shield size={32} />
            </div>
            {!isAdmin ? <Lock size={20} className="text-zinc-700" /> : <ChevronRight size={20} className="text-[#A855F7]" />}
          </div>
          <h3 className={`text-3xl font-black uppercase italic tracking-tighter mb-3 ${isAdmin ? 'text-white group-hover:text-[#A855F7] transition-colors' : 'text-zinc-700'}`}>Intérprete</h3>
          <p className="text-zinc-500 text-[11px] font-bold leading-relaxed uppercase tracking-wider">
            Transcripción técnica en tiempo real (19s Cycle).
          </p>
        </div>

        {/* ROMPEHIELO (Admin Only) */}
        <div 
          onClick={() => handleModuleAccess('/rompehielo', true)}
          className={`relative p-10 rounded-[3rem] border-2 transition-all lg:col-span-1 md:col-span-2 ${
            isAdmin ? 'bg-zinc-900/20 border-zinc-800 hover:border-[#FF9900] cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'bg-zinc-950 border-zinc-900 opacity-20 cursor-not-allowed'
          }`}
        >
          <div className="flex justify-between items-start mb-12">
            <div className={`p-5 rounded-[2rem] ${isAdmin ? 'bg-zinc-800 text-[#FF9900] group-hover:bg-[#FF9900] group-hover:text-black transition-colors' : 'bg-zinc-900 text-zinc-700'}`}>
              <Zap size={32} />
            </div>
            {!isAdmin ? <Lock size={20} className="text-zinc-700" /> : <ChevronRight size={20} className="text-[#FF9900]" />}
          </div>
          <h3 className={`text-3xl font-black uppercase italic tracking-tighter mb-3 ${isAdmin ? 'text-white group-hover:text-[#FF9900] transition-colors' : 'text-zinc-700'}`}>Rompehielo</h3>
          <p className="text-zinc-500 text-[11px] font-bold leading-relaxed uppercase tracking-wider">
            Dinámicas sociales: Respuesta 4s.
          </p>
        </div>
      </main>

      {/* FOOTER DE PAGO (Solo para Participantes sin bloque activo) */}
      {!isAdmin && !isPaid && (
        <footer className="fixed bottom-0 left-0 w-full p-8 bg-black/90 backdrop-blur-xl border-t border-zinc-900 flex justify-center z-50">
          <button 
            onClick={() => window.location.href = "https://mpago.la/2fPScDJ"}
            className="w-full max-w-2xl py-6 rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.5em] transition-all border-2 shadow-[0_0_30px_rgba(0,251,255,0.2)] bg-black border-[#00FBFF] text-[#00FBFF] hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-center justify-center gap-4">
              <CreditCard size={18} />
              ADQUIRIR BLOQUE 20m ($20 MXN)
            </div>
          </button>
        </footer>
      )}

      {/* INDICADOR DE TIEMPO (Solo para Participantes con pago) */}
      {!isAdmin && isPaid && (
        <div className="fixed bottom-10 right-10 z-50">
          <div className="bg-[#39FF14] text-black px-6 py-3 rounded-full font-black text-[10px] tracking-widest uppercase shadow-[0_0_20px_rgba(57,255,20,0.4)]">
            Bloque Activo // 20:00m
          </div>
        </div>
      )}
    </div>
  );
};

export default MainDashboard;