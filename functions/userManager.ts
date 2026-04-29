import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * 1. Inicialización Protegida del SDK de Admin
 * Verificamos si ya existe una instancia de la app antes de inicializar. 
 * Esto evita el error de duplicidad si este archivo se importa en conjunto con otros servicios del directorio /ai/.
 */
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

// Definición de tipos para la entrada de datos conforme a las especificaciones de Mencional 2026
interface CreateAnonymousUserData {
    sessionId: string; 
}

/**
 * 👤 Crea o inicializa el perfil de un usuario anónimo en Firestore.
 * @param {CreateAnonymousUserData} data - Espera { sessionId: string }.
 * @param {functions.https.CallableContext} context - Contexto de la llamada.
 */
export const createAnonymousUser = functions.https.onCall(async (data: CreateAnonymousUserData, context) => {
    try {
        const { sessionId } = data;

        // 1. Validación de argumentos para asegurar la integridad de la sesión
        if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
            console.warn("❌ Llamada rechazada: Falta o es inválido el ID de sesión.");
            throw new functions.https.HttpsError(
                "invalid-argument", 
                "Falta el ID de sesión (usado como ID de usuario anónimo)."
            );
        }

        // 2. Verificar si el usuario ya existe en la colección global
        const userDocRef = db.collection("users").doc(sessionId);
        const docSnapshot = await userDocRef.get();

        if (docSnapshot.exists) {
            return { 
                success: true, 
                message: "El usuario anónimo ya existe y se ha verificado." 
            };
        }

        // 3. Crear el documento del usuario con el protocolo de balance inicial ($20 MXN)
        // Usamos el ID de sesión del frontend como el Document ID para trazabilidad
        await userDocRef.set({
            createdAt: admin.firestore.Timestamp.now(),
            noShowCount: 0, 
            balance: 20,    // Crédito inicial para bloques de sincronización
            anonymous: true, 
            lastActive: admin.firestore.Timestamp.now(),
        });

        console.log(`✅ Usuario anónimo creado/inicializado con ID: ${sessionId}`);
        
        return { 
            success: true, 
            message: "Usuario anónimo creado correctamente." 
        };

    } catch (error: any) {
        // Manejo de errores estandarizado para Firebase Functions
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }

        console.error("❌ Error al crear usuario anónimo:", error);

        throw new functions.https.HttpsError(
            "internal", 
            error.message || "Error interno al procesar el usuario anónimo."
        );
    }
});