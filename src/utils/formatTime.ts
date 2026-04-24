/**
 * ⏳ TIME_ENGINE v2026.12 - MENCIONAL
 * Ubicación: /src/utils/formatTime.ts
 * Función: Gestión de Bloques de Sincronización (20 min) y telemetría de sesión.
 * Estado: PRODUCCIÓN FINAL - Optimizado para interfaces OLED.
 * ✅ DIRECTORIO AI: Sincronizado para logs en /src/services/ai/
 */

/**
 * ✅ CONSTANTES DE PROTOCOLO
 * BLOQUE_ESTANDAR: 20 minutos (1200 segundos) para Participantes.
 */
export const MENCIONAL_SESSION_LIMIT = 1200; 

/**
 * ⏲️ formatTime
 * Convierte segundos totales en un string de formato MM:SS.
 * Maneja casos negativos devolviendo 00:00 para evitar errores en la UI.
 */
export const formatTime = (seconds: number): string => {
  if (seconds <= 0) return "00:00";
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 🎨 getTimerStatusClass
 * Gestiona la jerarquía visual del cronómetro según la urgencia de tiempo.
 * Integra animaciones de pulso y resplandores neón (Glow).
 */
export const getTimerStatusClass = (seconds: number): string => {
  // 1. ESTADO AGOTADO: Sesión finalizada
  if (seconds <= 0) {
    return "text-zinc-800 line-through opacity-30 transition-all duration-1000 font-mono scale-90 grayscale";
  }

  // 2. ALERTA CRÍTICA: < 1 minuto (Urgencia Máxima)
  // Rojo vibrante con pulso acelerado para captar atención inmediata antes del cierre.
  if (seconds <= 60) {
    return "text-rose-500 animate-[pulse_0.6s_ease-in-out_infinite] drop-shadow-[0_0_15px_rgba(244,63,94,0.9)] font-black tracking-tighter scale-150 transition-transform duration-300";
  }
  
  // 3. ALERTA DE AVISO: < 5 minutos (Advertencia de Cierre / 300 segundos)
  // Especificación: El reloj se agranda ligeramente y parpadea.
  if (seconds <= 300) {
    return "text-amber-400 animate-pulse drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] font-bold scale-125 transition-all duration-700";
  }
  
  // 4. ESTADO NOMINAL: Funcionamiento estándar (Cian Neón #00FBFF)
  // Diseño limpio, minimalista y con brillo técnico sutil.
  return "text-[#00FBFF] drop-shadow-[0_0_12px_rgba(0,251,255,0.4)] opacity-90 font-medium scale-100 tracking-[0.2em]";
};

/**
 * 📊 getSessionProgress
 * Calcula el porcentaje de avance (0 a 100) para barras de progreso.
 */
export const getSessionProgress = (currentSeg: number, totalSeg: number = MENCIONAL_SESSION_LIMIT): number => {
  if (totalSeg <= 0) return 100;
  const progress = ((totalSeg - currentSeg) / totalSeg) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

/**
 * 🛰️ getElapsedSessionTime
 * Calcula el tiempo transcurrido desde un timestamp inicial.
 * Útil para el Modo Intérprete (Ultra) y logs de telemetría en /ai/.
 */
export const getElapsedSessionTime = (startTime: number): string => {
  if (!startTime) return "00:00";
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  return formatTime(elapsed);
};

// Objeto unificado para exportación por defecto
const TimeEngine = {
  MENCIONAL_SESSION_LIMIT,
  formatTime,
  getTimerStatusClass,
  getSessionProgress,
  getElapsedSessionTime
};

export default TimeEngine;