/** 📝 MENCIONAL | EVALUATION_TEST v2026.INFINITE
 * ✅ FIX: El test ya no se cierra solo al terminar el set.
 * ✅ RECARGA: Si se acaban las palabras, pide más automáticamente.
 * ✅ AUDITORÍA: Si isGuestMode está activo, no contamina el historial personal.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, BrainCircuit, XCircle, Loader2, LogOut, ShieldAlert } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import speechService from '../services/ai/speechService';
import { generateNeuralVocabulary } from '../services/ai/vocabularyService';
import { logger } from '../utils/logger';

const EvaluationTest: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  
  const [dynamicWords, setDynamicWords] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [sessionScore, setSessionScore] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  /** 🔄 CARGA DE NODOS (Infinite Loop Logic) */
  const fetchNewNodes = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      const targetLang = settings?.targetLanguage || 'en-US';
      const currentTopic = settings?.selectedTopic || 'General';
      
      // 🚀 BYPASS DE FILTRO: Si es modo invitado, enviamos lista vacía para ver todo.
      const exclusionList = settings.isGuestMode ? [] : (settings.knownVocabulary || []);
      
      const words = await generateNeuralVocabulary(
        targetLang, 
        exclusionList,
        currentTopic
      );
      
      if (words && words.length > 0) {
        setDynamicWords(words);
        setStep(0);
      } else {
        logger.warn("NEURAL_FLOW", "Set vacío, reintentando con tópico general...");
        fetchNewNodes(false);
      }
    } catch (error) {
      logger.error("NEURAL_FLOW", "Fallo en recarga de nodos", error);
    } finally {
      setIsLoading(false);
    }
  }, [settings.targetLanguage, settings.selectedTopic, settings.knownVocabulary, settings.isGuestMode]);

  useEffect(() => {
    fetchNewNodes(true);
    const welcomeMsg = settings.isGuestMode 
      ? "Iniciando sesión de auditoría. Experiencia completa activa."
      : "Iniciando sesión de aprendizaje continuo.";
    speechService.speak(welcomeMsg, 'es-MX');
  }, [fetchNewNodes, settings.isGuestMode]);

  /** 🧠 MANEJO DE SELECCIÓN */
  const handleWordSelection = async (word: string, known: boolean) => {
    if (known) {
      setSessionScore(prev => prev + 1);
      
      // ✅ PERSISTENCIA CONDICIONAL: Solo guardamos si NO es modo invitado
      if (!settings.isGuestMode) {
        const wordClean = word.toLowerCase();
        const updatedVocabulary = [...(settings.knownVocabulary || []), wordClean];
        await updateSettings({ knownVocabulary: updatedVocabulary });
      }
      
      speechService.speak(word, settings.targetLanguage); 
    }
    
    // Control de flujo infinito
    if (step < dynamicWords.length - 1) {
      setStep(prev => prev + 1);
    } else {
      fetchNewNodes(true); // Recarga automática al terminar el set
    }
  };

  const finalizeTest = async () => {
    setIsSaving(true);
    // Solo guardamos la fecha si es una sesión real
    if (!settings.isGuestMode) {
      await updateSettings({ lastEvaluationDate: new Date().toISOString() });
    }
    
    setTimeout(() => {
      navigate('/results', { 
        state: { 
          score: sessionScore, 
          total: sessionScore, 
          isGuest: settings.isGuestMode 
        } 
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-[#00FBFF]" size={64} />
        <p className="text-[10px] font-black text-[#00FBFF] uppercase tracking-[0.5em] animate-pulse">
          Sincronizando_Nuevos_Nodos...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 italic select-none overflow-hidden">
      
      {/* 🛡️ INDICADOR DE MODO AUDITORÍA */}
      {settings.isGuestMode && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full">
          <ShieldAlert size={14} className="text-[#39FF14] animate-pulse" />
          <span className="text-[9px] font-black uppercase text-[#39FF14] tracking-widest">Modo_Auditoría_Activo</span>
        </div>
      )}

      {/* 🛑 CIERRE MANUAL */}
      <button 
        onClick={finalizeTest}
        className="absolute top-8 right-8 z-50 flex items-center gap-3 px-5 py-2 border border-zinc-900 rounded-full bg-black hover:bg-white hover:text-black transition-all group"
      >
        <span className="text-[9px] font-black uppercase tracking-widest">Finalizar Sesión</span>
        <LogOut size={14} className="text-rose-600" />
      </button>

      {/* 📈 PUNTAJE DE SESIÓN */}
      <div className="absolute top-12 left-12">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">Nodos_Dominados</p>
        <p className="text-4xl font-[1000] text-[#00FBFF]">{sessionScore}</p>
      </div>

      <AnimatePresence mode="wait">
        {!isSaving ? (
          <motion.div 
            key={dynamicWords[step]?.word}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="text-center space-y-12 w-full max-w-4xl"
          >
            <div className="space-y-4">
              <BrainCircuit size={48} className="mx-auto text-[#FF00F5] opacity-20" />
              <h2 className="text-6xl md:text-8xl font-[1000] uppercase tracking-tighter leading-none">
                {dynamicWords[step]?.word}
              </h2>
              <p className="text-xl font-bold text-[#00FBFF] uppercase tracking-[0.3em] opacity-80">
                {dynamicWords[step]?.translation}
              </p>
            </div>

            <div className="flex gap-16 justify-center items-center">
              <button onClick={() => handleWordSelection(dynamicWords[step].word, false)} className="flex flex-col items-center gap-3 group">
                <div className="w-24 h-24 rounded-full border border-zinc-900 flex items-center justify-center group-hover:border-rose-600 transition-all duration-500">
                  <XCircle className="text-zinc-800 group-hover:text-rose-600" size={32} />
                </div>
                <span className="text-[8px] font-black uppercase text-zinc-800 tracking-widest group-hover:text-rose-600">Omitir</span>
              </button>

              <button onClick={() => handleWordSelection(dynamicWords[step].word, true)} className="flex flex-col items-center gap-3 group">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-500">
                  <CheckCircle2 className="text-black" size={32} />
                </div>
                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest group-hover:text-white">Lo sé</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <Loader2 className="animate-spin text-[#FF00F5] mx-auto" size={64} />
            <p className="text-xl font-[1000] uppercase italic tracking-[0.5em] text-[#FF00F5]">
              Sincronizando_Progreso...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="absolute bottom-12 opacity-10">
        <p className="text-[8px] font-black tracking-[1em] text-zinc-500 uppercase">Neural_Core_Infinite_Loop</p>
      </footer>
    </div>
  );
};

export default EvaluationTest;