/**
 * 🛰️ MENCIONAL | INTERPRETER_PRE_CONFIG v2026.12
 * Ubicación: /src/views/InterpreterPreConfig.tsx
 * Función: Configuración de Nodo Ultra, ruteo de audio y validación de sincronización.
 * Protocolo: Filtro obligatorio antes de iniciar sesión.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Headphones, 
  Volume2, 
  ChevronRight, 
  Zap,
  ArrowRightLeft,
  Settings2,
  ShieldCheck,
  AlertCircle,
  Clock
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

// ✅ INTEGRACIÓN CON CONTEXTO ÚNICO DE CONFIGURACIÓN
import { useSettings } from '../context/SettingsContext'; 

// Prioridad de idiomas según protocolo v2026.12 (Inglés prioritario)
const LANGUAGES = [
  { id: 'en-US', name: 'Inglés', flag: '🇺🇸' },
  { id: 'fr-FR', name: 'Francés', flag: '🇫🇷' },
  { id: 'de-DE', name: 'Alemán', flag: '🇩🇪' },
  { id: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { id: 'pt-BR', name: 'Portugués', flag: '🇧🇷' },
  { id: 'es-MX', name: 'Español', flag: '🇲🇽' },
  { id: 'auto', name: 'Auto-Detectar', flag: '✨' },
];

export const InterpreterPreConfig: React.FC = () => {
  const navigate = useNavigate();
  const { 
    role, 
    isAdminAuthenticated, 
    isPaid, 
    activateSession, 
    setLanguagePreference 
  } = useSettings(); 
  
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('es-MX');
  const [audioOutput, setAudioOutput] = useState<'headphones' | 'live'>('headphones');
  const [isReady, setIsReady] = useState(false);

  /**
   * 🛡️ PROTOCOLO DE SEGURIDAD (Gatekeeping)
   * Redirección inmediata si no se cumplen los requisitos de acceso.
   */
  useEffect(() => {
    const checkAccess = () => {
      // 1. Admin sin clave "osos"
      if (role === 'admin' && !isAdminAuthenticated) {
        navigate('/admin-auth');
        return;
      }

      // 2. Participante sin pago validado
      if (role === 'participant' && !isPaid) {
        navigate('/payment');
        return;
      }

      // 3. Estado huérfano
      if (!role) {
        navigate('/welcome');
        return;
      }

      // Simulación de enlace con el motor de audio Aoede
      const initEngine = async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsReady(true);
      };
      initEngine();
    };

    checkAccess();
  }, [role, isAdminAuthenticated, isPaid, navigate]);

  const handleStart = () => {
    /**
     * 🔄 ACTIVACIÓN DE SESIÓN
     * Sincroniza preferencias y bloquea el estado para evitar re-pagos accidentales.
     */
    setLanguagePreference(sourceLang);
    activateSession(); 

    if (role === 'admin') {
      navigate('/ultra-interpreter'); 
    } else {
      navigate('/learning-mode');
    }
  };

  const swapLanguages = () => {
    if (sourceLang === 'auto') return;
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* 🧬 FX: BACKGROUND NEURAL */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-[#030303] border border-white/5 rounded-[3rem] p-8 md:p-10 relative z-10 shadow-[0_0_50px_rgba(0,0,0,1)]"
      >
        {/* HEADER TÉCNICO */}
        <div className="flex items-center gap-5 mb-10 border-b border-white/[0.03] pb-8">
          <div className="p-3.5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <Settings2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-[1000] uppercase tracking-tighter italic italic">Configuración de Sesión</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <ShieldCheck size={12} className={role === 'admin' ? "text-cyan-400" : "text-emerald-500"} />
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">
                {role === 'admin' ? 'ADMIN_NODE_VALIDATED' : 'PARTICIPANT_ACCESS_GRANTED'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* MATRIZ DE IDIOMAS */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Input_Stream</label>
              <select 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 p-4 rounded-2xl font-bold text-[11px] outline-none focus:border-cyan-500/50 appearance-none text-zinc-300 transition-all cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id} className="bg-zinc-950">{lang.flag} {lang.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={swapLanguages} 
              className="mt-5 p-3.5 bg-zinc-900/50 border border-white/5 rounded-full hover:text-cyan-400 hover:border-cyan-400/30 transition-all active:scale-90"
            >
              <ArrowRightLeft size={16} />
            </button>

            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Output_Target</label>
              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 p-4 rounded-2xl font-bold text-[11px] outline-none focus:border-cyan-500/50 appearance-none text-zinc-300 transition-all cursor-pointer"
              >
                {LANGUAGES.filter(l => l.id !== 'auto').map(lang => (
                  <option key={lang.id} value={lang.id} className="bg-zinc-950">{lang.flag} {lang.name.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* RUTA DE SALIDA AUDIO (Aoede Route) */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setAudioOutput('headphones')}
              className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-500 ${audioOutput === 'headphones' ? 'border-cyan-500/40 bg-cyan-500/5 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-white/5 bg-zinc-900/20 text-zinc-700'}`}
            >
              <Headphones size={20} strokeWidth={audioOutput === 'headphones' ? 2.5 : 1.5} />
              <span className="text-[9px] font-black uppercase tracking-widest">Audífonos</span>
            </button>
            <button 
              onClick={() => setAudioOutput('live')}
              className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-500 ${audioOutput === 'live' ? 'border-cyan-500/40 bg-cyan-500/5 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-white/5 bg-zinc-900/20 text-zinc-700'}`}
            >
              <Volume2 size={20} strokeWidth={audioOutput === 'live' ? 2.5 : 1.5} />
              <span className="text-[9px] font-black uppercase tracking-widest">Altavoz</span>
            </button>
          </div>

          {/* ACTION: START SESSION */}
          <button 
            onClick={handleStart}
            disabled={!isReady}
            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 transition-all duration-700 ${isReady ? 'bg-cyan-500 text-black hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-[1.01]' : 'bg-zinc-900 text-zinc-700 cursor-wait'}`}
          >
            <Zap size={14} fill={isReady ? "black" : "none"} className={isReady ? "animate-pulse" : ""} />
            <span>{isReady ? 'Activar Nodo Mencional' : 'Sincronizando Motores...'}</span>
            <ChevronRight size={14} />
          </button>

          {/* FOOTER DE PROTOCOLO */}
          <div className="pt-6 space-y-3 border-t border-white/[0.03]">
            <div className="flex items-center gap-3 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
              <Clock size={12} className="text-zinc-700" /> Sincronización de Bloque: <span className="text-zinc-400">20:00 MIN</span>
            </div>
            <div className="flex items-center gap-3 text-rose-500/60 text-[8px] font-black uppercase tracking-widest">
              <AlertCircle size={12} /> La desconexión anticipada anula el crédito activo
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterpreterPreConfig;