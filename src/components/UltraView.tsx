/**
 * 🗛️ MENCIONAL | ULTRA_VIEW v2026.PROD
 * Protocolo: Panel de Control Maestro y Selección de Nodo.
 * Ubicación: /src/views/UltraView.tsx
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as m, AnimatePresence as Ap } from 'framer-motion';
import { 
  Globe, 
  MessageSquare, 
  Zap, 
  ChevronRight, 
  LogOut,
  ShieldCheck,
  Cpu,
  CreditCard,
  Activity
} from 'lucide-react';

import { useSettings } from '../context/SettingsContext';

/** 🎙️ SERVICIOS SINCRONIZADOS: Ruta corregida a /ai/ */
import suggestionEngine from '../services/ai/suggestionEngine';
import speechService from '../services/ai/speechService';

const UltraView: React.FC = () => {
  const navigate = useNavigate();
  const { settings, resetSettings, palette10 } = useSettings();
  const { userAlias, isAdmin, isPaid } = settings;
  
  // Frases Trend: Basadas en contextos reales de inmersión (Motor /ai/)
  const [currentTrend, setCurrentTrend] = useState(suggestionEngine.getInitialTrend());

  // Ciclo de tendencias cada 19 segundos (Protocolo Ultra-Mencional)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTrend(suggestionEngine.getSilenceBreaker('learning'));
    }, 19000); 
    return () => clearInterval(timer);
  }, []);

  // Definición de Protocolos sincronizados con Palette10 (OLED Optimized)
  const ALL_PROTOCOLS = [
    {
      id: 'learning',
      title: 'MENCIONAL', // Función Principal: Modo Aprendizaje
      subtitle: 'SINCRONIZACIÓN LINGÜÍSTICA 6S',
      icon: <Globe size={24} />,
      path: '/mencional', 
      color: palette10[0], // Cian (#00FBFF)
      adminOnly: false
    },
    {
      id: 'interpreter',
      title: 'ULTRA-MENCIONAL', // Modo Intérprete
      subtitle: 'CONFERENCIA PROFESIONAL 19S',
      icon: <MessageSquare size={24} />,
      path: '/ultra-mencional', 
      color: palette10[5], // Púrpura (#A855F7)
      adminOnly: true
    },
    {
      id: 'rompehielo',
      title: 'ROMPEHIELO', // Tercera Función
      subtitle: 'DINÁMICAS SOCIALES REACCIÓN 4S',
      icon: <Zap size={24} />,
      path: '/rompehielo',
      color: palette10[6], // Naranja (#FF9900)
      adminOnly: true
    }
  ];

  // Filtrado estricto: El participante promedio solo accede a Mencional
  const visibleProtocols = isAdmin 
    ? ALL_PROTOCOLS 
    : ALL_PROTOCOLS.filter(p => !p.adminOnly);

  const handleLogout = () => {
    // 🛡️ Purga de hardware total antes de navegar
    speechService.stopAll(); 
    resetSettings();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-8 font-sans select-none overflow-hidden relative">
      
      {/* 🌌 AMBIENTE OLED ACCENTS */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none animate-pulse opacity-10"
        style={{ backgroundColor: palette10[0] }} 
      />

      {/* 🟢 HEADER: IDENTIDAD Y STATUS DE NODO */}
      <header className="flex justify-between items-center z-20 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-6">
          <img 
            src="/icons/icon-192.png" 
            className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(0,251,255,0.4)]" 
            alt="Mencional Logo" 
          />
          <div className="flex flex-col text-left">
            <span className={`text-[8px] font-black tracking-[0.6em] uppercase italic ${isAdmin ? 'text-[#39FF14]' : 'text-zinc-600'}`}>
              {isAdmin ? 'SISTEMA_ORIGEN_MASTER' : 'NODO_PARTICIPANTE_ACTIVO'}
            </span>
            <span className="text-sm font-black tracking-widest text-zinc-100 uppercase flex items-center gap-2">
              <Cpu size={14} className={isAdmin ? "text-[#39FF14]" : "text-[#00FBFF]"} />
              {userAlias || 'USUARIO_ANÓNIMO'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="group flex items-center gap-4 px-6 py-3 bg-zinc-950/60 border border-white/5 rounded-2xl hover:border-rose-500/40 transition-all backdrop-blur-md"
        >
          <span className="text-[9px] font-black text-zinc-600 group-hover:text-rose-500 tracking-[0.2em] uppercase">Cerrar Sesión</span>
          <LogOut size={16} className="text-zinc-700 group-hover:text-rose-500" />
        </button>
      </header>

      {/* 🚀 DASHBOARD DE PROTOCOLOS */}
      <main className="flex-1 flex flex-col items-center justify-center gap-12 z-10 w-full max-w-4xl mx-auto">
        <m.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full space-y-8"
        >
          <h2 className="text-[40px] md:text-[60px] font-[1000] tracking-[0.3em] uppercase italic text-white leading-none">
            MEN<span className="text-[#00FBFF]">CIONAL</span>
          </h2>

          {/* 📊 PANEL DE TEMAS TREND */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 opacity-30">
              <Activity size={12} className="text-[#00FBFF]" />
              <span className="text-[8px] font-black tracking-[0.5em] uppercase text-zinc-400">Contexto_Social_Activo</span>
            </div>
            <Ap mode="wait">
              <m.div 
                key={currentTrend}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-zinc-900/40 border border-[#00FBFF]/20 px-12 py-6 rounded-2xl backdrop-blur-xl"
              >
                <p className="text-[12px] md:text-[15px] font-black tracking-[0.3em] text-[#00FBFF] uppercase italic">
                  "{currentTrend}"
                </p>
              </m.div>
            </Ap>
          </div>
        </m.div>

        {/* 📋 LISTADO DE NODOS */}
        <div className="w-full space-y-5 px-4">
          {visibleProtocols.map((proto, index) => (
            <m.button
              key={proto.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ x: 15, backgroundColor: "rgba(255,255,255,0.03)" }}
              onClick={() => navigate(proto.path)}
              className="w-full p-8 rounded-[2.5rem] bg-zinc-950/30 border border-white/5 flex items-center justify-between group relative overflow-hidden backdrop-blur-3xl"
            >
              <div className="flex items-center gap-10">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center bg-zinc-950 border border-white/5 group-hover:scale-110 transition-transform shadow-inner"
                  style={{ color: proto.color }}
                >
                  {proto.icon}
                </div>
                <div className="text-left">
                  <span className="block text-[22px] font-[1000] tracking-tighter uppercase italic text-zinc-400 group-hover:text-white transition-colors">
                    {proto.title}
                  </span>
                  <span className="block text-[8px] font-black tracking-[0.4em] text-zinc-700 uppercase italic mt-2">
                    {proto.subtitle}
                  </span>
                </div>
              </div>
              <ChevronRight size={24} className="text-zinc-800 group-hover:text-white group-hover:translate-x-2 transition-all" />
              
              {proto.adminOnly && (
                <div className="absolute top-4 right-8 flex items-center gap-2 opacity-40">
                   <ShieldCheck size={10} className="text-[#39FF14]" />
                   <span className="text-[7px] font-black text-[#39FF14] tracking-widest uppercase">Pase_Maestro</span>
                </div>
              )}
            </m.button>
          ))}
        </div>
      </main>

      {/* 🟢 FOOTER: SISTEMA Y PAGOS */}
      <footer className="mt-auto flex flex-col items-center gap-6 pb-4 z-20">
        {!isPaid && !isAdmin && (
          <m.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://mpago.la/2fPScDJ', '_blank')}
            className="text-[10px] font-black tracking-[0.3em] text-black bg-[#00FBFF] hover:bg-white transition-all flex items-center gap-4 italic px-10 py-4 rounded-full shadow-[0_0_20px_rgba(0,251,255,0.4)]"
          >
            <CreditCard size={14} /> 
            VINCULAR_PAGO_PARTICIPANTE
          </m.button>
        )}
        <div className="flex items-center gap-4 text-zinc-800">
          <div className="w-1 h-1 rounded-full bg-[#00FBFF] animate-ping" />
          <span className="text-[7px] font-black tracking-[0.8em] uppercase">
            MENCIONAL_CORE_V.26 // {isAdmin ? 'ADMIN_UNLIMITED' : 'SESSION_BLOCK_20M'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default UltraView;