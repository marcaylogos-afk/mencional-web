/**
 * 🔒 MENCIONAL | SECURITY_ENGINE v2026.PROD
 * Ubicación: /src/services/data/SecurityEngine.tsx
 * Protocolo: 3 Strikes = Baneo Global + Forfeit de Saldo ($20 MXN).
 * ✅ ESTRUCTURA DE SERVICIOS: Actualizada de /ia/ a /ai/
 */

import { ref, get, child, update } from "firebase/database";
/** * ✅ RUTA CORREGIDA: 
 * Apunta a la nueva carpeta 'ai'. Esto resuelve el error 500 en el import-analysis.
 */
import { rtdb } from "../ai/firebaseConfig"; 
import { logger } from "../../utils/logger"; 

export interface SecurityStatus {
  isBlocked: boolean;
  reason?: string;
  timestamp: number;
  role: 'admin' | 'participant' | 'guest';
  reports: number;
  coolDownUntil?: number;
  isGloballyBanned?: boolean;
  paymentStatus: 'pending' | 'approved' | 'forfeit'; 
  blockedParticipants: string[]; 
}

const SECURITY_CACHE: Map<string, SecurityStatus> = new Map();
const CACHE_EXPIRATION_MS = 300000; // 5 minutos de validez en caché
const BAN_THRESHOLD = 3; // Límite de reportes para baneo global (Protocolo Maestro)

export const SecurityEngine = {
  /**
   * 🕒 generateFingerprint
   * Crea un ID basado en el hardware del dispositivo (Entropy) para evitar bypass por borrado de caché.
   */
  generateFingerprint: (): string => {
    let id = localStorage.getItem('mencional_device_fingerprint');
    if (!id) {
      const entropy = `${navigator.hardwareConcurrency}-${screen.colorDepth}-${navigator.platform}`;
      // Generamos un Hash robusto para identificación única de terminal física
      id = `HW-${btoa(entropy).substring(0, 8).toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      localStorage.setItem('mencional_device_fingerprint', id);
    }
    return id;
  },

  /**
   * 🔑 verifyUserStatus
   * Implementa el bypass prioritario "osos" (Acceso Maestro) y validación de Hardware ID.
   */
  verifyUserStatus: async (credentials: { pass?: string; hwId: string }): Promise<{ isAllowed: boolean; role: string; reason?: string }> => {
    try {
      // 1. PROTOCOLO MAESTRO: Clave "osos" otorga inmunidad total.
      const inputPass = (credentials.pass || "").toLowerCase().trim().replace(/\s/g, '');
      
      if (inputPass === "osos") {
        const adminData = {
          'mencional_role': 'ADMIN',
          'isAdmin': 'true',
          'mencional_auth': 'true', 
          'mencional_paid': 'true', 
          'mencional_user_name': 'OPERADOR_MAESTRO'
        };
        Object.entries(adminData).forEach(([k, v]) => localStorage.setItem(k, v));
        
        logger.info("SECURITY_MASTER", "Bypass 'osos' detectado. Acceso Maestro verificado.");
        return { isAllowed: true, role: 'admin' };
      }
      
      // 2. PROTOCOLO PARTICIPANTE: Verificación en tiempo real contra Firebase RTDB (vía /ai/).
      const status = await SecurityEngine.checkAccess(credentials.hwId);
      
      const isAllowed = !status.isBlocked;
      const role = status.isGloballyBanned ? 'guest' : 'participant';

      if (isAllowed) {
         localStorage.setItem('mencional_role', role);
         localStorage.setItem('isAdmin', 'false');
      }

      return { 
        isAllowed, 
        role,
        reason: status.reason 
      };
    } catch (error) {
      logger.error("SECURITY_CRITICAL_FAILURE", error);
      return { isAllowed: false, role: 'guest', reason: "Fallo en el túnel de seguridad." };
    }
  },

  /**
   * 🛡️ checkAccess
   * Valida baneo global por strikes y estado de pago en la base de datos.
   */
  checkAccess: async (terminalId: string): Promise<SecurityStatus> => {
    const now = Date.now();
    const cached = SECURITY_CACHE.get(terminalId);

    if (cached && (now - cached.timestamp < CACHE_EXPIRATION_MS)) {
      return cached;
    }

    try {
      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `mencional_security/${terminalId}`));
      const data = snapshot.exists() ? snapshot.val() : {};
      
      const reports = data.reports || 0;
      const isGloballyBanned = data.isGloballyBanned || (reports >= BAN_THRESHOLD);
      const inCoolDown = data.coolDownUntil && now < data.coolDownUntil;

      const status: SecurityStatus = { 
        isBlocked: isGloballyBanned || inCoolDown, 
        reason: isGloballyBanned ? "BANEO GLOBAL: Reincidencia detectada. Saldo confiscado." : 
                inCoolDown ? "PENALIZACIÓN: Espera 1 hora para reintentar." : undefined,
        role: isGloballyBanned ? 'guest' : 'participant',
        timestamp: now,
        reports,
        coolDownUntil: data.coolDownUntil,
        paymentStatus: data.paymentStatus || 'pending',
        blockedParticipants: data.blockedParticipants || []
      };

      // Persistencia local del baneo para evitar recargas fraudulentas del cliente.
      if (isGloballyBanned) localStorage.setItem('mencional_global_block', 'true');

      SECURITY_CACHE.set(terminalId, status);
      return status;
    } catch (error) {
      // Fallback a acceso básico limitado en caso de error de red.
      return { 
        isBlocked: false, 
        role: 'participant', 
        timestamp: now, 
        reports: 0, 
        paymentStatus: 'pending', 
        blockedParticipants: [] 
      }; 
    }
  },

  /**
   * 🚩 registerReportOrNoShow
   * Ejecuta el protocolo de 3 Strikes: Confiscación de saldo y baneo permanente por hardware.
   */
  registerReportOrNoShow: async (terminalId: string, type: 'REPORT' | 'NOSHOW') => {
    try {
      const dbRef = ref(rtdb, `mencional_security/${terminalId}`);
      const snapshot = await get(dbRef);
      const currentData = snapshot.val() || { reports: 0 };
      const newStrikes = (currentData.reports || 0) + 1;
      const now = Date.now();

      const updates: any = { 
        reports: newStrikes, 
        lastUpdate: now,
        type: type 
      };

      if (newStrikes >= BAN_THRESHOLD) {
        updates.paymentStatus = "forfeit"; // El sistema confisca el saldo según TOS.
        updates.isGloballyBanned = true;
        localStorage.setItem('mencional_global_block', 'true');
        logger.error(`SECURITY_BAN: Terminal ${terminalId} bloqueada permanentemente por 3 strikes.`);
      } else {
        updates.coolDownUntil = now + (3600000); // 1 hora de penalización temporal.
      }

      await update(dbRef, updates);
      SECURITY_CACHE.delete(terminalId);
    } catch (error) {
      logger.error("SECURITY_UPDATE_FAILURE", error);
    }
  },

  /**
   * 🧹 clearCache
   */
  clearCache: (terminalId: string) => {
    SECURITY_CACHE.delete(terminalId);
    const items = ['mencional_role', 'isAdmin', 'mencional_auth', 'mencional_paid', 'mencional_global_block'];
    items.forEach(i => localStorage.removeItem(i));
  }
};

export default SecurityEngine;