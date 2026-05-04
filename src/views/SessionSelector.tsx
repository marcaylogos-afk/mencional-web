/** 🎛️ MENCIONAL | SESSION_SELECTOR v2026.PROD
 * Función: Configuración pre-inmersión y acceso directo a modos.
 * Estética: OLED High-Contrast con Azul Claro Neón (#00FBFF).
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Palette, 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  Target 
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import speechService from '../services/ai/speechService'; 
import { logger } from '../utils/logger';

const AVAILABLE_LANGUAGES = [
  { code: 'en-US', name: 'Inglés (Prioritario)', flag: '🇺🇸' },
  { code: 'fr-FR', name: 'Francés', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Alemán', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portugués', flag: '🇧🇷' },
  { code: 'es-MX', name: 'Español', flag: '🇲🇽' }
];

const SessionSelector: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const [trends, setTrends] = useState<string[]>([]);

  const oledColors = [
    '#00FBFF', '#39FF14', '#FF00F5', '#FFFF00', '#FF3131', 
    '#A855F7', '#FF9900', '#00FFAB', '#FFFFFF', '#71717A'
  ];

  useEffect(() => {
    setTrends([
      "Networking para perfiles Tech",
      "Inglés para negociaciones rápidas",
      "Frases para romper el hielo en cenas",
      "Sincronización Aoede: Voces Nativas",
      "Terminología AI y Machine Learning"
    ]);
    
    if (!settings.userAlias) {
      speechService.speak("Identificador de nodo requerido.", 'es-MX');
    }
  }, []);

  const handleStartSession = async () => {
    const mode = settings.activeMode || 'learning';
    
    // ✅ BYPASS DE SESIÓN: Acceso directo sin test obligatorio
    try {
      const messages: Record<string, string> = {
        learning: "Iniciando Modo Aprendizaje.",
        ultra: "Ultra-Mencional sincronizado.",
        rompehielo: "Modo Rompehielo activo."
      };

      await speechService.speak(messages[mode] || "Sincronizando.", 'es-MX');
      logger.info("SESSION_START", `Acceso directo a ${mode}`);
      navigate(`/${mode}`); 
    } catch (error) {
      navigate(`/${mode}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white p-6 md:p-12 flex flex-col font-sans italic overflow-y-auto selection:bg-[#00FBFF] selection:text-black">
      
      {/* HEADER: Identidad OLED + Botón de Pulido Diario */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-[#00FBFF]/10 rounded-2xl flex items-center justify-center border border-[#00FBFF]/20 shadow-[0_0_30px_rgba(0,251,255,0.15)]">
            <Zap size={32} className="text-[#00FBFF] fill-[#00FBFF]" />
          </div>
          <div>
            <h1 className="text-5xl font-[1000] tracking-tighter uppercase text-[#00FBFF]">Mencional</h1>
            <div className="flex items-center gap-2">
               <p className="text-[8px] tracking-[0.8em] text-zinc-600 font-black uppercase">Core_Neural_v2.6</p>
               {/* 🧠 BOTÓN DE PULIDO DIARIO (Opcional) */}
               <button 
                 onClick={() => navigate('/evaluation')}
                 className="flex items-center gap-1 px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full hover:border-[#39FF14] transition-colors group"
               >
                 <BrainCircuit size={10} className="text-zinc-500 group-hover:text-[#39FF14]" />
                 <span className="text-[7px] font-black text-zinc-500 group-hover:text-[#39FF14] uppercase">Entrenamiento_Neural</span>
               </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-4 space-y-1 focus-within:border-[#00FBFF] transition-colors shadow-2xl w-full md:w-72">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Operador_ID</span>
            <input 
              type="text" 
              value={settings.userAlias || ''}
              className="bg-transparent w-full text-sm font-black uppercase tracking-widest outline-none text-[#39FF14] placeholder:text-zinc-800"
              placeholder="MAINFRAME_USER"
              onChange={(e) => updateSettings({ userAlias: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
        
        {/* COLUMNA 1: FUNCIÓN */}
        <section className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-4 border-l-4 border-[#00FBFF] pl-4">
            <h2 className="text-[#00FBFF] uppercase text-[10px] font-black tracking-[0.4em]">01_Protocolo_Inmersión</h2>
          </div>
          <div className="grid gap-4">
            {[
              { id: 'learning', label: 'Modo Aprendizaje', desc: 'Traducción 100% + Audio' },
              { id: 'ultra', label: 'Ultra Intérprete', desc: 'Inmersión Selectiva (Neural)', icon: <Target size={14}/> },
              { id: 'rompehielo', label: 'Modo Rompehielo', desc: 'Social Trend Suggestions' }
            ].map((m) => (
              <button 
                key={m.id}
                onClick={() => updateSettings({ activeMode: m.id as any })}
                className={`p-6 rounded-[2rem] border transition-all text-left relative overflow-hidden group ${
                  settings.activeMode === m.id 
                  ? 'border-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_30px_rgba(57,255,20,0.05)]' 
                  : 'border-zinc-900 hover:border-zinc-700 opacity-40'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <span className="font-black uppercase text-xs tracking-wider text-white">{m.label}</span>
                   {m.id === 'ultra' && <span className="text-[#00FBFF]">{m.icon}</span>}
                </div>
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-tight">{m.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* COLUMNA 2: CONFIGURACIÓN */}
        <section className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-4 border-l-4 border-[#00FBFF] pl-4">
            <h2 className="text-[#00FBFF] uppercase text-[10px] font-black tracking-[0.4em]">02_Parámetros_Físicos</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <button 
                  key={lang.code}
                  onClick={() => updateSettings({ targetLanguage: lang.code })}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                    settings.targetLanguage === lang.code 
                    ? 'border-white bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                    : 'border-zinc-900 opacity-40 hover:opacity-100'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-[9px] font-black uppercase tracking-tighter">{lang.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <div className="p-6 bg-zinc-950 rounded-[2.5rem] border border-zinc-900 space-y-4">
               <div className="flex items-center gap-2 mb-2">
                 <Palette size={12} className="text-zinc-600" />
                 <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Espectro_OLED</span>
               </div>
               <div className="grid grid-cols-5 gap-3">
                {oledColors.map((c) => (
                  <button 
                    key={c} 
                    onClick={() => updateSettings({ themeColor: c })}
                    className="h-8 w-8 rounded-full transition-transform hover:scale-125 border-2"
                    style={{ backgroundColor: c, borderColor: settings.themeColor === c ? 'white' : 'transparent' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COLUMNA 3: TRENDS Y ACCIÓN */}
        <section className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex items-center gap-4 border-l-4 border-[#00FBFF] pl-4">
            <h2 className="text-[#00FBFF] uppercase text-[10px] font-black tracking-[0.4em]">03_Telemetría_Trend</h2>
          </div>
          
          <div className="bg-zinc-950/50 rounded-[3rem] p-6 border border-zinc-900 flex-1 space-y-3 overflow-hidden">
            {trends.map((phrase, i) => (
              <motion.button 
                whileHover={{ x: 5 }}
                key={i}
                onClick={() => updateSettings({ currentTopic: phrase })}
                className="w-full p-4 bg-black border border-zinc-900 rounded-2xl text-left hover:border-[#00FBFF]/40 transition-all group"
              >
                <p className="text-[10px] font-black text-zinc-600 group-hover:text-white transition-colors uppercase">
                   {phrase}
                </p>
              </motion.button>
            ))}
          </div>

          <button 
            onClick={handleStartSession}
            disabled={!settings.userAlias}
            className="w-full py-10 bg-[#39FF14] text-black rounded-[2.5rem] font-[1000] uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(57,255,20,0.15)] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
          >
            Inicializar_Inmersión <ChevronRight size={20} strokeWidth={3} />
          </button>
        </section>
      </main>

      <footer className="mt-auto border-t border-zinc-900 pt-8 flex justify-between items-center opacity-30">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-[1em] text-[#00FBFF]">Mencional_System_v2.6</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={10} className="text-[#39FF14]" />
          <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">
            {settings.role === 'admin' ? 'MASTER_ACCESS_GRANTEED' : 'OPERATOR_MODE'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default SessionSelector;