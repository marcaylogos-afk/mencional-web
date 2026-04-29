/**
 * 🏢 MENCIONAL | SESSION_LOBBY v4.0 (STABLE)
 * Orquestador de pre-sesión: Gestión de salas, creación y temas trend.
 * Ubicación: /src/views/SessionLobby.tsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Zap, ChevronRight, Plus, 
  Activity, Users, Star, Sparkles
} from 'lucide-react';
import { logger } from '../utils/logger';

const SessionLobby: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { isAdmin, isPaid } = useAuth();

  // --- ESTADOS DE CONFIGURACIÓN ---
  const [mode, setMode] = useState<'Individual' | 'Dúo' | 'Trío'>('Individual');
  const [selectedLang, setSelectedLang] = useState(settings.targetLanguage || 'en-US');
  const [sessionName, setSessionName] = useState('');
  const [view, setView] = useState<'browse' | 'create'>('create');

  const languages = [
    { id: 'en-US', name: "Inglés (USA)" },
    { id: 'fr-FR', name: "Francés" },
    { id: 'de-DE', name: "Alemán" },
    { id: 'it-IT', name: "Italiano" },
    { id: 'pt-BR', name: "Portugués" },
    { id: 'es-MX', name: "Español" }
  ];

  // Temas dinámicos para la Nube de Ideas
  const trendThemes = ["Ciberseguridad", "Diseño_Neural", "Viajes_Espaciales", "Gastronomía_Futurista"];

  const availableSessions = [
    { id: '1', name: 'CONEXIÓN_ASTRONAUTA', host: 'Miguel', time: 'En 12 min', slots: '1/2', type: 'Dúo' },
    { id: '2', name: 'DEBATE_IA_ETHICS', host: 'Elena', time: 'En 45 min', slots: '2/3', type: 'Trío' },
  ];

  /**
   * 🚀 EXECUTE_ACTION
   * Protocolo de acceso: Admins y sesiones individuales tienen vía libre.
   */
  const handleAction = () => {
    const finalName = sessionName.trim() || "MENCIONAL_SESSION";
    
    // Sincronización de preferencias en el Contexto Global
    updateSettings({ 
      targetLanguage: selectedLang,
      practiceLanguage: selectedLang,
      userName: settings.userName || 'USUARIO_NODE'
    });

    logger.info("LOBBY", `Iniciando protocolo: ${mode} | Idioma: ${selectedLang}`);

    /**
     * LÓGICA DE ACCESO MENCIONAL:
     * - Operador Maestro (Admin): Bypass total.
     * - Modo Individual: Acceso libre (Trial/Personal).
     * - Modo Grupal (Dúo/Trío): Requiere validación isPaid via Mercado Pago.
     */
    if (isAdmin || mode === 'Individual' || isPaid) {
      navigate('/learning-mode');
    } else {
      logger.info("AUTH", "Sesión grupal bloqueada. Requiere validación de acceso.");
      window.location.href = "https://link.mercadopago.com.mx/mencional"; 
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col items-center font-sans select-none overflow-x-hidden pb-40">
      
      {/* 🌌 FONDO DINÁMICO OLED */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000" 
        style={{ background: `radial-gradient(circle at 50% 0%, ${settings.themeColor}15 0%, transparent 50%)` }}
      />

      {/* 🛰️ HEADER */}
      <header className="flex flex-col items-center mb-12 max-w-2xl w-full relative z-10">
        <div 
          className="w-16 h-1 w-full mb-8 transition-all duration-500" 
          style={{ background: `linear-gradient(to right, transparent, ${settings.themeColor}33, transparent)` }}
        />
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black tracking-[0.6em] text-white/30 uppercase italic mb-2">Central_de_Sincronización</span>
          <h1 className="text-3xl font-[1000] tracking-tighter text-white italic uppercase">
            MENCIONAL<span style={{ color: settings.themeColor }}>_HUB</span>
          </h1>
        </div>
      </header>

      <main className="flex-1 space-y-10 max-w-2xl w-full relative z-10">
        
        {/* SELECTOR DE VISTA (Tab Switcher) */}
        <div className="flex bg-zinc-950/50 backdrop-blur-xl p-1.5 rounded-full border border-white/5">
          <button 
            onClick={() => setView('browse')}
            className={`flex-1 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'browse' ? 'bg-zinc-800 shadow-inner' : 'text-zinc-600'}`}
            style={{ color: view === 'browse' ? settings.themeColor : '' }}
          >
            Explorar_Salas
          </button>
          <button 
            onClick={() => setView('create')}
            className={`flex-1 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'create' ? 'bg-zinc-800 shadow-inner' : 'text-zinc-600'}`}
            style={{ color: view === 'create' ? settings.themeColor : '' }}
          >
            Configurar_Nueva
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === 'browse' ? (
            <motion.section 
              key="browse"
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-4">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Sesiones_Activas</label>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">Live_Node</span>
                </div>
              </div>

              {availableSessions.map(session => (
                <button 
                  key={session.id} 
                  onClick={handleAction}
                  className="w-full bg-zinc-950/40 border border-white/5 p-7 rounded-[2.5rem] flex items-center justify-between group transition-all hover:bg-zinc-900/40"
                  style={{ borderLeft: `2px solid ${settings.themeColor}22` }}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-black text-white italic tracking-wider group-hover:text-white">#{session.name}</span>
                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2">
                       <Users size={10} /> {session.host} • {session.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[10px] font-black" style={{ color: settings.themeColor }}>{session.slots}</div>
                      <div className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">{session.time}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-full transition-all group-hover:scale-110" style={{ backgroundColor: `${settings.themeColor}15` }}>
                      <ChevronRight size={18} style={{ color: settings.themeColor }} />
                    </div>
                  </div>
                </button>
              ))}
            </motion.section>
          ) : (
            <motion.section 
              key="create"
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              {/* SELECTOR DE MODALIDAD */}
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 italic block">Estructura_de_Nodo</label>
                <div className="flex gap-2">
                  {['Individual', 'Dúo', 'Trío'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m as any)}
                      className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${mode === m ? 'bg-white text-black border-white' : 'bg-zinc-950 text-zinc-700 border-white/5 hover:border-white/20'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* PROTOCOLO DE IDIOMA */}
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 italic block">Target_Language_Sync</label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLang(l.id)}
                      className={`py-4 px-6 rounded-xl text-[10px] font-black border transition-all text-left flex items-center justify-between ${selectedLang === l.id ? 'bg-white/5' : 'border-white/5 text-zinc-500'}`}
                      style={{ 
                        borderColor: selectedLang === l.id ? settings.themeColor : '',
                        color: selectedLang === l.id ? settings.themeColor : ''
                      }}
                    >
                      {l.name}
                      {selectedLang === l.id && <Sparkles size={10} className="fill-current animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* TRENDING THEMES */}
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 italic block">Contexto_Inicial</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {trendThemes.map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSessionName(topic.toUpperCase())}
                      className="px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-full text-[9px] font-black text-zinc-500 transition-all hover:text-white"
                      style={{ borderColor: sessionName === topic.toUpperCase() ? settings.themeColor : '' }}
                    >
                      #{topic}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="NOMBRAR_CANAL_DE_SINCRO..."
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-zinc-900 p-6 text-xl font-black italic outline-none uppercase tracking-[0.2em] placeholder:text-zinc-800 transition-all"
                    style={{ 
                      color: settings.themeColor,
                      borderBottomColor: sessionName ? settings.themeColor : ''
                    }}
                  />
                  {sessionName && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Zap size={16} style={{ color: settings.themeColor }} className="fill-current" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER ACCIÓN (STICKY) */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black to-transparent z-20 flex flex-col items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAction}
          className="max-w-2xl w-full py-8 rounded-[2.5rem] text-black font-[1000] italic text-sm tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-2xl"
          style={{ 
            backgroundColor: settings.themeColor,
            boxShadow: `0 20px 80px ${settings.themeColor}33`
          }}
        >
          {mode === 'Individual' ? <Zap size={20} className="fill-current" /> : <Plus size={20} />}
          {mode === 'Individual' ? 'INICIAR_SESIÓN_LIBRE' : 'VALIDAR_Y_CREAR'}
          <ChevronRight size={20} />
        </motion.button>
        
        <div className="flex items-center gap-3 opacity-20">
            <Activity size={12} />
            <span className="text-[8px] font-black uppercase tracking-[0.6em]">Protocolo_Seguridad_Kernel_v2.6</span>
        </div>
      </footer>
    </div>
  );
};

export default SessionLobby;