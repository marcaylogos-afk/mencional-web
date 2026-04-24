/**
 * 🔥 MENCIONAL | FIREBASE_CORE_CONFIG v2026.PROD
 * Configuración central para Realtime Database y Firebase Auth.
 * Ubicación real: /src/services/ai/firebaseConfig.ts
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

/**
 * 🔐 Credenciales del Proyecto
 * Basado en el nodo: https://mencional-19c15-default-rtdb.firebaseio.com/
 */

const firebaseConfig = {
  apiKey: "AIzaSyAaLc-Rnz7RYP0hgL87BSL-RQfr0Y9bQ3c",
  authDomain: "mencional-19c15.firebaseapp.com",
  databaseURL: "https://mencional-19c15-default-rtdb.firebaseio.com",
  projectId: "mencional-19c15",
  storageBucket: "mencional-19c15.firebasestorage.app",
  messagingSenderId: "554393280246",
  appId: "1:554393280246:web:17effcc9f1579c856f16d7",
  measurementId: "G-LWC5QRS83C"
};

// 🛡️ Inicialización segura (Bypass para Vite HMR)
// Previene el error "Firebase App named '[DEFAULT]' already exists" durante el desarrollo.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * 🔐 SERVICIO DE AUTENTICACIÓN
 * Utilizado por useAuth.tsx y AdminGate.tsx para validar al admin@mencional.com.
 */
export const auth = getAuth(app);

/**
 * 📊 REALTIME DATABASE (Protocolo de Sincronía)
 * 'db' para uso general y 'rtdb' para compatibilidad con el Motor AOEDE.
 */
export const db = getDatabase(app);
export const rtdb = db; 

/**
 * 🛰️ NODOS DE REFERENCIA
 * Define las rutas base en la base de datos para la sincronización del Modo Intérprete.
 */
export const DB_NODES = {
  SESSIONS: 'sessions/',
  ACTIVE_USERS: 'presence/',
  MODERATION: 'security/strikes/',
  AI_FLOW: 'ai_processing/' // Nodo crítico para la síntesis de 19 segundos
};

export default app;