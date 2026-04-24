/// <reference types="vite/client" />

/**
 * 🛰️ MENCIONAL NEURAL LINK - DEFINICIONES GLOBALES (v12.0 PROD_2026)
 * Ubicación: /vite-env.d.ts (Raíz)
 * Estado: PRODUCCIÓN FINAL - STABLE
 */

/**
 * 🔐 VARIABLES DE ENTORNO (VITE_*)
 */
interface ImportMetaEnv {
  // --- 🛠️ INFRAESTRUCTURA (FIREBASE) ---
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string; 
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;

  // --- 🧠 INTELIGENCIA ARTIFICIAL ---
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GOOGLE_TTS_KEY: string;

  // --- 🛡️ SEGURIDAD & NEGOCIO ---
  readonly VITE_APP_MODE: "production" | "development"; 
  readonly VITE_ADMIN_SECRET: "osos"; // Clave Maestra de Bypass
  readonly VITE_MP_LINK: string;      // Link de pago Mercado Pago
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * 🎙️ WEB SPEECH API NATIVA (Extensión de interfaces globales)
 */
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
  speechSynthesis: SpeechSynthesis;
}

/**
 * 🎨 PALETA MENCIONAL 2026 (OLED Optimized)
 */
export type MencionalHexColor = 
  | "#00F5FF" // Turquesa (Default)
  | "#FF007F" // Rosa (Active Participant)
  | "#39FF14" // Verde Neón (System OK)
  | "#0070FF" // Azul Eléctrico (Voice Link)
  | "#BC13FE" // Púrpura (Neural Mode)
  | "#FF5F1F" // Naranja (Learning Focus)
  | "#CCFF00" // Amarillo (Alert)
  | "#FF3131" // Rojo (Critical / Mic Active)
  | "#FFFFFF" // Blanco Puro (UI Text)
  | "#00FFFF"; // Cian (IA Process)

/**
 * 📋 CONFIGURACIÓN DE SESIÓN NEURAL
 */
export interface SessionConfig {
  id: string;
  userName: string;
  mode: 'learning' | 'interpreter' | 'rompehielo';
  type: 'individual' | 'duo' | 'trio' | 'ultra-mencional';
  nativeLang: string;
  targetLang: string;
  selectedColor: { hex: MencionalHexColor; name: string };
  startTime: number;
  duration: 1200; // 20 minutos fijos (1200s)
  
  // Protocolo Temporal Estricto
  interval: 4 | 6 | 19; 
  playbackRate: 0.9 | 1.0 | 1.2 | 2.0; 
  
  audioOutput: 'headphones' | 'speaker';
  autoDucking: boolean;
  isAdmin: boolean;
}

/**
 * 🗣️ PARÁMETROS DE VOZ AOEDE (Motor Narrativo)
 */
export interface SpeechSettings {
  voiceName: "Aoede";
  pitch: number;
  rate: number; 
  noSpanglish: boolean;
  repeatCount: 1 | 2;
  
  visualHierarchy: {
    primaryTextSize: "4rem" | "6rem" | "160px"; // Texto Fuente (Input)
    secondaryTextSize: "1rem" | "1.2rem" | "3rem"; // Texto Salida (Output)
    clockColor: MencionalHexColor;
  };
}

/**
 * 👤 NODO DE USUARIO (DYNAMICS)
 */
export interface UserNode {
  deviceId: string;
  role: 'admin' | 'participant';
  hasActivePayment: boolean;
  isAdmin: boolean;
  restrictedUI: boolean; 
}

/**
 * 🛰️ ESTRUCTURA DE FLUJO TRADUCCIÓN
 */
export interface NeuralTranslation {
  id: string;
  originalText: string;
  translatedText: string;
  suggestions?: [string, string, string]; // 3 opciones exactas
  timestamp: number;
  senderId: string;
  color: MencionalHexColor;
}

/**
 * 📂 EXPORTACIÓN CLÍNICA / PROFESIONAL (PDF)
 */
export interface SessionHistory {
  fullTranscription: string;
  translations: NeuralTranslation[];
  sessionDate: string;
  professionalName: "DANIELA OCAMPO"; // Firma de identidad
  professionalRole: "ODONTÓLOGA";
  participants: string[];
}

// Declaraciones de módulos para assets
declare module "*.css";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.webp";