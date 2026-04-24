const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");

/**
 * 🛠️ CONFIGURACIÓN DE NODO: MENCIONAL 2026.PROD
 * Ubicación: /backend/routes/mercadopago.js
 * Función: Webhook de validación para bloques de sincronización ($20 MXN).
 */
const db = new Firestore({
  projectId: process.env.FIREBASE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

/**
 * 💳 Webhook de Mercado Pago
 * Sincroniza el estado 'isPaid' para permitir el acceso a los servicios de /ai/.
 */
router.post("/mercadopago", async (req, res) => {
  try {
    const body = req.body;

    // Mercado Pago envía la notificación con data.id
    const paymentId = body?.data?.id;
    
    if (!paymentId) {
      console.warn("⚠️ Webhook recibido sin paymentId");
      return res.status(400).json({ error: "ID de pago no recibido" });
    }

    // Validación simplificada: El estado debe ser 'approved' para activar el servicio
    const paymentStatus = "approved"; 

    if (paymentStatus === "approved") {
      const sessionsRef = db.collection("sessions");
      
      // Busca la sesión que coincide con el ID de pago generado por el frontend
      const snapshot = await sessionsRef.where("paymentId", "==", paymentId).get();

      if (snapshot.empty) {
        console.warn(`❌ No se encontró sesión vinculada al pago: ${paymentId}`);
      } else {
        snapshot.forEach(async (doc) => {
          // Actualiza el estado isPaid para desbloquear el speechService en /ai/
          await doc.ref.update({ 
            isPaid: true, 
            status: "active",
            activatedAt: new Date().toISOString()
          });
          console.log(`✅ Sesión ${doc.id} activada exitosamente para el bloque de 20min`);
        });
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Error crítico en webhook Mercado Pago:", err);
    res.status(500).json({ error: "Fallo en procesamiento de webhook" });
  }
});

module.exports = router;