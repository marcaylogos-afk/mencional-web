/**
 * 🛰️ SESSION MANAGER MENCIONAL v2026.PROD
 * Ubicación: /src/services/ai/sessionManager.ts
 * Gestiona: Ciclo de vida, Sincronización de Sesiones (30min), Roles y Detección de Idioma.
 * ✅ UPDATE: Implementación de detección automática bidireccional.
 * ✅ UPDATE: Ajuste de tiempo de sesión a 30 minutos optimizados.
 */

export interface SessionData {
  id: string;            // Fingerprint de Hardware
  userName?: string;     
  sessionName: string;   // Frase Trend seleccionada
  topic: string;         // Contexto dinámico para la IA
  nativeLang: string;    
  targetLang: string;    
  autoDetect: boolean;   // 🔄 NUEVO: Estado para traducción bidireccional automática
  mode: 'INDIVIDUAL' | 'DUO' | 'TRIO';
  appMode: 'LEARNING' | 'ROMPEHIELO' | 'INTERPRETER'; 
  role: 'PARTICIPANT' | 'ADMIN';
  sessionColor: string;  
  startTime: number;
  endTime: number;       // Sincronización Forzada
  paymentStatus: 'PENDING' | 'APPROVED';
}

const SESSION_KEY = 'mencional_session_v2026';
const MASTER_PASSWORD = 'osos'; // Clave Nodo Maestro

export const sessionManager = {
  /**
   * 🔑 validateAdmin
   * Libera funciones y acceso ilimitado.
   */
  validateAdmin(password: string): boolean {
    return password === MASTER_PASSWORD;
  },

  /**
   * 🏁 startSession
   * Admin = Acceso Total + Tiempo Ilimitado.
   * Participante = $90 MXN + Sesión de 30 min optimizada.
   */
  startSession(params: Omit<SessionData, 'startTime' | 'endTime' | 'paymentStatus'>): SessionData {
    const now = Date.now();
    
    // PROTOCOLO: 30 min para participantes / 24h para Admin
    const durationMs = params.role === 'ADMIN' ? (24 * 60 * 60 * 1000) : (30 * 60 * 1000);

    const session: SessionData = {
      ...params,
      startTime: now,
      endTime: now + durationMs,
      paymentStatus: params.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('mencional_role', params.role);
    
    if (params.role === 'ADMIN') {
      localStorage.setItem('mencional_auth_token', `master_bypass_${MASTER_PASSWORD}`);
    }

    return session;
  },

  /**
   * 🔄 setLanguageMode
   * Cambia dinámicamente entre modo fijo y detección automática.
   */
  setLanguageMode(auto: boolean): void {
    const session = this.getSession();
    if (session) {
      session.autoDetect = auto;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  },

  /**
   * 🔍 getAvailableModes
   * Filtra funciones según el rol.
   */
  getAvailableModes(role: 'PARTICIPANT' | 'ADMIN'): string[] {
    if (role === 'ADMIN') {
      return ['LEARNING', 'ROMPEHIELO', 'INTERPRETER'];
    }
    return ['LEARNING', 'INTERPRETER', 'ROMPEHIELO']; // Ahora permitimos los 3 para participantes tras pago
  },

  /**
   * ⏳ checkTimeStatus
   * Monitorea el reloj OLED. Crítico a los 5 min.
   */
  getTimeStatus(): { remainingMs: number; isCritical: boolean; hasExpired: boolean } {
    const session = this.getSession();
    if (!session) return { remainingMs: 0, isCritical: false, hasExpired: true };

    const remaining = Math.max(0, session.endTime - Date.now());
    const fiveMinutesMs = 5 * 60 * 1000;

    return {
      remainingMs: remaining,
      isCritical: remaining <= fiveMinutesMs && session.role !== 'ADMIN',
      hasExpired: remaining === 0
    };
  },

  getSession(): SessionData | null {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    
    try {
      const parsed = JSON.parse(data) as SessionData;
      if (Date.now() > parsed.endTime) {
        this.clearSession();
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('mencional_role');
    localStorage.removeItem('mencional_auth_token');
  }
};

export default sessionManager;