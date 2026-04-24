/**
 * ⚡ MENCIONAL | NEURAL_DATA_SANITIZER v3.0
 * Función: Limpieza de transcripciones ASR para procesamiento Gemini/Aoede.
 * Ubicación: /src/utils/sanitizer.ts
 */

export const sanitizer = {
  /**
   * Limpia el texto de muletillas comunes y ruido de transcripción.
   * Optimiza el consumo de tokens en Gemini y evita ruidos en la síntesis Aoede.
   */
  cleanTranscription: (text: string): string => {
    if (!text) return "";

    let cleaned = text.trim();

    // 1. Eliminar muletillas de pensamiento (Speech Fillers) en ES/EN/FR/PT/DE
    // Se agregan fronteras de palabra (\b) para no mutilar palabras reales (ej: "bueno" -> "buen")
    const fillers = [
      /\b(eh|em|uh|ah|mmm|este|osea|o sea|bueno|pues|digamos|tipo|verdad|nada)\b/gi, // ES
      /\b(like|you know|i mean|totally|basically|actually|um|uh|right|okay)\b/gi,   // EN
      /\b(alors|donc|euh|enfin|quoi|voilà)\b/gi,                                   // FR
      /\b(né|tipo|então|sabe|hã|aliás)\b/gi,                                        // PT
      /\b(halt|quasi|sozusagen|ne|weißt du)\b/gi                                    // DE
    ];
    fillers.forEach(regex => {
      cleaned = cleaned.replace(regex, "");
    });

    // 2. Eliminar tartamudeos y repeticiones mecánicas del ASR
    // Detecta palabras repetidas idénticas consecutivas.
    // Triple pasada para colapsar secuencias largas (ej: "hola hola hola" -> "hola")
    cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, "$1");
    cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, "$1");
    cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, "$1");

    // 3. Sanitización de caracteres técnicos y ruidos de motor ASR
    // Elimina corchetes de metadatos tipo [silence], [noise], (laughs)
    cleaned = cleaned.replace(/\[.*?\]|\(.*?\)/g, "");
    
    // Evita inyección en el DOM y errores de renderizado React
    cleaned = cleaned.replace(/[<>{}|[\]\\^`~*]/g, "");

    // 4. Normalización estructural
    // Colapsa múltiples espacios en uno solo
    cleaned = cleaned.replace(/\s+/g, " ");
    
    // Corrige puntuación huérfana (espacio antes de punto/coma)
    cleaned = cleaned.replace(/\s+([.,!?;:])/g, "$1");

    // 5. Formateo de oración (Gramática básica para HUD)
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      // Asegura punto final si no tiene signo de puntuación de cierre
      if (!/[.!?]$/.test(cleaned)) {
        cleaned += ".";
      }
    }

    return cleaned.trim();
  },

  /**
   * Prepara el texto para el HUD OLED.
   * El texto en mayúsculas mejora la legibilidad en condiciones de baja luz.
   */
  formatForDisplay: (text: string): string => {
    if (!text) return "";
    return text.toUpperCase().trim();
  },

  /**
   * Sanitización estricta para exportación a PDF (jsPDF).
   * Mantiene legibilidad eliminando caracteres fuera del rango estándar de fuentes.
   */
  formatForExport: (text: string): string => {
    if (!text) return "";
    // Mantiene caracteres latinos (tildes/eñes) pero elimina emojis y símbolos de control.
    return text.replace(/[^\x20-\x7E\u00C0-\u017F\u00A1\u00BF]/g, "").trim();
  },

  /**
   * Genera el SLUG_TECNICO para el trendsService.
   * Transforma "Inteligencia Artificial" en "INTELIGENCIA_ARTIFICIAL".
   */
  convertToTrendSlug: (text: string): string => {
    if (!text) return "SESSION_LOG";
    
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Elimina tildes y acentos (Base ASCII)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "_")      // Todo lo no alfanumérico se vuelve guion bajo
      .replace(/_+/g, "_")             // Colapsa guiones bajos múltiples
      .replace(/^_+|_+$/g, "")         // Limpia guiones al inicio y al final
      .trim();
  },

  /**
   * Formateo de tiempo para los bloques de 20 minutos.
   * Convierte segundos en formato MM:SS.
   */
  formatTime: (seconds: number): string => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.floor(Math.max(0, seconds) % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * Limpia IDs de sesión o de usuario para evitar caracteres inválidos en Firebase.
   */
  sanitizeFirebaseKey: (key: string): string => {
    return key.replace(/[.$#[\]/]/g, "_");
  }
};

export default sanitizer;