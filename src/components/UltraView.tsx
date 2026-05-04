/**
 * 🗛️ MENCIONAL | ULTRA_VIEW v2026.PROD
 * Protocolo: Panel de Control Maestro y Selección de Nodo.
 * ✅ UPDATE: Fusión de modos (Mencional & Ultra-Interpreter).
 * ✅ UPDATE: Sincronización de bloques de 30 min.
 * ✅ OLED: Contraste absoluto e iluminación perimetral.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as m, AnimatePresence as Ap } from 'framer-motion';
import { 
  Globe, 
  MessageSquare, 
  ChevronRight, 
  LogOut,
  ShieldCheck,
  Cpu,
  CreditCard,
  Activity,
  Sparkles
} from 'lucide-react';

import { useSettings } from '../context/SettingsContext';
import suggestionEngine from '../services/ai/suggestionEngine';
import speechService from '../services/ai/speechService';

const UltraView: React.FC = () => {
  const navigate = useNavigate();
  const { settings, resetSettings, palette10 } = useSettings();
  const { userAlias, isAdmin, isPaid } = settings;
  
  // Rango Maestro (Protocolo Osos)
  const isMaster = useMemo(() => 
    userAlias?.toLowerCase() === 'osos' || isAdmin, 
  [userAlias, isAdmin]);

  // Motor de Tendencias (Cada 19 segundos para mantener el flujo cognitivo)
  const [currentTrend, setCurrentTrend] = useState(suggestionEngine.getInitialTrend());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTrend(suggestionEngine.getSilenceBreaker('learning'));
    }, 19000); 
    return () => clearInterval(timer);
  }, []);

  // Los dos pilares unificados de Mencional v2.6
  const ALL_PROTOCOLS = [
    {
      id: 'mencional',
      title: 'MENCIONAL', 
      subtitle: 'INMERSIÓN DUAL // AUTO-GEN',
      icon: <Globe size={26} />,
      path: '/mencional', 
      color: palette10[0], // Cian #00FBFF
      description: 'Aprendizaje fluido. Tú hablas tu idioma, el sistema inyecta el target.'
    },
    {
      id: 'ultra-interpreter',
      title: 'ULTRA-INTERPRETER', 
      subtitle: 'TEST NEURAL // INTERPRETACIÓN',
      icon: <MessageSquare size={26} />,
      path: '/ultra-mencional', 
      color: isMaster ? '#39FF14' : palette10[5], // Verde si es Master, Púrpura si no.
      description: 'Cuestionario de elocuencia seguido de interpretación selectiva.'
    }
  ];

  const handleLogout = () => {
    speechService.stopAll(); 
    resetSettings();
    navigate('/');
  };

  return (
    <div className="min-h-[100dvh] bg-[#000000] text-white flex flex-col p-6 md:p-12 font-sans select-none overflow-hidden relative">
      
      {/* 🌌 AMBIENTE OLED (Glow reactivo al rango) */}
      <div 
        className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: isMaster ? '#39FF14' : palette10[0] }} 
      />

      {/* 🟢 HEADER: STATUS DE NODO */}
      <header className="flex justify-between items-center z-20 max-w-7xl mx-auto w-full mb-10">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div 
              className="absolute inset-0 blur-lg opacity-40 group-hover:opacity-80 transition-opacity rounded-full" 
              style={{ backgroundColor: isMaster ? '#39FF14' : palette10[0] }} 
            />
            <img 
              src="/icons/icon-192.png" 
              className="relative w-14 h-14 md:w-16 md:h-16 object-contain" 
              alt="Mencional Logo" 
            />
          </div>
          <div className="flex flex-col">
            <span className={`text-[9px] font-[1000] tracking-[0.5em] uppercase italic ${isMaster ? 'text-[#39FF14]' : 'text-zinc-600'}`}>
              {isMaster ? 'SISTEMA_ORIGEN_MASTER' : 'NODO_PARTICIPANTE_ACTIVO'}
            </span>
            <span className="text-lg font-black tracking-tighter text-white uppercase flex items-center gap-2">
              <Cpu size={16} className={isMaster ? "text-[#39FF14]" : "text-[#00FBFF]"} />
              {userAlias || 'GUEST_NODE'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="group flex items-center gap-4 px-6 py-4 bg-zinc-950/40 border border-white/5 rounded-2xl hover:border-rose-500/40 transition-all backdrop-blur-xl"
        >
          <span className="text-[10px] font-black text-zinc-600 group-hover:text-rose-500 tracking-widest uppercase">Eyectar</span>
          <LogOut size={18} className="text-zinc-700 group-hover:text-rose-500 transition-colors" />
        </button>
      </header>

      {/* 🚀 DASHBOARD CORE */}
      <main className="flex-1 flex flex-col items-center justify-center gap-14 z-10 w-full max-w-5xl mx-auto">
        <m.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full space-y-8"
        >
          <div className="relative inline-block">
            <h2 className="text-[55px] md:text-[90px] font-[1000] tracking-[-0.05em] uppercase italic text-white leading-none">
              MEN<span style={{ color: isMaster ? '#39FF14' : '#00FBFF' }}>CIONAL</span>
            </h2>
            <div className="absolute -bottom-2 right-0 flex items-center gap-2 px-3 py-1 bg-black border border-white/10 rounded-lg">
              <Sparkles size={10} className="text-[#39FF14]" />
              <span className="text-[8px] font-black tracking-widest uppercase text-zinc-500">v2.6_STABLE</span>
            </div>
          </div>

          {/* MOTOR DE TENDENCIAS */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <Activity size={12} className="text-zinc-800 animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.6em] uppercase text-zinc-700">Canal_Neural_Data</span>
            </div>
            <Ap mode="wait">
              <m.div 
                key={currentTrend}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                className="bg-[#050505] border border-white/5 px-12 py-6 rounded-[2rem] shadow-2xl relative group"
              >
                <p className="text-[12px] md:text-[16px] font-black tracking-widest text-zinc-400 uppercase italic">
                  "{currentTrend}"
                </p>
              </m.div>
            </Ap>
          </div>
        </m.div>

        {/* NODOS DE SELECCIÓN */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {ALL_PROTOCOLS.map((proto, index) => (
            <m.button
              key={proto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(proto.path)}
              className="group relative bg-[#030303] border-2 border-white/5 p-8 rounded-[3rem] flex flex-col items-start gap-6 transition-all hover:border-white/20 text-left overflow-hidden"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center bg-black border border-white/10 group-hover:scale-110 transition-transform"
                style={{ color: proto.color }}
              >
                {proto.icon}
              </div>
              
              <div>
                <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white">
                  {proto.title}
                </h3>
                <p className="text-[9px] font-black tracking-[0.3em] text-zinc-600 uppercase mt-1 italic">
                  {proto.subtitle}
                </p>
                <p className="text-[11px] font-bold text-zinc-500 mt-4 leading-relaxed opacity-60">
                  {proto.description}
                </p>
              </div>

              <div className="absolute bottom-8 right-8 opacity-10 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                <ChevronRight size={28} style={{ color: proto.color }} />
              </div>

              {/* Glow sutil */}
              <div 
                className="absolute -bottom-10 -left-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: proto.color }}
              />
            </m.button>
          ))}
        </div>
      </main>

      {/* 🟢 FOOTER: ACCESO Y HARDWARE */}
      <footer className="mt-auto flex flex-col items-center gap-8 pb-4 z-20">
        {!isPaid && !isMaster && (
          <m.button 
            whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#000000' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://mpago.la/2fPScDJ', '_blank')}
            className="text-[10px] font-[1000] tracking-[0.4em] text-black bg-[#00FBFF] flex items-center gap-4 italic px-10 py-5 rounded-full shadow-[0_20px_40px_rgba(0,251,255,0.15)] transition-all"
          >
            <CreditCard size={14} /> 
            VINCULAR_SESIÓN_30_MIN
          </m.button>
        )}
        
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 opacity-20">
            <div className="w-1 h-1 rounded-full bg-[#39FF14] animate-pulse" />
            <span className="text-[7px] font-black tracking-[0.8em] uppercase text-zinc-500">
              MENCIONAL_ESTADO: {isMaster ? 'BYPASS_MASTER_ACTIVE' : 'READY_FOR_SYNC'}
            </span>
          </div>
          {isMaster && (
            <div className="flex items-center gap-2">
              <ShieldCheck size={10} className="text-[#39FF14] opacity-40" />
              <span className="text-[7px] font-black text-zinc-800 uppercase tracking-widest">Hardware_Link: Verified</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default UltraView;