/**
 * 🧊 ROMPEHIELO_CONFIG v23.1
 * Location: /src/components/RompehieloConfig.tsx
 * Protocolo: Selección de canal para respuesta pura (4s Window)
 * Nota: Este modo es exclusivo para Administradores.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Zap, Timer, ChevronRight, Sparkles } from 'lucide-react';

export const RompehieloConfig: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('AUTO');
  const [isActivating, setIsActivating] = useState(false);

  /**
   * handleStart: Inicia la sesión directamente cumpliendo con el protocolo 
   * de "sin confirmaciones extra".
   */
  const handleStart = () => {
    setIsActivating(true);
    
    // Simulación de carga neural para sincronización OLED Safe
    setTimeout(() => {
      navigate('/learning', { 
        state: { 
          mode: 'ROMPEHIELO', 
          lang: selectedLang,
          criticalWindow: 4000,
          isAdmin: true // Protocolo: Acceso administrativo desbloqueado
        } 
      });
    }, 800);
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 p-8 rounded-[2.5rem] border border-orange-500/30 shadow-[0_20px_50px_rgba(249,115,22,0.1)] relative overflow-hidden group oled-safe">
      
      {/* Indicador de Modo Exclusivo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-orange-500/10 rounded-lg">
          <Zap size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">
            Icebreaker_Protocol_v23
          </h3>
          <span className="text-[8px] text-zinc-600 font-bold uppercase">Admin_Access_Only</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
            MODO <span className="text-orange-500">ROMPEHIELO</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase leading-relaxed">
            IA detecta preguntas y ofrece 3 respuestas sugeridas. 
            Fijación Aoede 2x activa para respuestas rápidas.
          </p>
        </div>

        {/* Configuración de Idioma Interlocutor */}
        <div className="grid grid-cols-1 gap-3">
          <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">
            Idioma del Interlocutor (Prioridad Inglés)
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/50" size={16} />
            <select 
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full bg-black text-white pl-12 pr-4 py-4 rounded-2xl border border-white/5 font-bold appearance-none focus:border-orange-500/50 transition-all outline-none cursor-pointer"
            >
              <option value="AUTO">DETECTAR AUTOMÁTICAMENTE</option>
              <option value="EN">INGLÉS (PREDETERMINADO)</option>
              <option value="FR">FRANCÉS</option>
              <option value="IT">ITALIANO</option>
              <option value="DE">ALEMÁN</option>
              <option value="PT">PORTUGUÉS</option>
              <option value="ES">ESPAÑOL</option>
            </select>
          </div>
        </div>

        {/* Telemetría de Ventana Crítica: 4s para respuesta pura */}
        <div className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <Timer size={16} className="text-zinc-600" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Ventana de Respuesta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-500 font-black text-sm">4.0s</span>
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
          </div>
        </div>

        {/* Botón de Inicio Directo */}
        <button 
          onClick={handleStart}
          disabled={isActivating}
          className="w-full group/btn relative mt-4 overflow-hidden bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all duration-500"
        >
          {isActivating ? (
            <Sparkles className="animate-spin" size={18} />
          ) : (
            <>
              ACTIVAR ROMPEHIELO
              <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
        </button>
      </div>

      {/* Marca de Agua Técnica */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
        <Zap size={120} />
      </div>
    </div>
  );
};