/** * 🛰️ MENCIONAL_CORE_TYPES v15.5 - STABLE PRODUCTION (2026)
 * Sistema de tipos centralizado para arquitectura distribuida.
 * Objetivo: Estabilidad de aulas, anonimato y control de pagos.
 * Ubicación: /src/types/index.ts
 */

import { Timestamp } from "firebase/firestore";

// --- 🟦 LITERAL TYPES DE SISTEMA ---

export type UserRole = 'admin' | 'participant' | 'guest';

/** * aprendizaje: Ciclos de 19s - Formato Sentence Case.
 * interprete: Traducción técnica de alta fidelidad.
 * rompehielo: Ventana crítica de 4s - Respuesta Directa.
 * lobby: Pasarela de pago (Mercado Pago) y selección de aula.
 */
export type AppMode = 'aprendizaje' | 'interprete' | 'rompehielo' | 'lobby' | 'config';

export type ConnectionStatus = 'low' | 'stable' | 'ultra';
export type SignalStatus = 'speaking' | 'listening' | 'processing' | 'streaming' | 'idle';

// Protocolo de Voz Única: Aoede (Femenina, Suave, Profesional, 2x Speed)
export type VoiceOption = 'Aoede';

// --- 🎨 CONFIGURACIÓN DE IDENTIDAD Y TURNO ---

export interface ColorOption {
  id: number;
  name: string;
  hex: string;
}

// Paleta oficial Mencional 2026 (Visibilidad Neón Turquesa e Intensa)
export const MENCIONAL_PALETTE: ColorOption[] = [
  { id: 1, name: 'Turquesa Neón', hex: '#00FBFF' }, // "Azul" principal
  { id: 2, name: 'Rose 500', hex: '#f43f5e' },      // "Rosa" escucha
  { id: 3, name: 'Esmeralda', hex: '#10b981' },
  { id: 4, name: 'Violeta Pro', hex: '#8b5cf6' },
  { id: 5, name: 'Ambar Sync', hex: '#f59e0b' },
  { id: 6, name: 'Cielo', hex: '#0ea5e9' },
  { id: 7, name: 'Lava', hex: '#ef4444' },
  { id: 8, name: 'Lima', hex: '#84cc16' },
  { id: 9, name: 'Fucsia', hex: '#d946ef' },
  { id: 10, name: 'Slate', hex: '#64748b' }
];

// --- 🛡️ SEGURIDAD Y FINGERPRINTING ---

export interface UserConfig {
  id: string;               // UUID Anónimo (Renovado por sesión)
  deviceId: string;         // Hardware Fingerprint (Invariable para bloqueos)
  paymentHash?: string;     // Hash de tarjeta/método para bloqueo de pagos
  name: string;             // Solo nominal si es invitado por admin
  userColor: ColorOption;   // Identidad visual ("Eres Azul")
  role: UserRole;
  isPaymentVerified: boolean;
  strikes: number;          // Acumulación de reportes (3 = Bloqueo Global)
  lastNoShow?: Timestamp;   // Registro para penalización de reagendamiento
}

// --- 🛡️ MODERACIÓN TÁCTICA ---

export interface ModerationAction {
  targetUserId: string;
  issuerUserId: string;
  type: 'yellow_card' | 'kick' | 'global_report';
  timestamp: number;
}

// --- ⚙️ CONFIGURACIÓN DE SESIÓN (Lobby v15.5) ---

export type SessionType = 'individual' | 'duo' | 'trio' | 'conferencia';

export interface PreSessionSettings {
  type: SessionType;
  topic: string;            
  voice: VoiceOption;      
  colorId: number;          
  paymentUrl: string;       // Constante: https://mpago.la/2fPScDJ
  scheduledTime?: number;   // Timestamp (mínimo 1h de antelación)
}

// --- 🧠 FLUJO DE DATOS NEURAL ---

export interface SyncData {
  id: string;
  senderId: string;        
  senderColor: string;      
  originalText: string;
  translatedText: string;
  timestamp: number;
  status: SignalStatus;
  intervalMarker: 19 | 4 | 0;   // 19s para aprendizaje, 4s para rompehielo
  isCleanOutput: boolean;   // Filtro de conducta (Normas de convivencia)
}

// --- 🕹️ CONTROL DE SESIÓN SINCRONIZADA ---

export interface SessionControl {
  sessionId: string;
  startTime: number;
  totalDuration: 1200;      // 20 Minutos fijos (Sincronización Forzada)
  remainingSeconds: number;
  isActive: boolean;
  mode: AppMode;
  participantsIds: string[];
  status: 'active' | 'syncing' | 'finished' | 'quorum_failure';
}

// --- 🌍 ESTADO GLOBAL ---

export interface GlobalAppState {
  user: UserConfig | null;
  currentSession: SessionControl | null;
  activeSignal: SyncData | null;
  turnOwnerId: string;
  isLowTime: boolean;       // Trigger para el cronómetro expansivo @ 5min
  ui: {
    accentColor: string;    // Turquesa Neón o el color del turno actual
    theme: 'dark-oled';
    isRecording: boolean;
    showModerationPanel: boolean; // Oculto para Administradores
  };
}

/**
 * 🔌 EXPORTACIÓN ADICIONAL PARA UTILS
 * Ayuda a la validación de tipos en runtime.
 */
export const isAppMode = (mode: string): mode is AppMode => {
  return ['aprendizaje', 'interprete', 'rompehielo', 'lobby', 'config'].includes(mode);
};