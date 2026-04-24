/**
 * ⚠️ MENCIONAL | SESSION_GUARD v16.0
 * Lógica: Validación de Acceso y Gestión de Ciclos (20 min)
 * Ubicación: /src/components/SessionGuard.tsx
 */
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth';

export const SessionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { isAdmin } = useAuth(); // ✅ Distinción de roles para evitar bloqueos al Admin

  useEffect(() => {
    // 🛡️ BYPASS PARA ADMINISTRADORES
    // Los administradores tienen acceso total a las herramientas sin restricciones de tiempo.
    if (isAdmin) return;

    // 🕒 INICIO DEL CICLO DE 20 MINUTOS
    // Basado en el protocolo de pago de Mercado Pago ($20 MXN).
    const sessionStart = Date.now();
    const twentyMinutes = 20 * 60 * 1000;

    /**
     * 🔥 PROTOCOLO DE ABANDONO / CONSUMO
     * Si el participante navega fuera o cierra la app, el bloque de 20 min se da por consumido.
     */
    const handleIncompleteSession = () => {
      const elapsed = Date.now() - sessionStart;
      const isSessionActive = localStorage.getItem('access_granted') === 'true';

      if (isSessionActive && elapsed < twentyMinutes) {
        console.warn("[MENCIONAL_SYNC] Abandono detectado. Bloque de 20 min finalizado.");
        
        // 🚨 Sincronización con Backend (Firebase/Mercado Pago)
        // Aquí se marcaría el ID de transacción como "consumido"
        localStorage.removeItem('access_granted'); 
        localStorage.removeItem('session_token');
      }
    };

    // 📡 SEGURIDAD DE RUTA
    // Si no hay acceso concedido y no es una ruta pública, redirigir al lobby.
    const publicPaths = ['/', '/login', '/payment'];
    const isAccessGranted = localStorage.getItem('access_granted') === 'true';

    if (!isAccessGranted && !publicPaths.includes(location.pathname)) {
      navigate('/SessionLobby');
    }

    // Detectar cierre de pestaña o recarga de hardware
    window.addEventListener('beforeunload', handleIncompleteSession);

    return () => {
      // Si el componente se desmonta por navegación interna
      handleIncompleteSession();
      window.removeEventListener('beforeunload', handleIncompleteSession);
    };
  }, [location, navigate, isAdmin]);

  return <>{children}</>;
};

export default SessionGuard;