/**
 * 🧠 MENCIONAL | INSTRUCTION_ENGINE v2026.PROD
 * Orquestador de prompts y protocolos de respuesta neural.
 * ✅ UBICACIÓN: /src/services/ai/instructionEngine.ts
 * ✅ UPDATE: Implementación de Protocolo Espejo (Bidireccional EN/ES).
 */

export interface NeuralInstruction {
  functionName: string;
  systemPrompt: string;
  samplingRate: number;      // Ventana crítica de escucha (ms)
  audioRepeatCount: number; // Repeticiones (Protocolo de Fijación)
  playbackSpeed: number;    // Velocidad optimizada para voz Aoede
  autoPlay: boolean;        
}

/**
 * 🛰️ getNeuralInstructions
 * Define el ADN de respuesta según el modo activo.
 */
export const getNeuralInstructions = (
  mode: 'learning' | 'interpreter' | 'rompehielo'
): NeuralInstruction => {
  
  // Identidad central: IA Invisible, voz Aoede, respuesta inmediata.
  const baseIdentity = "Eres el núcleo de MENCIONAL. Tu voz es AOEDE. Respuesta inmediata. PROHIBIDO: 'Entendido', 'Aquí tienes', o cualquier comentario previo. Solo el output final.";

  switch (mode) {
    /**
     * 🟢 MENCIONAL (Modo Aprendizaje)
     * ✅ PROTOCOLO ESPEJO: Traduce EN->ES o ES->EN automáticamente.
     */
    case 'learning':
      return {
        functionName: 'Mencional_Learning',
        samplingRate: 6000, // Ventana de habla de 6s
        audioRepeatCount: 2, // DOBLE REPETICIÓN: Clave para la inmersión.
        playbackSpeed: 1.0,  
        autoPlay: true,
        systemPrompt: `${baseIdentity} 
          - TAREA: Detecta el idioma del INPUT_NEURAL. 
          - REGLA ESPEJO: Si el input es Español, traduce al Inglés. Si es Inglés, traduce al Español.
          - FORMATO: "[Solo la traducción]". 
          - ESTILO: Slang actual y lenguaje de tendencias. Frases cortas (5-7 palabras).
          - REGLA: El motor ejecutará el audio 2 veces.`
      };

    /**
     * 🔵 ULTRA-MENCIONAL (Modo Intérprete)
     * ✅ PROTOCOLO FLUIDEZ: Alta velocidad de procesamiento para 19s.
     */
    case 'interpreter':
      return {
        functionName: 'Ultra_Mencional',
        samplingRate: 19000, // Ciclo de traducción de 19s
        audioRepeatCount: 1, 
        playbackSpeed: 1.2, // Aceleración para tiempo real.
        autoPlay: true,
        systemPrompt: `${baseIdentity} 
          - ROL: Intérprete simultáneo de élite.
          - TAREA: Traducción técnica, limpia y directa. Detecta idioma automáticamente.
          - FORMATO: Texto plano. Sin omisiones. Sin explicaciones.`
      };

    /**
     * 🟠 ROMPEHIELO (Modo Social)
     * ✅ PROTOCOLO REACCIÓN: Ventana de respuesta de 4s.
     */
    case 'rompehielo':
      return {
        functionName: 'Rompehielo_Social',
        samplingRate: 4000, // Ventana social de 4s
        audioRepeatCount: 1, 
        playbackSpeed: 1.1,  
        autoPlay: true, 
        systemPrompt: `${baseIdentity} 
          - ROL: Social Wingman. Rompe el silencio incómodo.
          - TAREA: Genera 3 sugerencias de respuesta ingeniosas en el idioma opuesto al detectado.
          - FORMATO OBLIGATORIO: ["Opción 1", "Opción 2", "Opción 3"].`
      };

    default:
      return {
        functionName: 'Mencional_Sync',
        samplingRate: 6000,
        audioRepeatCount: 1,
        playbackSpeed: 1.0,
        autoPlay: false,
        systemPrompt: baseIdentity
      };
  }
};

/**
 * 🛠️ formatNeuralRequest
 * Payload optimizado para baja latencia (Gemini 1.5 Flash).
 */
export const formatNeuralRequest = (text: string, instructions: NeuralInstruction) => {
  const isSocial = instructions.functionName.includes('Rompehielo');

  return {
    contents: [{ 
      role: 'user', 
      parts: [{ text: `${instructions.systemPrompt}\n\nINPUT_NEURAL: "${text}"` }] 
    }],
    generationConfig: {
      temperature: isSocial ? 0.85 : 0.1, // Creatividad social vs rigor técnico.
      topP: 0.95,
      maxOutputTokens: isSocial ? 150 : 80,
      responseMimeType: isSocial ? "application/json" : "text/plain"
    }
  };
};

export const instructionEngine = {
  getInstructions: getNeuralInstructions,
  formatRequest: formatNeuralRequest
};

export default instructionEngine;