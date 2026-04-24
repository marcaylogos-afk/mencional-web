/**
 * 🛰️ MENCIONAL | GROUP_SERVICE v3.2 (STABLE)
 * Gestión de presencia, sincronización de ráfagas y latencia cero.
 * Ubicación: /src/services/groupService.ts
 */

import { rtdb } from "./firebaseConfig";
import {
  ref,
  set,
  onValue,
  serverTimestamp,
  remove,
  onDisconnect,
  Unsubscribe,
  DataSnapshot,
  update,
  push,
  get
} from "firebase/database";
import { logger } from "../utils/logger";

// --- ⚙️ INTERFAZ DE CAPACIDADES NEURALES ---

export interface Participant {
  id: string;
  name: string;
  color: string;
  joinedAt: number | object;
  role: 'OPERADOR_MASTER' | 'PARTICIPANTE';
  status: 'ONLINE' | 'AWAY';
  nodeMode?: 'Individual' | 'Dúo' | 'Trío';
}

export interface TranslationBurst {
  originalText: string;
  translatedText: string;
  timestamp: number | object;
  sourceType: 'ULTRA_MENCIONAL' | 'LEARNING_NODE';
  speed: number;
  moodColor?: string; // Sincroniza el aura visual neón entre nodos
}

/**
 * 🔑 IDENTIDAD DE HARDWARE (Persistent Client ID)
 */
const getClientId = (): string => {
  let id = localStorage.getItem('mencional_client_id');
  if (!id) {
    id = `NODE_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    localStorage.setItem('mencional_client_id', id);
  }
  return id;
};

/**
 * 🚀 REGISTER_SELF: Sincroniza el nodo con el clúster de la sesión.
 */
export const registerSelf = async (
  sessionId: string,
  userName: string,
  userColor: string,
  isAdmin: boolean = false,
  nodeMode: 'Individual' | 'Dúo' | 'Trío' = 'Individual'
): Promise<void> => {
  if (!sessionId || !userName) return;

  const clientId = getClientId();
  const sessionID_Upper = sessionId.toUpperCase();
  const sessionPath = `sessions/${sessionID_Upper}`;
  const participantRef = ref(rtdb, `${sessionPath}/participants/${clientId}`);

  try {
    // Protocolo de autolimpieza en desconexión (Heartbeat Fail-safe)
    await onDisconnect(participantRef).remove();

    const newParticipant: Participant = {
      id: clientId,
      name: userName.trim().toUpperCase(),
      color: userColor,
      joinedAt: serverTimestamp(),
      role: isAdmin ? 'OPERADOR_MASTER' : 'PARTICIPANTE',
      status: 'ONLINE',
      nodeMode
    };

    await set(participantRef, newParticipant);
    
    // Si es Master, inicializamos la sesión si no existe
    if (isAdmin) {
      await update(ref(rtdb, sessionPath), {
        masterNode: clientId,
        createdAt: serverTimestamp(),
        isActive: true
      });
    }

    logger.info("SYNC", `Nodo ${clientId} sincronizado como ${newParticipant.role}`);
  } catch (error) {
    logger.error("PRESENCE_ERROR", error);
    throw error;
  }
};

/**
 * 🎙️ PUSH_ULTRA_BURST: Emisión de ráfagas para Modo Intérprete o Aprendizaje.
 */
export const pushUltraBurst = async (
  sessionId: string,
  original: string,
  translation: string,
  mode: 'interpreter' | 'learning' = 'interpreter',
  auraColor?: string
): Promise<void> => {
  if (!sessionId || !original) return;
  const sessionPath = `sessions/${sessionId.toUpperCase()}`;
  
  try {
    const burst: TranslationBurst = {
      originalText: original,
      translatedText: translation,
      timestamp: serverTimestamp(),
      sourceType: mode === 'interpreter' ? 'ULTRA_MENCIONAL' : 'LEARNING_NODE',
      speed: mode === 'interpreter' ? 2.0 : 1.1,
      moodColor: auraColor || '#00FBFF'
    };

    // 1. Actualización atómica del último estado (Baja latencia para UI)
    await update(ref(rtdb, sessionPath), {
      lastBurst: burst,
      fullStream: original,
      lastUpdate: serverTimestamp()
    });

    // 2. Archivo histórico (Persistencia para PDF/Replay)
    const historyRef = ref(rtdb, `${sessionPath}/history`);
    await push(historyRef, burst);

  } catch (error) {
    logger.error("BURST_PUSH_ERROR", error);
  }
};

/**
 * 📻 LISTEN_TO_BURSTS: Suscripción a ráfagas y stream de texto.
 */
export const listenToBursts = (
  sessionId: string,
  onBurst: (burst: TranslationBurst) => void,
  onStream: (text: string) => void
): Unsubscribe => {
  const sessionRef = ref(rtdb, `sessions/${sessionId.toUpperCase()}`);

  return onValue(sessionRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data?.lastBurst) onBurst(data.lastBurst);
    if (data?.fullStream) onStream(data.fullStream);
  });
};

/**
 * 👥 LISTEN_TO_PARTICIPANTS: Monitoreo de presencia en tiempo real.
 */
export const listenToParticipants = (
  sessionId: string,
  callback: (participants: Participant[]) => void
): Unsubscribe => {
  const participantsRef = ref(rtdb, `sessions/${sessionId.toUpperCase()}/participants`);

  return onValue(participantsRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data) {
      const participantList = Object.keys(data).map(key => ({
        ...data[key],
        id: key
      })) as Participant[];
      callback(participantList);
    } else {
      callback([]);
    }
  });
};

/**
 * 🛑 KICK_PARTICIPANT: Comando exclusivo para el Maestro.
 */
export const kickParticipant = async (sessionId: string, targetId: string): Promise<void> => {
  const participantRef = ref(rtdb, `sessions/${sessionId.toUpperCase()}/participants/${targetId}`);
  try {
    await remove(participantRef);
    logger.warn("SECURITY", `Nodo ${targetId} expulsado por comando Maestro.`);
  } catch (error) {
    logger.error("KICK_ERROR", error);
  }
};

/**
 * 🚪 LEAVE_SESSION: Cierre voluntario y limpieza manual de rastro.
 */
export const leaveSession = async (sessionId: string): Promise<void> => {
  const clientId = getClientId();
  const participantRef = ref(rtdb, `sessions/${sessionId.toUpperCase()}/participants/${clientId}`);

  try {
    await remove(participantRef);
    logger.info("SYNC", "Nodo desconectado por solicitud del usuario.");
  } catch (error) {
    logger.error("LEAVE_ERROR", error);
  }
};

/**
 * 🧹 PURGE_SESSION: Limpieza total (Solo Operador Maestro)
 */
export const purgeSession = async (sessionId: string): Promise<void> => {
  const sessionPath = `sessions/${sessionId.toUpperCase()}`;
  try {
    await remove(ref(rtdb, sessionPath));
    logger.info("MAESTRO", `Sesión ${sessionId} purgada del Nodo_Principal.`);
  } catch (error) {
    logger.error("PURGE_ERROR", error);
  }
};

const groupService = { 
  registerSelf, 
  pushUltraBurst, 
  listenToBursts, 
  listenToParticipants, 
  kickParticipant, 
  leaveSession,
  purgeSession 
};

export default groupService;