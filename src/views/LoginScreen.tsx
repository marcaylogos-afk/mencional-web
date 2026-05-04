/** * 🔐 MENCIONAL | LOGIN & CONFIG v2.6 
 * ✅ DIRECTORIO AI: /src/services/ai/ (Sincronizado: Es ai, no ia)
 * ✅ LOGO: Desde /public/logo.png.png
 * ✅ TEMAS TREND: Generados por usuarios en español
 * ✅ SELECCIÓN: Idioma, Grupo (Individual/Dúo/Trío) y 10 Colores OLED
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { logger } from '../utils/logger';

// --- 🌐 CONFIGURACIÓN DE IDIOMAS ---
const LANGUAGES = [
  { code: 'en-US', name: 'Inglés (Prioritario)' },
  { code: 'fr-FR', name: 'Francés' },
  { code: 'de-DE', name: 'Alemán' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'pt-BR', name: 'Portugués' },
  { code: 'es-MX', name: 'Español' },
  { code: 'auto', name: 'Detectar Idioma' }
];

// --- 🎨 PALETA DE 10 COLORES NEÓN (OLED-Ready) ---
const PALETTE_10 = [
  '#39FF14', // Verde Neón
  '#00FBFF', // Cian
  '#FF00FB', // Magenta
  '#FFFF00', // Amarillo
  '#FF3131', // Rojo
  '#FFFFFF', // Blanco
  '#8A2BE2', // Violeta
  '#FFD700', // Dorado
  '#00FFAB', // Turquesa
  '#FF5E00'  // Naranja
];

// --- 📈 TEMAS TREND & SESIONES FUTURAS ---
const TREND_SESSIONS = [
  { topic: "Cena_Networking", phrase: "Me gustaría proponer una colaboración profesional" },
  { topic: "Viaje_Tokyo", phrase: "Busco recomendaciones de lugares tradicionales" },
  { topic: "Arquitectura_Sustentable", phrase: "El diseño OLED optimiza el consumo de energía" }
];

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const [step, setStep] = useState<'WELCOME' | 'CONFIG'>('WELCOME');

  const handleStartSession = () => {
    logger.info("NAVIGATION", "Entrando al Dashboard Principal desde el nodo /ai/");
    navigate('/learning-live');
  };

  return (
    <div className="bg-[#000000] min-h-screen text-white p-6 flex flex-col items-center font-sans overflow-y-auto">
      
      {/* 🟢 LOGO E IDENTIDAD MENCIONAL */}
      <div className="flex flex-col items-center mt-10 mb-8">
        <img 
          src="/logo.png" 
          className="w-20 h-20 mb-4 animate-pulse" 
          alt="Mencional Logo" 
        />
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Mencional</h1>
        <p className="text-[8px] font-bold tracking-[0.5em] text-zinc-600 uppercase mt-2">Neural_Immersion_v2.6</p>
      </div>

      {step === 'WELCOME' ? (
        <div className="w-full max-w-md space-y-6">
          {/* SECCIÓN DE TENDENCIAS (Generadas por participantes) */}
          <div className="grid grid-cols-1 gap-4">
            <p className="text-[10px] font-black opacity-40 tracking-[0.3em] ml-2">TENDENCIAS_DE_SESIONES</p>
            {TREND_SESSIONS.map((trend) => (
              <button 
                key={trend.topic}
                onClick={() => {
                  updateSettings({ sessionName: trend.topic, activeTopic: trend.topic });
                  setStep('CONFIG');
                }}
                className="bg-zinc-950 border border-zinc-900 p-6 rounded-[2rem] text-left hover:border-[#39FF14] transition-all group"
              >
                <h3 className="text-xl font-black text-[#39FF14] uppercase">{trend.topic}</h3>
                <p className="text-sm text-zinc-500 italic mt-1 group-hover:text-white">"{trend.phrase}"</p>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setStep('CONFIG')}
            className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-[#39FF14] transition-colors"
          >
            Configurar Sesión de 1 Hora ($90 MXN)
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xl bg-zinc-950 p-10 rounded-[3rem] border border-zinc-900 space-y-8 mb-10">
          
          {/* 1. SELECCIÓN DE GRUPO (Individual/Dúo/Trío) */}
          <div className="space-y-4">
            <p className="text-[10px] font-black opacity-40 tracking-[0.2em]">MODO_PARTICIPACIÓN</p>
            <div className="flex gap-4">
              {['Individual', 'Dúo', 'Trío'].map(mode => (
                <button 
                  key={mode}
                  onClick={() => updateSettings({ groupMode: mode as any })}
                  className={`flex-1 py-4 rounded-2xl border font-bold transition-all ${
                    settings.groupMode === mode 
                      ? 'border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14]' 
                      : 'border-zinc-800 text-zinc-500'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* 2. SELECCIÓN DE IDIOMA TARGET */}
          <div className="space-y-4">
            <p className="text-[10px] font-black opacity-40 tracking-[0.2em]">IDIOMA_TARGET</p>
            <select 
              className="w-full bg-black border border-zinc-800 p-4 rounded-2xl text-white outline-none focus:border-[#39FF14]"
              value={settings.targetLanguage}
              onChange={(e) => updateSettings({ targetLanguage: e.target.value })}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          {/* 3. PERSONALIZACIÓN OLED (10 Colores) */}
          <div className="space-y-4">
            <p className="text-[10px] font-black opacity-40 tracking-[0.2em]">PALETA_COLORES_OLED</p>
            <div className="flex flex-wrap gap-3">
              {PALETTE_10.map(color => (
                <button 
                  key={color} 
                  onClick={() => updateSettings({ themeColor: color })}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    settings.themeColor === color ? 'border-white' : 'border-transparent'
                  }`} 
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* 4. IDENTIDAD DEL PARTICIPANTE */}
          <div className="space-y-4">
            <p className="text-[10px] font-black opacity-40 tracking-[0.2em]">IDENTIDAD_ROOT</p>
            <input 
              type="text" 
              placeholder="TU_NOMBRE_FICTICIO"
              className="w-full bg-black border border-zinc-800 p-4 rounded-2xl text-white focus:border-[#39FF14] outline-none"
              value={settings.userAlias}
              onChange={(e) => updateSettings({ userAlias: e.target.value })}
            />
          </div>

          {/* 🟢 BOTÓN DE INICIO INMEDIATO */}
          <button 
            onClick={handleStartSession}
            className="w-full py-6 bg-[#39FF14] text-black rounded-2xl font-[1000] uppercase shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:scale-[1.02] transition-transform"
          >
            Iniciar Sesión Inmediata
          </button>
          
          <button 
            onClick={() => setStep('WELCOME')}
            className="w-full text-[10px] font-black text-zinc-600 uppercase tracking-widest"
          >
            ‹ Regresar a Tendencias
          </button>
        </div>
      )}

      {/* FOOTER TÉCNICO */}
      <footer className="mt-auto py-10 opacity-20 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="text-[7px] font-black uppercase tracking-[0.4em]">Services_Node: /src/services/ai/</span>
        </div>
        <div className="flex gap-2">
          {['#IA_COSTO_BENEFICIO', '#NETWORKING_PREMIUM', '#SINCRO_NEURAL', '#MERCADOPAGO_V2'].map(tag => (
            <span key={tag} className="text-[6px] border border-white/20 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default LoginScreen; // Exportación por defecto para evitar SyntaxError