/** 🎭 MENCIONAL | INTENT_SELECTOR v2026.PROD
 * Ubicación: /src/views/IntentSelector.tsx
 * ✅ FIX: Bypass automático para Nodo Maestro (Admin).
 * ✅ PRECIO: Actualizado a $90 MXN (Mercado Pago).
 * ✅ TIEMPO: 30 Minutos para Sesión de Muestra.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Zap, Star, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { logger } from '../utils/logger';

const MASTER_KEY = "osos"; 

const IntentSelector: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * 🚀 EJECUCIÓN DE ACCESO
   * Sincroniza el rol y los privilegios en el SettingsContext.
   */
  const executeAccess = (type: 'ADMIN' | 'GUEST') => {
    if (type === 'ADMIN') {
      updateSettings({
        role: 'admin',
        userAlias: 'NODO_MAESTRO',
        isPaid: true,
        isUnlimited: true,
        sessionTimeLeft: 999999,
        themeColor: '#39FF14' // Verde Neón para Admin
      });
    } else {
      updateSettings({
        role: 'participant',
        userAlias: 'INVITADO_VIP',
        isPaid: true, 
        isUnlimited: false,
        sessionTimeLeft: 1800, // 30 minutos de inmersión
        themeColor: '#00FBFF' // Cyan Neón para Invitados
      });
    }
    // Navegación al setup de la sesión
    navigate('/views/SessionSetup');
  };

  // 🛡️ BYPASS AUTOMÁTICO: Si ya detectamos rol admin en el contexto, saltamos.
  useEffect(() => {
    if (settings?.role === 'admin' && !showKeyInput) {
      logger.info("AUTH", "Bypass activo: Nodo Maestro reconocido.");
      executeAccess('ADMIN');
    }
  }, [settings?.role]);

  /**
   * 🔐 VALIDACIÓN DE LLAVE
   * Compara contra MASTER_KEY u osos y la llave dinámica generada en el Gate.
   */
  const handleKeyAuth = async () => {
    const input = accessKey.toLowerCase().trim();
    const dynamicKey = settings?.generatedGuestKey;
    
    setIsVerifying(true);
    setError(false);

    // Efecto de procesamiento visual
    await new Promise(resolve => setTimeout(resolve, 800));

    if (input === MASTER_KEY) {
      executeAccess('ADMIN');
    } 
    else if (dynamicKey && input === dynamicKey.toString()) {
      executeAccess('GUEST');
    } 
    else {
      setError(true);
      setIsVerifying(false);
      setTimeout(() => setError(false), 1500);
      setAccessKey('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 md:p-10 font-sans italic select-none">
      
      {/* LOGO & PROTOCOLO */}
      <div className="mb-12 flex flex-col items-center gap-6">
          <img 
            src="/logo.png" 
            alt="Mencional" 
            className="w-44 h-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]" 
          />
          <h2 className="text-zinc-800 text-[9px] tracking-[1.2em] uppercase font-[1000] italic">
            Definir_Tipo_De_Acceso_AI/
          </h2>
      </div>

      {!showKeyInput ? (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl animate-in fade-in zoom-in duration-500">
          
          {/* BOTÓN: CLASE MUESTRA */}
          <button 
            onClick={() => setShowKeyInput(true)}
            className="group flex-1 h-96 border-2 border-zinc-900 rounded-[40px] flex flex-col items-center justify-center gap-6 hover:border-[#39FF14] transition-all bg-zinc-950/20 active:scale-95"
          >
            <Star size={56} className="text-zinc-900 group-hover:text-[#39FF14] transition-all" />
            <div className="text-center">
                <span className="text-white font-[1000] uppercase text-2xl tracking-tighter block">Clase_Muestra</span>
                <p className="text-[8px] text-zinc-700 tracking-[0.4em] uppercase font-black mt-2">Validación_Llave_Digital</p>
            </div>
          </button>

          {/* BOTÓN: SESIÓN PRO ($90 MXN) */}
          <button 
            onClick={() => window.location.href = "https://mpago.la/1isA1oL"}
            className="group flex-1 h-96 border-2 border-zinc-900 rounded-[40px] flex flex-col items-center justify-center gap-6 hover:border-[#00FBFF] transition-all bg-zinc-950/20 active:scale-95"
          >
            <Zap size={56} className="text-zinc-900 group-hover:text-[#00FBFF] transition-all" />
            <div className="text-center">
                <span className="text-white font-[1000] uppercase text-2xl tracking-tighter block">Sesión_Full</span>
                <p className="text-[8px] text-[#00FBFF] tracking-[0.4em] uppercase font-black mt-2">Acceso_Inmediato_$90_MXN</p>
            </div>
          </button>
        </div>
      ) : (
        /* INTERFAZ DE VALIDACIÓN */
        <div className="flex flex-col items-center gap-12 w-full max-w-md animate-in slide-in-from-bottom-8 duration-300">
          <div className="relative w-full">
            <input 
              autoFocus
              disabled={isVerifying}
              type="text"
              placeholder="LLAVE_DE_ACCESO"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleKeyAuth()}
              className={`bg-transparent border-b-2 ${error ? 'border-red-600' : 'border-zinc-900 focus:border-[#39FF14]'} text-[#39FF14] text-center text-5xl outline-none p-6 w-full transition-all font-[1000] tracking-tighter placeholder:text-zinc-900 uppercase`}
            />
            {isVerifying && (
                <Loader2 className="absolute right-0 bottom-8 animate-spin text-[#39FF14]" size={24} />
            )}
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-12 items-center">
              <button 
                onClick={() => setShowKeyInput(false)} 
                className="text-zinc-700 hover:text-white text-[10px] font-black flex items-center gap-2 transition-colors uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Regresar
              </button>
              <button 
                onClick={handleKeyAuth} 
                disabled={isVerifying || !accessKey}
                className="bg-[#39FF14] text-black font-[1000] px-10 py-4 rounded-full hover:scale-105 transition-all text-[11px] tracking-widest uppercase disabled:opacity-10"
              >
                Validar_Nodo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER OLED */}
      <footer className="fixed bottom-10 flex flex-col items-center gap-2 opacity-10">
        <p className="text-white text-[7px] tracking-[1em] font-black uppercase">Mencional_Security_Protocol_v2.6</p>
      </footer>
    </div>
  );
};

export default IntentSelector;