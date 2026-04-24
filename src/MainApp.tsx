/**
 * 🛰️ MENCIONAL | CORE_ROUTING v2026.PROD
 * Objetivo: Orquestación de seguridad, roles y despacho neural de modos.
 * Ubicación: /src/MainApp.tsx
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Identidad Visual (OLED Optimized - Negro Absoluto)
import logoUltra from './assets/logo-ultra.png'; 

// Contextos, Seguridad y Logger
import { useAuth } from './context/AuthProvider';
import { logger } from './utils/logger';

// Vistas de Acceso (Gatekeepers)
import WelcomeGate from './views/WelcomeGate'; 
import AdminAuth from './views/AdminAuth';       

// Vistas de Configuración y Dashboard
import Selector from './views/SessionSelector'; 
import SessionSetup from './views/SessionSetup'; 

// Modos de Sesión (Motores Neurales vinculados a /src/services/ai/)
import LearningSession from './views/LearningSession';
import UltraInterpreter from './views/UltraInterpreter';
import ReflexMode from './views/ReflexMode'; // Modo Rompehielo

/**
 * 🛡️ COMPONENTE DE RUTA PROTEGIDA (NEURAL SHIELD)
 * Centraliza la validación de baneo (Strike System), autenticación y acceso VIP.
 */
const PrivateRoute: React.FC<{ children: React.ReactElement; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  
  // ⚡ PROTOCOLO DE SEGURIDAD: Bloqueo de hardware (Strike 3 Logic)
  const isBanned = localStorage.getItem('mencional_hw_ban') === 'true';

  // 🌀 CARGA INICIAL: Splash OLED con Glow Cian (Evita el pantallazo negro vacío)
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#000000] flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-2 border-white/5 border-t-[#00FBFF] rounded-full animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-[#00FBFF]/20 rounded-full animate-pulse" />
        </div>
        <span className="text-[10px] tracking-[0.8em] text-[#00FBFF] uppercase animate-pulse font-black italic">
          Sincronizando_Núcleo_AI
        </span>
      </div>
    );
  }

  // 🚫 ESTADO DE BANEO: Bloqueo total de interfaz por Strike Global
  if (isBanned) {
    logger.error('SECURITY', 'Acceso denegado: Hardware ID marcado con Strike_Global.');
    return (
      <div className="h-screen w-full bg-[#000000] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-px h-12 bg-rose-600 mb-6 animate-pulse" />
        <span className="text-rose-500 font-black tracking-[0.5em] uppercase text-[10px] italic">
          Acceso Restringido
        </span>
        <p className="text-zinc-800 text-[8px] mt-4 tracking-[0.3em] uppercase font-mono max-w-xs leading-relaxed">
          Protocolo de Seguridad: Strike_Global_Detected. <br />
          Su identificador de hardware ha sido invalidado por el sistema.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;
  
  if (adminOnly && !isAdmin) {
    logger.warn('AUTH', 'Acceso administrativo denegado. Redirigiendo a Selector.');
    return <Navigate to="/selector" replace />;
  }

  return children;
};

const MainApp: React.FC = () => {
  // Confirmación de telemetría para el nuevo path /ai/
  React.useEffect(() => {
    logger.info('SYSTEM', 'Mencional Engine: /src/services/ai/ activo y sincronizado.');
  }, []);

  return (
    <div className="bg-[#000000] min-h-screen selection:bg-[#00FBFF]/30 selection:text-white selection:backdrop-blur-sm overflow-x-hidden italic">
      
      <Routes>
        {/* 1. GATEWAY PRINCIPAL (Welcome Screen) */}
        <Route path="/" element={
          <div className="flex flex-col items-center min-h-screen bg-black">
            <div className="pt-20 pb-10">
              <img 
                src={logoUltra} 
                alt="Mencional Logo" 
                className="w-28 h-28 object-contain drop-shadow-[0_0_35px_rgba(0,251,255,0.2)] hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <WelcomeGate />
          </div>
        } />

        <Route path="/admin-auth" element={<AdminAuth />} />

        {/* 2. DASHBOARD & SETUP: Orquestación de Sesión */}
        <Route path="/selector" element={
          <PrivateRoute>
            <Selector />
          </PrivateRoute>
        } />

        <Route path="/session-setup" element={
          <PrivateRoute>
            <SessionSetup />
          </PrivateRoute>
        } />

        {/* 3. MOTORES NEURALES: Integración con /src/services/ai/ */}
        
        {/* MODO APRENDIZAJE */}
        <Route path="/learning-session" element={
          <PrivateRoute>
            <LearningSession />
          </PrivateRoute>
        } />

        <Route path="/learning-session/:sessionId" element={
          <PrivateRoute>
            <LearningSession />
          </PrivateRoute>
        } />
        
        {/* MODO INTÉRPRETE (ULTRA-MENCIONAL): Protocolo 'osos' */}
        <Route path="/ultra-mencional" element={
          <PrivateRoute adminOnly>
            <UltraInterpreter />
          </PrivateRoute>
        } />

        {/* MODO ROMPEHIELO: Protocolo 'osos' */}
        <Route path="/rompehielo" element={
          <PrivateRoute adminOnly>
            <ReflexMode />
          </PrivateRoute>
        } />

        {/* 🛡️ FAILSAFE: Retorno al Nodo Raíz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default MainApp;