/**
 * ⚠️ MENCIONAL | SESSION_GUARD v2026.PROD
 * Lógica: Validación de Acceso, Gestión de Ciclos (30 min) y Protección de Créditos.
 * Ubicación: /src/components/SessionGuard.tsx
 * ✅ ESTÁNDAR: Sincronizado con v2.6 (Protección contra No-Shows)
 */
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export const SessionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useSettings(); // Sincronizado con SettingsContext (v16.0 Core)

  useEffect(() => {
    // 🛡️ PROTOCOLO MAESTRO: BYPASS PARA ADMINISTRADORES
    // Los administradores ignoran las restricciones de tiempo y pago.
    if (isAdmin) return;

    // 🕒 CONFIGURACIÓN DE CICLO v2.6 ($50 MXN)
    const sessionStart = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // Ciclo actualizado de 30 min

    /**
     * 🔥 PROTOCOLO DE ABANDONO / CONSUMO (Anti No-Show)
     * Si el participante cierra la pestaña o navega fuera, el bloque se consume.
     */
    const handleIncompleteSession = () => {
      const elapsed = Date.now() - sessionStart;
      const isSessionActive = localStorage.getItem('access_granted') === 'true';

      // Si la sesión está activa y se detecta salida antes de los 30 min
      if (isSessionActive && elapsed < thirtyMinutes) {
        console.warn("[MENCIONAL_SYNC] Abandono detectado. Bloque de 30 min marcado como CONSUMIDO.");
        
        // 🚨 LIMPIEZA DE CREDENCIALES DE SESIÓN
        // Esto obliga a una nueva validación/pago vía Mercado Pago para reingresar.
        localStorage.removeItem('access_granted'); 
        localStorage.removeItem('session_token');
        localStorage.removeItem('current_node_id');
      }
    };

    // 📡 SEGURIDAD DE RUTA NEURAL
    const publicPaths = ['/', '/login', '/payment', '/welcome'];
    const isAccessGranted = localStorage.getItem('access_granted') === 'true';

    // Bloqueo de acceso si no hay token de pago activo
    if (!isAccessGranted && !publicPaths.includes(location.pathname)) {
      console.error("[GUARD] Acceso denegado: Token de sesión inexistente o expirado.");
      navigate('/');
    }

    // ⚡ PROTECCIÓN DE HARDWARE (Recarga/Cierre de pestaña)
    window.addEventListener('beforeunload', handleIncompleteSession);

    return () => {
      // Si el componente se desmonta por navegación interna fuera del nodo
      handleIncompleteSession();
      window.removeEventListener('beforeunload', handleIncompleteSession);
    };
  }, [location, navigate, isAdmin]);

  return <>{children}</>;
};

export default SessionGuard;