/** 📚 MENCIONAL | VOCABULARY_CORE_ENGINE v2026
 * Ubicación: /src/services/ai/vocabularyService.ts
 * Función: Gestión de palabras conocidas, filtrado de cognados y limpieza de ráfagas.
 * ✅ DIRECTORIO: Sincronizado para soporte de "Burbujas Selectivas".
 */

import { logger } from '../../utils/logger';

// Lista base de cognados (palabras que suenan/escriben igual en EN y ES)
// Evitamos traducir estas para no saturar visualmente al administrador.
const COMMON_COGNATES = [
  'ADAPT', 'ADVENTURE', 'ALBUM', 'ANIMAL', 'AREA', 'ART', 'AUTO', 
  'BANANA', 'CABLE', 'CANAL', 'CANCER', 'CAPITAL', 'CENTRAL', 'CLUB',
  'COLONEL', 'COLOR', 'COMEDY', 'CONCLUSION', 'CONTROL', 'DECISION',
  'DICTOR', 'ERROR', 'EXPERIMENT', 'FACTOR', 'FESTIVAL', 'GAS',
  'GENERAL', 'GOLF', 'HOSPITAL', 'HOTEL', 'IDEA', 'INTERIOR', 'LOCAL',
  'MENU', 'METAL', 'MOTOR', 'MUSEUM', 'NATURAL', 'OPINION', 'PIANO',
  'PLAN', 'RADIO', 'RELIGION', 'SOCIAL', 'SOLAR', 'TICKET', 'TOTAL', 
  'TRAIN', 'UNION', 'VERSION', 'VIDEO'
];

/**
 * 🧠 getUltraSelectiveText
 * Toma una ráfaga de texto y devuelve solo las palabras que:
 * 1. NO son cognados.
 * 2. NO están en la lista de palabras conocidas del usuario.
 * 3. NO son artículos o preposiciones cortas.
 */
export const getUltraSelectiveText = (
  text: string, 
  knownWords: string[] = []
): string[] => {
  if (!text) return [];

  // 1. Limpieza y tokenización
  const words = text
    .toUpperCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/);

  // 2. Filtrado multicapa
  const filtered = words.filter(word => {
    if (word.length <= 3) return false; // Omitir "the", "a", "in", etc.
    if (COMMON_COGNATES.includes(word)) return false; // Omitir cognados
    if (knownWords.includes(word)) return false; // Omitir lo ya aprendido
    
    return true;
  });

  // 3. Eliminar duplicados en la misma ráfaga
  return Array.from(new Set(filtered));
};

/**
 * 💾 Persistence Manager
 * Gestiona el guardado de palabras marcadas como "conocidas" en el EvaluationTest.
 */
export const vocabularyService = {
  
  /** Obtiene la lista de palabras conocidas desde el storage local */
  getKnownWords: (): string[] => {
    try {
      const data = localStorage.getItem('mencional_known_vocabulary');
      return data ? JSON.parse(data) : [];
    } catch (err) {
      logger.error("VOCAB_LOAD_FAIL", "Error al cargar vocabulario.");
      return [];
    }
  },

  /** Agrega palabras nuevas a la lista de "ya lo sé" */
  saveKnownWords: (words: string[]): void => {
    try {
      const current = vocabularyService.getKnownWords();
      const updated = Array.from(new Set([...current, ...words.map(w => w.toUpperCase())]));
      localStorage.setItem('mencional_known_vocabulary', JSON.stringify(updated));
      logger.info("VOCAB_SAVED", `${words.length} palabras nuevas registradas.`);
    } catch (err) {
      logger.error("VOCAB_SAVE_FAIL", "Error al persistir vocabulario.");
    }
  },

  /** Analiza una ráfaga y sugiere términos para el glosario del PDF */
  extractGlosaryTerms: (original: string, translated: string): {en: string, es: string}[] => {
    // Lógica para emparejar palabras clave detectadas (para el motor PDF)
    const enWords = getUltraSelectiveText(original);
    if (enWords.length === 0) return [];

    // Por simplicidad en v2.6, devolvemos el par completo de la ráfaga
    // si contiene términos nuevos detectados.
    return [{ en: original, es: translated }];
  },

  /** Reset total (Útil para nuevos alumnos en el mismo hardware) */
  clearVocabulary: (): void => {
    localStorage.removeItem('mencional_known_vocabulary');
    logger.warn("VOCAB_PURGED", "Base de datos de vocabulario reseteada.");
  }
};

export default vocabularyService;