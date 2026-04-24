const express = require("express");
const cors = require("cors");
const ttsRoutes = require("./routes/tts");
const mpRoutes = require("./routes/mercadopago");

/**
 * 🚀 CONFIGURACIÓN DE NODO: MENCIONAL 2026.BACKEND
 * Se asegura la integración con el nuevo directorio /ai/ del frontend.
 */
const app = express();

// Middleware esencial para el procesamiento de pagos y datos de IA
app.use(express.json());
app.use(cors({ 
  origin: process.env.ALLOW_ORIGIN || "*" 
}));

/**
 * 🧠 RUTAS DE SERVICIOS AI
 * Vincula los servicios de Text-to-Speech necesarios para la inmersión lingüística.
 */
app.use("/api/ai", ttsRoutes); // Se ajusta el endpoint para reflejar la estructura /ai/

/**
 * 💳 RUTAS DE PAGOS (MERCADO PAGO)
 * Gestión de webhooks para validación de bloques de 20 minutos ($20 MXN).
 */
app.use("/webhooks/payments", mpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend Mencional corriendo en puerto ${PORT}`);
  console.log(`🎯 Servicios AI mapeados en /api/ai`);
});