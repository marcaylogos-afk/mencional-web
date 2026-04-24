/**
 * 🔄 MENCIONAL | CORE_SESSION_LOGIC v2026.PROD
 * Orquestador: Gestiona el flujo entre ASR, Inferencia Gemini y Voz Aoede.
 * Protocolos: Aprendizaje (6s), Ultra (19s), Rompehielo (4s).
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { useSettings } from "../context/SettingsContext";

// ✅ Rutas estandarizadas al nuevo motor funcional /ai/
import speechService from "../services/ai/speechService"; 
import translateService from "../services/ai/translateService";
import asrService from "../services/ai/asr";
import { logger } from "../utils/logger";

export type SessionMode = 'learning' | 'interpreter' | 'icebreaker';

export const useSessionLogic = (
  mode: SessionMode,
  targetLang: string = "en-US"
) => {
  const { settings } = useSettings();
  const isAdmin = settings.role === 'admin';
  
  // --- ESTADOS DE INTERFAZ OLED (Optimizado para contraste infinito) ---
  const [sourceText, setSourceText] = useState<string>("ESCUCHANDO...");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const lastProcessedText = useRef<string>("");

  /**
   * 🎙️ INICIO DEL MOTOR DE ESCUCHA (ASR)
   * Se activa al montar el componente y hereda los umbrales del InstructionEngine.
   */
  useEffect(() => {
    // El ASR Service ya gestiona internamente los umbrales críticos (6s, 19s, 4s)
    asrService.start(mode, targetLang, (text) => {
      setSourceText(text);
      // Al detectar entrada de voz, preparamos el estado de procesamiento visual
      if (text !== "ESCUCHANDO...") {
        setIsProcessing(true);
      }
    });

    return () => {
      asrService.stop();
      logger.info("CORE_LOGIC", "Motor ASR liberado de hardware.");
    };
  }, [mode, targetLang]);

  /**
   * ⚡ GESTIÓN DE CICLO NEURAL
   * Reacciona cuando el ASR detecta un silencio suficiente según el modo activo.
   */
  const processNeuralCycle = useCallback(async (text: string) => {
    // 🛡️ Filtro de redundancia: Evita colisiones de red y re-procesamiento
    if (!text || text === lastProcessedText.current || text === "ESCUCHANDO...") {
      setIsProcessing(false);
      return;
    }
    
    setIsProcessing(true);
    lastProcessedText.current = text;

    try {
      // 1. Ejecución del protocolo (Inferencia Gemini + Síntesis Aoede automática en /ai/)
      const result = await translateService.executeProtocol(text, mode, targetLang);

      // 2. Distribución de resultados según la función de Mencional activa
      if (mode === 'icebreaker' && Array.isArray(result)) {
        // En Rompehielo (4s) esperamos un Array con 3 opciones táctiles
        setSuggestions(result);
      } else if (typeof result === 'string') {
        // En Learning (6s) o Ultra (19s) actualizamos el bloque de traducción principal
        setTranslatedText(result);
      }
      
    } catch (error) {
      logger.error("SESSION_LOGIC_FAIL", `Error en ciclo neural sincronizado: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  }, [mode, targetLang]);

  /**
   * 🔊 REPRODUCCIÓN MANUAL
   * Utilizado para repetir frases o ejecutar las sugerencias del modo Rompehielo.
   */
  const playManualAudio = async (text: string) => {
    // En modo Intérprete (Ultra) aplicamos velocidad profesional (1.15x)
    const rate = mode === 'interpreter' ? 1.15 : 1.0;
    await speechService.playTTS(text, targetLang, rate);
  };

  return {
    sourceText,      // Texto en tiempo real (Feedback visual ASR)
    translatedText,  // Respuesta procesada por la IA Gemini
    suggestions,     // Opciones rápidas (Solo en modo Rompehielo)
    isProcessing,    // Estado de carga para animaciones neón OLED
    isAdmin,         // Flag para bypass de restricciones de tiempo
    playManualAudio, // Función para interactuar con las sugerencias táctiles
    config: settings
  };
};

export default useSessionLogic;