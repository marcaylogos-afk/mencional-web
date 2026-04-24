/** 🔊 MOTOR MENCIONAL: SPEECH SERVICE v2026.PROD 
 * ✅ SOPORTE: Dual Mode (Ultra Interpreter / Learning Mode)
 * ✅ AUDIO: Doble Impacto Auditivo (x2) | 1.0x -> 0.85x
 * ✅ CONTROL: Sincronización de ciclos Micro-Repetición
 * ✅ UBICACIÓN: /src/services/ai/speechService.ts
 */

class SpeechService {
  private recognition: any = null;
  private listeners: { [key: string]: Function[] } = {};
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private autoRestart: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => { 
          this.isListening = true;
          this.emit('status', 'listening');
        };

        this.recognition.onend = () => { 
          this.isListening = false;
          this.emit('status', 'idle');
          // Si el micro se cierra solo por tiempo muerto pero no por orden nuestra, avisar a la UI
          this.emit('mic_closed', true);
        };

        this.recognition.onerror = (event: any) => {
          if (event.error !== 'no-speech') {
             console.error("%c 🔴 [AOEDE_ERROR]:", "color: #FF0055", event.error);
             this.emit('error', event.error);
          }
          this.isListening = false;
        };
      }
    }
  }

  /** 🎤 ESCUCHA ACTIVA (Captación Neural) */
  public async start(lang: string = 'es-MX') {
    if (!this.recognition) return false;
    
    // 🛡️ Prevenir feedback: Si Aoede está hablando, el micro NO se abre.
    if (this.isSpeaking) return false;

    // Reset limpio si ya está activo
    if (this.isListening) {
      this.stop();
      await new Promise(r => setTimeout(r, 100));
    }

    this.recognition.lang = lang;
    
    this.recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      
      if (interim) this.emit('partial_result', interim);
      if (final) {
        console.log("%c 🟢 [AOEDE_DATA]:", "color: #00FBFF", final.trim());
        this.emit('final_result', { transcription: final.trim() });
      }
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      // Si ya está iniciado capturamos el error silenciosamente
      return false;
    }
  }

  /** 🗣️ PROTOCOLO AOEDE: DOBLE IMPACTO (x2)
   * Bloquea el flujo hasta terminar la fijación fonética.
   */
  public async speakLearning(text: string, lang: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    this.isSpeaking = true;
    this.stop(); // 🛑 SILENCIO ABSOLUTO: Matamos el micro antes de hablar
    window.speechSynthesis.cancel();

    // Selección de voz técnica (Premium/Natural si está disponible)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.includes(lang) && 
      (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Neural"))
    );

    const playUtterance = (rate: number, volume: number = 1.0) => {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate; 
        utterance.volume = volume;
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(true);
        
        window.speechSynthesis.speak(utterance);
      });
    };

    try {
      // 1ª Pasada: Impacto Inicial (Velocidad Estándar)
      await playUtterance(1.0);
      
      // Pausa de Absorción Táctica (750ms para procesamiento cerebral)
      await new Promise(r => setTimeout(r, 750));

      // 2ª Pasada: Fijación Fonética (Velocidad Reducida)
      await playUtterance(0.85, 0.9); 
    } finally {
      this.isSpeaking = false;
      this.emit('speaking_finished', true);
    }
  }

  /** 🛑 DETENCIÓN DE EMERGENCIA (Hardware Release) */
  public stop() {
    if (this.recognition) {
      try {
        // .abort() es preferible a .stop() porque libera el hardware de inmediato
        this.recognition.abort(); 
        this.isListening = false;
      } catch (e) {}
    }
  }

  public stopAll() {
    this.stop();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /** 🔌 EVENT ENGINE */
  public on(event: string, cb: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
  }

  public off(event: string, cb?: Function) {
    if (!cb) {
      this.listeners[event] = [];
    } else {
      this.listeners[event] = this.listeners[event]?.filter(l => l !== cb);
    }
  }

  private emit(event: string, data: any) {
    this.listeners[event]?.forEach(cb => cb(data));
  }
}

// Singleton para toda la App Mencional
export const speechService = new SpeechService();
export default speechService;