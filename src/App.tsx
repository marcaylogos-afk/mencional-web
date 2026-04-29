/**
 * 🚀 MENCIONAL | APP_ORCHESTRATOR v2026.PROD
 * Ubicación: /src/App.tsx
 * ✅ DIRECTORIO AI: /src/services/ai/ (Sincronizado)
 * ✅ PROTOCOLO: OLED Black Absolute (#000000)
 * ✅ VITAL: Exportación default para main.tsx
 */

import React, { Suspense } from "react";
import { SettingsProvider } from "./context/SettingsContext"; //
import AppRouter from "./router/AppRouter"; //

/**
 * COMPONENTE APP
 * Centraliza la configuración global y el diseño base.
 * Estética: #000000 (OLED Black) para optimizar consumo y contraste.
 */
const App: React.FC = () => {
  return (
    <div className="app-container bg-[#000000] min-h-screen selection:bg-[#00FBFF] selection:text-black overflow-hidden antialiased font-sans italic">
      
      {/* 1. SettingsProvider: Centraliza roles, pagos ($50 MXN) e inteligencia artificial.
          2. AppRouter: Gestiona el despacho de vistas (Aprendizaje, Ultra, Rompehielo).
      */}
      <SettingsProvider>
        <div className="main-content-wrapper max-w-[1920px] mx-auto relative h-[100dvh]">
          
          {/* Overlay de Reducción de Fatiga Visual */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/95 pointer-events-none z-0" />
          
          <div className="relative z-10 h-full">
            {/* Suspense: Fallback temático mientras cargan los servicios en /services/ai/. */}
            <Suspense 
              fallback={
                <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-2 border-[#00FBFF]/20 border-t-[#00FBFF] rounded-full animate-spin shadow-[0_0_15px_#00FBFF33]" />
                  <div className="text-[#00FBFF] text-[10px] font-black tracking-[0.5em] animate-pulse uppercase">
                    Sincronizando_Mencional...
                  </div>
                </div>
              }
            >
              <AppRouter />
            </Suspense>
          </div>
        </div>
      </SettingsProvider>

      {/* Textura de Carbono Global */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.01] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-[999]" />
    </div>
  );
};

/**
 * ✅ EXPORTACIÓN POR DEFECTO
 * Obligatoria para corregir el SyntaxError en main.tsx.
 */
export default App;