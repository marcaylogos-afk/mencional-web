import * as admin from "firebase-admin";

/**
 * 1. Inicialización Segura del SDK de Admin
 */
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

// ----------------- Tipos de Datos de Usuario -----------------

interface UserData {
    noShowCount?: number;
    balance?: number;
    coolDownUntil?: admin.firestore.Timestamp | null;
    lastPenaltyType?: 'COOLDOWN' | 'CONFISCATION' | 'NONE';
    [key: string]: any; 
}

// ----------------- Función Principal -----------------

/**
 * 🚨 MOTOR DE COMPROMISO MENCIONAL 2026
 * Aplica penalización progresiva por inasistencia.
 * * Reglas:
 * - Strike 1 y 2: Bloqueo (Cooldown) de 60 minutos para agendar.
 * - Strike 3: Confiscación total del saldo de la sesión ($20 MXN).
 * * @param {string} userId - ID del usuario en Firestore.
 */
export async function penalizeUser(userId: string): Promise<void> {
    try {
        if (!userId) {
            console.error("❌ Error: No se proporcionó userId para la penalización.");
            return;
        }

        const userRef = db.collection("users").doc(userId);
        
        // Usamos una transacción para asegurar la integridad del saldo y el contador
        await db.runTransaction(async (transaction) => {
            const userSnap = await transaction.get(userRef);

            if (!userSnap.exists) {
                throw new Error(`Usuario ${userId} no encontrado.`);
            }

            const userData = userSnap.data() as UserData;
            const currentNoShows = (userData.noShowCount || 0) + 1;
            
            let updateData: any = {
                noShowCount: currentNoShows,
                updatedAt: admin.firestore.Timestamp.now()
            };

            // --- Lógica de Penalización Progresiva ---
            
            if (currentNoShows >= 3) {
                /**
                 * ⛔️ PENALIZACIÓN MÁXIMA (Strike 3)
                 * Confiscación de los $20 MXN invertidos en la sesión.
                 */
                updateData.balance = 0; // El saldo se sincroniza a CERO
                updateData.noShowCount = 0; // Reiniciamos contador tras la confiscación
                updateData.coolDownUntil = admin.firestore.FieldValue.delete();
                updateData.lastPenaltyType = 'CONFISCATION';
                
                console.log(`[MENCIONAL] 🚩 Strike 3 para ${userId}: SALDO CONFISCADO.`);
            } else {
                /**
                 * 🕒 PENALIZACIÓN TEMPORAL (Strike 1 y 2)
                 * Bloqueo de 1 hora. El saldo se mantiene intacto.
                 */
                const cooldownExpiry = new Date(Date.now() + 60 * 60 * 1000);
                
                updateData.coolDownUntil = admin.firestore.Timestamp.fromDate(cooldownExpiry);
                updateData.lastPenaltyType = 'COOLDOWN';
                
                console.log(`[MENCIONAL] ⚠️ Strike ${currentNoShows} para ${userId}: Cooldown de 1h.`);
            }

            transaction.update(userRef, updateData);
        });

        console.log(`✅ Protocolo de penalización ejecutado exitosamente para ${userId}.`);
    } catch (error) {
        console.error("❌ Error crítico en motor de penalización:", error);
        throw error;
    }
}