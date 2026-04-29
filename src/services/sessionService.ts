/**
 * 🛰️ SESSION_SERVICE v16.2 - MENCIONAL 2026.PROD
 * Motor de persistencia y validación de acceso en tiempo real.
 * Resuelve: Bypass Maestro, control de 1 Hora y registro de telemetría.
 * Ubicación: /src/services/sessionService.ts
 * ✅ ACTUALIZADO: Bloques de 60 min ($90 MXN)
 */

import { db } from "./firebaseConfig"; 
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  getDoc,
  increment
} from "firebase/firestore";

// ✅ Importaciones sincronizadas con el sistema de tipos v2026
import { SessionRecord, SessionOptions, SessionStatus } from "../types/index"; 
import { logger } from "../utils/logger"; 

/**
 * 🛡️ initiateSession
 * Crea la sesión en Firebase y define el tiempo de vida (TTL).
 * El operador Maestro (Admin) recibe 24h, el participante estándar 1 Hora.
 */
export async function initiateSession(opts: SessionOptions) {
  const {
    id,
    userId,
    isAdmin = false,
    paid = false,
    topic = "BIENVENIDA_TOP",
    languageCode = "en-US",
    mode = 'learning', 
    textScale = 'medium',
    themeColor = '#00FBFF'
  } = opts;

  // ⚡ REGLA DE SEGURIDAD MENCIONAL: Bloqueo de acceso si no hay pago ni rol Admin.
  if (!isAdmin && !paid) {
    logger.error("AUTH_DENIED: SESSION_INIT_WITHOUT_CREDITS");
    throw new Error("REQUIRED_PAYMENT_OR_ADMIN_AUTH");
  }

  /** ⏳ CRONOMETRÍA MENCIONAL 2026: 
   * Operador Maestro (admin): 24 Horas (Inmunidad total).
   * Participante: 60 Minutos (Ciclo comercial de $90 MXN).
   */
  const SESSION_DURATION_MS = isAdmin ? (24 * 60 * 60 * 1000) : (60 * 60 * 1000);
  
  const startTime = Date.now();
  const expiryDate = new Date(startTime + SESSION_DURATION_MS);
  const sessionRef = doc(db, "sessions", id);

  const sessionData: Partial<SessionRecord> = {
    id,
    hostId: userId || 'anonymous_node',
    topic,
    languageCode,
    sessionMode: mode,
    initialDurationMs: SESSION_DURATION_MS,
    createdAt: serverTimestamp(),
    endTime: Timestamp.fromDate(expiryDate),
    paid: isAdmin ? true : paid,
    isAdminSession: isAdmin,
    status: "preparing" as SessionStatus,
    telemetry: {
      turnsCount: 0,
      avgResponseTime: 0,
      wordCount: 0,
      reflexHits: 0 
    },
    visualSettings: {
      textScale,
      themeColor
    },
    /**
     * ⚙️ CONFIGURACIÓN DE PROTOCOLOS ESPECÍFICOS (Motores /ai/)
     * Rompehielo: 4s | Aprendizaje/Test: 6s | Intérprete/Ultra: 19s
     */
    config: {
      listeningWindow: mode === 'rompehielo' ? 4000 : (mode === 'ultra' ? 19000 : 6000),
      autoRepeat: mode === 'learning' ? 2 : 0, 
      synthesisSpeed: mode === 'ultra' ? 2.0 : 1.0, // Velocidad 2x para interpretación fluida
      pricePoint: isAdmin ? "FREE_ADMIN" : "$90 MXN"
    }
  };

  try {
    await setDoc(sessionRef, sessionData);
    logger.info("SESSION_CREATED", { sessionId: id, mode, isAdmin, price: "$90" });
    
    return { 
      id, 
      endTime: expiryDate, 
      duration: SESSION_DURATION_MS,
      accessGranted: true 
    };
  } catch (error) {
    logger.error("DATABASE_SYNC_FAILED", error);
    throw new Error("DATABASE_SYNC_FAILED");
  }
}

/**
 * 🚀 startSession: Activa formalmente el cronómetro en la DB.
 */
export async function startSession(id: string) {
  const sessionRef = doc(db, "sessions", id);
  try {
    await updateDoc(sessionRef, {
      status: "active" as SessionStatus,
      startedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    logger.error("SESSION_START_ERROR", { id, error });
    return false;
  }
}

/**
 * 🔄 logTurn: Registra telemetría para el análisis de efectividad del ciclo.
 */
export async function logTurn(id: string, wordsProcessed: number = 0, isReflex: boolean = false) {
  if (!id) return;
  try {
    const sessionRef = doc(db, "sessions", id);
    const updates: Record<string, any> = {
      "telemetry.turnsCount": increment(1),
      "telemetry.wordCount": increment(wordsProcessed)
    };

    if (isReflex) {
      updates["telemetry.reflexHits"] = increment(1);
    }

    await updateDoc(sessionRef, updates);
  } catch (e) {
    console.warn("[TELEMETRY_BYPASS]: Fallo en registro de turno (Offline Mode).");
  }
}

/**
 * 🔍 checkSessionValidity: Valida tiempo y estado de la sesión.
 */
export async function checkSessionValidity(id: string, isAdmin: boolean = false): Promise<boolean> {
  // El Admin (Bypass 'osos') tiene inmunidad de tiempo total
  if (isAdmin) return true;

  try {
    const sessionRef = doc(db, "sessions", id);
    const snap = await getDoc(sessionRef);

    if (!snap.exists()) return false;
    const data = snap.data() as SessionRecord;

    const terminalStates: SessionStatus[] = ["completed", "expired", "terminated"];
    if (terminalStates.includes(data.status)) return false;

    const now = Date.now();
    const expiry = (data.endTime as Timestamp).toMillis();

    // Verificación de expiración
    if (now >= expiry) {
      await updateDoc(sessionRef, { status: "expired" as SessionStatus });
      logger.warn("SESSION_EXPIRED", { id });
      return false;
    }

    return true;
  } catch (e) {
    // Failsafe Mencional: Si hay red inestable, permitimos continuar
    logger.warn("SESSION_VALIDATION_NETWORK_BYPASS", { id });
    return true; 
  }
}

/**
 * 🏁 endSession: Cierre de ciclo y limpieza de estado.
 */
export async function endSession(id: string, reason: SessionStatus = "completed") {
  if (!id) return false;
  try {
    const sessionRef = doc(db, "sessions", id);
    await updateDoc(sessionRef, {
      status: reason,
      endedAt: serverTimestamp(),
    });
    logger.info("SESSION_CLOSED", { id, reason });
    return true;
  } catch (error) {
    logger.error("SESSION_END_ERROR", { id, error });
    return false;
  }
}

export const sessionService = {
  initiate: initiateSession,
  start: startSession,
  log: logTurn,
  check: checkSessionValidity,
  end: endSession
};

export default sessionService;