/**
 * 🛡️ MENCIONAL | ERROR_BOUNDARY v2026.PROD
 * Protocolo de Contención de Fallos Neurales.
 * Ubicación: /src/components/ErrorBoundary.tsx
 */
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home, Terminal } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de fallback.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error en la consola del desarrollador bajo el estándar de producción 2026
    // Referencia interna a /services/ai/ para depuración de motores.
    console.error("🔴 CRITICAL_FAIL_MENCIONAL_CORE:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans selection:bg-rose-600 selection:text-black overflow-hidden italic">
          
          {/* 📡 HUD DE ERROR OLED (CandyGlass & Rose Glow) */}
          <div className="max-w-xl w-full space-y-12 text-center relative animate-shake">
            
            {/* Icono de Alerta con Pulso de advertencia */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-rose-600/20 blur-[50px] rounded-full animate-pulse" />
                <div className="p-10 bg-zinc-950 border border-rose-500/30 rounded-[3rem] relative z-10 shadow-[0_0_60px_rgba(225,29,72,0.15)] backdrop-blur-3xl">
                  <AlertTriangle size={56} className="text-rose-500 drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-[1000] uppercase tracking-tighter leading-none">
                SISTEMA_<span className="text-rose-600">FRACTURADO</span>
              </h1>
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.6em] italic">
                Exception_Handshake_Failed // Trace_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>

            {/* 📟 TERMINAL DE LOG (Diagnóstico de Núcleo) */}
            <div className="bg-zinc-950/90 border border-white/5 p-8 rounded-[2.5rem] text-left font-mono backdrop-blur-3xl relative overflow-hidden shadow-2xl group">
               <div className="absolute top-0 left-0 w-1 h-full bg-rose-600/50" />
               <div className="flex items-center gap-3 mb-5 opacity-40">
                 <Terminal size={14} className="text-rose-500" />
                 <span className="text-[9px] uppercase tracking-[0.4em] font-black">Neural_Dump_v2026.12</span>
               </div>
               <p className="text-rose-400/70 text-[11px] leading-relaxed break-all font-bold">
                 {this.state.error?.name || "Neural_Kernel_Panic"}: {this.state.error?.message || "La inyección de contexto en /services/ai/ ha sido interrumpida por una excepción de renderizado."}
               </p>
            </div>

            {/* 🛠️ ACCIONES DE RECUPERACIÓN (High-Contrast Buttons) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-4 py-7 bg-white text-black rounded-[2rem] font-[1000] uppercase text-[12px] tracking-widest hover:bg-rose-500 hover:text-white active:scale-95 transition-all shadow-[0_30px_60px_-10px_rgba(255,255,255,0.05)]"
              >
                <RefreshCcw size={18} strokeWidth={3} />
                Reiniciar_Nodo
              </button>
              
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-4 py-7 bg-zinc-950 border border-white/5 text-zinc-600 rounded-[2rem] font-[1000] uppercase text-[12px] tracking-widest hover:text-white hover:border-white/20 active:scale-95 transition-all"
              >
                <Home size={18} strokeWidth={3} />
                Fuga_Al_Core
              </button>
            </div>
          </div>

          {/* 🏁 FOOTER TÉCNICO INDUSTRIAL */}
          <footer className="mt-auto mb-12 z-10 text-center space-y-5">
            <p className="text-[9px] font-[1000] text-zinc-800 tracking-[1.5em] uppercase">
              MENCIONAL_OS // EMERGENCY_LINK_ACTIVE
            </p>
            <div className="flex justify-center gap-6 opacity-5">
              <div className="w-16 h-px bg-zinc-700" />
              <div className="w-16 h-px bg-zinc-700" />
            </div>
          </footer>

          {/* EFECTO DE ESCANEO DE ERROR (OLED Protector) */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-50 bg-[linear-gradient(rgba(225,29,72,0)_50%,rgba(225,29,72,0.4)_50%)] bg-[length:100%_6px]" />

          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-5px); }
              40% { transform: translateX(5px); }
              60% { transform: translateX(-5px); }
              80% { transform: translateX(5px); }
            }
            .animate-shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
            .font-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;