/**
 * 🛰️ MENCIONAL 2026 | MODAL v20.0
 * Ubicación: /src/components/Modal.tsx
 * Función: Contenedor universal OLED con adaptabilidad multidispositivo.
 * Protocolo: Interfaz de alto contraste con contornos táctiles y desenfoque cinemático.
 */

import React, { ReactNode, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity } from 'lucide-react';

// Importación opcional de logger para monitorear aperturas de configuración
import { logger } from '../utils/logger';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showCloseButton?: boolean;
  maxWidth?: string; // Responsivo: 'max-w-md', 'max-w-lg', 'max-w-2xl', 'max-w-full'
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  showCloseButton = true,
  maxWidth = 'max-w-lg',
  closeOnOverlayClick = true
}) => {
  
  // ⌨️ ACCESIBILIDAD: Manejo de tecla Escape
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // Log de apertura para depuración de flujo de aprendizaje
      logger.info('MODAL_SYSTEM', `Interfaz desplegada: ${title || 'Sin Título'}`);
      
      window.addEventListener('keydown', handleEsc);
      // Protocolo de Inmersión: Bloqueo de scroll en el eje Y
      document.body.style.overflow = 'hidden';
      // Fix para estabilidad visual en iOS / Safari
      document.body.style.touchAction = 'none';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen, handleEsc, title]);

  // Renderizado mediante Portal: El modal se inyecta al final del body
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-8 overflow-hidden">
          
          {/* 🌑 BACKDROP: Capa de profundidad con desenfoque extremo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-pointer"
          />

          {/* 📦 BODY: Contenedor con estética "Deep Black" y bordes neón */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 35, stiffness: 450 }}
            className={`relative w-full ${maxWidth} bg-[#030303] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_-15px_rgba(0,0,0,1)] z-10 flex flex-col`}
          >
            
            {/* ✨ PROTOCOLO DE VISIBILIDAD: Línea de acento superior turquesa */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FBFF]/40 to-transparent" />
            
            {/* 🛠️ HEADER: Información de sistema y controles */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-7 md:p-9 border-b border-white/5 bg-zinc-900/10">
                {title ? (
                  <div className="flex flex-col gap-2 select-none">
                    <div className="flex items-center gap-2">
                      <Activity size={10} className="text-[#00FBFF] animate-pulse" />
                      <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#00FBFF]/70 italic">
                        MENCIONAL_SYSTEM // MODAL_v20
                      </h3>
                    </div>
                    <p className="text-xl md:text-2xl font-[1000] text-white italic tracking-tighter uppercase leading-none">
                      {title}
                    </p>
                  </div>
                ) : <div />}
                
                {showCloseButton && (
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-4 rounded-full bg-zinc-950 text-zinc-500 hover:text-white transition-all border border-white/10 flex items-center justify-center shadow-2xl group"
                    aria-label="Cerrar modal"
                  >
                    <X size={22} strokeWidth={2.5} className="group-hover:text-[#00FBFF]" />
                  </motion.button>
                )}
              </div>
            )}

            {/* 🧬 CONTENT: Área operativa */}
            <div className="relative max-h-[65vh] md:max-h-[70vh] overflow-y-auto overflow-x-hidden p-7 md:p-9 scroll-smooth custom-scrollbar">
              {children}
            </div>

            {/* 📊 STATUS BAR: Indicador de carga visual inferior */}
            <div className="h-1.5 w-full bg-zinc-900/30 flex shrink-0">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1, ease: "circOut" }}
                  className="h-full w-full bg-gradient-to-r from-transparent via-[#00FBFF]/20 to-transparent" 
                />
            </div>

          </motion.div>

          {/* ESTILOS INLINE: Scrollbar invisible para estética OLED */}
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 0px;
              background: transparent;
            }
            .custom-scrollbar {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default React.memo(Modal);