/**
 * 🌎 MENCIONAL | LOGIN_LANGUAGE_HUB v20.0
 * Ubicación: /src/views/LoginPage.tsx
 * Función: Autenticación de Operador ("osos") y Selector de Inmersión.
 * ✅ DIRECTORIO AI: /src/services/ai/
 * Foco: Producción 2026 | OLED OPTIMIZED
 */

import React, { useState, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ShieldCheck, User, Zap, ChevronLeft, Lock } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext'; 
import { useNavigate } from 'react-router-dom';

interface Language {
  code: string;
  name: string;
  flag: string;
}

/**
 * 🗺️ CONFIGURACIÓN DE IDIOMAS MENCIONAL
 * El español es el puente para que los usuarios de México no se bloqueen.
 * El inglés aparece como la prioridad de configuración del sistema.
 */
const languages: Language[] = [
  { code: 'en-US', name: 'INGLÉS', flag: '🇺🇸' }, // PRIORITARIO
  { code: 'es-MX', name: 'ESPAÑOL', flag: '🇲🇽' }, // NATIVO BASE
  { code: 'fr-FR', name: 'FRANCÉS', flag: '🇫🇷' },
  { code: 'it-IT', name: 'ITALIANO', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'PORTUGUÉS', flag: '🇧🇷' },
  { code: 'de-DE', name: 'ALEMÁN', flag: '🇩🇪' },
  { code: 'auto', name: 'DETECTAR', flag: '🔍' },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(SettingsContext);
  
  // Navegación interna: Rol -> Idioma Nativo -> Idioma de Práctica
  const [view, setView] = useState<'role' | 'native' | 'practice'>('role');
  const [nativeLang, setNativeLang] = useState('es-MX');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!context) return null;

  /**
   * 🔐 PROTOCOLO DE AUTENTICACIÓN MASTER
   * Bypass "osos": Habilita el Modo Intérprete (Ultra-Mencional).
   */
  const handleAdminAuth = useCallback(() => {
    if (password.toLowerCase() === 'osos') {
      setIsLoading(true);
      
      context.updateSettings({ 
        userName: "OPERADOR_MAESTRO", 
        isUserAdmin: true,
        themeColor: '#39FF14' // Verde Neón: Acceso Total
      });
      
      // Sincronización estética del nodo maestro
      setTimeout(() => navigate('/selector'), 800);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPassword('');
    }
  }, [password, context, navigate]);

  /**
   * 🔵 FINALIZACIÓN DE PARTICIPANTE
   * Configura la sesión de 20 min para el Modo Aprendizaje.
   */
  const finalizeParticipant = (practiceCode: string) => {
    context.updateSettings({
      userName: "PARTICIPANTE_NODE",
      nativeLanguage: nativeLang,
      practiceLanguage: practiceCode,
      targetLang: practiceCode,
      isUserAdmin: false,
      themeColor: '#00FBFF' // Turquesa Neón: Modo Alumno
    });
    
    navigate('/learning-mode'); 
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 overflow-hidden relative font-sans select-none">
      
      {/* 🌌 FONDO DINÁMICO OLED (Efecto CandyGlass) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-[#00FBFF]/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[130px]" />
      </div>

      {/* 🛰️ LOGO MENCIONAL (Archivo Public) */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="z-20 mb-10"
      >
        <img src="/logo_mencional.png" alt="Mencional Logo" className="w-28 h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'role' && (
          <motion.div 
            key="role-view"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -150 }}
            className="w-full max-w-sm space-y-12 z-10"
          >
            <div className="text-center space-y-5">
              <h1 className="text-7xl font-[1000] italic tracking-tighter uppercase leading-[0.75] select-none">
                MEN<span className="text-[#00FBFF]">CIONAL</span>
              </h1>
              <p className="text-[10px] text-zinc-600 font-black tracking-[0.6em] uppercase">
                Neural_Language_Hub_2026
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-zinc-950/40 p-10 rounded-[3rem] space-y-6 border border-white/[0.03] backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center gap-3 text-zinc-600 italic font-black text-[10px] uppercase tracking-[0.4em]">
                  <ShieldCheck size={16} className="text-[#39FF14]" /> Operador_Master
                </div>
                <div className="relative">
                  <input 
                    type="password"
                    placeholder="PASS_CODE"
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
                    className={`w-full bg-black/60 border-2 rounded-3xl p-6 text-center font-black tracking-[1.2em] focus:outline-none transition-all placeholder:tracking-widest placeholder:text-zinc-800 ${
                      error ? 'border-rose-600 text-rose-600 animate-shake' : 'border-white/5 focus:border-[#39FF14]/40 text-white'
                    }`}
                  />
                  {error && <Lock size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-600" />}
                </div>
                <button 
                  onClick={handleAdminAuth} 
                  disabled={isLoading}
                  className="w-full py-6 bg-white text-black rounded-3xl font-[1000] italic uppercase hover:bg-[#39FF14] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? "VINCULANDO..." : "CONECTAR_NODO"}
                </button>
              </div>

              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute w-full h-[1px] bg-white/5"></div>
                <span className="relative bg-black px-8 text-[9px] font-black text-zinc-800 uppercase tracking-[0.5em] italic">Alternar_Acceso</span>
              </div>

              <button 
                onClick={() => setView('native')}
                className="group w-full bg-zinc-950/20 border border-white/5 p-10 rounded-[3.5rem] flex flex-col items-center gap-3 hover:bg-white/5 transition-all active:scale-95"
              >
                <User size={28} className="text-zinc-700 group-hover:text-[#00FBFF] transition-colors" />
                <span className="block font-black italic uppercase text-zinc-500 group-hover:text-white tracking-[0.3em]">Modo Participante</span>
                <span className="text-[9px] text-zinc-800 font-bold uppercase tracking-widest italic opacity-50">Acceso_Temporal // 20_MIN</span>
              </button>
            </div>
          </motion.div>
        )}

        {(view === 'native' || view === 'practice') && (
          <motion.div 
            key="lang-view"
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }}
            className="flex flex-col items-center space-y-10 w-full max-w-xl z-10"
          >
            <button 
              onClick={() => setView(view === 'practice' ? 'native' : 'role')}
              className="flex items-center gap-4 text-zinc-700 hover:text-white transition-all group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
              <span className="text-[11px] font-[1000] uppercase tracking-[0.5em] italic">Retroceder</span>
            </button>

            <div className="text-center space-y-2">
              <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">
                {view === 'native' ? 'Identifica tu origen' : 'Selecciona tu destino'}
              </h2>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">
                {view === 'native' ? 'Configuración de lengua materna' : 'Idioma prioritario de práctica'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 w-full px-4 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => view === 'native' ? (setNativeLang(lang.code), setView('practice')) : finalizeParticipant(lang.code)}
                  className={`
                    group flex flex-col items-center justify-center p-8 rounded-[3rem] border-2 transition-all duration-500
                    ${(view === 'native' && nativeLang === lang.code)
                      ? 'bg-white border-white text-black' 
                      : 'bg-[#050505] border-white/5 text-white hover:border-[#00FBFF]/30'}
                  `}
                >
                  <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{lang.flag}</span>
                  <span className="text-[11px] font-[1000] tracking-[0.2em] uppercase italic leading-none">{lang.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .animate-shake { animation: shake 0.25s ease-in-out 0s 2; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00FBFF; }
      `}</style>
    </div>
  );
};

export default LoginPage;