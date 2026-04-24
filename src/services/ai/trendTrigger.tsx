/**
 * ⚡ TREND_TRIGGER v16.0 - STABLE PRODUCTION (MENCIONAL 2026)
 * Orquestador visual y motor de sincronización de la Nube de Ideas.
 * Captura la esencia de la conversación actual y nutre el flujo de aprendizaje.
 * Ubicación: /src/services/ia/trendTrigger.tsx
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Globe, ChevronRight, RefreshCw } from 'lucide-react';

// Importación de tipos y utilidades según estructura de diseño OLED
import { TrendTopic, getNeuralTrends } from '../business/trendsService';
import { getCategoryStyle, UI_SYSTEM_COLORS } from '../../utils/colors10';
import { logger } from '../../utils/logger';

interface TrendTriggerProps {
  /** Callback para inyectar el tema como nombre de sesión automáticamente */
  onTrendSelect?: (topic: string) => void;
  /** Versión simplificada para la barra de estado superior */
  isCompact?: boolean;
}

const TrendTrigger: React.FC<TrendTriggerProps> = ({ onTrendSelect, isCompact = false }) => {
  const [activeTrends, setActiveTrends] = useState<TrendTopic[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * 🛰️ SYNC_ENGINE
   * Recupera temas emergentes basados en el lenguaje vivo de las sesiones pasadas.
   */
  const syncTrends = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    try {
      const trends = await getNeuralTrends();
      // Si no hay tendencias en tiempo real, se activan los fallbacks laborales por protocolo
      setActiveTrends(Array.isArray(trends) && trends.length > 0 ? trends : [
        { id: 't1', topic: 'CUSTOMER_SUPPORT', category: 'CALL_CENTER' },
        { id: 't2', topic: 'ORDER_MANAGEMENT', category: 'CAFE_SHOP' },
        { id: 't3', topic: 'GUEST_RELATIONS', category: 'HOTEL_STAFF' },
        { id: 't4', topic: 'TECHNICAL_ASSISTANCE', category: 'TECH_SUPPORT' }
      ]);
    } catch (error) {
      logger.error("TRENDS_SYNC_ERROR", "Fallo en sincronización neural, activando backup local.");
      setActiveTrends([
        { id: 'b1', topic: 'BUSINESS_INTERVIEW', category: 'OFFICE' },
        { id: 'b2', topic: 'RESTAURANT_SERVICE', category: 'HOSPITALITY' }
      ]);
    } finally {
      // Latencia intencional para feedback visual de procesamiento IA
      setTimeout(() => setIsSyncing(false), 1200);
    }
  }, [isSyncing]);

  useEffect(() => {
    syncTrends();
    // Refresco cada 5 minutos (300000ms) para mantener la nube fresca
    const interval = setInterval(syncTrends, 300000);
    return () => clearInterval(interval);
  }, [syncTrends]);

  /**
   * 🎯 HANDLE_SELECT
   * Inyecta el tópico limpio en el flujo de configuración de sesión.
   */
  const handleSelect = (topic: string) => {
    const cleanTopic = topic.replace(/_/g, ' ');
    if (onTrendSelect) {
      onTrendSelect(cleanTopic);
      logger.info("TREND_SELECT", `Sesión configurada como: ${cleanTopic}`);
    }
  };

  // --- RENDER: VERSIÓN COMPACTA (Status Bar) ---
  if (isCompact) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 bg-zinc-950 px-4 py-2.5 rounded-2xl border border-white/5 backdrop-blur-2xl cursor-pointer hover:border-[#00FBFF]/30 transition-all shadow-2xl group"
        onClick={syncTrends}
      >
        <div className="relative flex items-center justify-center">
          <div className={`h-2 w-2 rounded-full ${isSyncing ? 'bg-[#00FBFF] animate-ping' : 'bg-[#00FBFF] shadow-[0_0_8px_rgba(0,251,255,0.5)]'}`} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors">
          LIVE_TREND: <span className="text-white italic">
            {activeTrends.length > 0 ? activeTrends[0].topic.replace(/_/g, ' ') : 'SYNCHRONIZING...'}
          </span>
        </span>
      </motion.div>
    );
  }

  // --- RENDER: NUBE DE IDEAS COMPLETA (OLED DYNAMICS) ---
  return (
    <div className="flex flex-col gap-10 w-full select-none">
      
      {/* 🌌 HEADER TÉCNICO */}
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-zinc-950 rounded-[2rem] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-[#00FBFF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap 
              size={24} 
              className={isSyncing ? "animate-pulse text-[#00FBFF]" : "text-white"} 
              style={{ color: !isSyncing ? UI_SYSTEM_COLORS.MASTER : undefined }}
            />
          </div>
          <div>
            <h2 className="text-3xl font-[1000] tracking-tighter text-white uppercase italic leading-none">
              Nube_de_Ideas<span className="text-[#00FBFF] opacity-80">.IA</span>
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="h-1 w-1 rounded-full bg-[#00FBFF] animate-pulse" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">
                Lenguaje_Vivo_En_Tiempo_Real
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={syncTrends}
          disabled={isSyncing}
          className="p-4 bg-zinc-900/50 rounded-full border border-white/5 hover:border-[#00FBFF]/40 hover:bg-zinc-900 transition-all disabled:opacity-20 active:scale-90"
        >
          <RefreshCw size={18} className={`${isSyncing ? "animate-spin text-[#00FBFF]" : "text-zinc-500"}`} />
        </button>
      </div>

      {/* 🗂️ GRID DE TARJETAS TÁCTICAS (CandyGlass Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {activeTrends.map((item, index) => {
            const theme = getCategoryStyle(item.category);
            
            return (
              <motion.button
                key={item.id || index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelect(item.topic)}
                className="group relative h-60 flex flex-col justify-between overflow-hidden rounded-[3rem] border border-white/5 p-8 text-left transition-all bg-zinc-900/20 backdrop-blur-2xl shadow-2xl hover:border-[#00FBFF]/30"
              >
                {/* Indicador de Categoría Laboral */}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.hex }} />
                  <span 
                    className="text-[9px] font-[1000] tracking-[0.3em] uppercase italic opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ color: theme.hex }}
                  >
                    {item.category.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Tópico Principal */}
                <h3 className="text-2xl font-[1000] text-white leading-tight uppercase italic group-hover:text-[#00FBFF] transition-colors duration-500 break-words">
                  {item.topic.replace(/_/g, ' ')}
                </h3>

                {/* Footer de Tarjeta con Acción */}
                <div className="flex items-center justify-between border-t border-white/5 pt-6 opacity-30 group-hover:opacity-100 transition-all duration-700">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-zinc-500" />
                    <span className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-500">Global_Focus</span>
                  </div>
                  <div className="p-2.5 rounded-full bg-white/5 border border-white/5 group-hover:bg-[#00FBFF] group-hover:text-black group-hover:border-[#00FBFF] transition-all shadow-[0_0_20px_rgba(0,251,255,0)] group-hover:shadow-[0_0_20px_rgba(0,251,255,0.4)]">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </div>

                {/* Resplandor OLED Dinámico al Hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 120%, ${theme.hex}, transparent 70%)` }}
                />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* ⚡ STATUS LINE DE SISTEMA */}
      <div className="flex items-center gap-8 mt-4 opacity-20">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        <div className="flex items-center gap-3">
          <Activity size={14} className="text-[#00FBFF] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.7em] text-zinc-400">Neural_Sync_Active_v16</span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      </div>
    </div>
  );
};

export default TrendTrigger;