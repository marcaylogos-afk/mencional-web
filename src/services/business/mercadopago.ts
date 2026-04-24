/**
 * 💳 SERVICIO DE GESTIÓN DE PAGOS - MENCIONAL LINK MANUAL
 * Protocolo de cobro rápido para Participantes y Sesiones Externas.
 * Versión optimizada para redirección directa.
 */

// Link de pago oficial de la plataforma para acceso rápido
const PAYMENT_LINK_MANUAL = "https://mpago.la/2fPScDJ";

/**
 * 🚀 handleParticipantPayment
 * Orquesta la salida del usuario hacia la pasarela de pago de Mercado Pago.
 * Guarda el contexto de la sesión para recuperarlo tras el retorno.
 * * @param sessionId - El ID de la sesión neural que el usuario desea activar.
 */
export const handleParticipantPayment = (sessionId: string): void => {
  if (!sessionId) {
    console.error("❌ Error: No se puede iniciar el pago sin un ID de sesión válido.");
    return;
  }

  try {
    // 1. Persistencia de contexto: Guardamos qué sesión se está intentando pagar.
    // Esto permite que al volver de Mercado Pago, la app sepa qué sesión desbloquear.
    localStorage.setItem('mencional_pending_session', sessionId);
    localStorage.setItem('mencional_payment_start', Date.now().toString());

    console.log(`%c 🛰️ PAGO INICIADO: Sesión ${sessionId}. Redirigiendo a pasarela externa...`, "color: #06b6d4; font-weight: bold;");

    // 2. Redirección: Salida del entorno de la aplicación hacia Mercado Pago.
    // Se recomienda que en el panel de MP, las URLs de retorno (Back URLs) 
    // apunten de vuelta a tu dominio principal.
    window.location.href = PAYMENT_LINK_MANUAL;
    
  } catch (error) {
    console.error("❌ Fallo crítico al intentar iniciar el portal de pago:", error);
    // Nota: Evitamos alert() por políticas de entorno; el error se maneja vía consola 
    // o se debería capturar en un componente de UI de aviso.
  }
};

/**
 * 🔍 getPaymentReturnData
 * Extrae y procesa los parámetros de retorno que Mercado Pago añade a la URL 
 * después de que el usuario completa (o cancela) el pago.
 */
export const getPaymentReturnData = () => {
  const params = new URLSearchParams(window.location.search);
  
  const data = {
    status: params.get('collection_status'), // 'approved', 'pending', 'failure'
    paymentId: params.get('collection_id'),
    preferenceId: params.get('preference_id'),
    siteId: params.get('site_id'),
    processingMode: params.get('processing_mode'),
    merchantOrderId: params.get('merchant_order_id'),
    savedSessionId: localStorage.getItem('mencional_pending_session')
  };

  return data;
};

/**
 * 🧹 finalizePaymentContext
 * Limpia los datos temporales del almacenamiento local una vez que el pago 
 * ha sido procesado y validado con éxito.
 */
export const finalizePaymentContext = (): void => {
  localStorage.removeItem('mencional_pending_session');
  localStorage.removeItem('mencional_payment_start');
  console.log("%c 🧹 Contexto de pago liberado.", "color: #94a3b8; font-size: 10px;");
};

/**
 * ✅ isPaymentSuccessful
 * Verifica de forma rápida si la URL actual contiene una confirmación de pago aprobado.
 */
export const isPaymentSuccessful = (): boolean => {
  const { status } = getPaymentReturnData();
  return status === 'approved';
};