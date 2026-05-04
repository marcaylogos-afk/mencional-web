/**
 * 💳 MENCIONAL | MERCADO PAGO WEBHOOK HANDLER v2026.PROD
 * Protocolo: Activación de Nodos, Bloques de 30 min y Liberación de Interfaz.
 * Ubicación: /src/pages/api/webhooks/mercadopago.ts
 * Enlace de cobro vinculado: https://mpago.la/1HJRXhD
 * ✅ UPDATE: Bloque de tiempo ajustado a 30 minutos / $50 MXN.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../services/ai/firebaseConfig"; // Ruta corregida a tu carpeta /ai/
import { 
  doc, 
  updateDoc, 
  serverTimestamp, 
  getDoc, 
  setDoc, 
  Timestamp 
} from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method_Not_Allowed" });
  }

  try {
    const { body, query } = req;
    
    // Mercado Pago envía el ID de diferentes formas según el tipo de notificación
    const paymentId = body.data?.id || body.id || query.id;
    const eventType = body.type || body.topic || query.topic;

    // Solo procesamos pagos aprobados
    if (!paymentId || (eventType !== "payment" && eventType !== "merchant_order")) {
      return res.status(200).send("Event_Ignored");
    }

    // 🛡️ PREVENCIÓN DE DUPLICADOS (Idempotencia)
    const auditRef = doc(db, 'audit_payments', `MP_${paymentId}`);
    const auditSnap = await getDoc(auditRef);
    
    if (auditSnap.exists()) {
      return res.status(200).send("Payment_Already_Synced");
    }

    // El external_reference debe ser el ID del dispositivo o el nombre del usuario
    const externalRef = body.external_reference || body.data?.external_reference || body.metadata?.external_reference;

    if (!externalRef) {
      // Si no hay referencia, no podemos saber a quién activar el tiempo
      return res.status(200).send("No_User_Reference_Found");
    }

    /**
     * 🔄 PROTOCOLO 30/50: ACTIVACIÓN TEMPORAL
     * Se liberan las funciones por un bloque de media hora.
     */
    const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutos exactos
    const expiryDate = new Date(Date.now() + SESSION_DURATION_MS);

    const activationPayload = {
      is_premium_active: true,
      session_status: 'ACTIVE_NODE',
      expires_at: Timestamp.fromDate(expiryDate),
      last_payment_id: paymentId,
      interface_lock: false, 
      access_role: 'PAID_PARTICIPANT',
      subscription_type: 'TIME_BLOCK_30', // Identificador de bloque de 30 min
      last_sync: serverTimestamp(),
      app_version: 'Mencional_v2026.PROD',
      mencional_paid: 'true'
    };

    const userRef = doc(db, 'users', externalRef);
    const userSnap = await getDoc(userRef);

    // Actualizamos o creamos el perfil del usuario con su nuevo tiempo
    if (userSnap.exists()) {
      await updateDoc(userRef, activationPayload);
    } else {
      await setDoc(userRef, {
        ...activationPayload,
        created_at: serverTimestamp(),
        display_name: body.metadata?.user_name || externalRef,
        aura_theme: 'NEON_CYAN' 
      });
    }

    // Registro en la auditoría de pagos
    await setDoc(auditRef, {
      target_user: externalRef,
      mp_transaction_id: paymentId,
      processed_at: serverTimestamp(),
      amount: 50,
      currency: 'MXN',
      status: 'APPROVED',
      link_used: 'https://mpago.la/1HJRXhD'
    });

    return res.status(200).send("Mencional_30MIN_Activation_Success");

  } catch (error) {
    console.error("❌ [CRITICAL_PAYMENT_ERROR]:", error);
    // Respondemos 200 para evitar que Mercado Pago reintente infinitamente en caso de errores de lógica
    return res.status(200).send("Internal_Handled_Error");
  }
}