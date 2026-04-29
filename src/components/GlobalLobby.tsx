/**
 * 🛰️ MENCIONAL | GLOBAL_LOBBY v2026.12
 * Sincronización Realtime con validación de pago y selección de temas.
 * Optimizado para pantallas OLED y arquitectura de Nodos (Individual/Dúo/Trío).
 * Ubicación: /src/components/GlobalLobby.tsx
 * ✅ NOTA: Los servicios AI vinculados en pasos posteriores residen en /src/services/ai/
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebaseConfig';
import { ref, onValue, update, push, serverTimestamp } from "firebase/database";
import { Users, Globe, Zap, Clock, Loader2, Plus, Flame, X } from 'lucide-center';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalLobby: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const navigate = useNavigate();

  // Colores de identidad MENCIONAL (OLED Optimized)
  const officialColors = [
    '#00FBFF', '#39FF14', '#FF007A', '#ADFF2F', '#FFA500', 
    '#8A2BE2', '#FF4500', '#00FF7F', '#1E90FF', '#FFD700'
  ];

  const trendTopics = ['Cafetería', 'Startup_Pitch', 'Networking', 'Aduanas', 'Deep_Talk'];

  useEffect(() => {
    const sessionsRef = ref(db, 'sessions');
    
    const unsubscribe = onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const activeList = Object.entries(data)
          .map(([id, val]: any) => ({ id, ...val }))
          .filter(s => s.status === 'waiting' && (s.participants?.length || 0) < 3)
          .sort((a, b) => b.timestamp - a.timestamp);
        
        setSessions(activeList);
      } else {
        setSessions([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateSession = async (topic: string) => {
    if (!topic.trim()) return;
    
    const sessionData = {
      theme: topic.trim().toUpperCase(),
      status: 'waiting',
      timestamp: serverTimestamp(),
      duration: 20, // Bloques de 20 min ($20 MXN)
      participants: []
    };

    try {
      const newSessionRef = push(ref(db, 'sessions'));
      await update(newSessionRef, sessionData);
      setShowCreateModal(false);
      setNewTopic('');
    } catch (error) {
      console.error("Master_Node_Error:", error);
    }
  };

  const handleJoin = async (session: any) => {
    const currentParticipants = session.participants || [];

    if (currentParticipants.length >= 3) {
      alert("NODO_FULL: Intenta con otra frecuencia.");
      return;
    }

    const usedColors = currentParticipants.map((p: any) => p.color);
    const availableColor = officialColors.find(c => !usedColors.includes(c)) || '#FFFFFF';

    const newParticipant = {
      id: `node_${Math.random().toString(36).substr(2, 6)}`,
      color: availableColor,
      joinedAt: Date.now()
    };

    const updatedParticipants = [...currentParticipants, newParticipant];

    try {
      await update(ref(db, `sessions/${session.id}`), {
        participants: updatedParticipants,
        status: updatedParticipants.length === 3 ? 'active' : 'waiting'
      });

      // Persistencia de sesión para los servicios en /src/services/ai/
      sessionStorage.setItem('active_session_id', session.id);
      sessionStorage.setItem('user_color', availableColor);
      sessionStorage.setItem('session_theme', session.theme);
      
      // Salto al setup de aprendizaje (Neural Link)
      navigate(`/setup/learning`); 
    } catch (error) {
      console.error("Link_Sync_Error:", error);
    }
  };

  if (loading) return (
    <div className="h-[400px] flex flex-col items-center justify-center italic">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="mb-8"
      >
        <Zap className="w-10 h-10 text-[#00FBFF] drop-shadow-[0_0_15px_#00FBFF]" />
      </motion.div>
      <span className="text-[10px] font-[1000] tracking-[0.6em] text-zinc-600 uppercase animate-pulse">
        Sincronizando_Frecuencias...
      </span>
    </div>
  );

  return (
    <div className="w-full space-y-16 italic">
      {/* ⚡ TRENDING NODES */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 px-2">
          <Flame size={18} className="text-[#FF007A] animate-pulse" />
          <h2 className="text-[11px] font-[1000] uppercase tracking-[0.4em] text-zinc-500">
            Frecuencias_Populares
          </h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {trendTopics.map((topic, i) => (
            <motion.button
              key={topic}
              whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCreateSession(topic)}
              className="px-8 py-3 rounded-full border border-white/[0.03] bg-zinc-950 text-[10px] font-black uppercase tracking-widest transition-all"
              style={{ color: officialColors[i % 10], boxShadow: `0 0 20px ${officialColors[i % 10]}05` }}
            >
              #{topic}
            </motion.button>
          ))}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-3 rounded-full border-2 border-[#00FBFF]/20 bg-[#00FBFF]/5 text-[#00FBFF] text-[10px] font-[1000] uppercase flex items-center gap-3"
          >
            <Plus size={14} strokeWidth={3} /> Nuevo_Nodo
          </motion.button>
        </div>
      </section>

      {/* 🌐 ACTIVE LOBBY */}
      <section className="space-y-8">
        <div className="flex justify-between items-end px-2 border-b border-white/[0.05] pb-6">
          <div className="flex items-center gap-4">
            <Globe size={22} className="text-[#39FF14]" />
            <h2 className="text-2xl font-[1000] uppercase tracking-tighter text-white">
              Nodos_Disponibles
            </h2>
          </div>
          <span className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.3em]">
            {sessions.length} Señales_En_Espera
          </span>
        </div>

        <div className="grid gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
          <AnimatePresence mode='popLayout'>
            {sessions.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-white/[0.02] rounded-[3rem] py-24 text-center bg-[#020202]"
              >
                <p className="text-zinc-800 text-[11px] font-[1000] uppercase tracking-[1em]">
                  No_Hay_Señal
                </p>
              </motion.div>
            ) : (
              sessions.map((session, i) => (
                <motion.div 
                  key={session.id} 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#050505] border border-white/[0.04] p-8 rounded-[3rem] flex items-center justify-between group hover:border-white/10 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-[1000] uppercase tracking-tighter leading-none" style={{ color: officialColors[i % 10] }}>
                      #{session.theme}
                    </h3>
                    <div className="flex gap-6 items-center">
                      <span className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        <Users size={16} className="text-zinc-700" /> {session.participants?.length || 0} / 3
                      </span>
                      <div className="h-1.5 w-1.5 bg-zinc-900 rounded-full" />
                      <span className="flex items-center gap-3 text-[10px] font-black text-[#00FBFF] uppercase tracking-widest">
                        <Clock size={16} className="opacity-50" /> 20:00
                      </span>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF', color: '#000000' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleJoin(session)}
                    className="bg-zinc-900 text-white px-12 py-5 rounded-[2rem] font-[1000] text-[12px] uppercase tracking-widest transition-all border border-white/5"
                  >
                    Vincular
                  </motion.button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* MODAL_CREATE (CandyGlass) */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#020202] border border-white/10 p-12 rounded-[4rem] w-full max-w-lg relative shadow-[0_0_150px_rgba(0,251,255,0.05)]"
            >
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-10 right-10 text-zinc-700 hover:text-white p-2"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-3xl font-[1000] uppercase text-white mb-3 tracking-tighter">Setup_Nodo</h3>
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] mb-12 font-black">Asigna un tópico de inmersión</p>
              
              <input 
                autoFocus
                className="w-full bg-zinc-950 border-2 border-white/[0.03] p-7 rounded-[2rem] text-white font-[1000] mb-10 focus:border-[#00FBFF] outline-none transition-all placeholder:text-zinc-800 uppercase text-xl tracking-tighter"
                placeholder="EJ. INTELIGENCIA_ARTIFICIAL"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateSession(newTopic)}
              />
              
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: '#00FBFF', color: '#000' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCreateSession(newTopic)}
                className="w-full bg-white text-black py-7 rounded-[2rem] font-[1000] uppercase text-[13px] tracking-[0.3em] shadow-2xl transition-all"
              >
                Lanzar_Frecuencia
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #111; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};