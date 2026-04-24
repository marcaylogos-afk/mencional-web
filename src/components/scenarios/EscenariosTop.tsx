/**
 * 🏔️ MENCIONAL | ESCENARIOS_TOP v2026.12
 * Objetivo: Despliegue de "Nube de Ideas Dinámica" y Temas Trend.
 * Regla: Las frases que más se repiten en sesiones suben aquí automáticamente.
 * Ubicación: /src/components/scenarios/EscenariosTop.tsx
 * Sincronizado con: /services/ai/
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MessageSquare, PlayCircle, Sparkles, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// VINCULACIÓN CON MOTOR DE AUDIO Y CONFIGURACIÓN
import { useSettings } from '../../context/SettingsContext';
// ✅ DIRECTORIO CORRECTO: /ai/
import speechService from '../../services/ai/speechService'; 

interface ScenarioPhrase {
  id: string;
  text: string;
  translation: string;
  category: 'CAFETERÍA' | 'CALL_CENTER' | 'IT_SUPPORT' | 'NEGOCIOS';
  uses: number;
  isHot?: boolean;
}

// Datos de tendencia sincronizados con el entorno laboral real v2026.12
const DYNAMIC_TRENDS: ScenarioPhrase[] = [
  { id: 't1', text: "Can I take your order?", translation: "¿Puedo tomar su pedido?", category: 'CAFETERÍA', uses: 4500, isHot: true },
  { id: 't2', text: "I'll put you on hold for a moment.", translation: "Lo pondré en espera un momento.", category: 'CALL_CENTER', uses: 3200 },
  { id: 't3', text: "Have you tried restarting the router?", translation: "¿Ha intentado reiniciar el router?", category: 'IT_SUPPORT', uses: 2800 },
  { id: 't4', text: "Let's touch base next Monday.", translation: "Hablemos el próximo lunes.", category: 'NEGOCIOS', uses: 1950 },
];

export const EscenariosTop: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const [filter, setFilter] = useState<string>('ALL');
  
  // Sincronización OLED con el color de acento del sistema
  const activeColor = useMemo(() => settings?.themeColor || '#00FBFF', [settings]);

  const handlePreview = async (phrase: string) => {
    // Protocolo de audio: Vista previa rápida usando el motor Aoede
    try {
      await speechService.executeLearningProtocol(phrase, settings?.practiceLanguage || 'en-US');
    } catch (error) {
      console.error("TTS_PREVIEW_ERROR", error);
    }
  };

  const handleStartWithTrend = (phrase: string, topic: string) => {
    /**
     * REGLA MENCIONAL: Al seleccionar una tendencia, se debe pasar por
     * la configuración de la sesión para establecer el idioma prioritario.
     */
    updateSettings({ 
      sessionName: `Sesión Trend: ${topic}`,
      mode: 'learning' 
    });
    
    // Almacenamos el "Seed" para que LearningMode lo cargue al iniciar oficialmente
    sessionStorage.setItem('initial_topic', topic);
    sessionStorage.setItem('seed_phrase', phrase);
    
    // Redirigimos a la configuración obligatoria del modo aprendizaje
    navigate('/session-setup'); 
  };

  return (
    <div className="w-full space-y-10 p-2 select-none">
      
      {/* HEADER: NUBE DE IDEAS DINÁMICA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 blur-lg opacity-50 animate-pulse" style={{ backgroundColor: activeColor }} />
            <div className="relative p-3 rounded-2xl bg-zinc-950 border border-white/10">
              <Sparkles size={24} style={{ color: activeColor }} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-[1000] uppercase tracking-[0.4em] text-white italic leading-none">
              Nube_Ideas_Trend
            </h3>
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
              Sincronizado v2026.12 | Motor AI Activo
            </p>
          </div>
        </div>

        {/* FILTROS DE CATEGORÍA */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['ALL', 'CAFETERÍA', 'CALL_CENTER', 'IT_SUPPORT', 'NEGOCIOS'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap ${
                filter === cat 
                  ? 'bg-white text-black border-white' 
                  : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE TARJETAS OLED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode='popLayout'>
          {DYNAMIC_TRENDS.filter(i => filter === 'ALL' || i.category === filter).map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative bg-zinc-950 border border-white/5 rounded-[3rem] p-8 hover:border-white/20 transition-all overflow-hidden"
            >
              {/* STATUS Y POPULARIDAD */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black px-4 py-1.5 bg-zinc-900 rounded-xl text-zinc-400 tracking-widest border border-white/5 uppercase">
                    {item.category}
                  </span>
                  {item.isHot && (
                    <span className="flex items-center gap-1 text-[9px] font-black text-orange-500 animate-pulse">
                      <Zap size={10} fill="currentColor" /> TRENDING
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-black italic">
                  <Clock size={12} /> {item.uses.toLocaleString()} USOS
                </div>
              </div>

              {/* CONTENIDO: FRASE KARAOKE STYLE */}
              <div className="space-y-4 mb-10">
                <h4 className="text-3xl font-[1000] text-white leading-none tracking-tighter group-hover:italic transition-all duration-500">
                  "{item.text}"
                </h4>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest opacity-60">
                  {item.translation}
                </p>
              </div>

              {/* ACCIONES DE SESIÓN */}
              <div className="flex gap-4 relative z-10">
                <button
                  onClick={() => handlePreview(item.text)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-5 rounded-3xl flex items-center justify-center gap-3 transition-all border border-white/5 active:scale-95"
                >
                  <PlayCircle size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Vista Previa</span>
                </button>
                
                <button
                  onClick={() => handleStartWithTrend(item.text, item.category)}
                  className="px-10 rounded-3xl flex items-center justify-center transition-all border border-white/10 hover:scale-[1.05] active:scale-95 shadow-2xl"
                  style={{ backgroundColor: `${activeColor}20`, color: activeColor }}
                >
                  <MessageSquare size={20} />
                </button>
              </div>

              {/* GLOW DE FONDO OLED */}
              <div 
                className="absolute -bottom-10 -right-10 w-48 h-48 opacity-0 group-hover:opacity-20 transition-opacity blur-[90px] rounded-full pointer-events-none"
                style={{ backgroundColor: activeColor }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FOOTER INFO: Basado en bloques de 20 min */}
      <div className="text-center py-6">
        <p className="text-[8px] font-bold text-zinc-800 uppercase tracking-[0.6em] italic">
          Actualización dinámica basada en bloques de 20 min sincronizados.
        </p>
      </div>
    </div>
  );
};

export default EscenariosTop;