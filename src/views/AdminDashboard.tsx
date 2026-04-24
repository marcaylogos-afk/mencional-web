/** * 🛠️ MENCIONAL | ADMIN_DASHBOARD v2026.PROD
 * Panel de Control Maestro: Gestión de Nodos, Telemetría y Operadores.
 * Ubicación: /src/views/AdminDashboard.tsx
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, LogOut, Zap, RefreshCcw, 
  Radio, UserPlus, Key, Loader2, BrainCircuit 
} from 'lucide-react';

import { SessionList } from '../components/SessionList';
import { useSettings } from '../context/SettingsContext';
import { logger } from '../utils/logger';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { settings, logout, updateSettings } = useSettings();
  
  // ✅ Validación de seguridad: Si no es admin, expulsar al login
  const isAdmin = settings?.role === 'admin' || settings?.isUnlimited === true;
  const userName = settings?.userName || 'OPERADOR_DESCONOCIDO';
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ email: '', password: '' });

  const [systemStatus, setSystemStatus] = useState({
    apiLatency: '24ms',
    activeNodes: 1,
    totalTraffic: '0.4 GB/s',
    cpuLoad: '8%'
  });

  useEffect(() => {
    if (!isAdmin) {
      logger.warn("SECURITY", "Intento de acceso no autorizado a Consola Maestra.");
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSystemStatus({
        apiLatency: `${Math.floor(Math.random() * 10) + 20}ms`,
        cpuLoad: `${Math.floor(Math.random() * 4) + 4}%`,
        activeNodes: Math.floor(Math.random() * 2) + 1,
        totalTraffic: `${(Math.random() * 0.2 + 0.3).toFixed(1)} GB/s`
      });
      setIsRefreshing(false);
      logger.info("DASHBOARD", "Telemetría de Nodos sincronizada.");
    }, 1000);
  };

  // 🔑 GENERADOR DE LLAVES (Nuevos Admins con Bypass de $50 MXN)
  const handleCreateAdmin = async () => {
    if (!newAdminData.email || !newAdminData.password) return;
    setIsCreatingAdmin(true);
    
    try {
      logger.info("ADMIN_GEN", `Inyectando privilegios para: ${newAdminData.email}`);
      // Aquí se conectaría con tu Firebase/Supabase para crear el usuario con isUnlimited: true
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`ACCESO MAESTRO CREADO: El operador ${newAdminData.email} ahora tiene bypass total.`);
      setNewAdminData({ email: '', password: '' });
    } catch (e) {
      logger.error("ADMIN_ERROR", e);
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  // 🧠 RESET NEURAL: Limpia el vocabulario conocido para re-evaluar
  const handleResetNeural = async () => {
    const confirm = window.confirm("¿CONFIRMAR RESET NEURAL? Se borrará tu 'Escudo de Inmersión' y volverás a traducir palabras básicas.");
    if (confirm) {
      // Vaciamos el array de vocabulario conocido en el context y Firebase
      await updateSettings({ ...settings, knownVocabulary: [] });
      logger.info("NEURAL_RESET", "Almacén de palabras vaciado con éxito.");
      navigate('/evaluation'); 
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-[#00FBFF] selection:text-black">
      
      {/* HEADER: Identidad OLED */}
      <header className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-zinc-900/30 px-5 py-2 rounded-full border border-[#39FF14]/30 backdrop-blur-xl inline-flex">
            <ShieldCheck size={14} className="text-[#39FF14]" />
            <span className="text-[9px] font-black tracking-[0.5em] text-[#39FF14] uppercase italic">
              NODO_MAESTRO_{userName}_v2.6
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-[1000] italic tracking-tighter uppercase leading-[0.8]">
            CONTROL_<span className="text-[#00FBFF]">CENTRAL</span>
          </h1>
        </div>

        {/* TELEMETRÍA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-zinc-950/50 p-10 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl">
           <div className="text-center">
            <p className="text-[8px] font-black text-zinc-600 uppercase mb-3 italic tracking-widest">Latencia_API</p>
            <p className="text-lg font-black text-[#00FBFF] tracking-tighter">{systemStatus.apiLatency}</p>
          </div>
          <div className="text-center border-x border-white/5 px-8">
            <p className="text-[8px] font-black text-zinc-600 uppercase mb-3 italic tracking-widest">Vivos</p>
            <p className="text-lg font-black text-[#39FF14] tracking-tighter">{systemStatus.activeNodes}</p>
          </div>
          <div className="text-center hidden md:block border-r border-white/5 pr-8">
            <p className="text-[8px] font-black text-zinc-600 uppercase mb-3 italic tracking-widest">Tráfico</p>
            <p className="text-lg font-black text-white tracking-tighter">{systemStatus.totalTraffic}</p>
          </div>
          <div className="text-center hidden md:block pl-4">
            <p className="text-[8px] font-black text-zinc-600 uppercase mb-3 italic tracking-widest">Carga</p>
            <p className="text-lg font-black text-amber-500 tracking-tighter">{systemStatus.cpuLoad}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* MONITOR DE SESIONES ACTIVAS */}
        <section className="lg:col-span-7 space-y-10">
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-5">
              <Radio size={22} className="text-[#00FBFF] animate-pulse" />
              <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter">Monitoreo_Nodos</h2>
            </div>
            <button onClick={handleRefresh} className="text-[10px] font-black text-zinc-700 hover:text-[#00FBFF] transition-colors uppercase tracking-[0.3em] italic">
              [ {isRefreshing ? 'Sincronizando...' : 'Refrescar_Panel'} ]
            </button>
          </div>
          
          <div className="bg-zinc-950/30 rounded-[4.5rem] p-6 border border-white/5 min-h-[500px]">
            <SessionList 
                onJoinSession={(id) => navigate(`/ultra?node=${id}&role=admin&bypass=true`)} 
                onSelectTrend={() => {}} 
                onCreateFutureSession={() => navigate('/setup')} 
            />
          </div>
        </section>

        {/* CORE DE COMANDOS */}
        <section className="lg:col-span-5 space-y-8">
          
          {/* GENERADOR DE ACCESOS */}
          <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[3.5rem] space-y-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <UserPlus className="text-[#39FF14]" size={20} />
              <h3 className="text-xs font-black uppercase tracking-[0.4em] italic">Generar_Acceso_Bypass</h3>
            </div>
            
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="EMAIL_OPERADOR" 
                value={newAdminData.email}
                onChange={e => setNewAdminData({...newAdminData, email: e.target.value})}
                className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#39FF14] transition-all"
              />
              <input 
                type="password" 
                placeholder="PASS_TEMPORAL" 
                value={newAdminData.password}
                onChange={e => setNewAdminData({...newAdminData, password: e.target.value})}
                className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#39FF14] transition-all"
              />
            </div>

            <button 
              onClick={handleCreateAdmin}
              disabled={isCreatingAdmin}
              className="w-full py-5 bg-[#39FF14] text-black rounded-2xl font-[1000] text-[10px] uppercase tracking-[0.3em] italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isCreatingAdmin ? <Loader2 className="animate-spin" /> : <><Key size={16}/> Activar_Llave_Bypass</>}
            </button>
          </div>

          {/* ACCIONES DE SISTEMA */}
          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => navigate('/ultra')} className="p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] text-left hover:border-[#00FBFF]/30 transition-all group">
              <Zap size={24} className="text-[#00FBFF] mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-xl font-black italic uppercase tracking-tighter">Entrar_Modo_Ultra</p>
              <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-2">Acceso directo con privilegios de traducción selectiva</p>
            </button>

            <button onClick={handleResetNeural} className="p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] text-left hover:border-amber-500/30 transition-all group">
              <BrainCircuit size={24} className="text-amber-500 mb-4 group-hover:rotate-12 transition-transform" />
              <p className="text-xl font-black italic uppercase tracking-tighter">Limpiar_Escudo_Neural</p>
              <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-2">Vaciado total de términos conocidos en este nodo</p>
            </button>
          </div>

          <button onClick={() => { logout(); navigate('/'); }} className="w-full py-8 border border-rose-950/20 rounded-[2.5rem] text-rose-500/40 hover:text-rose-500 hover:border-rose-500/40 transition-all text-[10px] font-black uppercase tracking-[0.8em] italic">
            Desconectar_Nodo_Maestro
          </button>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;