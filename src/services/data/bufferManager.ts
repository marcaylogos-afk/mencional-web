/**
 * 🎙️ BUFFER_MANAGER v16.0 - MENCIONAL NEURAL LINK (PROD)
 * Ubicación: /src/services/BufferManager.ts
 * Objetivo: Segmentación inteligente de ASR para optimizar el contexto de Gemini.
 * Protocolo: Prevención de redundancia y sincronización de ciclos.
 */

import { logger } from "../utils/logger";

export class BufferManager {
  private buffer: string = "";
  private interval: number = 19000; // Ciclo nominal: 19 segundos (Modo Intérprete)
  private timer: ReturnType<typeof setInterval> | null = null;
  private lastFlushCallback: ((text: string) => void) | null = null;

  /**
   * 📝 addText
   * Acumula el texto del reconocimiento de voz evitando duplicidad de fragmentos.
   * Algoritmo: Heurística de coincidencia parcial para evitar el "eco" de Web Speech API.
   */
  public addText(text: string): void {
    const cleanText = text.trim();
    if (cleanText.length === 0) return;

    // Validación de redundancia avanzada:
    // Si el texto nuevo ya está contenido al final del buffer, lo ignoramos.
    // Esto previene duplicaciones cuando 'isFinal' se dispara tardíamente.
    const currentBuffer = this.buffer.toLowerCase();
    const incomingText = cleanText.toLowerCase();

    if (currentBuffer.endsWith(incomingText)) {
        return; 
    }

    // Si el buffer no termina exactamente igual, verificamos solapamiento de última palabra
    const words = this.buffer.split(" ");
    const lastWord = words[words.length - 1]?.toLowerCase();
    
    if (incomingText === lastWord) {
        return;
    }

    // Inyección de fragmento con normalización de espacios
    this.buffer += (this.buffer ? " " : "") + cleanText;
  }

  /**
   * ⚙️ setCycleDuration
   * Calibración del pulso de procesamiento: 6000ms (Aprendizaje) o 19000ms (Intérprete).
   */
  public setCycleDuration(ms: number): void {
    if (this.interval === ms) return; 
    
    this.interval = ms;
    logger.info("SYSTEM", `PULSO_AJUSTADO: ${ms}ms`);
    
    if (this.timer && this.lastFlushCallback) {
      this.restartWithNewDuration(this.lastFlushCallback);
    }
  }

  /**
   * 🚀 start
   * Inicia el cronómetro de inyección hacia el motor de traducción Gemini.
   */
  public start(onFlush: (finalText: string) => void): void {
    if (this.timer) this.stopTimerOnly();
    
    this.lastFlushCallback = onFlush;

    this.timer = setInterval(() => {
      this.executeFlush();
    }, this.interval);
    
    logger.info("SYSTEM", "BUFFER_ENGINE_STARTED");
  }

  /**
   * ⚡ executeFlush (Interno)
   * Procesa el buffer actual y limpia la memoria post-emisión.
   */
  private executeFlush(): void {
    const textToProcess = this.buffer.trim();
    
    if (textToProcess.length > 0 && this.lastFlushCallback) {
      // Emitir hacia el servicio de IA
      this.lastFlushCallback(textToProcess);
      
      // Purga de seguridad post-procesamiento
      this.buffer = ""; 
    }
  }

  /**
   * 🔄 restartWithNewDuration
   * Re-sincroniza el pulso sin perder el almacenamiento actual.
   */
  private restartWithNewDuration(onFlush: (text: string) => void): void {
    this.stopTimerOnly();
    this.start(onFlush);
  }

  /**
   * 🛑 stop
   * Detiene el flujo por completo y purga el almacenamiento.
   */
  public stop(): void {
    this.stopTimerOnly();
    this.buffer = "";
    this.lastFlushCallback = null;
    logger.warn("SYSTEM", "BUFFER_TERMINATED_AND_PURGED");
  }

  private stopTimerOnly(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * ⚡ forceFlush
   * Disparo inmediato de emergencia.
   */
  public forceFlush(): void {
    this.executeFlush();
  }

  /**
   * 🔍 getRawBuffer
   * Acceso de diagnóstico para el HUD de desarrollo.
   */
  public getRawBuffer(): string {
    return this.buffer;
  }
}

/**
 * 🔌 INSTANCIA GLOBAL (interpreterBuffer)
 * Usada por UltraView y Rompehielo para sincronizar la escucha.
 */
export const interpreterBuffer = new BufferManager();
export default interpreterBuffer;