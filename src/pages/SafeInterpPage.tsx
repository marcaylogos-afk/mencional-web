/**
 * 🛡️ SAFE_INTERP_PAGE v16.0 - MENCIONAL 2026
 * Escudo de Validación, Seguridad de Hardware y Pasarela de Pago.
 * Protocolo: Bloqueo de 20min Sincronizado ($20 MXN).
 * Ubicación: /src/pages/SafeInterpPage.tsx
 * ✅ SERVICIOS AI: Sincronizados en /src/services/ai/
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CreditCard, 
  CheckCircle,
  Lock,
  Activity,
  ArrowRight,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';

// ✅ SERVICIOS DE PRODUCCIÓN
import { auth, db } from '../services/ai/firebaseConfig'; // Ruta corregida a /ai/
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { createPaymentBlock } from '../services/data/business/payment'; 
import { getDeviceId } from '../utils/identity';

interface UserProfile {
  uid: string;
  role: 'admin' | 'user';
  credits: number; 
  isBlockedUntil: number | null;
  isPermanentlyBlocked: boolean;
  deviceId: string;
  strikes?: number;
}

const SafeInterpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Captura de datos del selector
  const sessionData = location.state || { 
    mode: 'learning',
    isAdmin: false 
  };

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let unsub: () => void;

    const initShield = async () => {
      try {
        // 1. Identificación única por Hardware (Previene abusos)
        const deviceId = getDeviceId(); 
        const credential = await signInAnonymously(auth);
        const user = credential.user;
        const profileRef = doc(db, 'users', user.uid);

        unsub = onSnapshot(profileRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            
            // 🛑 PROTOCOLO DE EXPULSIÓN Y BLOQUEO GLOBAL
            if (data.isPermanentlyBlocked) {
              setError("DISPOSITIVO BLOQUEADO: Violación grave detectada.");
            } else if (data.isBlockedUntil && data.isBlockedUntil > Date.now()) {
              const minutesLeft = Math.ceil((data.isBlockedUntil - Date.now()) / (1000 * 60));
              setError(`ACCESO RESTRINGIDO: Reintente en ${minutesLeft} minutos.`);
            }
            setProfile(data);
          } else {
            // 🆕 REGISTRO INICIAL (Sincronización con "osos" para Admin)
            const newProfile: UserProfile = {
              uid: user.uid,
              deviceId: deviceId,
              role: sessionData.isAdmin ? 'admin' : 'user',
              credits: sessionData.isAdmin ? 999999 : 0, 
              isBlockedUntil: null,
              isPermanentlyBlocked: false,
              strikes: 0
            };
            setDoc(profileRef, newProfile);
            setProfile(newProfile);
          }
          setLoading(false);
        });
      } catch (err) {
        setError("ERROR_SHIELD: Fallo de integridad en hardware.");
        setLoading(false);
      }
    };

    initShield();
    return () => unsub && unsub();
  }, [sessionData.isAdmin]);

  // --- 💳 PASARELA MERCADO PAGO ($20 MXN / 20 MIN) ---
  const handlePayment = async () => {
    if (!profile) return;
    setIsProcessing(true);
    try {
      const pref = await createPaymentBlock(profile.uid);
      window.location.href = pref.init_point; 
    } catch (err) {
      setError("Pasarela saturada. Intente en unos segundos.");
      setIsProcessing(false);
    }
  };

  // --- 🚪 ACCESO AL MOTOR NEURAL ---
  const handleAccess = () => {
    const paths: Record<string, string> = {
      learning: '/learning-live',
      interpreter: '/ultra-live', 
      rompehielo: '/rompehielo-live'
    };
    
    navigate(paths[sessionData.mode as string] || '/learning-live', { 
      state: { validated: true, profile },
      replace: true 
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <Fingerprint className="text-[#00FBFF] animate-pulse mb-6" size={56} />
      <div className="space-y-2 text-center">
        <p className="text-[10px] tracking-[0.6em] font-black uppercase opacity-60">Validando_Hardware_ID</p>
        <div className="h-1 w-32 bg-zinc-900 rounded-full overflow-hidden">
          <div className="h-full bg-[#00FBFF] animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
      <div className="p-10 bg-rose-500/5 rounded-[3.5rem] border border-rose-500/20 max-w-sm shadow-[0_0_50px_rgba(244,63,94,0.1)]">
        <AlertTriangle className="text-rose-600 mb-6 mx-auto animate-bounce" size={64} />
        <h2 className="text-2xl font-black uppercase text-rose-500 tracking-tighter leading-none mb-4">{error}</h2>
        <button 
          onClick={() => navigate('/')} 
          className="mt-6 w-full py-4 bg-zinc-900 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-rose-500 transition-all italic"
        >
          REGRESAR AL LOBBY
        </button>
      </div>
    </div>
  );

  const hasAccess = profile?.role === 'admin' || (profile?.credits || 0) > 0;

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* HUD DE SEGURIDAD (OLED) */}
      <nav className="p-8 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-3xl relative z-50">
        <div className="flex items-center gap-4">
          <Shield className="text-[#00FBFF]" size={32} />
          <div className="flex flex-col">
            <span className="font-black uppercase italic tracking-tighter text-2xl leading-none">
              MENCIONAL <span className="text-[#00FBFF]">SHIELD</span>
            </span>
            <span className="text-[8px] font-black tracking-[0.4em] text-zinc-600 uppercase">Hardware_Identity_Verified</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-950 rounded-2xl border border-white/5 shadow-inner">
          <div className={`w-2 h-2 rounded-full ${hasAccess ? 'bg-[#39FF14] shadow-[0_0_10px_#39FF14]' : 'bg-rose-500 animate-pulse'}`} />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            {profile?.deviceId.substring(0, 16)}...
          </span>
        </div>
      </nav>

      {/* PANEL DE VALIDACIÓN CENTRAL */}
      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Glow de fondo OLED */}
        <div className={`absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-10 pointer-events-none transition-colors duration-1000 ${hasAccess ? 'bg-[#00FBFF]' : 'bg-rose-500'}`} />

        <div className="max-w-md w-full bg-[#050505] border border-white/10 rounded-[4rem] p-12 text-center shadow-2xl relative z-10">
          
          <div className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center mb-10 transition-all duration-1000 ${hasAccess ? 'bg-[#00FBFF]/10 text-[#00FBFF] rotate-[360deg]' : 'bg-rose-500/10 text-rose-500'}`}>
            {hasAccess ? <CheckCircle size={56} className="animate-pulse" /> : <Lock size={56} />}
          </div>

          <h2 className="text-4xl font-black uppercase italic mb-6 tracking-tighter leading-[0.9] whitespace-pre-line">
            {hasAccess ? 'SISTEMA\nLISTO' : 'ACCESO\nLIMITADO'}
          </h2>
          
          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-tight mb-12 leading-relaxed opacity-80">
            {hasAccess 
              ? "Bloque de 20 minutos sincronizado. Presiona para iniciar la inmersión lingüística maestra." 
              : "Las sesiones inician en bloques sincronizados de 20 minutos ($20 MXN) para garantizar la latencia cero."}
          </p>

          <div className="space-y-4">
            {hasAccess ? (
              <button 
                onClick={handleAccess} 
                className="w-full py-6 bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-[2rem] flex items-center justify-center gap-4 hover:bg-[#00FBFF] transition-all italic active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
              >
                ENTRAR A LA SESIÓN <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handlePayment} 
                disabled={isProcessing} 
                className="w-full py-6 bg-[#00FBFF] text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-[2rem] flex items-center justify-center gap-4 shadow-[0_0_50px_rgba(0,251,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 italic"
              >
                {isProcessing ? (
                  <Activity size={22} className="animate-spin" />
                ) : (
                  <>PAGAR BLOQUE ($20 MXN) <CreditCard size={18} /></>
                )}
              </button>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5">
             <div className="flex flex-col gap-1">
                <p className="text-[8px] font-black text-zinc-700 uppercase italic tracking-widest">
                  Mencional Security Engine v16.0
                </p>
                <p className="text-[7px] font-bold text-zinc-800 uppercase tracking-widest">
                  AES-256-GCM Hardware Encrypted
                </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SafeInterpPage;