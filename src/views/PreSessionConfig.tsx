/** 🛠️ MENCIONAL | PRE-SESSION CONFIGURATION v2026
 * Ubicación: /src/views/PreSessionConfig.tsx
 * Función: Configuración de parámetros antes del montaje del nodo AI.
 * ✅ VALIDACIÓN: Precio actualizado $90 MXN / 1 Hora.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Zap, Shield, FileText, ChevronRight, CreditCard } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const PreSessionConfig: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, palette10 } = useSettings();
  
  const [alias, setAlias] = useState(settings.userAlias);
  const [wantsPDF, setWantsPDF] = useState(false);

  const handleStart = () => {
    // 1. Guardar configuración inicial
    updateSettings({ 
      userAlias: alias,
      wantsPDF: wantsPDF,
      sessionActive: true,
      // Si el alias es 'osos', el updateSettings del Context activará el Admin Mode automáticamente
    });

    // 2. Redirección táctica
    if (alias.toLowerCase() === 'osos' || settings.role === 'admin') {
      navigate('/selector'); // El admin elige entre Learning, Ultra o Rompehielo
    } else {
      navigate('/payment'); // Los participantes van al checkout de $90 MXN
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6 font-sans italic">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* HEADER ELEGANTE */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full border border-zinc-800 bg-zinc-950 shadow-[0_0_20px_rgba(0,251,255,0.1)]">
              <Settings size={32} style={{ color: palette10[0] }} />
            </div>
          </div>
          <h1 className="text-3xl font-[1000] tracking-tighter uppercase text-zinc-100">
            Configuración <span style={{ color: palette10[0] }}>Pre-Nodo</span>
          </h1>
          <p className="text-[10px] font-mono text-zinc-600 tracking-[0.3em] uppercase">
            Protocolo v2.6 // Session_Initialization
          </p>
        </div>

        <div className="space-y-6 bg-zinc-950/50 p-8 rounded-[40px] border border-zinc-900 backdrop-blur-xl">
          
          {/* INPUT: ALIAS / BYPASS */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">
              Identificador / Alias
            </label>
            <input 
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Ej: Master_User"
              className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500 transition-all text-cyan-400 font-bold"
            />
          </div>

          {/* OPCIÓN: REPORTE PDF (Ahorro de Esfuerzo) */}
          <div 
            onClick={() => setWantsPDF(!wantsPDF)}
            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
              wantsPDF ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-zinc-900 bg-transparent'
            }`}
          >
            <div className={`p-2 rounded-lg ${wantsPDF ? 'bg-cyan-500' : 'bg-zinc-900'}`}>
              <FileText size={18} className={wantsPDF ? 'text-black' : 'text-zinc-600'} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold uppercase">Generar Reporte PDF</h4>
              <p className="text-[9px] text-zinc-600 italic">Recibe transcripción y glosario al finalizar.</p>
            </div>
          </div>

          {/* INFO DE TARIFA */}
          <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-zinc-800 opacity-60">
            <CreditCard size={16} className="text-zinc-500" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
              Sesión Estándar: $90 MXN / 60 MIN
            </span>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button 
            onClick={handleStart}
            disabled={!alias.trim()}
            className="w-full group relative flex items-center justify-between p-5 rounded-2xl bg-white text-black font-black uppercase text-xs overflow-hidden disabled:opacity-30"
          >
            <div className="absolute inset-0 bg-cyan-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              <Zap size={16} /> Inicializar Nodo
            </span>
            <ChevronRight size={18} className="relative z-10" />
          </button>
        </div>

        {/* FOOTER: SEGURIDAD */}
        <div className="flex justify-center items-center gap-6 text-[8px] font-black text-zinc-800 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Shield size={10}/> Encryption: AES-256</span>
          <span className="flex items-center gap-1"><Zap size={10}/> AI: Gemini Flash 2.0</span>
        </div>
      </motion.div>
    </div>
  );
};

export default PreSessionConfig;