/**
 * 📈 TRENDS WELCOME | MENCIONAL 2026.PROD
 * Ubicación: /src/views/TrendsWelcome.tsx
 * Estética: Full Width | OLED Black | Protocolo Maestro "osos"
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  PlayCircle, 
  Users, 
  User, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Lock,
  ArrowRightCircle,
  Activity
} from 'lucide-react';

import { useSettings } from '../context/SettingsContext';
import Logo from '../components/common/Logo'; 

// ✅ IMPORTACIÓN SINCRONIZADA: Carpeta 'ai' (Directorio corregido según protocolo)
import speechService from '../services/ai/speechService';
import { logger } from '../utils/logger';

// 🇲🇽 TRENDS EN ESPAÑOL: Temas optimizados para el mercado local
const TREND_CARDS = [
  { id: 'T1', label: 'IA y el Futuro del Trabajo', trend: '+85% CRECIMIENTO', color: '#00FBFF' }, // Cyan Mencional
  { id: 'T2', label: 'Comida y Cultura Local', trend: 'POPULAR', color: '#FF00F5' },          // Fucsia Rompehielo
  { id: 'T3', label: 'Servicio al Cliente VIP', trend: 'PREMIUM', color: '#39FF14' },
  { id: 'T4', label: 'Negocios y Entrevistas', trend: 'HIGH-STAKES', color: '#A855F7' },      // Púrpura Ultra
  { id: 'T5', label: 'Viajes por el Mundo', trend: 'GLOBAL', color: '#FFFFFF' }
];

const SESSION_MODES = [
  { id: 'individual', label: 'Individual', icon: User },
  { id: 'duo', label: 'Dúo', icon: Users },
  { id: 'trio', label: 'Trío', icon: Users }
];

const LANGUAGES = [
  { id: 'en-US', label: 'Inglés 🇺🇸' },
  { id: 'fr-FR', label: 'Francés 🇫🇷' },
  { id: 'de-DE', label: 'Alemán 🇩🇪' },
  { id: 'it-IT', label: 'Italiano 🇮🇹' },
  { id: 'es-ES', label: 'Español 🇲🇽' }
];

const TrendsWelcome: React.FC = () => {
  const navigate = useNavigate();
  const { updateSettings } = useSettings(); 
  
  const [selectedTopic, setSelectedTopic] = useState(TREND_CARDS[0]);
  const [sessionMode, setSessionMode] = useState<'individual' | 'duo' | 'trio'>('individual');
  const [targetLang, setTargetLang] = useState('en-US');
  const [adminKey, setAdminKey] = useState('');
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Forzar el fondo negro puro para paneles OLED
    document.body.style.backgroundColor = '#000000';
    logger.info("SYSTEM", "TrendsWelcome activo. Esperando protocolo de acceso.");
  }, []);

  /**
   * 🚀 PROTOCOLO DE INICIO Y BYPASS "OSOS"
   */
  const handleStart = async () => {
    if (!userName.trim()) {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      return;
    }

    const key = adminKey.toLowerCase().trim();
    const isMaster = key === 'osos';
    
    // 1. Sincronización del Contexto de Sesión
    updateSettings({
      userAlias: userName.toUpperCase(),
      sessionName: selectedTopic.label,
      groupMode: sessionMode,
      targetLanguage: targetLang,
      themeColor: selectedTopic.color,
      isUnlimited: isMaster,
      role: isMaster ? 'admin' : 'participant'
    });

    // Feedback auditivo con Voz Aoede (Sincronizada a la nueva carpeta /ai/)
    speechService.speak(`Bienvenido a Mencional, ${userName}. Iniciando sistema.`, 'es-MX');

    // 2. Protocolo de Navegación PROD
    if (isMaster) {
      logger.info("AUTH", "Acceso de Operador confirmado.");
      navigate('/selector'); 
    } else {
      logger.info("USER", `Participante detectado: ${userName}`);
      navigate('/setup'); 
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white p-4 md:p-10 flex flex-col items-center selection:bg-[var(--accent-color)] selection:text-black font-sans relative overflow-x-hidden">
      
      {/* 🌌 ATMÓSFERA NEURAL OLED */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[120px] rounded-full transition-colors duration-1000"
          style={{ backgroundColor: `${selectedTopic.color}15` }}
        />
      </div>

      <header className="mb-12 text-center relative z-20 w-full max-w-6xl mt-8">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="mb-8 flex justify-center scale-125">
             <Logo color={selectedTopic.color} /> 
          </div>
          <h1 className="text-6xl md:text-[8rem] font-[1000] italic tracking-tighter uppercase leading-[0.8] mb-4">
            MENCIONAL <span style={{ color: selectedTopic.color }} className="not-italic transition-colors duration-500">2026</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.8em] opacity-40 italic">
            Neural_Immersion_Hub
          </p>
        </motion.div>
      </header>

      <main className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 flex-1">
        
        {/* 🟦 PANEL IZQUIERDO: Identidad y Temas */}
        <section className="lg:col-span-7 space-y-8">
          <motion.div 
            initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="bg-zinc-900/20 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl"
          >
            <div className="flex items-center gap-3 mb-2 opacity-50">
              <Cpu size={14} style={{ color: selectedTopic.color }} className="animate-pulse" />
              <h2 className="text-[9px] font-black uppercase tracking-widest italic">01. Nodo_Usuario</h2>
            </div>
            <input 
              type="text" 
              placeholder="IDENTIDAD..." 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-transparent p-2 text-4xl md:text-6xl font-[1000] outline-none uppercase italic text-white placeholder:text-zinc-900"
            />
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-600 pl-6 italic flex items-center gap-3">
               02. Tendencias <Activity size={12} className="text-[#39FF14]" />
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {TREND_CARDS.map((topic, index) => (
                <motion.button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: index * 0.05 }}
                  className={`group p-6 rounded-[2rem] border-2 transition-all duration-300 flex justify-between items-center ${
                    selectedTopic.id === topic.id 
                    ? 'border-white bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.03)]' 
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10'
                  }`}
                >
                  <div className="text-left">
                    <span className="text-[8px] font-black tracking-widest opacity-40 uppercase block mb-1">{topic.trend}</span>
                    <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">{topic.label}</span>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{ backgroundColor: selectedTopic.id === topic.id ? topic.color : 'rgba(255,255,255,0.02)' }}
                  >
                    {selectedTopic.id === topic.id ? (
                      <Zap size={18} className="text-black fill-black" />
                    ) : (
                      <ArrowRightCircle size={20} className="text-zinc-800" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* 🟩 PANEL DERECHO: Configuración de Sesión */}
        <section className="lg:col-span-5">
          <motion.div 
            initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="bg-zinc-950/90 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-10 backdrop-blur-3xl sticky top-10"
          >
            <div>
              <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-6 italic flex items-center gap-2">
                <Globe size={14} /> 03. Idioma_Objetivo
              </h2>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setTargetLang(lang.id)}
                    className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase border-2 transition-all ${
                      targetLang === lang.id 
                      ? 'bg-white text-black border-white' 
                      : 'border-zinc-900 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-6 italic text-center">04. Modo_Grupo</h2>
              <div className="grid grid-cols-3 gap-3">
                {SESSION_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSessionMode(mode.id as any)}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      sessionMode === mode.id 
                      ? "border-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_15px_rgba(57,255,20,0.1)]" 
                      : 'border-white/5 hover:border-zinc-800'
                    }`}
                  >
                    <mode.icon size={20} className={sessionMode === mode.id ? 'text-[#39FF14]' : 'text-zinc-800'} />
                    <p className="text-[8px] font-black uppercase tracking-tighter">{mode.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-900 space-y-6">
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 transition-colors" size={14} />
                <input 
                  type="password"
                  placeholder="MASTER_KEY (OSOS)"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-900 p-5 pl-14 rounded-2xl text-white font-mono tracking-[0.4em] outline-none focus:border-white/10 transition-all uppercase text-[10px]"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                style={{ backgroundColor: isError ? '#FF3131' : '#ffffff' }}
                className="w-full py-8 font-[1000] uppercase rounded-[2rem] tracking-[0.4em] text-xl text-black flex items-center justify-center gap-4 shadow-2xl"
              >
                <PlayCircle size={24} />
                <span>{isError ? 'NOMBRE_REQUERIDO' : 'ACCEDER_AL_NODO'}</span>
              </motion.button>
              
              <div className="flex justify-center items-center gap-3 opacity-20 pt-4">
                <ShieldCheck size={12} />
                <p className="text-[7px] font-black uppercase tracking-[0.4em] italic text-zinc-500">
                  MENCIONAL // PROD_2026
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 🛡️ PROTECCIÓN ANTI-QUEMADO OLED */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] z-[9999]" />
    </div>
  );
};

export default TrendsWelcome;