/**
 * 🔐 AUTH_SERVICE_CORE v2026.PROD - MENCIONAL
 * Gestión de identidad: Perfil + Bypass Maestro ("osos") + Control de Pago.
 * ✅ UBICACIÓN CORREGIDA: /src/services/ai/authService.ts
 * ⚡ ESTADO: Seguridad Sincronizada
 */

import { 
  signInAnonymously, 
  onAuthStateChanged, 
  User,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from './firebaseConfig'; 
import { logger } from '../../utils/logger';
import { getDeviceFingerprint } from '../../utils/anon';

// Persistencia de larga duración para mantener la sesión durante el flujo de pago.
setPersistence(auth, browserLocalPersistence);

export const authService = {
  
  /**
   * 🛠️ initializeAuth
   * Vincula la sesión de Firebase con el Fingerprint único del dispositivo.
   */
  async initializeAuth(): Promise<User> {
    try {
      // Verificación de lista negra (Security Engine - Protocolo Strike 3)
      const isBlocked = localStorage.getItem('mencional_global_block') === 'true';
      if (isBlocked) {
        const errorMsg = "ACCESO_DENEGADO: Dispositivo restringido por protocolo de seguridad.";
        logger.error("SECURITY_BLOCK", errorMsg);
        throw new Error(errorMsg);
      }

      // Autenticación anónima para seguimiento en Firebase
      const credential = await signInAnonymously(auth);
      const fingerprint = getDeviceFingerprint();
      
      // El fingerprint es nuestra ancla para el Webhook de pago (Mercado Pago)
      localStorage.setItem('mencional_device_fingerprint', fingerprint);
      
      logger.info("AUTH_SYNC", `Nodo vinculado con ID: ${fingerprint}`);
      return credential.user;
    } catch (error) {
      logger.error("AUTH_FAILURE", "Error en sincronización neural con Firebase.");
      throw error;
    }
  },

  /**
   * 🔑 validateAccess
   * Implementa el protocolo "osos" para acceso total gratuito y registro de usuarios.
   */
  async validateAccess(input: string): Promise<{ role: 'ADMIN' | 'PARTICIPANT'; id: string }> {
    const cleanInput = input.toLowerCase().trim();
    
    // 🐻 PROTOCOLO MAESTRO "osos": Acceso total, gratuito y sin límites de tiempo.
    if (cleanInput === "osos") {
      const adminId = `MASTER_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      // Escritura atómica de flags de seguridad para el Maestro (Bypass de pago)
      const adminData = {
        'mencional_role': 'ADMIN',
        'isAdmin': 'true',
        'mencional_auth': 'true', 
        'mencional_paid': 'true', 
        'mencional_user_name': 'OPERADOR_MAESTRO',
        'participant_id': adminId,
        'mencional_auth_token': 'master_bypass_osos'
      };

      Object.entries(adminData).forEach(([key, value]) => localStorage.setItem(key, value));
      
      logger.info("AUTH_MASTER", "Protocolo 'osos' activado. Nodo Maestro autorizado.");
      return { role: 'ADMIN', id: adminId };
    } 
    
    // 👤 REGISTRO DE PARTICIPANTE: Configuración inicial con sesión inactiva.
    // El input del participante se guarda como su nombre de usuario.
    const userId = input.trim().toUpperCase() || `USER_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    const participantData = {
      'mencional_role': 'PARTICIPANT',
      'isAdmin': 'false',
      'mencional_user_name': userId,
      'participant_id': userId,
      'mencional_auth': 'false', // Requiere activación por pago ($20 MXN / 20min)
      'mencional_paid': 'false'
    };

    Object.entries(participantData).forEach(([key, value]) => localStorage.setItem(key, value));
    
    logger.info("AUTH_CONFIG", `Perfil configurado para: ${userId}. Esperando validación de pago.`);
    return { role: 'PARTICIPANT', id: userId };
  },

  /**
   * 🛡️ canAccessSection
   * Validador de jerarquía: Filtra el acceso a módulos específicos.
   * El participante solo puede entrar a LEARNING tras el pago exitoso.
   */
  canAccessSection(section: 'LEARNING' | 'INTERPRETER' | 'ROMPEHIELO' | 'SELECTOR'): boolean {
    const role = localStorage.getItem('mencional_role');
    const isPaid = localStorage.getItem('mencional_paid') === 'true';

    // El Administrador tiene acceso total garantizado (Maestro "osos").
    if (role === 'ADMIN') return true;
    
    // El Participante requiere validación de pago activa.
    if (!isPaid) return false;

    switch (section) {
      case 'LEARNING':
        return true; // Único modo permitido para participantes de pago.
      case 'INTERPRETER':
      case 'ROMPEHIELO': 
      case 'SELECTOR':
        // Herramientas exclusivas para el Operador Maestro (Ultra-Mencional).
        return false; 
      default:
        return false;
    }
  },

  /**
   * 📡 onAuthStateChange
   * Sincroniza el estado de Firebase con los roles locales para la UI de React.
   */
  onAuthStateChange(callback: (user: any) => void) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        const role = localStorage.getItem('mencional_role') || 'PARTICIPANT';
        const hasPaid = localStorage.getItem('mencional_paid') === 'true';
        
        const extendedUser = {
          uid: user.uid,
          role,
          userName: localStorage.getItem('mencional_user_name') || 'Anónimo',
          isAdmin: role === 'ADMIN',
          isPremium: hasPaid || role === 'ADMIN',
          fingerprint: localStorage.getItem('mencional_device_fingerprint')
        };
        callback(extendedUser);
      } else {
        callback(null);
      }
    });
  },

  /**
   * 🚪 logout
   * Purgado completo para garantizar seguridad total (No-Traces Policy).
   */
  async logout(): Promise<void> {
    try {
      const itemsToClear = [
        'mencional_role', 'isAdmin', 'mencional_auth', 'mencional_user_name', 
        'participant_id', 'mencional_paid', 'mencional_device_fingerprint',
        'mencional_auth_token'
      ];
      itemsToClear.forEach(item => localStorage.removeItem(item));
      await signOut(auth);
      logger.info("AUTH_LOGOUT", "Almacenamiento purgado y sesión Firebase cerrada.");
    } catch (error) {
      logger.error("LOGOUT_ERROR", "Error al cerrar el túnel de seguridad.");
    }
  }
};

export default authService;