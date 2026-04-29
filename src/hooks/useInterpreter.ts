/**
 * 🎙️ HOOK: useInterpreter v2026.PROD (MENCIONAL CORE)
 * Protocolos: Fijación 6s (Learning) | Acumulación 19s (Ultra) | Repetición x2.
 * Ubicación: /src/hooks/useInterpreter.ts
 * ✅ SERVICIOS AI: Sincronizados en /src/services/ai/
 */

import { useEffect, useRef, useState, useContext, useCallback } from "react";
// ✅ Importaciones corregidas al estándar de directorio /ai/
import translateService from "../services/ai/translateService"; 
import speechService from "../services/ai/speechService"; 
import { logger } from "../utils/logger"; 
import { jsPDF } from "jspdf";
import { SettingsContext } from "../context/SettingsContext";

const SpeechRecognitionConstructor = 
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useInterpreter = (
  mode: 'LEARNING' | 'INTERPRETER' | 'ROMPEHIELO' = 'LEARNING',
  targetLangOverride?: string
) => {
  const context = useContext(SettingsContext);
  const settings = context?.settings;

  // --- ESTADOS DE FLUJO (Optimizado para OLED) ---
  const [sourceText, setSourceText] = useState<string>("ESCUCHANDO..."); 
  const [translatedText, setTranslatedText] = useState<string>(""); 
  const [liveTextLarge, setLiveTextLarge] = useState<string>(""); 
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [fullLog, setFullLog] = useState<{original: string, translated: string, timestamp: string}[]>([]);

  // --- REFERENCIAS DE CONTROL ---
  const recognitionRef = useRef<any>(null);
  const isProcessingAudio = useRef<boolean>(false); 
  const displayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interpreterBuffer = useRef<string>(""); 
  const isMounted = useRef<boolean>(true);

  /**
   * 📄 EXPORTACIÓN PDF
   * Genera el acta de sesión para revisión post-estudio.
   */
  const saveAsPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("MENCIONAL - ACTA DE SESIÓN PROFESIONAL", 10, 20);
    doc.setFontSize(9);
    
    let y = 30;
    fullLog.forEach((entry) => {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.setTextColor(150);
      doc.text(`[${entry.timestamp}] ORIG: ${entry.original}`, 10, y, { maxWidth: 180 });
      y += 10;
      doc.setTextColor(0);
      doc.text(`TRAD: ${entry.translated}`, 15, y, { maxWidth: 180 });
      y += 15;
    });
    
    doc.save(`Mencional_Report_${Date.now()}.pdf`);
  }, [fullLog]);

  /**
   * 🔄 EJECUCIÓN DE CICLOS (NEURAL CORE)
   * Gestiona la inferencia Gemini y el refuerzo auditivo Aoede.
   */
  const executeCycle = useCallback(async (text: string) => {
    if (!text.trim() || isProcessingAudio.current) return;

    setIsTranslating(true);
    isProcessingAudio.current = true;

    const currentTarget = targetLangOverride || settings?.practiceLanguage || "en-US";
    const timestamp = new Date().toLocaleTimeString();

    try {
      if (mode === 'INTERPRETER') {
        // Acumulación para ventana de 19s (Modo Ultra-Mencional)
        interpreterBuffer.current += ` ${text}`;
        setSourceText(text.toUpperCase());
        setLiveTextLarge(text);
      } else {
        // ✅ PROCESAMIENTO AI: Traducción para modo Learning en carpeta /ai/
        const result = await translateService.translateText(
          text, 
          currentTarget, 
          mode.toLowerCase() as any
        );

        if (!isMounted.current) return;

        setFullLog(prev => [...prev, { original: text, translated: result, timestamp }]);
        
        // Protocolo Visual: Repetición x2 en pantalla para fijación léxica
        setTranslatedText(`${result}\n${result}`);

        // Temporizador de limpieza OLED (Ventana de 6s para evitar burn-in)
        if (displayTimer.current) clearTimeout(displayTimer.current);
        displayTimer.current = setTimeout(() => {
          if (isMounted.current) setTranslatedText("");
        }, 6000);

        // 🧠 REFUERZO AUDITIVO AOEDE: Protocolo de repetición x2 (Fijación Neural)
        await speechService.speak(result, { 
          lang: currentTarget, 
          mode: 'learning',
          repeat: 2 
        });
      }
    } catch (error) {
      logger.error("IA_CYCLE_ERROR", `Fallo en el flujo de inteligencia artificial (/ai/): ${error}`);
    } finally {
      if (isMounted.current) {
        setIsTranslating(false);
        isProcessingAudio.current = false;
      }
    }
  }, [mode, settings, targetLangOverride]);

  /**
   * ⏱️ PROTOCOLO ULTRA: Ciclos de 19s
   * Traduce bloques de pensamiento largos para fluidez profesional.
   */
  useEffect(() => {
    if (mode !== 'INTERPRETER') return;
    const interpreterTimer = setInterval(async () => {
      if (interpreterBuffer.current.trim() && isMounted.current) {
        const textToProcess = interpreterBuffer.current;
        interpreterBuffer.current = "";
        
        const targetLang = settings?.nativeLanguage || 'es-MX';
        const result = await translateService.translateText(textToProcess, targetLang, 'ultra');
        
        // Síntesis Aoede 2.0x (Velocidad de intérprete profesional en tiempo real)
        await speechService.speak(result, { 
          lang: targetLang, 
          mode: 'ultra',
          rate: 2.0 
        });
        
        setFullLog(prev => [...prev, { 
          original: textToProcess, 
          translated: result, 
          timestamp: new Date().toLocaleTimeString() 
        }]);
      }
    }, 19000);

    return () => clearInterval(interpreterTimer);
  }, [mode, settings]);

  /**
   * 🎙️ ESCUCHA HANDS-FREE (ASR Constante)
   */
  useEffect(() => {
    if (!SpeechRecognitionConstructor) return;
    isMounted.current = true;
    const rec = new SpeechRecognitionConstructor();
    recognitionRef.current = rec;
    
    rec.continuous = true;
    rec.interimResults = true; 
    
    // Configuración de idioma según el modo
    rec.lang = mode === 'INTERPRETER' 
      ? (targetLangOverride || 'en-US') 
      : (settings?.nativeLanguage || 'es-MX');

    rec.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      if (interim && isMounted.current) setSourceText(interim.toUpperCase());
      if (final) executeCycle(final);
    };

    rec.onend = () => { if (isMounted.current) try { rec.start(); } catch (e) {} };
    
    try { 
      rec.start(); 
    } catch (e) { 
      logger.warn("MIC_BUSY", "Reintentando activación de hardware Mencional..."); 
    }

    return () => {
      isMounted.current = false;
      if (recognitionRef.current) rec.stop();
      speechService.stopAll();
    };
  }, [mode, executeCycle, settings, targetLangOverride]);

  return { 
    sourceText, 
    translatedText, 
    liveTextLarge,
    isTranslating, 
    saveAsPDF, 
    history: fullLog,
    forceStop: () => { 
      isMounted.current = false;
      recognitionRef.current?.stop();
      speechService.stopAll();
    }
  };
};

export default useInterpreter;