<script lang="ts">
  import { t } from '../stores';
  import StreamsBackground from './StreamsBackground.svelte';
  import IconBrain from './icons/IconBrain.svelte';
  import IconConnect from './icons/IconConnect.svelte';
  import IconAuto from './icons/IconAuto.svelte';

  type DashboardTab = 'automation' | 'crm' | 'ai';

  let activeTab = $state<DashboardTab>('automation');
  let logs = $state<string[]>([]);

  const simulationData: Record<DashboardTab, string[]> = {
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
      "Inicializando Agente Conversacional Gemini...",
      "Chatbot WhatsApp: consulta recibida de cliente",
      "Consultando stock y agenda en vivo vía MCP...",
      "Transmitiendo respuesta por chunks en 0.4s ✓",
      "Turno y lead sincronizados con CRM ✓"
    ]
  };

  function scrollToChatbots() {
    document.getElementById('chatbots')?.scrollIntoView({ behavior: 'smooth' });
  }

  $effect(() => {
    const tab = activeTab;
    let currentIndex = 0;
    logs = [];

    const interval = setInterval(() => {
      if (currentIndex < simulationData[tab].length) {
        const timestamp = new Date().toLocaleTimeString('es-AR', { hour12: false });
        const newLog = `[${timestamp}] ${simulationData[tab][currentIndex]}`;
        logs = [...logs, newLog];
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  });
</script>

<section id="rdd" class="min-h-[100dvh] bg-slate-950 relative overflow-hidden border-t border-slate-900 py-24">
  <div class="absolute inset-0 bg-slate-950">
    <StreamsBackground />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_90%)]"></div>
  </div>

  <div class="container mx-auto px-6 md:px-12 relative z-20 h-full flex items-center">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

      <!-- LEFT: Terminal -->
      <div class="order-2 lg:order-1 flex flex-col gap-6">
        <div class="w-full bg-[#0b1121]/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden flex flex-col h-[500px] animate-slideUp">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-slate-800/50 bg-slate-900/50">
            <div class="flex gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div class="text-xs font-mono text-slate-500">pidgeon-core-v3.0</div>
          </div>

          <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar Menu -->
            <div class="w-16 md:w-48 border-r border-slate-800/50 flex flex-col py-4 bg-slate-900/30">
              <button
                onclick={() => activeTab = 'automation'}
                class="p-3 md:px-6 md:py-3 text-left flex items-center gap-3 transition-all {activeTab === 'automation' ? 'text-cyan-400 bg-cyan-500/10 border-r-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'}"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <span class="hidden md:inline text-xs font-bold uppercase tracking-wider">Auto</span>
              </button>
              <button
                onclick={() => activeTab = 'crm'}
                class="p-3 md:px-6 md:py-3 text-left flex items-center gap-3 transition-all {activeTab === 'crm' ? 'text-emerald-400 bg-emerald-500/10 border-r-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span class="hidden md:inline text-xs font-bold uppercase tracking-wider">CRM</span>
              </button>
              <button
                onclick={() => activeTab = 'ai'}
                class="p-3 md:px-6 md:py-3 text-left flex items-center gap-3 transition-all {activeTab === 'ai' ? 'text-purple-400 bg-purple-500/10 border-r-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span class="hidden md:inline text-xs font-bold uppercase tracking-wider">AI</span>
              </button>
            </div>

            <!-- Log Area -->
            <div class="flex-1 p-6 font-mono text-xs md:text-sm overflow-y-auto">
              <div class="mb-4 text-slate-500">
                // Iniciando secuencia de monitoreo...<br/>
                // Conectado a Gemini AI + MCP<br/>
                // Estado: <span class="text-emerald-500">ONLINE</span>
              </div>
              <div class="space-y-3">
                {#each logs as log}
                  <div class="animate-slideRight border-l-2 border-transparent pl-2 hover:border-slate-700 transition-colors">
                    <span class="text-slate-600 mr-3">{log.substring(0, 10)}</span>
                    <span class="{log.includes('✓') ? 'text-emerald-400' : log.includes('Alerta') ? 'text-yellow-400' : 'text-cyan-300'}">
                      {log.substring(11)}
                    </span>
                  </div>
                {/each}
                <div class="animate-blink-cursor text-emerald-500 font-bold mt-2">_</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center px-4">
          <p class="text-xs text-slate-500 uppercase tracking-widest">Panel de Control Unificado</p>
          <div class="flex gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          </div>
        </div>
      </div>

      <!-- RIGHT: Technology -->
      <div class="order-1 lg:order-2 text-left">
        <div class="mb-10">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Tecnología que te <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">potencia</span>.
          </h2>
          <p class="text-slate-400 text-lg leading-relaxed">
            {$t.education.subtitle} No vendemos "humo". Construimos sobre los tres pilares fundamentales de la infraestructura digital moderna.
          </p>
        </div>

        <div class="space-y-8">
          <!-- LLM -->
          <div class="flex gap-6 group">
            <div class="shrink-0 w-16 h-16">
              <IconBrain class="w-full h-full drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-transform group-hover:scale-110 duration-500" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{$t.education.llm.title}</h3>
              <p class="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-4 group-hover:border-purple-500/50 transition-colors">
                {$t.education.llm.desc}
              </p>
            </div>
          </div>

          <!-- MCP -->
          <div class="flex gap-6 group">
            <div class="shrink-0 w-16 h-16">
              <IconConnect class="w-full h-full drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-transform group-hover:scale-110 duration-500" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{$t.education.mcp.title}</h3>
              <p class="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-4 group-hover:border-emerald-500/50 transition-colors">
                {$t.education.mcp.desc}
              </p>
            </div>
          </div>

          <!-- Automation -->
          <div class="flex gap-6 group">
            <div class="shrink-0 w-16 h-16">
              <IconAuto class="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform group-hover:scale-110 duration-500" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{$t.education.auto.title}</h3>
              <p class="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-4 group-hover:border-cyan-500/50 transition-colors">
                {$t.education.auto.desc}
              </p>
            </div>
          </div>

          <!-- AI Chatbots Highlight -->
          <div class="mt-8 pt-8 border-t border-slate-800/50">
            <div class="flex items-center justify-between gap-4 mb-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                  {$t.rddChatbotHighlight.badge}
                </span>
              </div>
              <button
                onclick={scrollToChatbots}
                class="text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                {$t.rddChatbotHighlight.cta}
              </button>
            </div>
            <h4 class="text-white font-bold text-lg">{$t.rddChatbotHighlight.title}</h4>
            <p class="text-xs text-slate-400 mt-1 leading-relaxed">
              {$t.rddChatbotHighlight.desc}
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<style>
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  :global(.animate-slideRight) { animation: slideRight 0.3s ease-out forwards; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  :global(.animate-slideUp) { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  @keyframes blinkCursor { 50% { opacity: 0; } }
  :global(.animate-blink-cursor) { animation: blinkCursor 1s step-end infinite; }
</style>
