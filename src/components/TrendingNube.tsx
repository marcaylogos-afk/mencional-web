/**
 * ☁️ TRENDING_NUBE v23.5.PROD - MENCIONAL 2026
 * Captura frases reales de sesiones para ofrecerlas como tendencias iniciales.
 * Estética: CandyGlass OLED | Responsivo: Mobile & Desktop.
 * Ubicación: /src/components/TrendingNube.tsx
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Zap, MessageCircle, 
  ArrowUpRight, Calendar, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

interface TrendItem {
  id: string;
  phrase: string;
  topic: string;
  intensity: number; // Multiplicador de brillo y escala
  usersActive: number;
  language: string;
}

const TrendingNube: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isAdmin = settings?.role === 'admin';
  
  // DATA FEED: Simulación de frases capturadas por el motor de IA en tiempo real
  const [activeTrends] = useState<TrendItem[]>([
    { id: '1', phrase: "¿PODRÍAS REPETIR ESO?", topic: "CALL_CENTER", intensity: 1.5, usersActive: 12, language: "ES" },
    { id: '2', phrase: "EL PEDIDO ESTÁ LISTO", topic: "CAFETERÍA", intensity: 1.1, usersActive: 8, language: "ES" },
    { id: '3', phrase: "TRANSFERENCIA EXITOSA", topic: "NEGOCIOS", intensity: 1.2, usersActive: 5, language: "ES" },
    { id: '4', phrase: "DAME UN MOMENTO, POR FAVOR", topic: "SOCIAL", intensity: 1.8, usersActive: 42, language: "ES" },
    { id: '5', phrase: "HAY UN ERROR EN EL SISTEMA", topic: "TECH_SUPPORT", intensity: 1.1, usersActive: 9, language: "ES" },
    { id: '6', phrase: "WELCOME TO THE TEAM", topic: "ENTREVISTA", intensity: 1.4, usersActive: 15, language: "EN" },
  ]);

  /**
   * 📡 Sincronía de Contexto
   * Persiste la selección para el motor en /src/services/ai/.
   */
  const handleTrendSelect = (trend: TrendItem) => {
    sessionStorage.setItem('initial_topic', trend.topic);
    sessionStorage.setItem('trend_phrase', trend.phrase);
    
    // Bypass Maestro: Redirección según rol de nodo
    if (isAdmin) {
      navigate('/mencional');
    } else {
      navigate('/payment-gateway');
    }
  };

  return (
    <section className="w-full py-24 px-6 md:px-12 bg-[#000000] rounded-[3.5rem] border-2 border-white/5 shadow-2xl overflow-hidden relative italic">
      
      {/* 🔮 EFECTOS DE FONDO NEURAL (Orange-Cian OLED Optimized) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-15%] left-1/4 w-[600px] h-[600px] bg-orange-600/15 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-15%] right-1/4 w-[600px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full" />
      </div>

      {/* 📟 HUD DE ESTADO (TOP INDICATOR) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-8 mb-24 relative z-10"
      >
        <div className="flex items-center gap-10">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-orange-500/30" />
          <div className="flex items-center gap-3 bg-zinc-950 px-6 py-2.5 rounded-full border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <Zap size={14} className="text-orange-500 fill-orange-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-orange-500">
              NEURAL_TRENDS_LIVE
            </span>
          </div>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-orange-500/30" />
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-white text-4xl md:text-6xl font-[1000] tracking-tighter uppercase leading-none">
            Nube de Sincronía
          </h2>
          <div className="flex items-center justify-center gap-4 opacity-40">
            <Activity size={14} className="text-zinc-600" />
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.4em]">
              AI_SERVICES_PATH: /src/services/ai/
            </p>
          </div>
        </div>
      </motion.div>

      {/* 🧊 NUBE DINÁMICA (CANDYGLASS TILES) */}
      <div className="flex flex-wrap gap-6 md:gap-10 justify-center max-w-7xl mx-auto px-4 relative z-10">
        <AnimatePresence>
          {activeTrends.map((trend, index) => (
            <motion.button
              key={trend.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
              transition={{ 
                type: "spring", 
                stiffness: 350, 
                damping: 30, 
                delay: index * 0.05 
              }}
              onClick={() => handleTrendSelect(trend)}
              className="group relative"
            >
              <div className={`
                relative z-10 px-12 py-10 rounded-[2.5rem] 
                backdrop-blur-2xl border-2 transition-all duration-500
                bg-zinc-900/40 group-hover:bg-zinc-800/60 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]
                ${trend.intensity > 1.4 
                  ? 'border-orange-500/40 shadow-[0_30px_70px_rgba(249,115,22,0.1)]' 
                  : 'border-white/5'}
                group-hover:border-orange-500/80
              `}>
                <div className="flex flex-col gap-5 items-start">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Sparkles size={12} className="text-orange-500 opacity-60" />
                      <span className="text-[9px] font-black text-orange-500/70 tracking-[0.3em] uppercase">
                        #{trend.topic}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-zinc-700 group-hover:text-zinc-400 transition-colors uppercase">
                      {trend.language}
                    </span>
                  </div>

                  <p className="text-white font-[1000] text-xl md:text-3xl uppercase leading-tight tracking-tighter group-hover:text-orange-400 transition-colors">
                    "{trend.phrase}"
                  </p>

                  <div className="flex items-center justify-between w-full mt-2 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-3 text-zinc-600 group-hover:text-zinc-400">
                      <MessageCircle size={14} strokeWidth={3} />
                      <span className="text-[8px] font-black tracking-[0.3em] uppercase">
                        {trend.usersActive} Nodos Activos
                      </span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-full group-hover:bg-orange-500/20 transition-all">
                      <ArrowUpRight size={18} className="text-orange-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glow Dinámico */}
              <div className="absolute inset-0 bg-orange-500/10 blur-[40px] rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* 🛡️ PRÓXIMAS SESIONES (FOOTER HUD) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-40 flex flex-col items-center relative z-10"
      >
        <div className="w-full max-w-4xl bg-[#080808]/80 p-12 rounded-[3rem] border-2 border-white/5 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-12 px-2">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.8em] flex items-center gap-5">
              <Calendar size={18} /> 
              Sincronías_Siguientes
            </span>
            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping opacity-30" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { time: "10m", title: "Social Interaction", tag: "HOT" },
              { time: "45m", title: "Business Networking", tag: "STABLE" }
            ].map((session, i) => (
              <div key={i} className="p-8 bg-black/60 rounded-[2rem] border border-white/5 hover:border-orange-500/40 group transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-5">
                  <span className="text-[9px] text-zinc-600 font-black uppercase group-hover:text-orange-500 tracking-widest">
                    In_{session.time}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-orange-500 transition-all shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                </div>
                <p className="text-xl text-zinc-400 font-black uppercase tracking-tighter group-hover:text-white">
                  {session.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default TrendingNube;