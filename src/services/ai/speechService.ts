/** 🔊 MOTOR MENCIONAL: SPEECH SERVICE v2026.PROD 
 * ✅ SOPORTE: Dual Mode (Ultra Interpreter / Learning Mode)
 * ✅ AUDIO: Doble Impacto Auditivo (x2) | 1.0x -> 0.85x
 * ✅ CONTROL: Sincronización de ciclos Micro-Repetición
 * ✅ MOD: Espera extendida de 7s para traducción
 */

class SpeechService {
  private recognition: any = null;
  private listeners: { [key: string]: Function[] } = {};
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  
  // ⏳ Timer para controlar la espera de 7 segundos
  private silenceTimer: any = null;
  private accumulatedTranscript: string = "";

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
        this.onerror = (event: any) => {
          console.error("%c 🔴 [AOEDE_ERROR]:", "color: #FF0055", event.error);
          this.isListening = false;
        };
      }
    }
  }

  /** 🎤 ESCUCHA ACTIVA CON ESPERA DE 7s */
  public async start(lang: string = 'es-MX') {
    if (!this.recognition) return false;
    
    if (this.isSpeaking) return false;

    if (this.isListening) {
      this.stop();
      await new Promise(r => setTimeout(r, 150));
    }

    this.accumulatedTranscript = ""; // Reset de la frase acumulada
    this.recognition.lang = lang;

    this.recognition.onresult = (event: any) => {
      let interim = "";
      
      // Limpiamos el timer cada vez que el usuario vuelve a hablar
      if (this.silenceTimer) clearTimeout(this.silenceTimer);

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.accumulatedTranscript += " " + transcript;
        } else {
          interim += transcript;
        }
      }
      
      if (interim) this.emit('partial_result', interim);

      // ⏱️ Inicia la cuenta regresiva de 7 segundos tras detectar silencio
      this.silenceTimer = setTimeout(() => {
        const finalPhrase = (this.accumulatedTranscript + " " + interim).trim();
        
        if (finalPhrase) {
          console.log("%c 🟢 [AOEDE_DATA]: (Enviando tras 7s)", "color: #00FBFF", finalPhrase);
          this.emit('final_result', { transcription: finalPhrase });
          
          // Limpiamos para la siguiente oración
          this.accumulatedTranscript = "";
          // Opcional: Detener tras traducir si así lo requiere tu flujo
          // this.stop(); 
        }
      }, 7000); // <--- Los 7000ms que solicitaste
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      return false;
    }
  }

  public async speakLearning(text: string, lang: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    this.isSpeaking = true;
    this.stop(); 
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
      await playUtterance(1.0);
      await new Promise(r => setTimeout(r, 700));
      await playUtterance(0.85);
    } finally {
      this.isSpeaking = false;
      this.emit('speaking_finished', true);
    }
  }

  public stop() {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.recognition) {
      try {
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