/**
 * ⏰ PROTOCOLO DE CUMPLIMIENTO MENCIONAL 2026
 * Ubicación: /functions/src/checkNoShow.ts
 * Objetivo: Auditoría automatizada de asistencia y ejecución de sanciones por hardware.
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { penalizeUser } from './penalizeUser'; 

// Inicialización segura del SDK de Admin
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

/**
 * 📄 ESQUEMA DE DATOS DE SESIÓN
 * Sincronizado con el CommitmentEngine para bloques de 20 min ($20 MXN).
 */
interface SessionData extends admin.firestore.DocumentData {
    scheduledTime: admin.firestore.Timestamp;
    status: 'scheduled' | 'active' | 'finished' | 'no-show' | 'cancelled';
    participants?: string[];
    createdBy?: string;
    isPaid?: boolean;
}

/**
 * 🚀 MOTOR DE AUDITORÍA (Ejecución cada 5 minutos)
 * Monitorea sesiones programadas que no han sido iniciadas por el usuario.
 */
export const checkNoShow = functions.pubsub
    .schedule("every 5 minutes") 
    .onRun(async (context) => {
        try {
            const now = new Date();
            const TOLERANCIA_NOSHOW = 5 * 60 * 1000;      // 5 min: Umbral de sanción
            const TOLERANCIA_LIBERACION = 10 * 60 * 1000;  // 10 min: Limpieza de sistema

            console.log(`🔍 Iniciando auditoría de cumplimiento: ${now.toISOString()}`);

            // Filtramos sesiones 'scheduled' cuya hora de inicio ya pasó
            const snapshot = await db
                .collection("sessions")
                .where("status", "==", "scheduled")
                .where("scheduledTime", "<", admin.firestore.Timestamp.fromDate(now))
                .get();

            if (snapshot.empty) {
                console.log("✅ No hay sesiones pendientes de auditoría.");
                return null;
            }

            const processingPromises = snapshot.docs.map(async (doc) => {
                const session = doc.data() as SessionData;
                const scheduledTime = session.scheduledTime.toDate();
                const timePassed = now.getTime() - scheduledTime.getTime();

                /**
                 * 🔴 ESCENARIO 1: PROTOCOLO NO-SHOW (Strike & Sanción)
                 * Se activa si el aula está vacía después de los 5 minutos de gracia.
                 */
                if (
                    timePassed >= TOLERANCIA_NOSHOW && 
                    timePassed < TOLERANCIA_LIBERACION &&
                    (!session.participants || session.participants.length === 0)
                ) {
                    console.log(`🚨 NO-SHOW DETECTADO: Sesión ${doc.id} (Usuario: ${session.createdBy})`);

                    // 1. Marcamos la sesión como fallida en la DB
                    await doc.ref.update({
                        status: "no-show",
                        updatedAt: admin.firestore.Timestamp.now(),
                    });

                    // 2. Ejecutamos Protocolo de Penalización por Hardware
                    // Strike 1/2: Cooldown 1h | Strike 3: Confiscación de crédito
                    if (session.createdBy) {
                        try {
                            await penalizeUser(session.createdBy); 
                        } catch (pError) {
                            console.error(`❌ Error al penalizar usuario ${session.createdBy}:`, pError);
                        }
                    }
                }
                
                /**
                 * ⚪ ESCENARIO 2: LIMPIEZA GLOBAL (Garbage Collection)
                 * Si pasan 10 minutos sin respuesta, liberamos el espacio para nuevos alumnos.
                 */
                else if (timePassed >= TOLERANCIA_LIBERACION) {
                    console.log(`🗑️ LIBERACIÓN: Cancelando sesión ${doc.id} por inactividad prolongada.`);
                    
                    await doc.ref.update({
                        status: "cancelled",
                        reason: "timeout_no_response",
                        updatedAt: admin.firestore.Timestamp.now(),
                    });
                }
            });

            await Promise.all(processingPromises);
            return null;

        } catch (error) {
            console.error("❌ FALLO CRÍTICO EN MOTOR NO-SHOW:", error);
            // No lanzamos error para evitar re-intentos infinitos en PubSub
            return null;
        }
    });