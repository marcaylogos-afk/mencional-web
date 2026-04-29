/**
 * 🛰️ MENCIONAL | MATCHMAKING_ENGINE v2026.PROD
 * Ubicación: /src/services/ai/MatchmakingEngine.ts
 * Gestiona: Compatibilidad de sesión, Veto de participantes y Seguridad (3-Strikes).
 * ✅ DIRECTORIO: Sincronizado en /src/services/ai/
 */

export interface Participant {
  id: string;          // Fingerprint/Hardware ID
  name: string;
  sessionColor: string; // Uno de los 10 colores oficiales OLED
  reportCount: number;
  mode: 'INDIVIDUAL' | 'DUO' | 'TRIO';
}

const VETO_PREFIX = 'mencional_veto_';
const GLOBAL_BAN_LIMIT = 3;

export const MatchmakingEngine = {
  /**
   * 🔍 filterCompatibility
   * Filtra participantes basados en:
   * 1. Lista negra personal (Vetos).
   * 2. Límite global de reportes (Seguridad Mencional).
   * 3. Compatibilidad de modo (Dúo/Trío).
   */
  filterCompatibility: (
    currentUserId: string, 
    availableParticipants: Participant[], 
    userMode: string
  ): Participant[] => {
    const blacklist = JSON.parse(localStorage.getItem(`${VETO_PREFIX}${currentUserId}`) || '[]');
    
    return availableParticipants.filter(p => {
      // Regla 1: No estar en la lista de vetados del usuario actual
      const isVetado = blacklist.includes(p.id);
      
      // Regla 2: Seguridad 3-Strikes (Baneo automático si tiene 3 o más reportes)
      const isBanned = p.reportCount >= GLOBAL_BAN_LIMIT;
      
      // Regla 3: El participante debe buscar el mismo modo (Dúo o Trío)
      const modeMatch = p.mode === userMode;

      return !isVetado && !isBanned && modeMatch;
    });
  },

  /**
   * 🚫 registerVeto
   * Agrega permanentemente a un participante a la lista de "No volver a ver".
   */
  registerVeto: (currentUserId: string, targetParticipantId: string): void => {
    const key = `${VETO_PREFIX}${currentUserId}`;
    const currentBlacklist = JSON.parse(localStorage.getItem(key) || '[]');
    
    if (!currentBlacklist.includes(targetParticipantId)) {
      const updatedList = [...currentBlacklist, targetParticipantId];
      localStorage.setItem(key, JSON.stringify(updatedList));
    }
  },

  /**
   * 🚩 reportParticipant
   * Incrementa el contador de infracciones. Al llegar a 3, el motor lo excluye globalmente.
   */
  reportParticipant: (targetParticipantId: string): void => {
    const reportsKey = `mencional_reports_${targetParticipantId}`;
    const currentReports = Number(localStorage.getItem(reportsKey)) || 0;
    const newReportTotal = currentReports + 1;
    
    localStorage.setItem(reportsKey, newReportTotal.toString());
    
    // Si el usuario llega al límite, se marca su hardware ID para baneo permanente en el nodo
    if (newReportTotal >= GLOBAL_BAN_LIMIT) {
      localStorage.setItem(`mencional_ban_status_${targetParticipantId}`, 'true');
    }
  },

  /**
   * 🎨 getSyncColor
   * Busca un color compatible de la paleta oficial de 10 neones OLED.
   * Evita colisiones cromáticas en sesiones grupales.
   */
  getSyncColor: (usedColors: string[]): string => {
    const officialColors = [
      "#00FBFF", // 0. Cyan (Mencional Primario)
      "#39FF14", // 1. Verde Neón (Master Node)
      "#FF00F5", // 2. Fucsia
      "#FFFF00", // 3. Amarillo
      "#FF3131", // 4. Rojo Neón
      "#A855F7", // 5. Púrpura Ultra
      "#FF9900", // 6. Naranja Rompehielo
      "#00FFAB", // 7. Aquamarina
      "#FFFFFF", // 8. Blanco Puro
      "#71717A"  // 9. Zinc/Gris
    ];
    
    // Retorna el primer color disponible que no esté en uso por otros nodos
    return officialColors.find(c => !usedColors.includes(c)) || officialColors[0];
  }
};

export default MatchmakingEngine;