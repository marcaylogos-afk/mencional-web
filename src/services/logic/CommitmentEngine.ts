/**
 * 🧠 MENCIONAL | COMMITMENT_ENGINE v2026.PROD
 * Orquestación de reglas de negocio, sincronización de bloques y lógica de IA.
 * Protocolo: Admin ("osos") -> Suite Ultra | Participante -> Bloque 20min.
 * Ubicación: /src/services/logic/CommitmentEngine.ts
 */

import { sessionManager } from "../ai/sessionManager";

export const CommitmentEngine = {
  /**
   * ⏱️ REGLA DE TIEMPO (Protocolo $20 MXN)
   * Bloques estandarizados de 20 min para participantes.
   * Retorna 0 para Admin (Infinito).
   */
  getSynchronizedBlockMs: (isAdmin: boolean): number => {
    return isAdmin ? 0 : 20 * 60 * 1000;
  },

  /**
   * 🛡️ VALIDADOR DE ROLES Y FUNCIONES
   * El Admin desbloquea la suite completa de producción.
   */
  getAvailableFunctions: (isAdmin: boolean) => {
    const base = [
      { 
        id: 'learning', 
        name: 'APRENDIZAJE', 
        path: '/mode/learning', 
        description: 'Refuerzo neuronal y repetición.' 
      }
    ];

    if (isAdmin) {
      return [
        ...base,
        { 
          id: 'interpreter', 
          name: 'INTÉRPRETE ULTRA', 
          path: '/mode/interpreter', 
          description: 'Sincronización en tiempo real (Sync 19s).' 
        },
        { 
          id: 'rompehielo', 
          name: 'ROMPEHIELO', 
          path: '/mode/rompehielo', 
          description: 'Nube de frases y tendencias IT.' 
        }
      ];
    }
    return base;
  },

  /**
   * 🌐 MOTOR DE IDIOMAS (Prioridad Neural 2026)
   */
  getSupportedLanguages: () => [
    { id: 'en-US', name: '🇺🇸 Inglés', priority: true },
    { id: 'fr-FR', name: '🇫🇷 Francés', priority: false },
    { id: 'de-DE', name: '🇩🇪 Alemán', priority: false },
    { id: 'it-IT', name: '🇮🇹 Italiano', priority: false },
    { id: 'pt-BR', name: '🇧🇷 Portugués', priority: false },
    { id: 'es-MX', name: '🇲🇽 Español', priority: false },
    { id: 'auto', name: '🔍 Detectar (Neural)', priority: false }
  ],

  /**
   * 👥 CONFIGURACIÓN DE FORMACIÓN
   */
  getGroupFormations: () => [
    { id: 'INDIVIDUAL', label: '1 NODO', description: 'Enfoque total' },
    { id: 'DUO', label: '2 NODOS', description: 'Interacción dual' },
    { id: 'TRIO', label: '3 NODOS', description: 'Dinámica grupal' }
  ],

  /**
   * 🎤 CONFIGURADOR DE SERVICIO IA
   * Inyecta la configuración directamente en el sessionManager.
   */
  configureAIService: (targetLanguage: string, formation: string = 'INDIVIDUAL') => {
    const langCode = targetLanguage || 'en-US';
    
    console.log(`[COMMITMENT_ENGINE] Configurando IA: ${langCode} | Modo: ${formation}`);

    if (sessionManager && typeof sessionManager.updateConfiguration === 'function') {
      sessionManager.updateConfiguration({
        language: langCode,
        mode: formation,
        isAuto: langCode === 'auto',
        // Optimización 2026: Alta velocidad para Intérprete
        playbackSpeed: 2.0 
      });
    }
    
    return { 
      langCode, 
      isAutoDetect: langCode === 'auto',
      isGroupMode: formation !== 'INDIVIDUAL'
    };
  },

  /**
   * 🔑 VALIDACIÓN DE ACCESO MAESTRO
   * Protocolo "osos" para bypass de pago y persistencia.
   */
  validateAccess: (pass?: string): boolean => {
    const cleanPass = pass?.toLowerCase().trim();
    
    if (cleanPass === 'osos') {
      localStorage.setItem('mencional_role', 'admin');
      localStorage.setItem('mencional_paid', 'true');
      localStorage.setItem('mencional_is_unlimited', 'true');
      return true;
    }
    return false;
  },

  /**
   * 🛑 PROTOCOLO DE CIERRE DE SESIÓN
   * Limpia estados y confisca bloques si es participante.
   */
  terminateSession: (isAdmin: boolean) => {
    if (!isAdmin) {
      localStorage.setItem('mencional_paid', 'false'); // Sesión consumida
      localStorage.removeItem('mencional_session_start');
    }
    
    if (sessionManager?.terminateSession) {
      sessionManager.terminateSession();
    }
    
    console.log(`[COMMITMENT_ENGINE] Sesión finalizada. Rol: ${isAdmin ? 'ADMIN' : 'PARTICIPANTE'}`);
  }
};

export default CommitmentEngine;