/**
 * 🎛️ MENCIONAL | SESSION_SELECTOR v2026.PROD
 * Función: Configuración pre-inmersión obligatoria (Mencional, Ultra, Rompehielo).
 * Estética: OLED High-Contrast con Azul Claro Neón Bold (#00FBFF).
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 * ✅ RESPONSIVE: Scroll habilitado y padding de seguridad para móviles.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Activity } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

/** 🎙️ SERVICIOS SINCRONIZADOS: Ruta corregida a /ai/ */
import speechService from '../services/ai/speechService'; 
import translateCache from '../services/ai/translateCache'; 
import { logger } from '../utils/logger';

const AVAILABLE_LANGUAGES = [
  { code: 'en-US', name: 'Inglés', flag: '🇺🇸' },
  { code: 'fr-FR', name: 'Francés', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Alemán', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portugués', flag: '🇧🇷' },
  { code: 'es-MX', name: 'Español', flag: '🇲🇽' },
  { code: 'auto', name: 'Detectar', flag: '🛰️' }
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
    // Sincronización con caché de tendencias AI
    const localizedTrends = translateCache.getTrendingPhrases?.() || [
      "¿Cómo sonar más natural en juntas?",
      "Preparación para entrevistas IT",
      "Inglés para negociaciones rápidas",
      "Frases de networking",
      "Sincronización Aoede"
    ];
    setTrends(localizedTrends);
  }, []);

  const handleStartSession = async () => {
    const mode = settings.activeMode || 'learning';
    try {
      if (mode === 'learning') {
        await speechService.speak("Iniciando Modo Mencional.", { lang: 'es-MX', rate: 1.1 });
        navigate('/learning'); 
      } else if (mode === 'ultra') {
        await speechService.speak("Ultra-Mencional sincronizado.", { lang: 'es-MX', rate: 1.1 });
        navigate('/ultra'); 
      } else if (mode === 'rompehielo') {
        await speechService.speak("Modo Rompehielo activo.", { lang: 'es-MX', rate: 1.1 });
        navigate('/rompehielo');
      }
      logger.info("SESSION_START", `Modo ${mode} iniciado.`);
    } catch (error) {
      logger.error("AUDIO_FAULT", "Fallo en feedback inicial", error);
      const backupPath = mode === 'learning' ? '/learning' : mode === 'ultra' ? '/ultra' : '/rompehielo';
      navigate(backupPath);
    }
  };

  return (
    /* ✅ FIX: 'h-full overflow-y-auto' permite el scroll en móviles con notch/barras de navegación */
    <div className="h-full min-h-screen w-full bg-black text-white p-6 flex flex-col font-sans select-none italic overflow-y-auto overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-scanlines" />

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-6">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Mencional" className="w-12 h-12 object-contain drop-shadow-[0_0_20px_rgba(0,251,255,0.3)]" />
          <h1 className="text-3xl font-[1000] tracking-tighter uppercase text-[#00FBFF]">Mencional</h1>
        </div>
        
        <div className="flex flex-col items-end w-full md:w-auto">
          <label className="text-[#00FBFF] text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Identificador_Ficticio</label>
          <input 
            type="text" 
            placeholder="NODO_MAESTRO"
            value={settings.userAlias || ''}
            className="bg-zinc-950 border-2 border-[#00FBFF]/30 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:border-[#39FF14] outline-none text-[#39FF14] w-full md:w-48 transition-all placeholder:text-[#00FBFF]/20"
            onChange={(e) => updateSettings({ userAlias: e.target.value })}
          />
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1 relative z-10 pb-20">
        {/* COLUMNA 1: FUNCIÓN Y GRUPO */}
        <section className="space-y-10 text-left">
          <div className="space-y-4">
            <span className="text-[#00FBFF] uppercase text-[11px] font-black tracking-[0.4em] block border-b border-[#00FBFF]/20 pb-2">1. Función_Nodo</span>
            <div className="grid gap-3">
              {[
                { id: 'learning', label: 'Mencional (Aprendizaje)' },
                { id: 'ultra', label: 'Ultra-Mencional' },
                { id: 'rompehielo', label: 'Rompehielo' }
              ].map((m) => (
                <button 
                  key={m.id}
                  onClick={() => updateSettings({ activeMode: m.id as any })}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                    settings.activeMode === m.id 
                    ? 'border-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_15px_rgba(57,255,20,0.15)]' 
                    : 'border-zinc-900 hover:border-[#00FBFF]/50'
                  }`}
                >
                  <span className={`block font-black uppercase text-xs tracking-wider ${settings.activeMode === m.id ? 'text-white' : 'text-[#00FBFF]'}`}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[#00FBFF] uppercase text-[11px] font-black tracking-[0.4em] block border-b border-[#00FBFF]/20 pb-2">2. Configuración_Grupo</span>
            <div className="flex gap-2">
              {['Individual', 'Dúo', 'Trío'].map((g) => (
                <button 
                  key={g}
                  onClick={() => updateSettings({ groupMode: g as any })}
                  className={`flex-1 py-4 rounded-xl border-2 font-black text-[11px] uppercase transition-all duration-300 ${
                    settings.groupMode === g 
                    ? 'border-[#00FBFF] bg-[#00FBFF] text-black' 
                    : 'border-zinc-800 text-[#00FBFF] hover:border-[#00FBFF]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* COLUMNA 2: IDIOMA Y ESTÉTICA */}
        <section className="space-y-10 text-left">
          <div className="space-y-4">
            <span className="text-[#00FBFF] uppercase text-[11px] font-black tracking-[0.4em] block border-b border-[#00FBFF]/20 pb-2">3. Idioma_Prioritario</span>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <button 
                  key={lang.code}
                  onClick={() => updateSettings({ targetLanguage: lang.code })}
                  className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 ${
                    settings.targetLanguage === lang.code 
                    ? 'border-cyan-400 bg-cyan-400/5 shadow-[0_0_15px_rgba(0,251,255,0.1)]' 
                    : 'border-zinc-900 opacity-60 hover:border-[#00FBFF]/50'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-[#00FBFF]">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[#00FBFF] uppercase text-[11px] font-black tracking-[0.4em] block border-b border-[#00FBFF]/20 pb-2">4. Estética_OLED</span>
            <div className="grid grid-cols-5 gap-2">
              {oledColors.map((c) => (
                <button 
                  key={c} 
                  onClick={() => updateSettings({ themeColor: c })}
                  className="h-10 rounded-xl transition-all hover:scale-110 border-2"
                  style={{ backgroundColor: c, borderColor: settings.themeColor === c ? 'white' : 'transparent' }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* COLUMNA 3: SUGERENCIAS Y ACCIÓN FINAL */}
        <section className="space-y-10 flex flex-col justify-between text-left">
          <div className="space-y-4">
            <span className="text-[#00FBFF] uppercase text-[11px] font-black tracking-[0.4em] block border-b border-[#00FBFF]/20 pb-2">5. Sugerencias_Trend_AI</span>
            <div className="space-y-2">
              {trends.map((phrase, i) => (
                <button 
                  key={i}
                  onClick={() => updateSettings({ currentTopic: phrase })}
                  className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-2xl text-left hover:border-[#00FBFF] transition-all group"
                >
                  <p className="text-[11px] font-black text-[#00FBFF] group-hover:text-white transition-colors italic leading-tight">
                    "{phrase}"
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative group">
               <label className="absolute -top-2 left-4 bg-black px-2 text-[#00FBFF] text-[9px] font-black uppercase tracking-widest z-20">Contexto_Sesión</label>
               <input 
                type="text" 
                placeholder="EJ. ENTREVISTA O NEGOCIOS" 
                value={settings.currentTopic || ''}
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-6 text-xs font-black uppercase tracking-widest outline-none focus:border-[#00FBFF] text-[#00FBFF] transition-all placeholder:text-[#00FBFF]/20"
                onChange={(e) => updateSettings({ currentTopic: e.target.value })}
              />
            </div>
            
            {/* ✅ BOTÓN CRÍTICO: py-8 y margin-bottom para asegurar visibilidad en móviles */}
            <button 
              onClick={handleStartSession}
              className="w-full py-10 mb-8 bg-[#39FF14] text-black rounded-3xl font-[1000] uppercase tracking-[0.4em] text-[13px] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-[0_10px_50px_rgba(57,255,20,0.3)] active:scale-95"
            >
              Iniciar_Sincronización <ChevronRight size={20} />
            </button>
          </div>
        </section>
      </main>

      <footer className="mt-auto pt-6 border-t border-[#00FBFF]/20 flex flex-col md:flex-row justify-between items-center opacity-40 gap-4 pb-10">
        <span className="text-[8px] font-black uppercase tracking-[1em] text-[#00FBFF]">Mencional_v2.6 // AI_ENGINE_PROD</span>
        <div className="flex gap-6 text-[8px] font-black uppercase tracking-widest text-[#00FBFF]">
            <span className="flex items-center gap-1"><Activity size={8}/> Latencia: 14ms</span>
            <span>Nodo: Maestro_Activo</span>
        </div>
      </footer>
    </div>
  );
};

export default SessionSelector;