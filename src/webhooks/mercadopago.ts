/**
 * 💳 MENCIONAL | MERCADO PAGO WEBHOOK HANDLER v2026.PROD
 * Protocolo: Activación de Nodos, Bloques de 20 min y Liberación de Interfaz.
 * Ubicación: /src/pages/api/webhooks/mercadopago.ts
 * Enlace de cobro vinculado: https://mpago.la/2fPScDJ
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../services/firebaseConfig"; 
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
    const paymentId = body.data?.id || body.id || query.id;
    const eventType = body.type || body.topic || query.topic;

    if (!paymentId || (eventType !== "payment" && eventType !== "merchant_order")) {
      return res.status(200).send("Event_Ignored");
    }

    // 🛡️ PREVENCIÓN DE DUPLICADOS
    const auditRef = doc(db, 'audit_payments', `MP_${paymentId}`);
    const auditSnap = await getDoc(auditRef);
    
    if (auditSnap.exists()) {
      return res.status(200).send("Payment_Already_Synced");
    }

    const externalRef = body.external_reference || body.data?.external_reference || body.metadata?.external_reference;
    const deviceId = body.metadata?.device_id || 'node_unidentified';

    if (!externalRef) {
      return res.status(200).send("No_User_Reference_Found");
    }

    /**
     * 🔄 PROTOCOLO 20/20: ACTIVACIÓN TEMPORAL
     * Se liberan las funciones: Mencional, Ultra-Mencional y Rompehielo.
     */
    const SESSION_DURATION_MS = 20 * 60 * 1000; 
    const expiryDate = new Date(Date.now() + SESSION_DURATION_MS);

    const activationPayload = {
      is_premium_active: true,
      session_status: 'ACTIVE_NODE',
      expires_at: Timestamp.fromDate(expiryDate),
      last_payment_id: paymentId,
      interface_lock: false, 
      access_role: 'PAID_PARTICIPANT',
      subscription_type: 'TIME_BLOCK_20',
      last_sync: serverTimestamp(),
      app_version: 'Mencional_v2026.PROD'
    };

    const userRef = doc(db, 'users', externalRef);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, activationPayload);
    } else {
      await setDoc(userRef, {
        ...activationPayload,
        created_at: serverTimestamp(),
        display_name: body.metadata?.user_name || 'NODE_PARTICIPANT',
        aura_theme: 'NEON_CYAN' 
      });
    }

    await setDoc(auditRef, {
      target_user: externalRef,
      mp_transaction_id: paymentId,
      processed_at: serverTimestamp(),
      amount: 20,
      currency: 'MXN',
      status: 'APPROVED'
    });

    return res.status(200).send("Mencional_Activation_Success");

  } catch (error) {
    console.error("❌ [CRITICAL_PAYMENT_ERROR]:", error);
    return res.status(200).send("Internal_Handled_Error");
  }
}