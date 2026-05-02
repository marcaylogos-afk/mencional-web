/**
 * 🛰️ MENCIONAL | LANGUAGE_SELECTOR v2026.PROD
 * Ubicación: /src/components/LanguageSelector.tsx
 * Función: Selector de idiomas con Bypass de Error para Admin.
 * ✅ FIX: Botón "Detectar" siempre visible para alias "osos".
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Languages, Crosshair, Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { suggestionEngine } from '../services/ai/suggestionEngine';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelect: (lang: string) => void;
  isAutoDetecting?: boolean;
  onAutoDetect: () => void;
  hasError?: boolean; // Prop que viene del error 404 de la API
}

const LANGUAGES = [
  { id: 'en-US', label: 'Inglés (EE.UU)', code: 'EN' },
  { id: 'es-MX', label: 'Español (MX)', code: 'ES' },
  { id: 'fr-FR', label: 'Francés', code: 'FR' },
  { id: 'pt-BR', label: 'Portugués', code: 'PT' }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelect,
  isAutoDetecting,
  onAutoDetect,
  hasError
}) => {
  const { settings } = useSettings();

  // Protocolo Maestro: Si eres "osos", ignoramos el estado de error de la API.
  const isAdmin = settings?.userAlias?.toLowerCase() === 'osos';
  const showDetectButton = isAdmin || !hasError;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Languages size={14} className="text-[#00FBFF]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
            Idioma_Objetivo
          </span>
        </div>

        {/* BOTÓN DE DETECCIÓN AUTOMÁTICA (Bypass aplicado) */}
        {showDetectButton && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onAutoDetect}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
              isAutoDetecting 
                ? 'border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14]' 
                : 'border-zinc-800 text-zinc-600 hover:border-[#00FBFF] hover:text-[#00FBFF]'
            }`}
          >
            <Crosshair size={12} className={isAutoDetecting ? 'animate-spin' : ''} />
            <span className="text-[9px] font-[1000] uppercase tracking-widest">
              {isAutoDetecting ? 'Analizando...' : 'Auto_Detectar'}
            </span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className={`relative p-6 rounded-[2rem] border-2 transition-all duration-500 text-left overflow-hidden group ${
                isSelected 
                  ? 'border-[#00FBFF] bg-[#00FBFF]/5' 
                  : 'border-zinc-900 bg-black hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col gap-1 relative z-10">
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isSelected ? 'text-[#00FBFF]' : 'text-zinc-700'}`}>
                  {lang.code}
                </span>
                <span className={`text-xs font-[1000] uppercase italic tracking-tighter ${isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                  {lang.label}
                </span>
              </div>

              {isSelected && (
                <motion.div 
                  layoutId="activeLang"
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#00FBFF]"
                >
                  <Check size={20} strokeWidth={3} />
                </motion.div>
              )}

              {/* Efecto Glow OLED al estar seleccionado */}
              {isSelected && (
                <div className="absolute inset-0 bg-[#00FBFF]/5 blur-xl pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mini-Log de Sugerencia Dinámica (Sincronizado con AI) */}
      <div className="pt-4 border-t border-zinc-950">
        <p className="text-[7px] font-black text-zinc-800 uppercase tracking-[0.5em] text-center">
          {isAutoDetecting 
            ? suggestionEngine.getLanguageDetectionPrompt() 
            : 'Selección_Manual_Habilitada'}
        </p>
      </div>
    </div>
  );
};

export default LanguageSelector;