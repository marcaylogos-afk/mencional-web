/**
 * 🛡️ MENCIONAL | MODERATION_ENGINE v20.0
 * Gestión de Seguridad: Protocolo Strike 3, Ban de Hardware y Sincronía Forzada.
 * Ubicación: /src/services/data/ModerationEngine.ts
 * Estado: PRODUCCIÓN FINAL | SEGURIDAD_CRÍTICA
 */

import { ref, update, get, child, increment, remove } from "firebase/database";
import { db as rtdb } from "../ai/firebaseConfig"; 
import { logger } from "../../utils/logger";

export const ModerationEngine = {
  /**
   * 📡 REGISTRO DE REPORTE TÁCTICO
   * Al alcanzar el umbral crítico (3 reportes), activa el baneo automático.
   */
  registerReport: async (reporterId: string, targetId: string, reason: string = "INAPPROPRIATE_BEHAVIOR") => {
    try {
      if (!reporterId || !targetId) throw new Error("IDENTIFICADORES_NULOS");
      if (reporterId === targetId) return { success: false, error: "SELF_REPORT_DISABLED" };

      const dbRef = ref(rtdb);
      const now = Date.now();
      
      // 1. REGISTRO LOCAL DE FILTRO (Evita emparejamientos futuros para el reportero)
      const localBlockPath = `nodes/${reporterId}/filters/${targetId}`;
      
      // 2. CONTADOR GLOBAL DE STRIKES
      const strikePath = `security/strikes/${targetId}`;

      const updates: Record<string, any> = {};
      updates[localBlockPath] = {
        timestamp: now,
        reason: reason 
      };
      updates[`${strikePath}/count`] = increment(1);
      updates[`${strikePath}/last_reporter`] = reporterId;
      updates[`${strikePath}/last_update`] = now;
      updates[`${strikePath}/history/${now}`] = {
        by: reporterId,
        reason: reason
      };

      // Ejecución Atómica
      await update(ref(rtdb), updates);

      // 3. EVALUACIÓN DE PROTOCOLO STRIKE 3
      const snapshot = await get(child(dbRef, strikePath));
      const currentStrikes = snapshot.exists() ? snapshot.val().count : 0;

      if (currentStrikes >= 3) {
        await ModerationEngine.applyGlobalBan(targetId);
        return { success: true, status: 'BANNED' };
      }

      logger.info("SECURITY", `Strike inyectado a [${targetId}]: Total ${currentStrikes}/3.`);
      return { success: true, status: 'STRIKE_ADDED', current: currentStrikes };

    } catch (error) {
      logger.error("FATAL_MODERATION_ERROR", error);
      return { success: false, error };
    }
  },

  /**
   * 🚫 PROTOCOLO DE EXPULSIÓN Y BANEO GLOBAL
   * Ejecuta: Saldo a CERO + Desconexión Forzada + Marcaje por 7 días.
   */
  applyGlobalBan: async (targetId: string) => {
    try {
      const timestamp = Date.now();
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
      const expiryDate = timestamp + SEVEN_DAYS_MS;
      
      const securityUpdates: Record<string, any> = {
        // A. Marcaje en Lista Negra
        [`security/blacklist/${targetId}`]: {
          timestamp,
          expiry: expiryDate, 
          reason: "VIOLATION_OF_COMMUNITY_RULES (STRIKE_3)",
          status: "TEMPORARY_BAN_7_DAYS",
          app_version: "MENCIONAL_V20_PROD"
        },
        // B. Sincronización Forzada de Nodo (Kill-Switch)
        [`nodes/${targetId}/status`]: "BANNED",
        [`nodes/${targetId}/session_active`]: false,
        [`nodes/${targetId}/credit_balance`]: 0, // Confiscación por infracción de términos
        [`nodes/${targetId}/last_incident`]: timestamp,
        [`nodes/${targetId}/restricted`]: true,
        [`nodes/${targetId}/force_logout_signal`]: Math.random() // Dispara el listener en el cliente
      };

      await update(ref(rtdb), securityUpdates);

      // Feedback visual para el Admin en consola (OLED Estilo)
      console.warn(
        `%c 🚫 [BAN_APPLIED] NODO: ${targetId} | BLOQUEO: 7 DÍAS `, 
        "color: #FF3131; background: #000000; padding: 10px; font-weight: 900; border: 2px solid #FF3131; border-radius: 8px;"
      );
      
    } catch (err) {
      logger.error("FAILED_TO_EXECUTE_GLOBAL_BAN", err);
    }
  },

  /**
   * 🔍 VERIFICADOR DE INTEGRIDAD (Gatekeeper Check)
   * Se debe llamar al iniciar la App o al intentar entrar a un aula.
   */
  checkBanStatus: async (nodeId: string): Promise<{ isBanned: boolean; expiry?: number; remainingDays?: number }> => {
    if (!nodeId) return { isBanned: false };
    
    try {
      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `security/blacklist/${nodeId}`));
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const now = Date.now();

        // Auto-limpieza si el ban ya expiró
        if (data.expiry && now > data.expiry) {
          await ModerationEngine.resetNodeStrikes(nodeId);
          return { isBanned: false };
        }

        const remainingMs = data.expiry - now;
        const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

        logger.warn("SECURITY", `Acceso denegado: Nodo ${nodeId} bloqueado por ${remainingDays} días.`);
        return { isBanned: true, expiry: data.expiry, remainingDays };
      }
      return { isBanned: false };
    } catch (error) {
      logger.error("CHECK_BAN_FAULT", error);
      return { isBanned: false }; 
    }
  },

  /**
   * 🛠️ RESET_STRIKES (Exclusivo Maestro / Bypass Admin)
   * Restaura la cuenta a su estado original.
   */
  resetNodeStrikes: async (nodeId: string) => {
    try {
      const updates: Record<string, any> = {
        [`security/strikes/${nodeId}`]: null,
        [`security/blacklist/${nodeId}`]: null,
        [`nodes/${nodeId}/status`]: "ACTIVE",
        [`nodes/${nodeId}/restricted`]: false,
        [`nodes/${nodeId}/force_logout_signal`]: null,
        [`nodes/${nodeId}/last_incident`]: null
      };
      
      await update(ref(rtdb), updates);
      logger.info("SECURITY", `Protocolo de restauración completado para: ${nodeId}`);
      return { success: true };
    } catch (error) {
      logger.error("RESET_STRIKES_ERROR", error);
      return { success: false, error };
    }
  }
};

export default ModerationEngine;