/**
 * ✅ SESSION_LIST v2026.PROD
 * Tablero de Control de Sesiones y Temas Trend.
 * Protocolo: Selección de Aula y Sincronización de Sesiones (Ciclos 20 min).
 * Ubicación: /src/components/SessionList.tsx
 * ✅ DIRECTORIO: Sincronizado de /ia/ a /ai/
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Clock, Flame, ChevronRight, Activity, 
  Zap, CalendarDays, Target, CreditCard 
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth'; 

// ✅ CORRECCIÓN CRÍTICA: Importación desde la carpeta 'ai' sincronizada
import { suggestionEngine } from '../services/ai/suggestionEngine'; 

// --- INTERFACES ---
interface Session {
  id: string;
  name: string;
  host: string;
  time: string;
  participants: number;
  maxParticipants: number;
  themeColor: string;
  isFuture?: boolean;
}

interface SessionListProps {
  onJoinSession: (sessionId: string) => void;
  onSelectTrend: (theme: string) => void;
  onCreateFutureSession: () => void;
}

export const SessionList: React.FC<SessionListProps> = ({ 
  onJoinSession, 
  onSelectTrend,
  onCreateFutureSession
}) => {
  const { settings, palette10 } = useSettings();
  const { isAdmin, user } = useAuth(); // ✅ Gestión de Protocolo 'osos'
  const activeColor = settings?.themeColor || '#00FBFF';

  const [trends, setTrends] = useState<string[]>([]);

  /**
   * 🔄 CICLO DE TENDENCIAS (19s)
   * Sincroniza la "Frase más Top" desde el motor de IA.
   */
  useEffect(() => {
    const updateTrends = () => {
      // ✅ Uso del motor desde services/ai/ con fallback de seguridad
      const mainTrend = suggestionEngine?.getInitialTrend 
        ? suggestionEngine.getInitialTrend() 
        : 'EL ACENTO ES SECUNDARIO';
      
      setTrends([
        mainTrend,
        'CONEXIÓN > TRADUCCIÓN', 
        'FUTURE OF NEURAL VOICE', 
        'ERROR_AS_A_TOOL',
        'SINTONIZACIÓN_AOEDE'
      ]);
    };

    updateTrends();
    const interval = setInterval(updateTrends, 19000); 
    return () => clearInterval(interval);
  }, []);

  // Simulación de Nodos (Sincronizados con Firebase en Producción)
  const sessions: Session[] = [
    { 
      id: 'node_alpha', 
      name: 'NEURAL_CONVERSATION_LAB', 
      host: 'MENCIONAL_MASTER', 
      time: 'LIVE', 
      participants: 1, 
      maxParticipants: 4, 
      themeColor: palette10[0] // Cyan
    },
    { 
      id: 'node_beta', 
      name: 'DEEP_TALK_UX_DESIGN', 
      host: 'Operador_02', 
      time: '14:20 HRS', 
      participants: 0, 
      maxParticipants: 3, 
      themeColor: palette10[5], // Púrpura (Ultra)
      isFuture: true
    }
  ];

  return (
    <div className="space-y-16 select-none font-sans max-w-5xl mx-auto pb-32 relative z-10 px-4">
      
      {/* 🧩 BRANDING CENTRAL */}
      <div className="flex justify-center pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-2"
        >
          <img src="/logo_mencional.png" alt="M." className="w-20 drop-shadow-[0_0_20px_rgba(0,251,255,0.2)]" />
          <span className="text-[8px] font-black tracking-[0.5em] text-zinc-700 uppercase">
            Mencional_Core_v2026.PROD
          </span>
        </motion.div>
      </div>

      {/* 🟢 TENDENCIAS DINÁMICAS (Ciclo 19s) */}
      <section>
        <header className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3 text-zinc-600">
            <Flame size={14} className="text-[#FFB800] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
              Tendencias_Sincronizadas_19s
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-30">
              <Target size={10} className="text-white" />
              <span className="text-[8px] font-black text-white uppercase tracking-widest">Feed_Global</span>
          </div>
        </header>
        
        <div className="flex flex-wrap gap-3">
          <AnimatePresence mode='popLayout'>
            {trends.map((theme, index) => (
              <motion.button
                key={theme}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: index === 0 ? activeColor : 'rgba(255,255,255,0.2)',
                  backgroundColor: index === 0 ? `${activeColor}11` : 'rgba(255,255,255,0.02)',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTrend(theme)}
                className={`px-6 py-4 bg-zinc-950 border rounded-2xl text-[9px] font-[1000] transition-all text-left group flex items-center gap-4 ${
                  index === 0 ? 'border-[#00FBFF]/30 text-white shadow-[0_0_20px_rgba(0,251,255,0.05)]' : 'border-white/5 text-zinc-500'
                }`}
              >
                <Hash size={12} className={index === 0 ? 'text-[#00FBFF]' : 'text-zinc-800'} />
                <span className="tracking-[0.2em] italic uppercase">{theme}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 📡 EXPLORADOR DE NODOS ACTIVOS */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Activity size={16} style={{ color: activeColor }} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">
            Nodos_Activos_En_Red
          </span>
        </div>

        <div className="grid gap-6">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
              onClick={() => onJoinSession(session.id)}
              className="group relative p-8 bg-zinc-950/60 border border-white/5 rounded-[2.5rem] flex items-center justify-between cursor-pointer backdrop-blur-3xl transition-all overflow-hidden"
            >
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 group-hover:w-3" 
                style={{ 
                  backgroundColor: session.themeColor, 
                  boxShadow: `0 0 40px ${session.themeColor}` 
                }}
              />

              <div className="pl-6 flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h4 className="font-[1000] italic uppercase text-2xl md:text-3xl tracking-tighter text-zinc-600 group-hover:text-white transition-colors">
                    {session.name}
                  </h4>
                  {session.time === 'LIVE' && (
                    <div className="flex items-center gap-2 bg-[#00FBFF]/10 px-4 py-1 rounded-full border border-[#00FBFF]/20 animate-pulse">
                      <Zap size={10} className="text-[#00FBFF] fill-[#00FBFF]" />
                      <span className="text-[8px] font-black text-[#00FBFF] uppercase tracking-widest">Live</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">
                  <span className="flex items-center gap-2 group-hover:text-zinc-400">
                    <Clock size={12} /> {session.time}
                  </span>
                  <span className="flex items-center gap-2 group-hover:text-zinc-400">
                    <Users size={12} /> {session.participants}/{session.maxParticipants} NODOS
                  </span>
                  <span className="opacity-20 italic lowercase group-hover:opacity-60">
                    host_{session.host}
                  </span>
                </div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center transition-all group-hover:bg-white group-hover:rotate-90 shadow-xl">
                <ChevronRight size={20} className="text-zinc-600 group-hover:text-black" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💳 CONTROL DE ACCESO (ADMIN vs PARTICIPANTE) */}
      <footer className="pt-8">
        {isAdmin ? (
          <motion.button
            whileHover={{ scale: 1.01, borderColor: `${activeColor}44` }}
            whileTap={{ scale: 0.99 }}
            onClick={onCreateFutureSession}
            className="w-full py-16 border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center gap-6 group transition-all bg-zinc-950/20 hover:bg-zinc-950/40"
          >
            <div className="p-6 bg-zinc-950 rounded-3xl border border-white/5 group-hover:border-white/20 transition-all shadow-2xl">
              <CalendarDays size={32} className="text-zinc-800 group-hover:text-white" />
            </div>
            <div className="text-center space-y-3">
              <span className="text-[12px] font-black uppercase tracking-[0.8em] text-zinc-700 group-hover:text-white block">
                NUEVA_SESIÓN_MAESTRA
              </span>
              <p className="text-[8px] font-bold text-zinc-800 uppercase tracking-widest italic">
                 Operador: {user?.name || 'ADMIN_TECNICO'} // Acceso Ilimitado
              </p>
            </div>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.01, borderColor: `#00FBFF44` }}
            whileTap={{ scale: 0.99 }}
            // ✅ Integración Mercado Pago: $20 MXN por bloque de 20 min
            onClick={() => window.open('https://mpago.la/2fPScDJ', '_blank')}
            className="w-full py-16 border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center gap-6 group transition-all bg-[#00FBFF]/5 hover:bg-[#00FBFF]/10 shadow-[0_0_50px_rgba(0,251,255,0.02)]"
          >
            <div className="p-6 bg-zinc-950 rounded-3xl border border-[#00FBFF]/20 group-hover:border-[#00FBFF]/50 shadow-2xl">
              <CreditCard size={32} className="text-[#00FBFF] opacity-50 group-hover:opacity-100" />
            </div>
            <div className="text-center space-y-3">
              <span className="text-[12px] font-black uppercase tracking-[0.8em] text-[#00FBFF] block">
                DESBLOQUEAR_PROTOCOLO_VOZ
              </span>
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest italic">
                Sincronización Mercado Pago // Ciclo de 20 min
              </p>
            </div>
          </motion.button>
        )}
      </footer>
    </div>
  );
};

const Hash: React.FC<{ size?: number, className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);

export default SessionList;