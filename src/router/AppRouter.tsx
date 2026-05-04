/** 🛣️ MENCIONAL | APP_ROUTER v2026.PROD
 * Orquestación de Vistas y Jerarquía de Modos (Aprendizaje / Ultra / Rompehielo)
 * Ubicación: /src/router/AppRouter.tsx
 * ✅ FIX: Eliminado EvaluationTest (Archivo inexistente).
 * ✅ FIX: Acceso diferenciado por perfil (Admin vs Guest) y Bypass Maestro.
 * ✅ MONETIZACIÓN: Redirección automática si Admin intenta entrar a Checkout.
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

// --- 🛡️ IMPORTACIONES DE VISTAS ---
import WelcomeGate from "../views/WelcomeGate";
import IntentSelector from "../views/IntentSelector"; 
import LearningMode from "../views/LearningMode";
import UltraInterpreter from "../views/UltraInterpreter";
import RompehieloMode from "../views/RompehieloMode";
import AdminDashboard from "../views/AdminDashboard"; 
import SessionSetup from "../views/SessionSetup";
import PaymentGateway from "../views/PaymentGateway";
import SessionSelector from "../views/SessionSelector";

const AppRouter: React.FC = () => {
  const { settings } = useSettings();

  /**
   * 🛡️ PROTOCOLO DE ACCESO MENCIONAL 2026
   * Admin: Acceso total ilimitado tras ingresar MASTER_KEY.
   * Guest: Sesión de 30 min por $50 MXN tras validación de pago.
   */
  const isAdmin = settings?.role === 'admin' || settings?.isUnlimited === true;
  const hasPaidAccess = settings?.isPaid === true;
  const canAccessCore = isAdmin || hasPaidAccess;

  // ✅ BLINDAJE OLED DE CARGA: Muestra el estado mientras se sincronizan los servicios AI
  if (!settings) {
    return (
      <div className="bg-[#000000] min-h-screen flex items-center justify-center">
        <div className="text-[#00FBFF] text-[10px] tracking-[0.8em] animate-pulse italic uppercase">
          Sincronizando_Servicios_AI...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 🏠 BIENVENIDA: Punto de entrada para MASTER_KEY y GUEST_KEY */}
      <Route path="/" element={<WelcomeGate />} />

      {/* 💳 CHECKOUT: Bypass automático para el Administrador */}
      <Route 
        path="/checkout" 
        element={isAdmin ? <Navigate to="/selector" replace /> : <PaymentGateway />} 
      />

      {/* 🆕 SELECTOR DE INTENCIÓN: Acceso administrativo inmediato */}
      <Route 
        path="/selector-intencion" 
        element={isAdmin ? <IntentSelector /> : <Navigate to="/checkout" replace />} 
      />

      {/* 🎯 SELECTOR CENTRAL: Filtra modos según el rol */}
      <Route 
        path="/selector" 
        element={canAccessCore ? <SessionSelector /> : <Navigate to="/" replace />} 
      />

      {/* ⚙️ SETUP: Configuración de 30 min / $50 MXN */}
      <Route 
        path="/setup" 
        element={canAccessCore ? <SessionSetup /> : <Navigate to="/checkout" replace />} 
      />

      {/* 🎓 MODO APRENDIZAJE: Disponible para todos los perfiles validados */}
      <Route 
        path="/learning" 
        element={canAccessCore ? <LearningMode /> : <Navigate to="/selector" replace />} 
      />

      {/* 🚀 MODO ULTRA: Restringido estrictamente a Administrador */}
      <Route 
        path="/ultra" 
        element={isAdmin ? <UltraInterpreter /> : <Navigate to="/selector" replace />} 
      />

      {/* 🍻 MODO ROMPEHIELO: Restringido estrictamente a Administrador */}
      <Route 
        path="/rompehielo" 
        element={isAdmin ? <RompehieloMode /> : <Navigate to="/selector" replace />} 
      />

      {/* 🖥️ DASHBOARD: Panel de control administrativo */}
      <Route 
        path="/admin" 
        element={isAdmin ? <AdminDashboard /> : <Navigate to="/selector" replace />} 
      />

      {/* 🛰️ FAILSAFE: Redirección automática a Bienvenida */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;