/**
 * 🛰️ HOOK: useSessionFlow v2026.PROD
 * Director de Arte Dinámico: Gestiona la identidad cromática y turnos.
 * Vincula: Reloj + Texto Gigante + Aura de Participante + Protocolos AI.
 * Ubicación: /src/hooks/useSessionFlow.tsx
 * ✅ ESTÁNDAR: Sincronizado con /src/services/ai/
 */
import { useState, useEffect, useCallback, useMemo } from 'react';

// Tipos alineados a la nomenclatura oficial de la App Mencional
export type SessionMode = 
  | 'individual' 
  | 'duo' 
  | 'trio' 
  | 'ultra_mencional' // Modo Intérprete (Ciclo 19s)
  | 'rompehielo'      // Función de sugerencias (Ciclo 4s)
  | 'mencional';      // Función Principal / Aprendizaje (Ciclo 6s)

export const useSessionFlow = (mode: SessionMode) => {
  const [participantId, setParticipantId] = useState<number>(1);
  const [activeColor, setActiveColor] = useState('#00f2ff'); 

  /**
   * 🎨 PALETA AURA NEÓN OLED v2026.PROD
   * Optimizada para el "Negro Absoluto" (#000000) y eficiencia energética.
   */
  const colors = useMemo(() => ({
    p1: '#FF007F',      // Rosa Eléctrico (Participante 1 / Alerta Crítica)
    p2: '#39FF14',      // Verde Neón (Participante 2)
    p3: '#00F2FF',      // Cian Neón (Participante 3 / Foco / Rompehielo)
    admin: '#E4E4E7',   // Zinc 200 (Elegancia técnica para Ultra-Mencional)
    off: '#27272A'      // Zinc 800 (Inactivo)
  }), []);

  /**
   * 🔄 NEXT_TURN: Protocolo de rotación de autoridad visual.
   */
  const nextTurn = useCallback(() => {
    // Inmunidad de turno en modos fijos o de alta concentración
    if (['individual', 'ultra_mencional', 'rompehielo'].includes(mode)) return;

    setParticipantId(prev => {
      if (mode === 'duo' || mode === 'mencional') return prev === 1 ? 2 : 1;
      if (mode === 'trio') return (prev % 3) + 1;
      return 1;
    });
  }, [mode]);

  /**
   * ⚡ SINCRONIZACIÓN CROMÁTICA AUTOMÁTICA
   * Ajusta el Aura del Nodo según el modo y el participante activo.
   */
  useEffect(() => {
    switch (mode) {
      case 'ultra_mencional':
        setActiveColor(colors.admin); // Estética minimalista para interpretación
        break;
      
      case 'rompehielo':
        setActiveColor(colors.p3);    // Cian de alta visibilidad para interacciones flash
        setParticipantId(3); 
        break;

      case 'individual':
        setActiveColor(colors.p1);    // Enfoque en práctica solitaria
        setParticipantId(1);
        break;

      case 'mencional':
      case 'duo':
      case 'trio':
        const colorKey = `p${participantId}` as keyof typeof colors;
        setActiveColor(colors[colorKey] || colors.p3);
        break;

      default:
        setActiveColor(colors.p3);
        break;
    }
  }, [participantId, mode, colors]);

  /**
   * 🎙️ HANDLE_INTERRUPTION (Sincronización por voz en tiempo real)
   * Cambia el foco visual al participante que toma la palabra.
   */
  const handleInterruption = useCallback((id: number) => {
    if (['individual', 'ultra_mencional', 'rompehielo'].includes(mode)) return;
    
    const maxParticipants = mode === 'trio' ? 3 : (mode === 'duo' || mode === 'mencional') ? 2 : 1;
    if (id >= 1 && id <= maxParticipants) {
      setParticipantId(id);
    }
  }, [mode]);

  /**
   * 🕒 FORMATO DE CLASES DINÁMICAS (Tailwind OLED Effects)
   */
  const colorClass = useMemo(() => {
    if (mode === 'ultra_mencional') return 'accent-admin';
    if (mode === 'rompehielo') return 'accent-3';
    if (mode === 'individual') return 'accent-1';
    return `accent-${participantId}`;
  }, [mode, participantId]);

  /**
   * ⏱️ GET_ROTATION_INTERVAL (Ventanas Críticas de IA)
   * Sincroniza la UI con los tiempos de respuesta del servicio /ai/
   */
  const intervalTime = useMemo(() => {
    if (mode === 'ultra_mencional') return 19000; // Acumulación larga (Ultra-Interpreter)
    if (mode === 'mencional') return 6000;        // Ventana de fijación (Learning Mode)
    if (mode === 'rompehielo') return 4000;       // Reacción flash (Icebreaker Mode)
    return 6000;
  }, [mode]);

  return { 
    activeColor,
    participantId, 
    nextTurn, 
    handleInterruption,
    colorClass,
    palette: colors,
    intervalTime
  };
};

export default useSessionFlow;