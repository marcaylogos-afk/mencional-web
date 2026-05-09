/** 🔊 MOTOR MENCIONAL: SPEECH SERVICE v2026.PROD 
 * ✅ SOPORTE: Dual Mode (Ultra Interpreter / Learning Mode)
 * ✅ AUDIO: Doble Impacto Auditivo Aoede (1.0x -> 0.85x)
 * ✅ DETECCIÓN: Lógica Bilingüe Dinámica (Target <-> Native)
 * ✅ UBICACIÓN: /src/services/ai/speechService.ts
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

  /** 🎤 ESCUCHA ACTIVA (Captación Neural Bilingüe) 
   * @param lang El idioma en el que el motor intentará reconocer la voz.
  */
  public async start(lang: string = 'es-MX') {
    if (!this.recognition) return false;
    
    if (this.isSpeaking) return false;

    if (this.isListening) {
      this.stop();
      await new Promise(r => setTimeout(r, 150));
    }

    // Seteamos el idioma capturado desde la configuración (ej. 'it-IT' o 'es-MX')
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
        console.log(`%c 🟢 [AOEDE_DETECTED (${lang})]:`, "color: #00FBFF", final.trim());
        
        // Enviamos el texto y el idioma en el que se detectó para que el traductor sepa qué hacer
        this.emit('final_result', { 
          transcription: final.trim(),
          detectedLang: lang 
        });
      }
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      return false;
    }
  }

  /** 🗣️ PROTOCOLO AOEDE: DOBLE IMPACTO (x2) */
  public async speakLearning(text: string, lang: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    this.isSpeaking = true;
    this.stop(); 
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    // Buscamos una voz que coincida con el idioma de destino (ej. Italiano)
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
      await playUtterance(1.0);
      await new Promise(r => setTimeout(r, 750));
      await playUtterance(0.85, 0.9); 
    } finally {
      this.isSpeaking = false;
      this.emit('speaking_finished', true);
    }
  }

  public stop() {
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