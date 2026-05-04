/** 🔊 MOTOR MENCIONAL: SPEECH SERVICE v2026.PROD 
 * ✅ SOPORTE: Dual Mode (Ultra Interpreter / Learning Mode)
 * ✅ AUDIO: Doble Impacto Auditivo (x2) | 1.0x -> 0.85x
 * ✅ CONTROL: Sincronización de ciclos Micro-Repetición
 */

class SpeechService {
  private recognition: any = null;
  private listeners: { [key: string]: Function[] } = {};
  private isListening: boolean = false;
  private isSpeaking: boolean = false;

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
        };
        this.recognition.onerror = (event: any) => {
          console.error("%c 🔴 [AOEDE_ERROR]:", "color: #FF0055", event.error);
          this.isListening = false;
        };
      }
    }
  }

  /** 🎤 ESCUCHA ACTIVA (Ventana de 5s gestionada por UI) */
  public async start(lang: string = 'es-MX') {
    if (!this.recognition) return false;
    
    // Si estamos hablando, no permitimos que el micro se abra para evitar feedback
    if (this.isSpeaking) return false;

    // Si ya está escuchando, hacemos un reset limpio
    if (this.isListening) {
      this.stop();
      await new Promise(r => setTimeout(r, 150));
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
      return false;
    }
  }

  /** 🗣️ PROTOCOLO AOEDE: DOBLE IMPACTO (x2)
   * Este método es asíncrono y "bloquea" el flujo hasta que termina la repetición.
   */
  public async speakLearning(text: string, lang: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    this.isSpeaking = true;
    this.stop(); // 🛑 Detenemos el micro de inmediato antes de hablar
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes(lang) && (v.name.includes("Google") || v.name.includes("Natural")));

    const playUtterance = (rate: number) => {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate; 
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(true);
        
        window.speechSynthesis.speak(utterance);
      });
    };

    try {
      // 1ª Pasada: Impacto Natural (1.0x)
      await playUtterance(1.0);
      
      // Pausa de Absorción Táctica (700ms)
      await new Promise(r => setTimeout(r, 700));

      // 2ª Pasada: Fijación Fonética (0.85x)
      await playUtterance(0.85);
    } finally {
      this.isSpeaking = false;
      // Emitimos evento para avisar a la UI que ya puede re-encender el radar
      this.emit('speaking_finished', true);
    }
  }

  /** 🛑 DETENCIÓN DE GOLPE (Hardware Release) */
  public stop() {
    if (this.recognition) {
      try {
        // .abort() es crucial para que el micro se apague AL INSTANTE
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

  /** 🔌 SISTEMA DE EVENTOS */
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

export const speechService = new SpeechService();
export default speechService;