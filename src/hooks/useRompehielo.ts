/**
 * 🍹 MENCIONAL | HOOK: USE_ROMPEHIELO v2026.PROD
 * Protocolo: Ventana Crítica 4s | Triple Sugerencia Social | Social Wingman
 * Nomenclatura: Mencional (Aprendizaje), Ultra-Mencional (Intérprete), Rompehielo (Social).
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */
import { useState, useCallback, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
// ✅ Importaciones corregidas al estándar /ai/
import instructionEngine from '../services/ai/instructionEngine';
import translateService from '../services/ai/translateService';
import speechService from '../services/ai/speechService'; 
import { logger } from '../utils/logger';

export const useRompehielo = () => {
  const { settings } = useSettings();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePhrase, setActivePhrase] = useState("");
  
  // Referencia para evitar colisiones en la ventana flash de 4s
  const processingRef = useRef(false);

  /**
   * 🧠 ANALIZAR_CONTEXTO: Detecta la intención social y genera 3 respuestas lógicas.
   * Se dispara tras el silencio de 4 segundos detectado por el ASR.
   */
  const analyzeContext = useCallback(async (transcript: string) => {
    if (!transcript || transcript.trim().length < 3 || processingRef.current) return;

    processingRef.current = true;
    setIsAnalyzing(true);
    logger.info("ROMPEHIELO", "Iniciando análisis de reacción social (Ventana 4s)");

    try {
      // 1. Cargar el prompt especializado del motor neural
      const instructions = instructionEngine.getInstructions('rompehielo');
      
      // 2. Inferencia Gemini: Solicitamos las 3 opciones de respuesta social
      const response = await translateService.getNeuralResponse(transcript, instructions);
      
      let finalSuggestions: string[] = [];

      // 3. Procesamiento seguro del retorno (Array o JSON string)
      if (Array.isArray(response)) {
        finalSuggestions = response.slice(0, 3);
      } else if (typeof response === 'string') {
        try {
          const parsed = JSON.parse(response);
          finalSuggestions = Array.isArray(parsed) ? parsed.slice(0, 3) : [response];
        } catch {
          // Fallback si no es un JSON válido
          finalSuggestions = [response];
        }
      }

      setSuggestions(finalSuggestions);

      // 4. EJECUCIÓN AUTOMÁTICA: Reproducción de la opción primaria (Wingman activo)
      if (finalSuggestions.length > 0) {
        await playSuggestion(finalSuggestions[0], true); 
      }

    } catch (error) {
      logger.error("ROMPEHIELO_ERROR", `Fallo en flujo de reacción: ${error}`);
    } finally {
      setIsAnalyzing(false);
      processingRef.current = false;
    }
  }, [settings.targetLanguage]);

  /**
   * 🔊 PLAY_SUGGESTION: Reproducción con Voz Aoede (Ducking activado).
   * @param phrase La frase a pronunciar.
   * @param auto true: Ejecuta el protocolo de repetición x2 para fijación.
   */
  const playSuggestion = useCallback(async (phrase: string, auto: boolean = false) => {
    if (!phrase) return;
    
    setActivePhrase(phrase);
    const targetLang = settings.targetLanguage || 'en-US';
    
    try {
      if (auto) {
        // Protocolo Rompehielo: 2 repeticiones automáticas para absorber pronunciación
        await speechService.playRompehielo(phrase, targetLang);
      } else {
        // Reproducción única (cuando el usuario toca manualmente una burbuja)
        // Velocidad 1.1x para mantener el ritmo de conversación real
        await speechService.playTTS(phrase, targetLang, 1.1);
      }
    } catch (err) {
      logger.error("AUDIO_ERROR", `Fallo en síntesis Aoede: ${err}`);
    }
  }, [settings.targetLanguage]);

  /**
   * ♻️ LIMPIEZA DE INTERFAZ OLED
   */
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setActivePhrase("");
    processingRef.current = false;
  }, []);

  return {
    suggestions,      // Las 3 opciones para el renderizado de burbujas
    isAnalyzing,      // Estado para animaciones de carga neón
    activePhrase,     // Frase resaltada actualmente
    analyzeContext,   // Trigger principal del modo Rompehielo
    playSuggestion,   // Función para botones de UI
    clearSuggestions
  };
};

export default useRompehielo;