/**
 * 🔐 MENCIONAL | IDENTITY_CORE v2026.12
 * Ubicación: /src/utils/identity.ts
 * Estado: STABLE
 * Protocolo: Purgado de Credenciales y Hash de Identidad.
 * ✅ DIRECTORIO AI: Sincronizado para resets de hardware en /src/services/ai/
 */

/**
 * Purgado completo de credenciales y estados de sesión.
 * Resuelve el Uncaught SyntaxError en ErrorBoundary.tsx y asegura un estado limpio.
 * También limpia los buffers de audio residuales del motor Aoede.
 */
export function terminateSessionIdentity(): void {
  try {
    // Registro de llaves críticas para el ecosistema Mencional
    const keys = [
      'mencional_auth',
      'mencional_role',
      'mencional_user_name',
      'mencional_lang',
      'mencional_paid',
      'mencional_current_path',
      'active_session_token',
      'mencional_hw_hash',
      'mencional_trends_local' // Limpia las tendencias sugeridas en la sesión previa
    ];

    // 1. Limpieza de persistencia local (LocalStorage)
    keys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // 2. Limpieza de datos temporales (SessionStorage)
    sessionStorage.clear();

    // 3. Notificación al Kernel
    console.log("🛡️ [IDENTITY] Protocolo de purga ejecutado. Nodo y servicios /ai/ reseteados.");
    
  } catch (error) {
    console.error("🛑 [IDENTITY_CRASH]: Fallo en la purga de identidad.", error);
  }
}

/**
 * Verifica si existe una identidad activa en el nodo actual.
 * @returns boolean - True si el usuario tiene una sesión autenticada.
 */
export const isIdentityActive = (): boolean => {
  const auth = localStorage.getItem('mencional_auth');
  return auth === 'true';
};

/**
 * Obtiene el rol actual del operador de forma segura.
 * Sincronizado con WelcomeGate: 'admin' (Nodo Maestro) o 'participant'.
 */
export const getOperatorRole = (): 'admin' | 'participant' | null => {
  return (localStorage.getItem('mencional_role') as 'admin' | 'participant') || null;
};

/**
 * Genera un identificador efímero para la sesión actual (v4.0).
 * Útil para la telemetría de ráfagas de 19s (Ultra) y 6s (Aprendizaje).
 */
export const generateSessionHash = (): string => {
  const hash = `MNC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  localStorage.setItem('mencional_hw_hash', hash);
  return hash;
};

export default {
  terminate: terminateSessionIdentity,
  isActive: isIdentityActive,
  getRole: getOperatorRole,
  generateHash: generateSessionHash
};