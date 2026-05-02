/**
 * 🔐 MENCIONAL | USE_AUTH v2026.PROD
 */

import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

// ⚠️ CORRECCIÓN DE IMPORT: Ajustar según cómo exportes en speechService.ts
// Si es export nombrado: { speechService } | Si es default: speechService
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

  const userFingerprint = useMemo(() => SecurityEngine.generateFingerprint(), []);

  const loginAsAdmin = useCallback(async (password: string): Promise<boolean> => {
    const cleanPassword = password.toLowerCase().trim();
    
    if (cleanPassword === 'osos') {
      const adminName = 'ADMIN_MASTER';

      localStorage.setItem('mencional_role', 'admin');
      localStorage.setItem('access_mode', 'operator');
      localStorage.setItem('mencional_auth', 'true'); 
      localStorage.setItem('mencional_paid', 'true'); 
      localStorage.setItem('mencional_user_name', adminName);

      updateSettings({ 
        userAlias: adminName,
        role: 'admin',
        isUnlimited: true, 
        themeColor: palette10[1], 
        // sessionActive: true // Asegúrate que esta prop exista en tu SettingsState
      });

      logger.info("AUTH", "Protocolo 'osos' validado. Nodo Maestro Activo.");
      
      // Feedback auditivo (Solo si el servicio está disponible)
      if (speechService?.speak) {
        await speechService.speak("Acceso Maestro validado. Sistema Mencional listo.", { 
          mode: 'ultra', 
          rate: 1.1 
        });
      }

      setTimeout(() => {
        navigate('/selector', { replace: true }); 
      }, 100);
      
      return true;
    }
    
    logger.error("AUTH_FAIL", "Intento de acceso maestro denegado.");
    return false;
  }, [updateSettings, navigate, palette10]);

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

    updateSettings({ 
      userAlias: name,
      role: 'participant',
      isUnlimited: false, 
      themeColor: palette10[0]
    });

    navigate('/setup', { replace: true }); 
    return { blocked: false };
  }, [userFingerprint, updateSettings, navigate, palette10]);

  const authStatus: AuthStatus = useMemo(() => {
    const localRole = localStorage.getItem('mencional_role');
    const role = settings.role !== 'guest' ? settings.role : localRole;
    const mode = localStorage.getItem('access_mode');
    const name = settings.userAlias || localStorage.getItem('mencional_user_name') || 'GUEST';

    return {
      userFingerprint,
      isAuthenticated: role === 'admin' || localStorage.getItem('mencional_auth') === 'true', 
      isAdmin: role === 'admin',
      accessMode: (mode as 'operator' | 'participant' | null),
      isPaid: role === 'admin' || localStorage.getItem('mencional_paid') === 'true',
      userName: name,
      loading: false 
    };
  }, [userFingerprint, settings]);

  const logout = useCallback(() => {
    if (speechService && typeof speechService.stopAll === 'function') {
      speechService.stopAll();
    } else {
      window.speechSynthesis.cancel();
    }

    localStorage.clear(); // Limpieza total por seguridad en v2026
    resetSettings();
    
    logger.info("AUTH", "Sesión finalizada. Recursos liberados.");
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