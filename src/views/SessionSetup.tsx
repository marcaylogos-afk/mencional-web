/** ⚙️ MENCIONAL | SESSION_SETUP v2026.PROD
 * ✅ ACTUALIZACIÓN: Sesiones de 30 min / $50 MXN.
 * ✅ PRIVILEGIOS: Bypass automático para Nodo Maestro (Admin).
 * ✅ DIRECTORIO AI: Sincronizado con services/ai/.
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
  
  // 🔐 Validación de Rango Maestro: Comprueba si el rol es 'admin'
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
   * Grupos: Pago colectivo de $90 MXN.
   */
  const handleStart = async () => {
    setIsSyncing(true);
    
    // ✅ Optimización: Sesiones de 30 minutos (1800 segundos)
    const SESSION_LIMIT = 1800; 

    const config = {
      targetLanguage: practiceLang,
      themeColor: selectedColor, 
      userAlias: userName.trim() || (isActuallyAdmin ? 'NODO_MAESTRO' : 'NEURAL_USER'),
      currentTopic: sessionTitle.trim() || 'SESIÓN_ESTÁNDAR',
      groupMode: modality,
      isPaid: isActuallyAdmin, // Bypass de pago si es admin
      isUnlimited: isActuallyAdmin,
      sessionTimeLeft: isActuallyAdmin ? 999999 : SESSION_LIMIT,
      sessionActive: true
    };

    try {
      await updateSettings(config);
      logger.info("SETUP", `Sincronizando Nodo: ${isActuallyAdmin ? 'MASTER_ADMIN' : 'GUEST_OPERATOR'}`);
      
      // Simulación de sincronización neural
      setTimeout(() => {
        // 🛡️ REGLA DE ORO: Si es Admin, salta el checkout
        if (isActuallyAdmin) {
          navigate('/learning'); 
          return;
        }

        // Flujo de cobro para usuarios
        if (modality === 'individual') {
          // ✅ Link de pago actualizado a $50 MXN
          window.location.href = "https://mpago.la/LINK_50_MXN_PROD"; 
        } else {
          // Link grupal $90 MXN
          window.location.href = "https://mpago.la/1HJRXhD"; 
        }
      }, 1200);
    } catch (error) {
      logger.error("SETUP_SYNC_ERROR", error);
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12 flex flex-col items-center relative overflow-x-hidden select-none font-sans italic selection:bg-white selection:text-black">
      
      {/* Fondo OLED Dinámico */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.07] transition-all duration-1000" 
        style={{ background: `radial-gradient(circle at 50% 100%, ${selectedColor} 0%, transparent 70%)` }} 
      />

      <header className="w-full max-w-6xl flex justify-between items-center z-20 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <Zap size={28} style={{ color: selectedColor }} className="drop-shadow-[0_0_10px_currentColor] fill-current" />
          </div>
          <div className="flex flex-col border-l border-zinc-900 pl-4">
            <span className="text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase">Mencional_Core_v2.6</span>
            {isActuallyAdmin && (
              <span className="text-[8px] font-black text-[#39FF14] uppercase tracking-widest flex items-center gap-1.5 mt-1 animate-pulse">
                <ShieldCheck size={10}/> Nodo_Maestro_Identificado
              </span>
            )}
          </div>
        </div>
        <button onClick={() => navigate('/selector')} className="p-4 bg-zinc-950 rounded-full border border-zinc-900 text-zinc-700 hover:text-white hover:border-zinc-700 transition-all">
          <X size={20} />
        </button>
      </header>

      <div className="w-full max-w-3xl space-y-12 z-10">
        <section className="text-center space-y-2">
          <h1 className="text-7xl md:text-9xl font-[1000] uppercase tracking-tighter leading-none">
            SETUP<span style={{ color: selectedColor }}>.</span>SYS
          </h1>
          <p className="text-[9px] font-black tracking-[1em] text-zinc-800 uppercase">Configuración_De_Entorno</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-6">Operador_Alias</label>
            <input 
              type="text" value={userName} onChange={(e) => setUserName(e.target.value.toUpperCase())}
              placeholder="MAINFRAME_USER"
              className="w-full bg-zinc-950 border-2 border-zinc-900 p-6 rounded-[2.5rem] outline-none focus:border-zinc-700 transition-all text-xs font-black tracking-[0.2em] uppercase"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-6">Contexto_Semántico</label>
            <input 
              type="text" value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value.toUpperCase())}
              placeholder="EJ: NEGOCIACIÓN_AI"
              className="w-full bg-zinc-950 border-2 p-6 rounded-[2.5rem] outline-none transition-all text-xs font-black tracking-[0.2em] uppercase"
              style={{ color: selectedColor, borderColor: `${selectedColor}33` }}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[8px] font-black uppercase text-zinc-600 tracking-[0.4em] ml-6">Sincronización_Voz</label>
            <div className="relative">
              <select 
                value={practiceLang} onChange={(e) => setPracticeLang(e.target.value)} 
                className="w-full bg-zinc-950 border-2 border-zinc-900 p-6 rounded-[2.5rem] text-xs font-black uppercase tracking-[0.2em] outline-none appearance-none cursor-pointer text-center hover:border-zinc-800 transition-colors"
                style={{ color: selectedColor }}
              >
                <option value="en-US">Inglés (US) 🇺🇸</option>
                <option value="fr-FR">Francés 🇫🇷</option>
                <option value="de-DE">Alemán 🇩🇪</option>
                <option value="it-IT">Italiano 🇮🇹</option>
                <option value="pt-BR">Portugués 🇧🇷</option>
                <option value="es-MX">Español 🇲🇽</option>
              </select>
              <Globe size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-800 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[8px] font-black uppercase text-zinc-600 tracking-[0.4em] ml-6">Escala_De_Grupo</label>
            <div className="flex gap-2 h-[72px]">
              {[
                { id: 'individual', icon: <User size={16}/>, label: 'Solo' },
                { id: 'duo', icon: <Users2 size={16}/>, label: 'Duo' },
                { id: 'trio', icon: <Users size={16}/>, label: 'Trio' }
              ].map((m) => (
                <button 
                  key={m.id} onClick={() => setModality(m.id as any)}
                  className={`flex-1 rounded-[2.2rem] border-2 transition-all flex items-center justify-center gap-2 ${modality === m.id ? 'bg-white text-black border-white' : 'bg-zinc-950 border-zinc-900 text-zinc-800'}`}
                >
                  {m.icon}
                  <span className="text-[9px] font-[1000] uppercase tracking-tighter">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="bg-zinc-950/30 p-8 rounded-[3.5rem] border border-zinc-900/50">
          <div className="flex flex-wrap justify-center gap-3">
            {COLORS_10.map((hex) => (
              <button 
                key={hex} onClick={() => setSelectedColor(hex)}
                className={`w-11 h-11 rounded-2xl transition-all relative flex items-center justify-center shadow-lg ${selectedColor === hex ? 'scale-110 ring-2 ring-white/20' : 'opacity-20 hover:opacity-100 hover:scale-105'}`}
                style={{ backgroundColor: hex }}
              >
                {selectedColor === hex && <Check color="black" size={20} strokeWidth={4} />}
              </button>
            ))}
          </div>
        </section>

        <footer className="pt-6 pb-20 flex flex-col items-center">
          <button
            onClick={handleStart} disabled={isSyncing}
            className="w-full py-10 rounded-full font-[1000] text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-5 transition-all shadow-2xl active:scale-[0.97] disabled:grayscale disabled:opacity-50"
            style={{ backgroundColor: selectedColor, color: 'black' }}
          >
            {isSyncing ? (
              <Loader2 className="animate-spin" size={32} />
            ) : (
              <>
                <span className="tracking-tighter">
                  {isActuallyAdmin ? 'INICIALIZAR_PROTOCOLO' : (modality === 'individual' ? 'Sincronizar_$50_MXN' : 'Sincronizar_$90_MXN')}
                </span>
                <ArrowRight size={28} strokeWidth={3} />
              </>
            )}
          </button>
          
          <div className="flex flex-col items-center gap-2 mt-8 opacity-40">
            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.8em]">
               Cycle: {isActuallyAdmin ? 'UNLIMITED_SESSION' : '1800_SECONDS_LIMIT'} 
            </p>
            <div className="h-[1px] w-24 bg-zinc-900" />
            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">
              Fee_Protocol: {isActuallyAdmin ? 'EXEMPT_MASTER' : (modality === 'individual' ? 'PAY_PER_USE_$50' : 'PAY_PER_GROUP_$90')}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SessionSetup;