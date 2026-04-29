/**
 * 💾 MENCIONAL | OFFLINE_STORAGE_MANAGER v2026.PROD
 * Gestión de LocalStorage y persistencia de seguridad (Fingerprinting/Sanciones).
 * Ubicación: /src/constants/offlineData.ts
 * ✅ SINCRONIZADO: Referencias de motores actualizadas de /ia/ a /ai/
 */

import { logger } from "../utils/logger";

const SESSIONS_KEY = "mencional_sessions_2026";
const USER_CONFIG_KEY = "mencional_neural_config";
const TRENDS_KEY = "mencional_dynamic_trends";
const SANCTIONS_KEY = "mencional_node_sanctions";
const AUTH_ROLE_KEY = "mencional_user_role"; 

/**
 * 🧠 Estructura de Configuración de Usuario.
 * Sincronizada con los motores residentes en el directorio /ai/
 */
export interface UserNeuralConfig {
  userId?: string;
  userName?: string;
  selectedLanguage: string; 
  // Modos oficiales vinculados a los servicios de /ai/
  mode: 'learning' | 'ultra' | 'rompehielo' | 'interpreter';
  groupMode: 'individual' | 'duo' | 'trio';
  isConfigured: boolean; 
  themeColor?: string;
}

export interface SessionRecord {
  id: string;
  date: string;
  lastModified: number;
  topic: string;
  color: string;
  durationMode: '20min' | 'infinite';
  data: Array<{
    q: string; // Frase original (Natal)
    t: string; // Traducción o Respuesta Sugerida (IA)
    id: number;
    timestamp: string;
    mode?: 'learning' | 'ultra' | 'rompehielo' | 'interpreter';
  }>;
}

/**
 * 🛡️ PROTOCOLO DE SEGURIDAD MENCIONAL
 * Implementa el sistema de "3 strikes" y validación de pago por bloque de $20 MXN.
 */
export interface NodeSanction {
  strikes: number;           // Sistema de 3 strikes para conducta
  lastViolation: number;
  isTemporarilyBlocked: boolean;
  blockUntil?: number;
  isPermanentlyBlocked: boolean;
  deviceId: string;          // Fingerprint del nodo
  paymentVerified: boolean;  // Estado de validación Mercado Pago
}

/**
 * 💾 OPERACIONES DE DISCO FÍSICO (Abstracción de LocalStorage)
 */
export const saveToDisk = (key: string, data: unknown): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    logger.error("STORAGE_CRITICAL", `Fallo en escritura de disco [${key}]`, error);
    // Si el disco está lleno, activamos protocolo de purga de caché técnica
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
       purgeOldData();
    }
  }
};

export const getFromDisk = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    return null;
  }
};

/**
 * 🛡️ GESTIÓN DE ROLES & SEGURIDAD
 * Protocolo 'master-key' para bypass de administrador/desarrollador.
 */
export const setUserRole = (role: 'admin' | 'participant' | 'guest' | null): void => {
  saveToDisk(AUTH_ROLE_KEY, role);
};

export const getUserRole = (): 'admin' | 'participant' | 'guest' | null => {
  return getFromDisk<'admin' | 'participant' | 'guest'>(AUTH_ROLE_KEY);
};

/**
 * ⚙️ GESTIÓN DE CONFIGURACIÓN NEURAL
 */
export const saveUserConfig = (config: UserNeuralConfig): void => {
  saveToDisk(USER_CONFIG_KEY, config);
};

export const getUserConfig = (): UserNeuralConfig | null => {
  return getFromDisk<UserNeuralConfig>(USER_CONFIG_KEY);
};

/**
 * 🔄 ACTUALIZACIÓN DE SESIÓN (Persistencia de Motores /ai/)
 * Alimenta el historial y el Dashboard del Administrador.
 */
export const updateSessionInDisk = (
  sessionId: string,
  original: string,
  translated: string,
  config: { 
    topic?: string; 
    color?: string; 
    mode?: 'learning' | 'ultra' | 'rompehielo' | 'interpreter' 
  } = {}
): void => {
  const allSessions = getFromDisk<Record<string, SessionRecord>>(SESSIONS_KEY) || {};
  const { topic = "GENERAL_FLOW", color = "#00FBFF", mode = "learning" } = config;

  if (!allSessions[sessionId]) {
    allSessions[sessionId] = {
      id: sessionId,
      date: new Date().toLocaleDateString(),
      lastModified: Date.now(),
      topic,
      color,
      durationMode: '20min',
      data: []
    };
  }

  // Insertar al inicio para visualización rápida en el Feed
  allSessions[sessionId].data.unshift({
    q: original.trim(),
    t: translated.trim(),
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    mode
  });

  // Capacidad máxima de 100 fragmentos por sesión (Optimización OLED)
  if (allSessions[sessionId].data.length > 100) {
    allSessions[sessionId].data = allSessions[sessionId].data.slice(0, 100);
  }

  allSessions[sessionId].lastModified = Date.now();
  saveToDisk(SESSIONS_KEY, allSessions);

  // El modo aprendizaje alimenta la IA de tendencias en tiempo real
  if (mode === 'learning' && original.length > 4) {
    updateTrendsFromSession(original);
  }
};

/**
 * 📈 LÓGICA DE TRENDS (Nube de palabras dinámica del Nodo)
 */
const updateTrendsFromSession = (phrase: string): void => {
  const words = phrase.split(' ').filter(w => w.length > 5);
  if (words.length === 0) return;

  const currentTrends = getFromDisk<string[]>(TRENDS_KEY) || [];
  
  // Limpieza de caracteres especiales y normalización
  const cleanWord = words[Math.floor(Math.random() * words.length)]
    .replace(/[.,!?;:()]/g, "")
    .toUpperCase();
  
  // Mantener top 15 palabras únicas (LIFO)
  const updatedTrends = [cleanWord, ...currentTrends.filter(t => t !== cleanWord)]
    .slice(0, 15); 

  saveToDisk(TRENDS_KEY, updatedTrends);
};

/**
 * 🚫 GESTIÓN DE SANCIONES & BLOQUEO POR PAGO
 */
export const updateSanctions = (update: Partial<NodeSanction>): void => {
  const current = getFromDisk<NodeSanction>(SANCTIONS_KEY) || {
    strikes: 0,
    lastViolation: 0,
    isTemporarilyBlocked: false,
    isPermanentlyBlocked: false,
    deviceId: `NODE-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    paymentVerified: false
  };
  saveToDisk(SANCTIONS_KEY, { ...current, ...update });
};

/**
 * 🧹 PURGE_OLD_DATA: Limpieza automática de emergencia
 */
const purgeOldData = (): void => {
  const allSessions = getFromDisk<Record<string, SessionRecord>>(SESSIONS_KEY);
  if (allSessions) {
    const keys = Object.keys(allSessions).sort((a, b) => allSessions[a].lastModified - allSessions[b].lastModified);
    if (keys.length > 0) {
      delete allSessions[keys[0]]; // Eliminar la sesión más vieja
      saveToDisk(SESSIONS_KEY, allSessions);
    }
  }
};

export const offlineData = {
  saveToDisk,
  getFromDisk,
  setUserRole,
  getUserRole,
  saveUserConfig,
  getUserConfig,
  updateSessionInDisk,
  updateSanctions,
  keys: {
    sessions: SESSIONS_KEY,
    config: USER_CONFIG_KEY,
    trends: TRENDS_KEY,
    sanctions: SANCTIONS_KEY,
    role: AUTH_ROLE_KEY
  }
};

export default offlineData;