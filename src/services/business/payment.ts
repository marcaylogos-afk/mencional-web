/**
 * 💳 MERCADO_PAGO_BRIDGE v17.2 - MENCIONAL 2026
 * Protocolo: Automatización Directa y Sincronización Forzada.
 * Ubicación: /src/services/business/payment.ts
 */

import { logger } from "../../utils/logger";

/**
 * 🔗 MP_CONFIG
 * Regla de negocio: $20 MXN = 20 Minutos de procesamiento neural.
 */
const MP_CONFIG = {
  DIRECT_LINK: "https://mpago.la/2fPScDJ", // Enlace oficial de producción
  BLOCK_DURATION_MS: 20 * 60 * 1000,       // 20 minutos (Protocolo Estándar)
  FORFEIT_THRESHOLD: 3,                    // Límite de "No-Shows" para purga
};

/**
 * 🚀 initiateSession
 * Valida el rol antes de lanzar la pasarela. 
 * El Admin ("osos") nunca es redirigido a Mercado Pago.
 */
export const initiateSession = async (amount: number, mode: string): Promise<string> => {
  const isAdmin = localStorage.getItem('mencional_role') === 'admin';

  if (isAdmin) {
    logger.info("PAYMENT_BYPASS", "Protocolo Maestro activo. Acceso directo habilitado.");
    return "/selector";
  }
  
  logger.info("PAYMENT_INIT", `Iniciando sesión: ${mode} | Bloque: $${amount} MXN`);
  return MP_CONFIG.DIRECT_LINK;
};

/**
 * 🚀 createPaymentBlock
 * Ejecuta la redirección de hardware hacia el entorno de pago.
 */
export const createPaymentBlock = (): void => {
  try {
    logger.info("PAYMENT_REDIRECT", "Sincronizando con nodo seguro de Mercado Pago...");
    
    // Flag de seguridad para validar el retorno
    localStorage.setItem('mencional_payment_pending', 'true');
    window.location.href = MP_CONFIG.DIRECT_LINK;
  } catch (error) {
    logger.error("PAYMENT_CRITICAL", "Fallo de hardware: No se pudo establecer conexión con MP.");
  }
};

/**
 * 🚀 handleCheckout
 */
export const handleCheckout = (): void => {
  createPaymentBlock();
};

/**
 * 🛰️ verifyPaymentSuccess
 * Verifica si el bloque de tiempo sigue siendo válido o ha expirado.
 */
export const verifyPaymentSuccess = (): boolean => {
  if (localStorage.getItem('mencional_role') === 'admin') return true;

  const confirmed = localStorage.getItem('payment_confirmed') === 'true';
  const activationTime = Number(localStorage.getItem('payment_timestamp') || 0);
  
  if (!confirmed || !activationTime) return false;

  const now = Date.now();
  const timeElapsed = now - activationTime;
  const isExpired = timeElapsed > MP_CONFIG.BLOCK_DURATION_MS;

  if (isExpired) {
    logger.warn("SESSION_EXPIRED", "Bloque temporal agotado. Purgando acceso.");
    localStorage.removeItem('payment_confirmed');
    localStorage.removeItem('payment_timestamp');
    localStorage.removeItem('mencional_payment_pending');
    localStorage.setItem('mencional_paid', 'false');
    return false;
  }
  
  return true;
};

/**
 * ⚖️ applyForfeit
 * Penalización por abandono o inactividad prolongada.
 */
export const applyForfeit = (): boolean => {
  const noShowCount = Number(localStorage.getItem('no_show_count') || 0);
  
  if (noShowCount >= MP_CONFIG.FORFEIT_THRESHOLD) {
    logger.warn("SECURITY_FORFEIT", `Exceso de faltas (${noShowCount}). Confiscando saldo.`);
    localStorage.removeItem('payment_confirmed');
    localStorage.removeItem('payment_timestamp');
    localStorage.setItem('balance_forfeit', 'true');
    localStorage.setItem('mencional_paid', 'false');
    return true;
  }
  return false;
};

/**
 * 🔍 getStatusMessage
 * Feedback para la Interfaz OLED.
 */
export const getStatusMessage = (status: string): string => {
  const statusMap: Record<string, string> = {
    approved: "✅ SYNC_OK: BLOQUE_ACTIVO",
    pending: "⏳ SYNC_PENDING: VERIFICANDO_SALDO...",
    failure: "❌ SYNC_ERROR: PAGO_RECHAZADO",
    forfeit: "🚨 PROTOCOLO_FORFEIT: SALDO_PURGADO",
    expired: "⌛ BLOQUE_AGOTADO: RECARGA_REQUERIDA",
  };
  return statusMap[status] || "📡 ESCANEANDO_NODO_PAGO...";
};

/**
 * ⏱️ getTimeRemaining
 * Retorna el tiempo en formato técnico MM:SS o símbolo de infinito.
 */
export const getTimeRemaining = (): string => {
  if (localStorage.getItem('mencional_role') === 'admin') return "∞";

  const activationTime = Number(localStorage.getItem('payment_timestamp') || 0);
  if (!activationTime) return "00:00";

  const elapsed = Date.now() - activationTime;
  const remaining = MP_CONFIG.BLOCK_DURATION_MS - elapsed;
  
  if (remaining <= 0) return "00:00";

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 🛠️ activateBlock
 * Inicia el temporizador de producción tras el pago exitoso.
 */
export const activateBlock = (): void => {
  localStorage.setItem('payment_confirmed', 'true');
  localStorage.setItem('payment_timestamp', Date.now().toString());
  localStorage.setItem('mencional_paid', 'true');
  localStorage.removeItem('mencional_payment_pending');
  localStorage.removeItem('balance_forfeit');
  logger.info("BLOCK_ACTIVATED", "Sincronización de 20 min iniciada.");
};

export const paymentService = {
  initiateSession,
  createPaymentBlock,
  handleCheckout,
  verifyPaymentSuccess,
  applyForfeit,
  getStatusMessage,
  getTimeRemaining,
  activateBlock
};

export default paymentService;