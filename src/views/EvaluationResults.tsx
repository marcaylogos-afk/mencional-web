/** 📊 MENCIONAL | EVALUATION_RESULTS v2026.PROD
 * ✅ UPDATE: Visualización de palabras eliminadas del flujo de traducción.
 * ✅ ESTÉTICA: OLED Deep Black + Neon Typography.
 */
import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { Trophy, ArrowRight, RotateCcw, Activity, ShieldCheck, Zap } from 'lucide-react';

const EvaluationResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();

  // Recuperar palabras marcadas como dominadas en la sesión actual
  const learnedThisSession = location.state?.learnedWords || []; 
  const score = learnedThisSession.length;
  const total = location.state?.total || 5;
  const precision = total > 0 ? Math.round((score / total) * 100) : 0;

  const stats = useMemo(() => [
    { label: 'Fluidez', val: `${precision >= 80 ? 90 : 75}%`, color: '#39FF14' },
    { label: 'Precisión', val: `${precision}%`, color: '#A855F7' },
    { label: 'Sesión', val: settings?.sessionDuration === 60 ? '60:00' : '30:00', color: '#FFFFFF' }
  ], [precision, settings?.sessionDuration]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6 italic select-none font-sans overflow-x-hidden pt-20">
      
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60 z-0" />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md space-y-10 z-10"
      >
        {/* HEADER: NIVEL SINCRO */}
        <header className="text-center space-y-4">
          <div className="flex justify-center relative">
            <motion.div 
              animate={{ boxShadow: ["0 0 20px #39FF1433", "0 0 40px #39FF1466", "0 0 20px #39FF1433"] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 bg-black rounded-full flex items-center justify-center border border-[#39FF14]"
            >
              <Trophy size={32} className="text-[#39FF14]" />
            </motion.div>
            <ShieldCheck size={16} className="absolute bottom-0 right-[40%] text-[#00FBFF]" />
          </div>
          <h1 className="text-5xl font-[1000] tracking-tighter uppercase italic leading-none">
            Nivel_<span className="text-[#39FF14]">Sincro</span>
          </h1>
        </header>

        {/* 🧠 SECCIÓN DE NODOS ELIMINADOS (Lo nuevo) */}
        <section className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <span className="text-[8px] font-black text-zinc-500 tracking-[0.3em] uppercase">Traducciones_Eliminadas</span>
            <span className="text-[#00FBFF] text-xs font-bold">{score} Nodos</span>
          </div>
          
          <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-6 min-h-[120px] flex flex-wrap gap-2 items-center justify-center">
            <AnimatePresence>
              {learnedThisSession.length > 0 ? (
                learnedThisSession.map((word: string, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-4 py-2 bg-black border border-[#00FBFF]/30 text-[#00FBFF] rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <Zap size={10} fill="#00FBFF" /> {word}
                  </motion.span>
                ))
              ) : (
                <p className="text-zinc-700 text-[10px] uppercase font-bold tracking-tighter text-center italic">
                  No se detectaron nuevos nodos dominados.
                </p>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* MÉTRICAS SECUNDARIAS */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((item, i) => (
            <div key={i} className="bg-zinc-950/30 border border-zinc-900 py-4 rounded-[1.5rem] flex flex-col items-center">
              <span className="text-[6px] font-black text-zinc-600 uppercase tracking-widest mb-1">{item.label}</span>
              <span className="text-xl font-[1000]" style={{ color: item.color }}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* ACCIONES */}
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={() => navigate('/selector')}
            className="w-full py-6 bg-white text-black font-[1000] rounded-[2rem] uppercase italic flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            Nueva_Inmersión <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => navigate('/evaluation')}
            className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.5em] hover:text-white transition-colors"
          >
            [ RECALIBRAR_MAPA_NEURAL ]
          </button>
        </div>
      </motion.div>

      <footer className="fixed bottom-8 flex items-center gap-3 opacity-30">
        <Activity size={10} className="text-[#39FF14] animate-pulse" />
        <p className="text-[6px] font-black tracking-[1em] text-zinc-500 uppercase">Mencional_Neural_Clean_v2.6</p>
      </footer>
    </div>
  );
};

export default EvaluationResults;