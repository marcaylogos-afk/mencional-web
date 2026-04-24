/**
 * 🛰️ MENCIONAL | USER SETTINGS & IDENTITY v2026.PROD
 * Gestión de perfil temporal, selección de color neural y persistencia.
 * Ubicación: /src/views/UserSettings.tsx
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth';
import { 
  User, 
  Palette, 
  Check, 
  ShieldCheck, 
  ChevronLeft, 
  Save, 
  Cpu 
} from 'lucide-react';

// Paleta oficial de 10 colores de la nube de tendencias Mencional (OLED Optimized)
const NEURAL_COLORS = [
  { id: 'cyan', hex: '#00FBFF', label: 'Neural Cyan' },
  { id: 'rose', hex: '#FF007A', label: 'Deep Rose' }, // Ajustado a paleta oficial
  { id: 'emerald', hex: '#39FF14', label: 'Vibrant Emerald' },
  { id: 'amber', hex: '#CCFF00', label: 'Core Amber' },
  { id: 'violet', hex: '#8B00FF', label: 'Ultra Violet' },
  { id: 'blue', hex: '#0070FF', label: 'OLED Blue' },
  { id: 'fuchsia', hex: '#D946EF', label: 'Neon Fuchsia' },
  { id: 'orange', hex: '#FF5F00', label: 'Plasma Orange' },
  { id: 'lime', hex: '#84CC16', label: 'Bio Lime' },
  { id: 'white', hex: '#FFFFFF', label: 'Crystal White' }
];

export const UserSettings: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth(); // Asumiendo que useAuth retorna el objeto user o userName
  
  // Sincronización: Prioriza settings guardados sobre el login actual
  const isAdmin = settings.isAdmin || user?.userName?.toLowerCase() === 'miguel';
  const [localName, setLocalName] = useState(settings.userName || user?.userName || "");
  const [selectedColor, setSelectedColor] = useState(settings.themeColor || '#00FBFF');
  const [isSaved, setIsSaved] = useState(false);

  /**
   * 💾 PERSISTENCIA EN NÚCLEO
   */
  const handleSave = async () => {
    try {
      updateSettings({
        userName: localName.toUpperCase() || "OPERADOR_NODE",
        themeColor: selectedColor,
      });
      
      setIsSaved(true);
      
      // Feedback estético en consola para el administrador
      console.log(
        `%c [SETTINGS] CONFIGURACIÓN APLICADA AL NÚCLEO `, 
        `background: #000; color: ${selectedColor}; font-weight: bold; border: 1px solid ${selectedColor}; padding: 4px;`
      );
      
      // Latencia para confirmar la escritura y retorno al selector
      setTimeout(() => {
        setIsSaved(false);
        navigate('/selector');
      }, 1000);
    } catch (error) {
      console.error("Error al guardar configuración:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-white selection:text-black">
      
      {/* 🌌 FONDO AMBIENTAL DINÁMICO: Reacciona al color seleccionado */}
      <motion.div 
        initial={false}
        animate={{ background: `radial-gradient(circle at center, ${selectedColor}15 0%, transparent 70%)` }}
        className="absolute inset-0 opacity-40 transition-colors duration-1000 ease-in-out pointer-events-none"
      />
      <motion.div 
        initial={false}
        animate={{ backgroundColor: selectedColor }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-1000 opacity-10 pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-zinc-950/40 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl z-10 relative overflow-hidden"
      >
        {/* HEADER DE NAVEGACIÓN */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate('/selector')}
            className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col items-end">
             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">Identidad_Neural</span>
             <div className="flex items-center gap-2 text-zinc-400 mt-1">
               <Cpu size={12} style={{ color: selectedColor }} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest italic">{isAdmin ? 'Master_Node' : 'User_Node'}</span>
             </div>
          </div>
        </div>

        {/* SECCIÓN 1: IDENTIDAD VISUAL */}
        <div className="space-y-10">
          <header className="space-y-2">
            <div className="flex items-center gap-3" style={{ color: selectedColor }}>
              <User size={18} strokeWidth={2.5} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] italic">Configuración_Perfil</h3>
            </div>
            <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-tight">Define tu alias en el protocolo Mencional.</p>
          </header>

          <div className="relative group">
            <input 
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value.toUpperCase())}
              placeholder="ESCRIBE TU ALIAS..."
              className="w-full bg-black/60 border-2 border-white/5 rounded-[1.8rem] px-8 py-6 text-white font-black tracking-[0.2em] focus:outline-none transition-all placeholder:text-zinc-800 focus:border-white/10"
              style={{ borderColor: isSaved ? '#39FF14' : undefined }}
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
               <ShieldCheck size={20} style={{ color: selectedColor }} />
            </div>
          </div>

          {/* SECTOR DE COLOR NEURAL */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-zinc-600">
              <Palette size={16} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Sincronización_de_Aura</span>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              {NEURAL_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.hex)}
                  className="relative aspect-square rounded-2xl transition-all active:scale-90 hover:scale-105 border-2 overflow-hidden group/btn"
                  style={{ 
                    backgroundColor: color.hex,
                    borderColor: selectedColor === color.hex ? 'white' : 'transparent',
                    boxShadow: selectedColor === color.hex ? `0 0 25px ${color.hex}66` : 'none'
                  }}
                >
                  <AnimatePresence>
                    {selectedColor === color.hex && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]"
                      >
                        <Check size={24} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>
          </div>

          {/* ACCIÓN DE GUARDADO */}
          <div className="pt-4">
            <button 
              onClick={handleSave}
              disabled={isSaved}
              className={`w-full py-7 font-black uppercase text-xs rounded-[2rem] tracking-[0.4em] transition-all flex items-center justify-center gap-4 active:scale-95 italic ${
                isSaved 
                ? "bg-[#39FF14] text-black shadow-[0_0_40px_rgba(57,255,20,0.4)]" 
                : "text-black shadow-xl hover:-translate-y-1"
              }`}
              style={{ backgroundColor: !isSaved ? selectedColor : undefined }}
            >
              {isSaved ? (
                <>Sincronizado_Exitosamente <Check size={18} strokeWidth={3} /></>
              ) : (
                <>Actualizar_Identidad <Save size={18} /></>
              )}
            </button>
          </div>
        </div>

        {/* NOTA TÉCNICA */}
        <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-2">
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.6em] italic">
            Mencional_System // Álvaro Obregón // Nodo_v2.6
          </span>
          <div className="w-12 h-[1px] bg-zinc-800" />
        </footer>
      </motion.div>

      {/* 🛡️ CAPA DE ESTÉTICA INDUSTRIAL (Scanlines) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-[100]" />
    </div>
  );
};

export default UserSettings;