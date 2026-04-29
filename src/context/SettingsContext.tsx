/** 🛠️ CONFIGURACIÓN DE NODO: MENCIONAL 2026.PROD
 * ✅ PERSISTENCIA: Alias 'osos' (Admin) con guardado neural permanente.
 * ✅ INMERSIÓN SELECTIVA: Filtrado automático por knownVocabulary.
 * ✅ NUTRICIÓN: Modo Anfitrión para alimentar el Cerebro Colectivo.
 * ✅ TAREA SEMANAL: Validación Estricta para retos de pronunciación.
 * ✅ GUEST_ACCESS: Sesiones de 30 min ($90 MXN) bloqueadas.
 */

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { logger } from '../utils/logger';

// --- 🏷️ TIPOS OFICIALES MENCIONAL 2026 ---
export type AudioOutputMode = 'headphones' | 'live'; 
export type GroupFormation = 'individual' | 'duo' | 'trio'; 
export type MencionalFunction = 'learning' | 'ultra' | 'rompehielo' | 'test'; 

export type MasterTopic = 'BIENVENIDA_TOP' | 'CAFETERIA_SERVICE' | 'EMERGENCY_PROTOCOL' | 'SOCIAL_ICEBREAKER';

interface SettingsState {
  userAlias: string;
  sessionName: string;
  role: 'admin' | 'participant' | 'guest';
  currentTopic: MasterTopic | string;      
  nativeLanguage: string;
  targetLanguage: string;
  activeMode: MencionalFunction; 
  audioOutput: AudioOutputMode;
  groupMode: GroupFormation;
  themeColor: string;           
  isUnlimited: boolean;         
  sessionActive: boolean;
  isPaid: boolean;              
  sessionTimeLeft: number;      
  micAuthorized: boolean;
  paymentLink: string;          
  isBidirectional: boolean;     
  
  // 🧠 MEMORIA NEURAL
  knownVocabulary: string[];    // Palabras aprendidas (Si están aquí, Ultra NO las traduce)
  
  // ✨ MAGIA DE NUTRICIÓN Y TAREA
  isFeedingMode: boolean;       // Admin alimenta frases nuevas
  strictValidationMode: boolean; // Reto semanal: solo traduce si existe en base
  ghostPhraseVisible: boolean;  // Guía visual en español bajo el micro
  detectedLanguageMode: 'auto' | 'target' | 'native';
  
  wantsPDF: boolean;            
  showBubbles: boolean;         
  lastEvaluationDate?: string;
}

interface SettingsContextType {
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>; 
  updateSettings: (newSettings: Partial<SettingsState>) => void; 
  resetSettings: () => void;
  palette10: string[];          
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const OLED_PALETTE = [
  '#00FBFF', // 0. Cyan (Learning)
  '#39FF14', // 1. Verde Neón (Master / Admin)
  '#FF00F5', // 2. Fucsia
  '#FFFF00', // 3. Amarillo (Test)
  '#FF3131', // 4. Rojo (Alertas)
  '#A855F7', // 5. Púrpura (Ultra)
  '#FF9900', // 6. Naranja (Rompehielo)
  '#00FFAB', // 7. Aquamarina
  '#FFFFFF', // 8. Blanco
  '#71717A'  // 9. Zinc
];

const INITIAL_STATE: SettingsState = {
  userAlias: '',
  sessionName: 'Sesión_Mencional',
  role: 'guest',
  currentTopic: 'BIENVENIDA_TOP', 
  nativeLanguage: 'es-MX',
  targetLanguage: 'en-US',
  activeMode: 'learning',
  audioOutput: 'headphones',
  groupMode: 'individual',
  themeColor: '#00FBFF', 
  isUnlimited: false,
  sessionActive: false,
  isPaid: false,
  sessionTimeLeft: 1800, 
  micAuthorized: false,
  paymentLink: 'https://mpago.la/1isA1oL',
  isBidirectional: false, 
  knownVocabulary: [],
  isGuestMode: false,
  isFeedingMode: false,
  strictValidationMode: false,
  ghostPhraseVisible: true,
  detectedLanguageMode: 'auto',
  wantsPDF: false,
  showBubbles: true
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('mencional_settings');
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        const volatileTokens = ['mencional30', 'trial_presencial', 'pago_cash'];
        if (volatileTokens.includes(parsed.userAlias?.toLowerCase())) return INITIAL_STATE;
        return { ...INITIAL_STATE, ...parsed };
      }
      return INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  /** 🛡️ PERSISTENCIA SELECTIVA (Filtrado de Usuarios) */
  useEffect(() => {
    const volatileTokens = ['mencional30', 'trial_presencial', 'pago_cash'];
    const isVolatile = volatileTokens.includes(settings.userAlias.toLowerCase());

    if (!isVolatile && settings.userAlias !== '') {
      localStorage.setItem('mencional_settings', JSON.stringify(settings));
    }
    
    // OLED Mastery: Fondo Negro Puro
    document.body.style.backgroundColor = '#000000'; 
    document.documentElement.style.backgroundColor = '#000000';
  }, [settings]);

  /** ⚡ ACTUALIZADOR DE NODO (Lógica de Negocio 2026) */
  const updateSettings = useCallback((newSettings: Partial<SettingsState>) => {
    setSettings(prev => {
      let updated = { ...prev, ...newSettings };
      const alias = updated.userAlias?.toLowerCase();
      const GUEST_TOKENS = ['mencional30', 'trial_presencial', 'pago_cash'];
      
      // CONFIGURACIÓN DE PODER: 'osos' (Admin Maestro)
      if (alias === 'osos') {
        updated.isUnlimited = true;
        updated.isPaid = true;
        updated.role = 'admin';
        updated.isFeedingMode = true; 
        updated.themeColor = updated.themeColor || OLED_PALETTE[1]; 
        updated.sessionTimeLeft = 999999;
      } 
      else if (GUEST_TOKENS.includes(alias)) {
        updated.isPaid = true;
        updated.isUnlimited = false;
        updated.role = 'participant';
        updated.sessionTimeLeft = 1800;
        updated.isFeedingMode = false;
      }

      // 🎨 GESTIÓN DE ATMÓSFERA VISUAL
      if (updated.role !== 'admin') {
        if (updated.currentTopic === 'EMERGENCY_PROTOCOL') updated.themeColor = OLED_PALETTE[4];
        else if (updated.currentTopic === 'CAFETERIA_SERVICE') updated.themeColor = OLED_PALETTE[7];
        else {
          const modeMap: Record<string, string> = {
            learning: OLED_PALETTE[0],
            test: OLED_PALETTE[3],
            ultra: OLED_PALETTE[5],
            rompehielo: OLED_PALETTE[6]
          };
          updated.themeColor = modeMap[updated.activeMode] || updated.themeColor;
        }
      }

      return updated;
    });
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      const aiMod = await import('../services/ai/speechService');
      const speechService = aiMod.speechService || (aiMod as any).default;
      if (speechService?.stopAll) speechService.stopAll();
    } catch (err) {
      logger.error("CLEANUP", "Error en servicios AI", err);
    }
    localStorage.removeItem('mencional_settings');
    setSettings(INITIAL_STATE);
  }, []);

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      setSettings, 
      updateSettings, 
      resetSettings, 
      palette10: OLED_PALETTE 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings debe usarse dentro de un SettingsProvider');
  return context;
};

export default SettingsProvider;