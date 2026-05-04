/**
 * ⚙️ MENCIONAL | SETTINGS_CONTEXT v2026.PROD
 * ✅ DIRECTORIO AI: /src/services/ai/ (Sincronizado: Es ai, no ia)
 * 🛡️ PROTOCOLO: Persistencia de Sesión, Roles y Estética OLED
 * ✅ TIEMPO ESTÁNDAR: 1 Hora (3600s)
 * Ubicación: /src/context/SettingsContext.tsx
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

// --- 🔵 INTERFACES DE CONFIGURACIÓN ---

interface Settings {
  role: 'admin' | 'participant' | null;
  userAlias: string;
  targetLanguage: string;
  nativeLanguage: string;
  themeColor: string;
  sessionTimeLeft: number; 
  audioOutput: 'headphones' | 'stereo';
  sessionActive: boolean;
  autoMic: boolean;
  activeMode: 'learning' | 'ultra' | 'rompehielo' | 'test' | null;
  testDuration: number; 
  activeTopic: string;  
  isAuthenticated: boolean; 
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  palette10: string[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // Estado Inicial con Persistencia y Sincronía /ai/
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('mencional_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Forzar actualización a 1 hora si el valor es del protocolo antiguo
      if (parsed.sessionTimeLeft === 1200) parsed.sessionTimeLeft = 3600;
      return parsed;
    }
    
    return {
      role: null,
      userAlias: '',
      targetLanguage: 'en-US',
      nativeLanguage: 'es-MX',
      themeColor: '#39FF14', // Verde Neón
      sessionTimeLeft: 3600, // ✅ Protocolo 2026: 1 hora
      audioOutput: 'stereo',
      sessionActive: false,
      autoMic: true,
      activeMode: null,
      testDuration: 6,
      activeTopic: 'General',
      isAuthenticated: false
    };
  });

  // Persistencia Automática
  useEffect(() => {
    localStorage.setItem('mencional_settings', JSON.stringify(settings));
  }, [settings]);

  /**
   * 🔄 ACTUALIZAR_CONFIGURACIÓN
   * Mantiene la sincronía con los motores de /src/services/ai/
   */
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      logger.info("SETTINGS_UPDATE", `Nodo AI sincronizado (/src/services/ai/)`);
      return updated;
    });
  }, []);

  /**
   * 🧹 REINICIAR_SISTEMA (Log Out / Purge)
   * Restaura el nodo de servicios a valores de fábrica y limpia el caché de /ai/
   */
  const resetSettings = useCallback(() => {
    localStorage.removeItem('mencional_settings');
    setSettings({
      role: null,
      userAlias: '',
      targetLanguage: 'en-US',
      nativeLanguage: 'es-MX',
      themeColor: '#39FF14',
      sessionTimeLeft: 3600, // ✅ Reset a 1 hora
      audioOutput: 'stereo',
      sessionActive: false,
      autoMic: true,
      activeMode: null,
      testDuration: 6,
      activeTopic: 'General',
      isAuthenticated: false
    });
    logger.info("SETTINGS_RESET", "Nodo /src/services/ai/ restaurado. Buffer limpio.");
  }, []);

  // Paleta de 10 Colores OLED para la interfaz neon
  const palette10 = [
    '#39FF14', '#00FBFF', '#FF00FB', '#FFFF00', '#FF3131', 
    '#FFFFFF', '#8A2BE2', '#FFD700', '#00FFAB', '#FF5E00'
  ];

  // ✅ El return debe estar DENTRO de la función SettingsProvider
  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      resetSettings,
      palette10 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe usarse dentro de un SettingsProvider');
  }
  return context;
};