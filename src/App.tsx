/**
 * 🚀 MENCIONAL | APP_ORCHESTRATOR v2026.PROD
 * Ubicación: /src/App.tsx
 * ✅ DIRECTORIO AI: /src/services/ai/ (Sincronizado)
 * Protocolo: Delegación de Router a main.tsx
 */

import React, { Suspense } from "react";
import { SettingsProvider } from "./context/SettingsContext";
import AppRouter from "./router/AppRouter";

/**
 * COMPONENTE APP
 * Se ha removido el BrowserRouter de aquí por protocolo de arquitectura.
 * El enrutamiento ahora se gestiona desde el punto de entrada raíz (main.tsx).
 * Estética: #000000 (OLED Black) para evitar sangrado de luz.
 */
const App: React.FC = () => {
  return (
    <div className="app-container bg-[#000000] min-h-screen selection:bg-[#00FBFF] selection:text-black overflow-hidden antialiased">
      {/* 1. SettingsProvider: El núcleo que centraliza:
             - Roles (Admin 'osos' / Participante)
             - Pagos ($20 MXN por sesión via Mercado Pago)
             - Inmersión Neural (English Priority / /services/ai/ services)
          
          2. AppRouter: Despacho de vistas (Learning, Ultra, Rompehielo).
             Se comunica con /src/services/ai/ para validación de hardware.
      */}
      <SettingsProvider>
        <div className="main-content-wrapper max-w-[1920px] mx-auto relative h-screen">
          
          {/* Overlay de Reducción de Fatiga Visual (OLED Optimized) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/90 pointer-events-none z-0" />
          
          <div className="relative z-10 h-full">
            {/* Suspense con fallback temático:
                Evita el "Black Screen" inicial mientras se cargan los modelos de /services/ai/.
                Estética: Cian (#00FBFF) sobre Negro Absoluto (#000000).
            */}
            <Suspense 
              fallback={
                <div className="h-screen w-full bg-black flex items-center justify-center text-[#00FBFF] text-[10px] tracking-[0.5em] animate-pulse italic uppercase">
                  Sincronizando_Mencional...
                </div>
              }
            >
              <AppRouter />
            </Suspense>
          </div>
        </div>
      </SettingsProvider>
    </div>
  );
};

export default App;