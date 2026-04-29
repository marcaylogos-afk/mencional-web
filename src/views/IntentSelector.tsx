/** 🎭 MENCIONAL | INTENT_SELECTOR v2026.PROD
 * Ubicación: /src/views/IntentSelector.tsx
 * ✅ FIX: Bypass automático para Nodo Maestro (Admin).
 * ✅ PRECIO: Actualizado a $90 MXN según protocolo de recaudación.
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

  // 🛡️ BYPASS AUTOMÁTICO: Si ya es Admin, saltamos la aduana sin preguntar.
  useEffect(() => {
    if (settings?.role === 'admin' || settings?.isUnlimited) {
      logger.info("AUTH", "Bypass detectado: Nodo Maestro activo.");
      executeAccess('ADMIN');
    }
  }, [settings?.role, settings?.isUnlimited]);

  /**
   * 🚀 EJECUCIÓN DE ACCESO
   * Configura los parámetros de sesión según el nivel de privilegios.
   */
  const executeAccess = (type: 'ADMIN' | 'GUEST') => {
    if (type === 'ADMIN') {
      updateSettings({
        role: 'admin',
        userAlias: settings.userAlias || 'NODO_MAESTRO',
        isPaid: true,
        isUnlimited: true,
        sessionTimeLeft: 999999, // Tiempo infinito para Admin
        themeColor: '#39FF14'
      });
    } else {
      updateSettings({
        role: 'participant',
        userAlias: 'INVITADO_MUESTRA',
        isPaid: true, 
        isUnlimited: false,
        sessionTimeLeft: 1800, // 30 minutos de prueba
        themeColor: '#00FBFF'
      });
    }
    // Redirección al selector de configuración de sesión
    navigate('/selector');
  };

  /**
   * 🛡️ VALIDACIÓN DE LLAVE DINÁMICA
   */
  const handleKeyAuth = async () => {
    const input = accessKey.toLowerCase().trim();
    const GUEST_KEY = settings?.generatedGuestKey || "2026";
    
    setIsVerifying(true);
    setError(false);

    // Simulamos un delay de "procesamiento neural" para la estética
    await new Promise(resolve => setTimeout(resolve, 800));

    if (input === MASTER_KEY) {
      executeAccess('ADMIN');
    } 
    else if (input === GUEST_KEY.toString()) {
      executeAccess('GUEST');
    } 
    else {
      setError(true);
      setIsVerifying(false);
      setTimeout(() => setError(false), 2000);
      setAccessKey('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 md:p-10 font-sans italic selection:bg-[#39FF14] selection:text-black">
      
      {/* HEADER OLED */}
      <div className="mb-16 flex flex-col items-center gap-4">
         <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center border border-zinc-800 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
            <ShieldCheck size={40} className="text-zinc-700" />
         </div>
         <h2 className="text-zinc-500 text-[9px] tracking-[1.2em] uppercase font-black italic">
           Security_Gateway_v2.6
         </h2>
      </div>

      {!showKeyInput ? (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
          
          {/* BOTÓN: CLASE MUESTRA (Acceso por Llave) */}
          <button 
            onClick={() => setShowKeyInput(true)}
            className="group flex-1 h-96 border-2 border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center gap-6 hover:border-[#39FF14] transition-all bg-zinc-950/20 active:scale-95"
          >
            <Star size={56} className="text-zinc-800 group-hover:text-[#39FF14] transition-all drop-shadow-[0_0_20px_rgba(57,255,20,0.2)]" />
            <div className="text-center">
                <span className="text-white font-[1000] uppercase text-2xl tracking-tighter block">Clase_Muestra</span>
                <p className="text-[8px] text-zinc-600 tracking-[0.4em] uppercase font-black mt-2">Validación_Llave_Digital</p>
            </div>
          </button>

          {/* BOTÓN: SESIÓN PRO (Mercado Pago $90 MXN) */}
          <button 
            onClick={() => window.location.href = "https://mpago.la/1isA1oL"}
            className="group flex-1 h-96 border-2 border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center gap-6 hover:border-[#00FBFF] transition-all bg-zinc-950/20 active:scale-95 shadow-[0_0_50px_rgba(0,0,0,1)]"
          >
            <Zap size={56} className="text-zinc-800 group-hover:text-[#00FBFF] transition-all drop-shadow-[0_0_20px_rgba(0,251,255,0.2)]" />
            <div className="text-center">
                <span className="text-white font-[1000] uppercase text-2xl tracking-tighter block">Sesión_Full</span>
                <p className="text-[8px] text-[#00FBFF] tracking-[0.4em] uppercase font-black mt-2">Acceso_Inmediato_$90_MXN</p>
            </div>
          </button>
        </div>
      ) : (
        /* ADUANA DE LLAVE */
        <div className="flex flex-col items-center gap-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
          <div className="relative">
            <input 
              autoFocus
              disabled={isVerifying}
              type="text"
              placeholder="LLAVE_AI"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleKeyAuth()}
              className={`bg-transparent border-b-2 ${error ? 'border-rose-600' : 'border-zinc-800 focus:border-[#39FF14]'} text-[#39FF14] text-center text-6xl outline-none p-6 w-full transition-all font-[1000] tracking-widest placeholder:text-zinc-900`}
            />
            {isVerifying && (
                <Loader2 className="absolute right-0 bottom-8 animate-spin text-[#39FF14]" size={24} />
            )}
          </div>

          <div className="flex flex-col items-center gap-6">
            {error && <span className="text-rose-600 text-[10px] font-black tracking-widest uppercase animate-bounce">Credenciales_Invalidas</span>}
            
            <div className="flex gap-12 items-center">
              <button 
                onClick={() => setShowKeyInput(false)} 
                className="text-zinc-600 hover:text-white text-[9px] font-black flex items-center gap-2 transition-colors uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Regresar
              </button>
              <button 
                onClick={handleKeyAuth} 
                disabled={isVerifying || !accessKey}
                className="bg-[#39FF14] text-black font-[1000] px-10 py-4 rounded-2xl hover:scale-105 transition-all text-[11px] tracking-widest uppercase disabled:opacity-20"
              >
                Validar_Nodo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER DE PROTOCOLO */}
      <footer className="fixed bottom-10 flex flex-col items-center gap-2 opacity-10">
        <p className="text-white text-[7px] tracking-[1em] font-black uppercase">Mencional_Master_Access_v2.6_OLED</p>
        <p className="text-white text-[6px] tracking-[0.5em] font-black uppercase">Encrypted_by_SecurityEngine</p>
      </footer>
    </div>
  );
};

export default IntentSelector;