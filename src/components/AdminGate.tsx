/**
 * ⛩️ ADMIN_GATE v2026.PROD - MENCIONAL
 * Función: Terminal de validación y blindaje contra intrusos.
 * Ubicación: /src/components/AdminGate.tsx
 * Clave Maestra: "osos"
 * ✅ PROTOCOLO: Strike-3 Hardware Ban
 * ✅ ESTÉTICA: OLED Absolute Black + Neon Cyan (#00FBFF)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Fingerprint, Lock, ShieldCheck, Loader2 } from 'lucide-react';

interface AdminGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Activa privilegios maestros (Admin)
}

export const AdminGate: React.FC<AdminGateProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  // 🛡️ PROTOCOLO DE SEGURIDAD: Verificación de ban por Hardware ID (LocalStorage)
  useEffect(() => {
    const banStatus = localStorage.getItem('mencional_hw_ban');
    if (banStatus === 'true') setIsBanned(true);
  }, []);

  /**
   * 🚫 PANTALLA DE BLOQUEO CRÍTICO (BAN)
   * Se dispara tras 3 intentos fallidos consecutivos.
   */
  if (isBanned) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center p-12 text-center font-sans italic"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.18),transparent_70%)]" />
        <AlertTriangle size={100} className="text-rose-600 mb-10 animate-pulse relative z-10" />
        <h1 className="text-6xl md:text-8xl font-[1000] text-white uppercase tracking-tighter relative z-10 leading-[0.9]">
          TERMINAL<br /><span className="text-rose-600">BLOQUEADA</span>
        </h1>
        <p className="text-zinc-700 text-[10px] mt-10 uppercase tracking-[0.6em] font-[1000] relative z-10">
          HARDWARE_ID: MENCIONAL-V26-STRIKE-3
        </p>
        <div className="mt-16 h-[2px] w-48 bg-rose-950 relative z-10 overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-1/2 h-full bg-rose-600"
          />
        </div>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || isProcessing) return;
    
    setIsProcessing(true);
    setError(false);

    // Latencia de Seguridad Neural (Sincronía con /services/ai/)
    await new Promise(resolve => setTimeout(resolve, 1800));

    // ✅ VALIDACIÓN DE CLAVE MAESTRA
    if (passcode.toLowerCase() === 'osos') {
      localStorage.setItem('mencional_admin_auth', 'true'); 
      setPasscode('');
      setAttempts(0);
      onSuccess(); 
      onClose();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(true);
      setPasscode('');
      
      // 🚫 AUTO-BLOQUEO: Protocolo Strike 3
      if (newAttempts >= 3) {
        localStorage.setItem('mencional_hw_ban', 'true');
        setIsBanned(true);
      }
    }
    setIsProcessing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl font-sans italic"
        >
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div 
            initial={{ scale: 0.85, y: 50, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.85, y: 50, opacity: 0 }}
            className="w-full max-w-lg bg-zinc-950 border border-white/5 rounded-[4rem] p-12 md:p-16 relative shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden"
          >
            {/* Efecto de Energía OLED (Cian #00FBFF) */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#00FBFF]/10 blur-[100px] rounded-full" />

            <div className="flex justify-between items-center mb-16 relative z-10">
              <div className="flex items-center gap-4">
                <Lock size={14} className="text-[#00FBFF]" />
                <span className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.5em]">Admin_Vault_v26</span>
              </div>
              <button 
                onClick={onClose} 
                className="p-4 bg-zinc-900/50 hover:bg-rose-500/20 rounded-full transition-all text-zinc-700 hover:text-rose-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center mb-12 relative z-10">
              <motion.div 
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                className={`inline-block p-10 rounded-[3rem] mb-8 transition-all duration-700 ${
                  error 
                  ? 'bg-rose-600/10 text-rose-600 shadow-[0_0_80px_rgba(225,29,72,0.2)]' 
                  : 'bg-[#00FBFF]/5 text-[#00FBFF] shadow-[0_0_80px_rgba(0,251,255,0.15)]'
                }`}
              >
                {error ? <AlertTriangle size={48} /> : <Fingerprint size={48} className="animate-pulse" />}
              </motion.div>
              
              <h2 className="text-5xl font-[1000] text-white uppercase tracking-tighter leading-none">
                {error ? 'ACCESO_DENEGADO' : 'NODO_MAESTRO'}
              </h2>
              <p className={`text-[10px] mt-6 uppercase tracking-[0.6em] font-[1000] transition-colors ${error ? 'text-rose-600' : 'text-zinc-600'}`}>
                {attempts > 0 ? `INTENTO_MAESTRO: ${attempts}/3` : 'IDENTIFICACIÓN: REQUERIDA'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              <div className="relative">
                <input
                  autoFocus
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setError(false);
                    setPasscode(e.target.value);
                  }}
                  className={`w-full bg-black border-2 rounded-[2.5rem] px-8 py-10 text-center text-5xl font-mono tracking-[0.8em] text-white outline-none transition-all ${
                    error ? 'border-rose-900 text-rose-600' : 'border-white/5 focus:border-[#00FBFF]/30'
                  }`}
                  placeholder="••••"
                />
              </div>

              <button 
                type="submit" 
                disabled={isProcessing} 
                className={`w-full py-8 rounded-[2.5rem] font-[1000] uppercase text-[12px] tracking-[0.5em] transition-all flex items-center justify-center gap-5 ${
                  isProcessing 
                  ? 'bg-zinc-900 text-zinc-800 cursor-wait' 
                  : 'bg-white text-black hover:bg-[#00FBFF] active:scale-95 shadow-2xl shadow-white/5'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>VERIFICANDO_AI_CORE...</span>
                  </>
                ) : (
                  'SOLICITAR_PRIVILEGIOS'
                )}
              </button>
            </form>

            <div className="mt-16 flex flex-col items-center gap-5 opacity-30 relative z-10">
              <div className="flex items-center gap-3">
                <ShieldCheck size={14} className="text-[#00FBFF]" />
                <span className="text-[8px] font-[1000] uppercase tracking-[0.7em]">Mencional_Security_Engine /ai/</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminGate;