/**
 * 🚪 Digoapp | WELCOME_GATE v2026.12
 * Ubicación: /src/views/WelcomeGate.tsx (o /src/components/WelcomeGate.tsx)
 * Función: Bifurcación de Roles, Persistencia de Sesión y Acceso Maestro.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // Asegura que useAuth maneje localStorage
import { identity } from '../utils/identity'; // Para Fingerprinting de seguridad
import { logger } from '../utils/logger';

// Assets - El logo sale desde el principio
import logoUltra from '/logo.png'; // Ruta directa a public/logo.png para carga inmediata

export const WelcomeGate: React.FC = () => {
  const [view, setView] = useState<'SELECT' | 'ADMIN_AUTH'>('SELECT');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const { loginAdmin } = useAuth(); 
  const navigate = useNavigate();

  /**
   * ✅ PROTOCOLO DE PERSISTENCIA
   * Si el usuario ya está autenticado (isAdmin o pago verificado), 
   * lo enviamos directamente al selector para evitar el login loop.
   */
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const isPaid = localStorage.getItem('payment_status') === 'verified';

    if (isAdmin || isPaid) {
      navigate('/selector', { replace: true });
    }
  }, [navigate]);

  /**
   * 👤 FLUJO 1: PARTICIPANTE (Pago Inmediato)
   * Redirige inmediatamente a Mercado Pago. Al pagar, el webhook debe marcar 'payment_status'.
   */
  const handleParticipantAccess = () => {
    logger.info("NAV", "Participante inicia flujo de pago.");
    // Seteo temporal de rol para el router
    localStorage.setItem('mencional_role', 'participant');
    window.location.href = "https://mpago.la/2fPScDJ"; 
  };

  /**
   * 🔑 FLUJO 2: ADMINISTRADOR (Clave: "osos")
   * Desbloquea las 3 funciones: Aprendizaje, Intérprete y Rompehielo.
   */
  const handleAdminAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const cleanPassword = password.trim().toLowerCase();
    
    if (cleanPassword === 'osos') {
      const deviceId = identity.getFingerprint?.() || "dev_default";
      
      logger.security("AUTH", "Acceso Administrador concedido.");
      
      // ✅ PERSISTENCIA FÍSICA: Evita la pantalla negra al navegar o refrescar
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('mencional_role', 'admin');
      localStorage.setItem('auth_token', 'admin_active');
      localStorage.setItem('device_fingerprint', deviceId);

      loginAdmin?.(cleanPassword); // Sincroniza estado global
      navigate('/selector', { replace: true });
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 text-white font-sans relative overflow-hidden">
      
      {/* 🌌 AMBIENTE OLED */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,251,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* 🟢 LOGO: Visible desde el segundo 0 */}
      <img 
        src={logoUltra} 
        alt="Mencional Logo" 
        className="w-32 mb-12 drop-shadow-[0_0_15px_rgba(0,251,255,0.4)] z-10" 
      />

      {view === 'SELECT' ? (
        <div className="w-full max-w-xs space-y-6 z-10">
          <h2 className="text-center text-zinc-500 uppercase tracking-[0.4em] text-[10px] mb-8">
            Protocolo de Identificación
          </h2>
          
          <button
            onClick={handleParticipantAccess}
            className="group w-full py-6 bg-zinc-900 border-2 border-white/5 rounded-2xl hover:border-white/20 transition-all active:scale-95"
          >
            <span className="block font-black uppercase tracking-widest text-sm text-white">
              Participante
            </span>
            <span className="block text-[9px] text-zinc-500 font-bold mt-1">
              ACCESO 20 MIN | $20 MXN
            </span>
          </button>

          <button
            onClick={() => setView('ADMIN_AUTH')}
            className="w-full py-4 bg-transparent text-zinc-600 font-bold uppercase text-[10px] tracking-widest hover:text-cyan-400 transition-colors"
          >
            Acceso Técnico (Admin)
          </button>
        </div>
      ) : (
        <form onSubmit={handleAdminAuth} className="w-full max-w-xs space-y-6 z-10">
          <h1 className="text-[#00FBFF] text-xl font-[1000] uppercase tracking-[0.2em] text-center italic">
            VALIDAR_MAESTRO
          </h1>

          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-zinc-900/90 border-2 p-5 rounded-2xl text-white text-center font-black text-2xl outline-none transition-all tracking-[0.4em] ${
              error ? 'border-red-600 animate-shake' : 'border-white/10 focus:border-[#00FBFF]'
            }`}
            placeholder="••••"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => { setView('SELECT'); setError(false); }}
              className="flex-1 py-4 text-zinc-500 font-bold uppercase text-[10px] tracking-widest"
            >
              Atrás
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-[#00FBFF] text-black font-black uppercase rounded-2xl text-xs hover:shadow-[0_0_20px_#00FBFF] transition-all"
            >
              Entrar
            </button>
          </div>
        </form>
      )}

      <footer className="absolute bottom-10 opacity-30">
        <p className="text-[8px] text-zinc-500 text-center uppercase tracking-[0.5em] font-black">
          Mencional Neural Engine | v2026.12
        </p>
      </footer>
    </div>
  );
};

export default WelcomeGate;