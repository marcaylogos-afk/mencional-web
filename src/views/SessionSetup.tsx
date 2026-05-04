/** ⚙️ MENCIONAL | SESSION_SETUP v2026.PROD
 * ✅ ACTUALIZACIÓN: Sesiones de 30 min / $50 MXN.
 * ✅ PRIVILEGIOS: Bypass automático para Nodo Maestro.
 * ✅ DIRECTORIO AI: Sincronizado.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext'; 
import { 
  ArrowRight, User, Users2, Users, 
  Loader2, ShieldCheck, X, Check, Zap, Globe 
} from 'lucide-react';
import { logger } from '../utils/logger';

const SessionSetup: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  
  // 🔐 Validación de Rango Maestro
  const isActuallyAdmin = useMemo(() => settings.role === 'admin', [settings.role]);

  const COLORS_10 = [
    '#00FBFF', '#39FF14', '#FF00F5', '#FFFF00', '#FF3131', 
    '#A855F7', '#FF9900', '#00FFAB', '#FFFFFF', '#71717A'
  ];

  const [practiceLang, setPracticeLang] = useState(settings.targetLanguage || 'en-US');
  const [modality, setModality] = useState<'individual' | 'duo' | 'trio'>(settings.groupMode || 'individual');
  const [userName, setUserName] = useState(settings.userAlias || '');
  const [sessionTitle, setSessionTitle] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(settings.themeColor || COLORS_10[0]);

  /** 🚀 INICIO DE PROTOCOLO
   * Administradores: Acceso total ilimitado (Bypass).
   * Aprendizaje Individual: 30 minutos / $50 MXN.
   * Grupos: Redirección a link de pago de $90 MXN.
   */
  const handleStart = async () => {
    setIsSyncing(true);
    
    // 30 minutos = 1800 segundos para aprendizaje optimizado
    const SESSION_LIMIT = 1800; 

    const config = {
      targetLanguage: practiceLang,
      themeColor: selectedColor, 
      userAlias: userName.trim() || (isActuallyAdmin ? 'OPERADOR_MAESTRO' : 'NEURAL_USER'),
      currentTopic: sessionTitle.trim() || 'SESIÓN_ESTÁNDAR',
      groupMode: modality,
      isPaid: isActuallyAdmin, // Solo el admin nace "pagado" para evitar el checkout
      isUnlimited: isActuallyAdmin,
      sessionTimeLeft: isActuallyAdmin ? 999999 : SESSION_LIMIT,
    };

    try {
      await updateSettings(config);
      logger.info("SETUP", `Sincronizando Nodo: ${isActuallyAdmin ? 'ADMIN' : 'GUEST'}`);
      
      setTimeout(() => {
        // 🛡️ REGLA DE ORO: Si es Admin, salta directo al learning
        if (isActuallyAdmin) {
          navigate('/learning'); 
          return;
        }

        // Redirección por cobro para usuarios estándar
        if (modality === 'individual') {
          // Link actualizado a $50 MXN
          window.location.href = "https://mpago.la/LINK_DE_50_MXN"; 
        } else {
          // Link de pago grupal ($90 MXN)
          window.location.href = "https://mpago.la/1HJRXhD"; 
        }
      }, 1000);
    } catch (error) {
      logger.error("SETUP_SYNC_ERROR", error);
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12 flex flex-col items-center relative overflow-x-hidden select-none font-sans italic">
      
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-10 transition-all duration-1000" 
        style={{ background: `radial-gradient(circle at 50% 100%, ${selectedColor} 0%, transparent 80%)` }} 
      />

      <header className="w-full max-w-6xl flex justify-between items-center z-20 mb-8">
        <div className="flex items-center gap-4">
          <Zap size={32} style={{ color: selectedColor }} className="drop-shadow-[0_0_15px_currentColor]" />
          <div className="flex flex-col border-l border-zinc-800 pl-4">
            <span className="text-[9px] font-black tracking-[0.4em] text-zinc-500 uppercase leading-none">Mencional_v2.6</span>
            {isActuallyAdmin && (
              <span className="text-[8px] font-black text-[#39FF14] uppercase tracking-widest flex items-center gap-1.5 mt-1">
                <ShieldCheck size={10}/> Acceso_Maestro_Concedido
              </span>
            )}
          </div>
        </div>
        <button onClick={() => navigate('/selector')} className="p-3 bg-zinc-950 rounded-full border border-zinc-900 text-zinc-500 hover:text-white transition-all">
          <X size={20} />
        </button>
      </header>

      <div className="w-full max-w-3xl space-y-10 z-10">
        <section className="text-center">
          <h1 className="text-6xl md:text-8xl font-[1000] uppercase tracking-tighter leading-none">
            CONFIG<span style={{ color: selectedColor }}>_</span>NODO
          </h1>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4">Pseudónimo_ID</label>
            <input 
              type="text" value={userName} onChange={(e) => setUserName(e.target.value.toUpperCase())}
              placeholder="USUARIO_ALFA"
              className="w-full bg-zinc-950 border-2 border-zinc-900 p-5 rounded-[2rem] outline-none focus:border-zinc-700 transition-all text-xs font-black tracking-widest"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4">Tópico_Contextual</label>
            <input 
              type="text" value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value.toUpperCase())}
              placeholder="EJ: TECH_TALK"
              className="w-full bg-zinc-950 border-2 p-5 rounded-[2rem] outline-none transition-all text-xs font-black tracking-widest"
              style={{ color: selectedColor, borderColor: `${selectedColor}44` }}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[8px] font-black uppercase text-zinc-600 tracking-[0.3em] ml-4">Target_Language</label>
            <div className="relative">
              <select 
                value={practiceLang} onChange={(e) => setPracticeLang(e.target.value)} 
                className="w-full bg-zinc-950 border-2 border-zinc-900 p-6 rounded-[2.5rem] text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer text-center"
                style={{ color: selectedColor }}
              >
                <option value="en-US">Inglés 🇺🇸</option>
                <option value="it-IT">Italiano 🇮🇹</option>
                <option value="pt-BR">Portugués 🇧🇷</option>
                <option value="fr-FR">Francés 🇫🇷</option>
                <option value="de-DE">Alemán 🇩🇪</option>
                <option value="es-MX">Español 🇲🇽</option>
                <option value="auto">Detectar_Idioma 🛰️</option>
              </select>
              <Globe size={16} className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-800 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[8px] font-black uppercase text-zinc-600 tracking-[0.3em] ml-4">Protocolo_Sesión</label>
            <div className="flex gap-2 h-[68px]">
              {[
                { id: 'individual', icon: <User size={14}/>, label: 'Solo' },
                { id: 'duo', icon: <Users2 size={14}/>, label: 'Dúo' },
                { id: 'trio', icon: <Users size={14}/>, label: 'Trio' }
              ].map((m) => (
                <button 
                  key={m.id} onClick={() => setModality(m.id as any)}
                  className={`flex-1 rounded-[2rem] border-2 transition-all flex items-center justify-center gap-2 ${modality === m.id ? 'bg-white text-black border-white' : 'bg-zinc-950 border-zinc-900 text-zinc-700'}`}
                >
                  {m.icon}
                  <span className="text-[9px] font-black uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="bg-zinc-950/50 p-6 rounded-[3rem] border border-zinc-900 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {COLORS_10.map((hex) => (
              <button 
                key={hex} onClick={() => setSelectedColor(hex)}
                className={`w-10 h-10 rounded-xl transition-all relative flex items-center justify-center ${selectedColor === hex ? 'scale-110 ring-2 ring-white/30' : 'opacity-30 hover:opacity-100'}`}
                style={{ backgroundColor: hex }}
              >
                {selectedColor === hex && <Check color="black" size={16} strokeWidth={4} />}
              </button>
            ))}
          </div>
        </section>

        <footer className="pt-4 pb-12">
          <button
            onClick={handleStart} disabled={isSyncing}
            className="w-full py-9 rounded-full font-black text-xl uppercase tracking-tighter flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98]"
            style={{ backgroundColor: selectedColor, color: 'black' }}
          >
            {isSyncing ? (
              <Loader2 className="animate-spin" size={28} />
            ) : (
              <>
                <span>{isActuallyAdmin ? 'ENTRAR_SIN_CARGO' : (modality === 'individual' ? 'Pagar_$50_MXN' : 'Pagar_$90_MXN')}</span>
                <ArrowRight size={24} />
              </>
            )}
          </button>
          <p className="text-center text-[7px] text-zinc-700 uppercase mt-6 tracking-[0.8em]">
            Time_Allotted: {isActuallyAdmin ? 'UNLIMITED' : '1800_SEC'} // Fee_Status: {isActuallyAdmin ? 'EXEMPT' : 'PENDING'}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SessionSetup;