import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * 1. Inicialización Protegida del SDK de Admin
 * Verificamos si ya existe una app para evitar el error de duplicidad.
 * Esto garantiza que el archivo sea compatible con el index.ts centralizado del directorio /ai/.
 */
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

// ----------------- Tipos de Datos MENCIONAL 2026 -----------------

interface ScheduleSessionData {
    scheduledTime: string; // Fecha y hora en formato string (ej. ISO 8601)
    topic?: string;
    langCode?: string;
    mode?: 'individual' | 'duo' | 'trio' | string;
}

// ----------------- Cloud Function Principal -----------------

/**
 * 📅 Cloud Function: scheduleSession
 * - Valida la autenticación del usuario.
 * - Verifica que la cita se programe con al menos 1 hora de anticipación.
 * - Persiste la sesión en la colección 'sessions' de Firestore.
 */
export const scheduleSession = functions.https.onCall(
    async (data: ScheduleSessionData, context: functions.https.CallableContext) => {
        try {
            // 1. Validar autenticación del usuario de Mencional
            if (!context.auth || !context.auth.uid) {
                throw new functions.https.HttpsError(
                    "unauthenticated",
                    "Debes iniciar sesión para agendar una sesión."
                );
            }

            // 2. Desestructuración y validación de argumentos
            const { scheduledTime, topic, langCode, mode } = data;
            const userId = context.auth.uid;

            if (!scheduledTime || typeof scheduledTime !== 'string') {
                throw new functions.https.HttpsError(
                    "invalid-argument",
                    "Debes proporcionar una fecha y hora válida (scheduledTime)."
                );
            }

            const scheduledDate = new Date(scheduledTime);
            const now = new Date();
            const minAnticipationMs = 60 * 60 * 1000; // 1 hora de margen (Protocolo Estándar)

            // 3. Validación de anticipación: mínimo 1 hora antes de la inmersión
            if (scheduledDate.getTime() < now.getTime() + minAnticipationMs) {
                throw new functions.https.HttpsError(
                    "failed-precondition",
                    "Las sesiones deben agendarse con al menos 1 hora de anticipación."
                );
            }
            
            // 4. Crear el objeto de la sesión para Firestore (Optimizado para el motor /ai/)
            const newSession = {
                topic: topic || "Tema libre",
                langCode: langCode || "en-US",
                mode: mode || "individual",
                scheduledTime: admin.firestore.Timestamp.fromDate(scheduledDate),
                createdBy: userId,
                participants: [userId], // El creador inicia la cola de sincronización
                status: "scheduled", 
                createdAt: admin.firestore.Timestamp.now(),
            };

            // 5. Registro atómico en Firestore
            const sessionRef = await db.collection("sessions").add(newSession);

            console.log(`✅ Sesión agendada exitosamente por ${userId}. ID: ${sessionRef.id}`);

            return {
                success: true,
                message: "Sesión agendada correctamente.",
                sessionId: sessionRef.id,
            };

        } catch (error: unknown) {
            // Propagación de errores controlados
            if (error instanceof functions.https.HttpsError) {
                throw error;
            }

            let errorMessage = "Error inesperado al agendar sesión.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            console.error("❌ Error crítico en scheduleSession:", error);

            throw new functions.https.HttpsError(
                "unknown",
                errorMessage
            );
        }
    }
);