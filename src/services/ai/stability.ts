/**
 * 🛰️ STABILITY SERVICE PRO - MENCIONAL OS
 * Estado: PRODUCCIÓN FINAL (PROD_2026)
 * Monitoreo de latencia real y blindaje de red para procesamiento de voz.
 * Ubicación: /src/services/ai/stability.ts
 */

import { useState, useEffect } from 'react';
import { logger } from '../../utils/logger';

export interface NetworkStatus {
  online: boolean;
  latency: number;
  quality: 'EXCELLENT' | 'STABLE' | 'DEGRADED' | 'DISCONNECTED';
}

class StabilityMonitor {
  private latencyHistory: number[] = [];
  private recoveryInterval: number | null = null;
  // @ts-ignore - Usado para monitoreo interno de salud de sesión
  private lastPulse: number = Date.now();

  /**
   * 🏁 checkPulse: Medición REAL de latencia hacia infraestructura crítica.
   * Crucial para el Protocolo 6s/4s de Mencional.
   */
  async checkPulse(): Promise<NetworkStatus> {
    const start = performance.now();
    try {
      // HEAD request ultra-ligera (204 No Content) para medir salud sin gasto de datos.
      await fetch("https://www.gstatic.com/generate_204", {
        mode: 'no-cors',
        cache: 'no-cache',
        method: 'HEAD'
      });

      const latency = Math.round(performance.now() - start);
      this.updateHistory(latency);
      this.lastPulse = Date.now();

      return {
        online: navigator.onLine,
        latency,
        quality: this.calculateQuality(latency)
      };
    } catch (error) {
      return {
        online: false,
        latency: 0,
        quality: 'DISCONNECTED'
      };
    }
  }

  private updateHistory(newLatency: number) {
    this.latencyHistory.push(newLatency);
    // Ventana móvil de 5 mediciones para suavizar el jitter.
    if (this.latencyHistory.length > 5) this.latencyHistory.shift();
  }

  private calculateQuality(latency: number): NetworkStatus['quality'] {
    if (!navigator.onLine) return 'DISCONNECTED';
    
    const avg = this.latencyHistory.length > 0 
      ? this.latencyHistory.reduce((a, b) => a + b) / this.latencyHistory.length 
      : latency;

    /** * Umbrales Críticos Mencional:
     * EXCELLENT: < 150ms (Latencia imperceptible para Ultra-Interpreter)
     * STABLE: < 350ms (Óptimo para ciclos de 6s de aprendizaje)
     * DEGRADED: > 350ms (Riesgo de desincronización de audio Aoede)
     */
    if (avg < 150) return 'EXCELLENT';
    if (avg < 350) return 'STABLE';
    return 'DEGRADED';
  }

  /**
   * 🛡️ attemptRecovery: Lógica de reconexión silenciosa.
   */
  async attemptRecovery(onRecovered: () => void) {
    if (this.recoveryInterval) return;

    logger.info("STABILITY_RECOVERY", "Iniciando protocolo de recuperación de enlace...");

    this.recoveryInterval = window.setInterval(async () => {
      const status = await this.checkPulse();
      if (status.online && (status.quality === 'EXCELLENT' || status.quality === 'STABLE')) {
        if (this.recoveryInterval) clearInterval(this.recoveryInterval);
        this.recoveryInterval = null;
        logger.info("STABILITY_RECOVERY", "Enlace restablecido con éxito.");
        onRecovered();
      }
    }, 5000); 
  }

  /**
   * ⏱️ getSyncRemaining: Retorna segundos restantes para el cierre forzado.
   * ✅ Actualizado a 60 minutos (3600s) según protocolo Mencional 2026.
   */
  getSyncRemaining(startTime: number, durationMinutes: number = 60): number {
    const elapsed = (Date.now() - startTime) / 1000;
    const total = durationMinutes * 60;
    return Math.max(0, total - elapsed);
  }
}

export const stability = new StabilityMonitor();

/**
 * 📡 useNetworkShield
 * Hook para la UI (Navbar/Status Bar). 
 */
export const useNetworkShield = (sessionStartTime?: number, sessionId?: string | null) => {
  const [netStatus, setNetStatus] = useState<NetworkStatus>({
    online: navigator.onLine,
    latency: 0,
    quality: 'STABLE'
  });

  const [syncWarning, setSyncWarning] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Verificar si el Watchdog ya bloqueó esta sesión localmente
    if (sessionId) {
      const blocked = localStorage.getItem(`blocked_${sessionId}`) === 'true';
      if (blocked) setIsBlocked(true);
    }

    // Diagnóstico inicial
    stability.checkPulse().then(status => {
      if (isMounted) setNetStatus(status);
    });

    // Polling de salud cada 12s
    const interval = setInterval(async () => {
      // 🛑 Si ya está bloqueado, no gastar recursos en pings
      if (isBlocked) return;

      const current = await stability.checkPulse();
      
      if (isMounted) {
        setNetStatus(current);
        
        // Alerta de 10 minutos (600s) restantes para Sincronización Forzada
        if (sessionStartTime) {
          const remaining = stability.getSyncRemaining(sessionStartTime);
          if (remaining <= 600 && remaining > 0) {
            setSyncWarning(true);
          } else {
            setSyncWarning(false);
          }

          // Si el tiempo se agotó (0), forzamos el estado bloqueado
          if (remaining <= 0) {
            setIsBlocked(true);
          }
        }
      }
    }, 12000);

    const handleOnline = () => stability.checkPulse().then(s => isMounted && setNetStatus(s));
    const handleOffline = () => isMounted && setNetStatus({ online: false, latency: 0, quality: 'DISCONNECTED' });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [sessionStartTime, sessionId, isBlocked]);

  return { ...netStatus, syncWarning, isBlocked };
};

export default stability;