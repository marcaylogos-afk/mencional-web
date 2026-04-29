import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * 1. INICIALIZACIÓN PROTEGIDA DEL SDK DE ADMIN
 * Verificamos si ya existe una app activa para evitar errores de duplicidad.
 * Garantiza estabilidad en despliegue y emuladores locales.
 */
if (!admin.apps.length) {
    admin.initializeApp();
}

const firestore = admin.firestore();

/**
 * 🧹 CLOUD FUNCTION: cleanupUnrequestedLogs
 * Se ejecuta cada 24 horas para limpiar registros de transcripción antiguos.
 * Optimizado con Batch Writes (límite de 500 operaciones).
 */
export const cleanupUnrequestedLogs = functions.pubsub
    .schedule("every 24 hours")
    .onRun(async (context) => {
        try {
            const logsRef = firestore.collectionGroup("logs"); 
            const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffDate);

            const snapshot = await logsRef
                .where("requested", "==", false)
                .where("timestamp", "<", cutoffTimestamp)
                .get();

            if (snapshot.empty) {
                console.log("No hay logs no solicitados para limpiar.");
                return null;
            }

            const batch = firestore.batch();
            let deletedCount = 0;

            snapshot.forEach((doc) => {
                batch.delete(doc.ref);
                deletedCount++;
            });

            await batch.commit();

            console.log(`✅ Limpieza completada: ${deletedCount} logs no solicitados eliminados.`);
            return null;

        } catch (error) {
            console.error("❌ Error en la limpieza de logs no solicitados:", error);
            throw new functions.https.HttpsError("internal", "Fallo en la Cloud Function programada.");
        }
    });

// --------------------------------------------------------------------------------------
// 2. IMPORTACIÓN Y EXPORTACIÓN DE MÓDULOS MODULARES
// --------------------------------------------------------------------------------------

/**
 * 🧠 IMPORTACIÓN DE LÓGICA DE NEGOCIO
 * Se vinculan los módulos de gestión de usuarios y sesiones.
 * Nota: La carpeta de servicios de IA en el frontend se renombró a /ai/.
 */
import { createAnonymousUser } from './userManager';
import { scheduleSession } from './scheduleSession';
import { penalizeUser } from './penalizeUser'; // Incluido según tu estructura de archivos
import { checkNoShow } from './checkNoShow';   // Incluido según tu estructura de archivos

/**
 * EXPORTACIÓN DE FUNCIONES CALLABLE
 * Estas funciones estarán disponibles para el frontend de Mencional.
 */
export { 
    createAnonymousUser, 
    scheduleSession, 
    penalizeUser, 
    checkNoShow 
};