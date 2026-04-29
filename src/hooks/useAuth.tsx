/**
 * 🔐 MENCIONAL | USE_AUTH v2026.PROD
 * Protocolo: Gestión de acceso Maestro (Operador) y Participante.
 * Ubicación: /src/hooks/useAuth.ts
 * ✅ DIRECTORIO AI: Sincronizado con /src/services/ai/
 */

import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

// ✅ Sincronización estricta con carpeta 'ai'
import { speechService } from "../services/ai/speechService";
import { SecurityEngine } from "../services/data/SecurityEngine";
import { logger } from "../utils/logger";

interface AuthStatus {
  userFingerprint: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  accessMode: 'operator' | 'participant' | null;
  isPaid: boolean;
  userName: string;
  loading: boolean; 
}

export const useAuth = () => {
  const { updateSettings, resetSettings, settings, palette10 } = useSettings();
  const navigate = useNavigate();

  // Huella digital única para el hardware (Prevención de bloqueos y seguridad)
  const userFingerprint = useMemo(() => SecurityEngine.generateFingerprint(), []);

  /**
   * 🔑 ACCESO MAESTRO (Protocolo "osos")
   * Otorga privilegios totales e inmunidad de pago. 
   * Color Admin: Verde Neón OLED (#39FF14).
   */
  const loginAsAdmin = useCallback(async (password: string): Promise<boolean> => {
    const cleanPassword = password.toLowerCase().trim();
    
    // Validación de la llave maestra del Nodo Maestro
    if (cleanPassword === 'osos') {
      const adminName = 'ADMIN_MASTER';

      // Persistencia de privilegios de Operador
      localStorage.setItem('mencional_role', 'admin');
      localStorage.setItem('access_mode', 'operator');
      localStorage.setItem('mencional_auth', 'true'); 
      localStorage.setItem('mencional_paid', 'true'); 
      localStorage.setItem('mencional_user_name', adminName);

      // Sincronización visual: Verde Neón para indicar estado "Ilimitado"
      updateSettings({ 
        userAlias: adminName,
        role: 'admin',
        isUnlimited: true, 
        themeColor: palette10[1], // Verde Neón OLED
        sessionActive: true
      });

      logger.info("AUTH", "Protocolo 'osos' validado. Nodo Maestro Activo.");
      
      // ✅ Feedback auditivo Aoede desde la ruta /ai/
      await speechService.speak("Acceso Maestro validado. Sistema Mencional listo.", { 
        mode: 'ultra', 
        rate: 1.1 
      });

      setTimeout(() => {
        // Redirección al Selector de 3 Funciones (Aprendizaje, Intérprete, Rompehielo)
        navigate('/selector', { replace: true }); 
      }, 100);
      
      return true;
    }
    
    logger.error("AUTH_FAIL", "Intento de acceso maestro denegado.");
    return false;
  }, [updateSettings, navigate, palette10]);

  /**
   * 👤 ACCESO PARTICIPANTE
   * Perfil temporal con restricciones de tiempo y acceso único a Aprendizaje.
   */
  const loginAsParticipant = useCallback(async (customName?: string) => {
    const status = await SecurityEngine.verifyUserStatus(userFingerprint);
    
    if (status.isBlocked) {
      logger.error("SECURITY", "Hardware bloqueado por infracción previa.");
      navigate('/blocked', { replace: true }); 
      return { blocked: true };
    }

    const name = (customName?.trim() || 'PARTICIPANTE_NODE').toUpperCase();
    
    localStorage.setItem('mencional_role', 'participant');
    localStorage.setItem('access_mode', 'participant');
    localStorage.setItem('mencional_user_name', name);
    localStorage.setItem('mencional_auth', 'false');
    localStorage.setItem('mencional_paid', 'false');

    updateSettings({ 
      userAlias: name,
      role: 'participant',
      isUnlimited: false, 
      themeColor: palette10[0], // Cyan Neón Estándar (#00FBFF)
      sessionActive: false
    });

    logger.info("AUTH", `Perfil '${name}' creado. Redirigiendo a Setup.`);
    
    // Los participantes solo pueden acceder al flujo de configuración guiada
    navigate('/setup', { replace: true }); 
    
    return { blocked: false };
  }, [userFingerprint, updateSettings, navigate, palette10]);

  /**
   * 📊 ESTADO DE SESIÓN (Rehidratación reactiva)
   */
  const authStatus: AuthStatus = useMemo(() => {
    const localRole = localStorage.getItem('mencional_role');
    const role = settings.role !== 'guest' ? settings.role : localRole;
    const mode = localStorage.getItem('access_mode');
    const auth = settings.sessionActive || localStorage.getItem('mencional_auth') === 'true'; 
    const paid = settings.isUnlimited || localStorage.getItem('mencional_paid') === 'true';
    const name = settings.userAlias || localStorage.getItem('mencional_user_name') || 'GUEST';

    return {
      userFingerprint,
      isAuthenticated: auth || role === 'admin', 
      isAdmin: role === 'admin',
      accessMode: (mode as 'operator' | 'participant' | null),
      isPaid: role === 'admin' ? true : paid,
      userName: name,
      loading: false 
    };
  }, [userFingerprint, settings]);

  /**
   * 🚪 LOGOUT (Cierre de ciclo y liberación de hardware)
   */
  const logout = useCallback(() => {
    // 🛡️ Liberación de recursos de IA desde /services/ai/
    if (speechService && typeof speechService.stopAll === 'function') {
      speechService.stopAll();
    } else {
      window.speechSynthesis.cancel();
    }

    const keys = [
      'mencional_role', 'access_mode', 'mencional_auth',
      'mencional_paid', 'mencional_user_name', 'mencional_session_start',
      'mencional_noshow_count'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    
    resetSettings();
    
    logger.info("AUTH", "Sesión finalizada. Recursos de IA y hardware liberados.");
    navigate('/', { replace: true });
  }, [resetSettings, navigate]);

  return {
    ...authStatus,
    loginAsAdmin,
    loginAsParticipant,
    logout
  };
};

export default useAuth;