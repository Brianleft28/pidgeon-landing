
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../App';
import { VeoBackground } from './VeoBackground';
import { IconBrain, IconConnect, IconAuto, IconVideo } from './GlassIcons';

type DashboardTab = 'automation' | 'crm' | 'ai';

export const RDDSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<DashboardTab>('automation');
  const [logs, setLogs] = useState<string[]>([]);

  // Simulation Data
  const simulationData = {
    automation: [
      "Sincronizando Stock con Proveedores...",
      "Analizando emails entrantes (32 nuevos)...",
      "Factura #402 Generada automáticamente",
      "Alerta de Stock bajo: Item #992 -> Pedido creado",
      "Enviado a Cliente por WhatsApp ✓"
    ],
    crm: [
      "Nuevo Lead detectado: Juan Pérez",
      "Scoring automático: Alta Probabilidad (85%)",
      "Asignando a vendedor: Carlos M.",
      "Programando seguimiento para: Mañana 10:00 AM",
      "Actualizando base de datos de clientes..."
    ],
    ai: [
      "Inicializando Gemini 3 Pro Context...",
      "Generando video marketing con Veo...",
      "Optimizando assets con Nano...",
      "Generando reporte de estrategia...",
      "Respuesta optimizada generada en 0.4s"
    ]
  };

  useEffect(() => {
    let currentIndex = 0;
    setLogs([]);
    
    const interval = setInterval(() => {
      if (currentIndex < simulationData[activeTab].length) {
        const timestamp = new Date().toLocaleTimeString('es-AR', { hour12: false });
        const newLog = `[${timestamp}] ${simulationData[activeTab][currentIndex]}`;
        setLogs(prev => [...prev, newLog]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <section id="rdd" className="min-h-[100dvh] bg-slate-950 relative overflow-hidden border-t border-slate-900 py-24">
      
      {/* 1. Cinematic Background (Veo Art Direction) */}
      <div className="absolute inset-0 bg-slate-950">
          <VeoBackground />
          {/* Vignette Overlay for focus */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_90%)]"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-20 h-full flex items-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            
            {/* --- LEFT COLUMN: Digital Command (Terminal) --- */}
            <div className="order-2 lg:order-1 flex flex-col gap-6">
                
                {/* Terminal Window */}
                <div className="w-full bg-[#0b1121]/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden flex flex-col h-[500px] animate-slideUp">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-800/50 bg-slate-900/50">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="text-xs font-mono text-slate-500">pidgeon-core-v3.0</div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar Menu */}
                        <div className="w-16 md:w-48 border-r border-slate-800/50 flex flex-col py-4 bg-slate-900/30">
                             <button 
                                onClick={() => setActiveTab('automation')}
                                className={`p-3 md:px-6 md:py-3 text-left flex items-center gap-3 transition-all ${activeTab === 'automation' ? 'text-cyan-400 bg-cyan-500/10 border-r-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Auto</span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('crm')}
                                className={`p-3 md:px-6 md:py-3 text-left flex items-center gap-3 transition-all ${activeTab === 'crm' ? 'text-emerald-400 bg-emerald-500/10 border-r-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">CRM</span>
                            </button>
                             <button 
                                onClick={() => setActiveTab('ai')}
                                className={`p-3 md:px-6 md:py-3 text-left flex items-center gap-3 transition-all ${activeTab === 'ai' ? 'text-purple-400 bg-purple-500/10 border-r-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">AI</span>
                            </button>
                        </div>

                        {/* Log Area */}
                        <div className="flex-1 p-6 font-mono text-xs md:text-sm overflow-y-auto">
                            <div className="mb-4 text-slate-500">
                                // Iniciando secuencia de monitoreo...<br/>
                                // Conectado a Gemini 3 Pro Preview<br/>
                                // Estado: <span className="text-emerald-500">ONLINE</span>
                            </div>
                            <div className="space-y-3">
                                {logs.map((log, i) => (
                                    <div key={i} className="animate-slideRight border-l-2 border-transparent pl-2 hover:border-slate-700 transition-colors">
                                        <span className="text-slate-600 mr-3">{log.substring(0, 10)}</span>
                                        <span className={log.includes("✓") ? "text-emerald-400" : log.includes("Alerta") ? "text-yellow-400" : "text-cyan-300"}>
                                            {log.substring(11)}
                                        </span>
                                    </div>
                                ))}
                                <div className="animate-blink text-emerald-500 font-bold mt-2">_</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center px-4">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Panel de Control Unificado</p>
                    <div className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                    </div>
                </div>
            </div>


            {/* --- RIGHT COLUMN: Technology Explained (Nano/Veo/LLM) --- */}
            <div className="order-1 lg:order-2 text-left">
                <div className="mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Tecnología que te <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">potencia</span>.
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        {t.education.subtitle} No vendemos "humo". Construimos sobre los tres pilares fundamentales de la infraestructura digital moderna.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Item 1: LLM */}
                    <div className="flex gap-6 group">
                        <div className="shrink-0 w-16 h-16">
                            <IconBrain className="w-full h-full drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-transform group-hover:scale-110 duration-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{t.education.llm.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-4 group-hover:border-purple-500/50 transition-colors">
                                {t.education.llm.desc}
                            </p>
                        </div>
                    </div>

                     {/* Item 2: MCP */}
                     <div className="flex gap-6 group">
                        <div className="shrink-0 w-16 h-16">
                            <IconConnect className="w-full h-full drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-transform group-hover:scale-110 duration-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{t.education.mcp.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-4 group-hover:border-emerald-500/50 transition-colors">
                                {t.education.mcp.desc}
                            </p>
                        </div>
                    </div>

                     {/* Item 3: Automation */}
                     <div className="flex gap-6 group">
                        <div className="shrink-0 w-16 h-16">
                            <IconAuto className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform group-hover:scale-110 duration-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{t.education.auto.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-4 group-hover:border-cyan-500/50 transition-colors">
                                {t.education.auto.desc}
                            </p>
                        </div>
                    </div>

                    {/* New Video Section (Veo) */}
                    <div className="mt-8 pt-8 border-t border-slate-800/50">
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-8 h-8">
                                <IconVideo className="w-full h-full" />
                             </div>
                             <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Nuevo</span>
                        </div>
                        <h4 className="text-white font-bold text-lg">Generación de Video (Veo)</h4>
                        <p className="text-xs text-slate-500 mt-1">
                            Creamos assets visuales dinámicos para tu marca utilizando el modelo Veo. Desde fondos animados hasta contenido para redes sociales.
                        </p>
                    </div>

                </div>
            </div>

        </div>

      </div>
      <style>{`
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideRight { animation: slideRight 0.3s ease-out forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </section>
  );
};
