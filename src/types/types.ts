/**
 * 📚 MENCIONAL TYPE SYSTEM v10.0 - PRODUCTION CORE
 * Centralización de interfaces para el ecosistema Mencional 2026.
 * Ubicación: /src/types/types.ts
 * Estado: SELLADO PARA PRODUCCIÓN
 */

// --- 1. NAVEGACIÓN Y MODOS DE NÚCLEO ---
export type LanguageCode = "es-MX" | "en-US" | "pt-BR" | "fr-FR" | "AUTO";

export type View = 
  | "landing" 
  | "booking" 
  | "session" 
  | "admin_panel" 
  | "interpreter_mode" 
  | "payment_gateway"
  | "ultraview_session";

export type SessionMode = 'aprendizaje' | 'interprete' | 'neural_link' | 'icebreaker';

// --- 2. SEGURIDAD E IDENTIDAD (Fingerprinting & Reputation) ---
export interface DeviceSecurity {
  fingerprint: string;       // Hash único: GPU + Screen + Browser Fingerprint
  isBlocked: boolean;        // Bloqueo de hardware por infracción de términos
  strikes: number;           // Contador de faltas (0 a 3)
  lastStrikeAt?: number;     // Para gestión de Cool-down temporal
  paymentHash?: string;      // Hash del último método de pago (prevención de fraudes)
}

export interface Participant {
  id: string;                // ID efímero (Ej: NODE-7742)
  deviceId: string;          // Referencia al DeviceSecurity
  name: string;              // Alias operativo
  role: "admin" | "user" | "master_dev"; // Rol extendido para acceso gratuito
  colorHex: string;          // Aura visual (Cyan, Amber, Rose, etc.)
  joinedAt: number;
  status: 'active' | 'speaking' | 'muted' | 'expelled';
  reputationScore: number;   // 0.0 a 1.0 (Afecta visibilidad de sus mensajes)
}

// --- 3. ECONOMÍA Y BLOQUES DE TIEMPO (Mercado Pago Bridge) ---
export interface Transaction {
  id: string;                // External Reference ID
  status: 'approved' | 'rejected' | 'pending';
  amount: number;            // Valor transaccional
  timestamp: number;
  type: 'new_session' | 'extension';
  metadata?: {
    nodesAdded: number;      // Tiempo comprado en minutos
    couponApplied?: string;
  };
}

// --- 4. MOTOR NEURAL & ULTRAVIEW (Data Sync) ---
/** * Estructura de sincronización para el ciclo de 19 segundos solicitado.
 * El campo inputEN maneja el formato Sentence Case (Mayúsculas/Minúsculas).
 */
export interface SyncData {
  id: string;
  speakerId: string;
  inputEN: string;           // Fuente: Mediano + Mayúsculas/Minúsculas
  outputES: string;          // Resultado: Grande + Siempre Mayúsculas
  suggestion: string;        // Frase para el acordeón de aprendizaje
  isDoubleRepeat: boolean;   // Activación de Protocolo de Refuerzo (6s)
  audioConfig: {
    duckingLevel: number;    // 0.0 a 1.0 (Atenuación de ruido ambiente)
    interval: 6 | 19;        // Ventana de 19s para Modo Intérprete
    pitch: number;           // Modulación de voz de la IA
    rate: number;            // Velocidad (0.8x a 1.2x)
  };
  isMarkedAsUseful: boolean; 
  timestamp: number;
}

// --- 5. MODERACIÓN Y GOBERNANZA ---
export interface Report {
  id: string;
  reportedId: string;        // ID del transgresor
  reporterId: string;        // ID del denunciante
  reason: string;
  sessionId: string;
  timestamp: number;
  isValid: boolean;          // Verificado por IA o Admin
}

// --- 6. AJUSTES DE USUARIO (Persistencia Local) ---
export interface UserSettings {
  userId?: string;
  userColor: string;
  role: 'admin' | 'user' | 'master_dev'; // Bypass de pago si es master_dev
  selectedLang: LanguageCode;
  targetLangName: string;    // Nombre legible del idioma destino
  autoDetectMode: boolean;
  isBlocked: boolean;
  audioLevel: number;        // Master Gain (0-100)
  privacy: 'protected' | 'anonymous';
}

// --- 7. ESTADO GLOBAL DE SESIÓN (Redux/Context State) ---
export interface SessionData {
  id: string;                // Prefijo MENC- (Ej: MENC-ALPHA-9)
  mode: SessionMode;
  adminId: string;
  startTime: number;
  endTime: number;           // Cálculo dinámico según extensiones
  participants: Participant[];
  transcript: SyncData[];
  isCriticalZone: boolean;   // Flag para TimerDisplay.tsx (< 300s)
  activeTopics: string[];    // Seleccionados vía TopicSelector.tsx
}

// --- 8. ANALÍTICA DE TENDENCIAS (Trends & News Service) ---
export interface TrendData {
  phrase: string;
  category: 'neural' | 'organic' | 'system' | 'trending_news';
  weight: number;            // Relevancia (afecta el tamaño en la nube)
  originUrl?: string;        // Enlace a fuente verificada
  lastPulse: number;         // Última vez que se detectó esta tendencia
}

/**
 * 🔌 HELPER TYPES PARA EVENTOS
 */
export type SpeechEvent = {
  text: string;
  isFinal: boolean;
  confidence: number;
};