/** 🛣️ MENCIONAL | APP_ROUTER v2026.PROD
 * Orquestación de Vistas y Jerarquía de Modos (Aprendizaje / Ultra / Rompehielo)
 * Ubicación: /src/router/AppRouter.tsx
 * ✅ UPDATE: Protocolo de acceso estricto (Admin vs Guest/Participant).
 * ✅ UPDATE: Sincronización de flujo de Evaluación y Diagnóstico.
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
import EvaluationTest from "../views/EvaluationTest"; 
import EvaluationResults from "../views/EvaluationResults"; 

const AppRouter: React.FC = () => {
  const { settings } = useSettings();

  /**
   * 🛡️ PROTOCOLO DE ACCESO MENCIONAL 2026
   * Admin: Acceso total ilimitado tras validación "Master Key".
   * Participant: Acceso tras validación de pago ($90 MXN).
   */
  const isAdmin = settings?.role === 'admin' || settings?.isUnlimited === true;
  const hasPaidAccess = settings?.isPaid === true;
  const canAccessCore = isAdmin || hasPaidAccess;

  // ✅ BLINDAJE OLED DE CARGA (Failsafe)
  if (!settings) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-[1px] bg-[#00FBFF] animate-pulse" />
        <div className="text-[#00FBFF] text-[10px] tracking-[0.8em] italic uppercase opacity-50">
          Sincronizando_Servicios_AI
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 🏠 PUERTA DE ENLACE: Único punto de entrada sin credenciales */}
      <Route path="/" element={<WelcomeGate />} />

      {/* 💳 PASARELA: Si es Admin, salta directo al Hub. Si ya pagó, también. */}
      <Route 
        path="/checkout" 
        element={canAccessCore ? <Navigate to="/selector" replace /> : <PaymentGateway />} 
      />

      {/* 🎯 HUB CENTRAL: Punto de bifurcación de la experiencia */}
      <Route 
        path="/selector" 
        element={canAccessCore ? <SessionSelector /> : <Navigate to="/" replace />} 
      />

      {/* 🆕 SELECTOR DE INTENCIÓN: Sub-capa de configuración */}
      <Route 
        path="/selector-intencion" 
        element={canAccessCore ? <IntentSelector /> : <Navigate to="/checkout" replace />} 
      />

      {/* ⚙️ SETUP: Configuración de idiomas y niveles */}
      <Route 
        path="/setup" 
        element={canAccessCore ? <SessionSetup /> : <Navigate to="/checkout" replace />} 
      />

      {/* 🎓 MODO APRENDIZAJE: Inmersión total inicial */}
      <Route 
        path="/learning" 
        element={canAccessCore ? <LearningMode /> : <Navigate to="/selector" replace />} 
      />

      {/* 🚀 MODO ULTRA: Traducción selectiva basada en Escudo Neural */}
      <Route 
        path="/ultra" 
        element={canAccessCore ? <UltraInterpreter /> : <Navigate to="/selector" replace />} 
      />

      {/* 🍻 MODO ROMPEHIELO: Soporte social de baja latencia */}
      <Route 
        path="/rompehielo" 
        element={canAccessCore ? <RompehieloMode /> : <Navigate to="/selector" replace />} 
      />

      {/* 🧠 TEST DE EVALUACIÓN: Diagnóstico para calibrar el Modo Ultra */}
      <Route 
        path="/evaluation" 
        element={canAccessCore ? <EvaluationTest /> : <Navigate to="/" replace />} 
      />

      {/* 📊 RESULTADOS: Visualización de métricas de dominio */}
      <Route 
        path="/results" 
        element={canAccessCore ? <EvaluationResults /> : <Navigate to="/" replace />} 
      />

      {/* 🖥️ DASHBOARD: Panel de control exclusivo para el Administrador */}
      <Route 
        path="/admin" 
        element={isAdmin ? <AdminDashboard /> : <Navigate to="/selector" replace />} 
      />

      {/* 🛰️ FAILSAFE: Cualquier ruta no definida colapsa al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;