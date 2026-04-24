/**
 * 🔒 MENCIONAL | ANON_IDENTITY_PROTOCOL v2026.12
 * Ubicación: /src/utils/anon.ts
 * Objetivo: Generación de Fingerprinting y IDs anónimos rotativos.
 * ✅ DIRECTORIO AI: Sincronizado para validación de nodos en /src/services/ai/
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * 🛠️ getDeviceFingerprint
 * Genera un hash único basado en el hardware (GPU, RAM, Pantalla).
 * Este ID vincula el pago al dispositivo físico, impidiendo el uso compartido indebido.
 */
export const getDeviceFingerprint = (): string => {
  if (typeof window === 'undefined') return 'SERVER_NODE';

  try {
    // 🎨 Canvas Fingerprinting: Firma basada en la renderización única de la GPU
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let canvasHash = '';
    
    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = "#00FBFF"; // Color Maestro Mencional
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#000";
      ctx.fillText("Mencional_v2026_Secure", 2, 15);
      canvasHash = canvas.toDataURL();
    }

    // 🖥️ WebGL Info: Obtiene el modelo exacto de la tarjeta de video
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;
    let renderer = 'no-gpu';
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'generic-gpu';
    }
    
    // 🧱 Agregación de Entropía (Hardware + Software)
    const fingerprintData = [
      navigator.userAgent,
      navigator.language,
      `${screen.width}x${screen.height}`,
      renderer,
      navigator.hardwareConcurrency || 'unknown',
      canvasHash.slice(-50) 
    ].join('###');

    const rawHash = btoa(unescape(encodeURIComponent(fingerprintData)));
    return `DEV_${rawHash.replace(/[/+=]/g, '').toUpperCase().substring(0, 24)}`;
    
  } catch (e) {
    return `FB_GENERIC_NODE_${Math.random().toString(36).substring(7).toUpperCase()}`;
  }
};

/**
 * 🎭 generateAnonymousId
 * ID visual volátil para la sesión (ej: MENC-9A2F).
 */
export const generateAnonymousId = (): string => {
  const sessionNonce = uuidv4().split('-')[0]; 
  return `MENC-${sessionNonce.toUpperCase()}`;
};

/**
 * 🛡️ getIdentity
 * Orquestador: Mantiene el publicId en sesión y el deviceId en persistencia.
 */
export const getIdentity = () => {
  if (typeof window === 'undefined') return { publicId: 'OFFLINE', deviceId: 'OFFLINE' };

  const storageKey = 'mencional_temp_id';
  let tempId = sessionStorage.getItem(storageKey);

  if (!tempId) {
    tempId = generateAnonymousId();
    sessionStorage.setItem(storageKey, tempId);
  }

  return {
    publicId: tempId,                  // Identidad volátil de sesión
    deviceId: getDeviceFingerprint(),  // ID persistente del hardware (Ancla para strikes/pagos)
    timestamp: new Date().toISOString()
  };
};

/**
 * 🚫 isPersistentBlockActive
 * Flag para denegar acceso tras 3 strikes (Strike 3 Protocol).
 */
export const isPersistentBlockActive = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const isLocalBlock = localStorage.getItem('mencional_global_block') === 'true';
  const blockExpiry = localStorage.getItem('mencional_block_expiry');
  
  if (blockExpiry && Date.now() > Number(blockExpiry)) {
    localStorage.removeItem('mencional_global_block');
    localStorage.removeItem('mencional_block_expiry');
    return false;
  }

  return isLocalBlock;
};

/**
 * 💸 hasActiveSessionToken
 * Verifica permiso por pago ($20 MXN) o bypass maestro ("osos").
 */
export const hasActiveSessionToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const isPaid = localStorage.getItem('mencional_paid') === 'true';
  const isAdmin = localStorage.getItem('mencional_role') === 'admin';
  const sessionActive = localStorage.getItem('mencional_auth') === 'true';
  
  // 🛡️ ACCESO CONCEDIDO SI: Admin (Bypass Maestro) o Pago confirmado con Sesión Activa
  return isAdmin || (isPaid && sessionActive);
};

/**
 * 🏗️ validateSessionPersistence
 * Asegura que el dispositivo no haya cambiado durante la sesión de 20 minutos.
 */
export const validateSessionPersistence = (): boolean => {
  if (typeof window === 'undefined') return true;
  const currentFingerprint = getDeviceFingerprint();
  const registeredFingerprint = localStorage.getItem('mencional_registered_device');

  if (!registeredFingerprint) {
    localStorage.setItem('mencional_registered_device', currentFingerprint);
    return true;
  }

  return currentFingerprint === registeredFingerprint;
};

export const anonProtocol = {
  getFingerprint: getDeviceFingerprint,
  getIdentity,
  isBlocked: isPersistentBlockActive,
  hasAccess: hasActiveSessionToken,
  validate: validateSessionPersistence
};

export default anonProtocol;