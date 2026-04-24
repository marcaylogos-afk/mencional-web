/**
 * 🌐 MENCIONAL | CLOUD_SYNC_SERVICE v2026.PROD
 * Conectividad Global para Sesiones Multi-Usuario (Laptops/Celulares)
 * Ubicación: /src/services/supabaseClient.ts
 */
import { createClient } from '@supabase/supabase-js';

// ✅ Credenciales vinculadas al Nodo Maestro
const supabaseUrl: string = 'https://tu-proyecto-id.supabase.co';
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; 

/**
 * Cliente de Supabase configurado para Realtime.
 * Optimizado para latencia mínima en voz activa y cambios de color.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, // Sincronización fluida para el espectro visual
    },
  },
});

/**
 * 🧬 TIPADO DE SESIÓN MENCIONAL (Contrato de Inmersión)
 * Basado en la arquitectura de 3 participantes y 10 colores.
 */
export interface Participant {
  id: string;
  name: string;
  color: string;           // Uno de los 10 colores del sistema (Palette10)
  device: 'mobile' | 'desktop';
  is_admin: boolean;       // Identificador de Nodo Maestro
}

export interface MencionalSession {
  id: string;              // UUID de la sesión
  theme: string;           // Contexto de Inmersión (Ingeniería, Medicina, etc.)
  status: 'waiting' | 'active' | 'finished';
  participants: Participant[]; 
  active_speaker_id: string;   // ID del participante que emite voz actualmente
  active_speaker_color: string; // Color OLED activo en el espectro
  last_phrase_original: string; // Texto detectado en idioma fuente
  last_phrase_translated: string; // Traducción para repetición x2
  created_at: string;
}