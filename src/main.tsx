/**
 * 🛰️ MENCIONAL | APP_CORE_BRIDGE
 * Objetivo: Punto de entrada principal con soporte de Enrutamiento.
 * ✅ DIRECTORIO AI: Sincronizado en /src/services/ai/
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 👈 Necesario para el contexto de rutas
import App from './App';
import { SettingsProvider } from './context/SettingsContext';
import { logger } from './utils/logger';

// ✅ Ruta de estilos verificada
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  logger.error('CRITICAL', 'No se encontró el nodo de montaje #root.');
  throw new Error("Mencional requiere un elemento con id 'root'.");
}

// 🚀 Envolvemos todo el árbol en BrowserRouter para habilitar useRoutes()
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter> 
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);

logger.info('BOOT', 'Mencional 2026: Enrutador y Nodo principal activos.');