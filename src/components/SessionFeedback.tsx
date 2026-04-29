/**
 * ⚖️ MENCIONAL | SESSION_FEEDBACK v18.0
 * Protocolo de Integridad: Reporte de conducta, Lista de Exclusión y Bloqueo de Nodo.
 * Función: Evaluar participantes al cierre de sesión para mitigar reincidencias.
 * Ubicación: /src/components/interpreter/SessionFeedback.tsx
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserX, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  Users, 
  Loader2, 
  ArrowRight 
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
}

interface SessionFeedbackProps {
  /** Lista de participantes activos al cierre de la sesión */
  participants: Participant[];
  /** Callback disparado tras la sincronización del reporte */
  onFinish: (reports: string[]) => void;
}

const SessionFeedback: React.FC<SessionFeedbackProps> = ({ participants, onFinish }) => {
  const [negatives, setNegatives] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gestión de selección con feedback táctico
  const toggleNegative = useCallback((id: string) => {
    // Implementación de vibración ligera si el dispositivo lo soporta
    if (navigator.vibrate) navigator.vibrate(10);
    
    setNegatives(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const handleFinalize = async () => {
    setIsSubmitting(true);
    
    /**
     * 🛡️ LÓGICA DE EXCLUSIÓN PERMANENTE (Shield_Node)
     * Persistencia en Blacklist local sincronizada con el motor de emparejamiento.
     */
    try {
      const existingExclusions = JSON.parse(localStorage.getItem('mencional_blacklist') || "[]");
      const updatedExclusions = Array.from(new Set([...existingExclusions, ...negatives]));
      localStorage.setItem('mencional_blacklist', JSON.stringify(updatedExclusions));
      
      // Simulación de latencia de red para telemetría de seguridad
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      onFinish(negatives);
    } catch (err) {
      console.error("Shield_Node_Critical_Error: Fallo en persistencia de integridad.");
      onFinish(negatives); // Failsafe: terminar incluso con error de guardado
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[999] flex items-center justify-center p-4 md:p-6 overflow-hidden font-sans select-none">
      
      {/* HUD GLOW DE SEGURIDAD */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.1),transparent_70%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-[#050505] border border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.9)] relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isSubmitting ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 md:py-24 flex flex-col items-center justify-center gap-8 text-center"
            >
              <div className="relative">
                 <Loader2 size={48} className="text-rose-500 animate-spin" />
                 <div className="absolute inset-0 blur-2xl bg-rose-500/30 animate-pulse" />
              </div>
              <div className="space-y-3">
                <h4 className="text-[11px] font-[1000] uppercase tracking-[0.5em] text-white">Sincronizando_Reporte</h4>
                <p className="text-[9px] text-zinc-600 uppercase font-bold italic tracking-widest">Shield_Node actualizando blacklist...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10"
            >
              <header className="mb-10 text-center">
                <div className="inline-flex p-4 bg-rose-500/5 rounded-[1.5rem] border border-rose-500/10 mb-6">
                  <ShieldAlert size={30} className="text-rose-600" />
                </div>
                <h3 className="text-3xl md:text-4xl font-[1000] uppercase italic tracking-tighter text-white leading-none">
                  Integridad
                </h3>
                <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.4em] mt-3">
                  Protocolo_Seguro // v18.0
                </p>
              </header>
              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-5 px-2">
                   <div className="flex items-center gap-3">
                     <Users size={14} className="text-zinc-600" />
                     <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Participantes</p>
                   </div>
                   <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20 tabular-nums">
                     {negatives.length.toString().padStart(2, '0')} MARCADOS
                   </span>
                </div>
                
                <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                  {participants.length > 0 ? (
                    participants.map((p, idx) => (
                      <motion.div 
                        key={p.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => toggleNegative(p.id)}
                        className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                          negatives.includes(p.id) 
                            ? 'bg-rose-500/10 border-rose-500/40 shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]' 
                            : 'bg-zinc-900/20 border-white/5 hover:border-white/10 hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${negatives.includes(p.id) ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]' : 'bg-zinc-800 group-hover:bg-zinc-600'}`} />
                          <span className={`font-black italic uppercase tracking-tighter text-sm transition-colors ${
                            negatives.includes(p.id) ? 'text-white' : 'text-zinc-500'
                          }`}>
                            {p.name}
                          </span>
                        </div>
                        <div className={`p-2 rounded-xl transition-all duration-500 ${
                            negatives.includes(p.id) 
                              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 rotate-0' 
                              : 'bg-zinc-900 text-zinc-700 -rotate-12 group-hover:rotate-0'
                          }`}>
                          <UserX size={16} />
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-10 text-center border border-dashed border-white/5 rounded-[2rem] bg-zinc-950/50">
                       <CheckCircle2 size={24} className="mx-auto mb-3 text-zinc-800" />
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 italic">
                         Canal_Limpio_Detectado
                       </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-zinc-950/80 border border-white/5 p-5 rounded-[1.5rem] mb-8 flex gap-4 items-start relative overflow-hidden">
                <Info size={16} className="text-rose-500/50 shrink-0 mt-0.5" />
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight leading-relaxed italic">
                  "La exclusión vincula el ID del dispositivo al Shield_Node. Los perfiles marcados no volverán a coincidir en tu flujo."
                </p>
              </div>

              <button
                onClick={handleFinalize}
                disabled={isSubmitting}
                className="w-full group bg-white text-black py-5 rounded-2xl flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all duration-500 active:scale-[0.98] disabled:opacity-50"
              >
                Finalizar_Transmisión
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f43f5e; }
      `}</style>
    </div>
  );
};

export default React.memo(SessionFeedback);