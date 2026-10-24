<script lang="ts">
  type SettingItem = {
    key: string;
    value: string;
    category: string;
    label: string;
    description: string;
  };

  type AiConfigData = {
    displayName: string;
    systemPrompt: string;
    plansDirective: string;
    finalDirectivesEs: string;
    finalDirectivesEn: string;
    temperature: number;
    primaryModel: string;
    fallbackModels: string;
  };

  type MemoryItem = {
    slug: string;
    title: string;
    content: string;
    keywords: string[];
    priority: number;
    active: boolean;
  };

  type ShadowbanItem = {
    ip: string;
    reason: string;
    fakeReplyEs: string;
    fakeReplyEn: string;
    createdAt: string;
  };

  type AdminUserItem = {
    id: number;
    username: string;
    displayName: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: string;
  };

  type ClientLeadItem = {
    id: number;
    name: string;
    company: string;
    email: string;
    phone: string;
    plan: string;
    status: string;
    notes: string;
    source: string;
    createdAt: string;
  };

  let {
    isOpen = false,
    apiUrl = '',
    adminToken = '',
    onClose = () => {},
    onLogout = () => {},
  }: {
    isOpen: boolean;
    apiUrl: string;
    adminToken: string;
    onClose: () => void;
    onLogout: () => void;
  } = $props();

  type TabId = 'memories' | 'ai' | 'settings' | 'shadowban' | 'roadmap';
  let activeTab = $state<TabId>('memories');
  let loading = $state(false);
  let saving = $state(false);
  let feedbackMsg = $state('');
  let feedbackType = $state<'ok' | 'err'>('ok');

  let currentUser = $state<AdminUserItem | null>(null);
  let currentIp = $state('');
  let settings = $state<SettingItem[]>([]);
  let aiConfig = $state<AiConfigData>({
    displayName: 'Pidgeon Assistant',
    systemPrompt: '',
    plansDirective: '',
    finalDirectivesEs: '',
    finalDirectivesEn: '',
    temperature: 0.35,
    primaryModel: 'gemini-2.5-flash-lite',
    fallbackModels: 'gemini-3.1-flash-lite,gemini-3.5-flash-lite,gemini-2.5-flash',
  });
  let memories = $state<MemoryItem[]>([]);
  let shadowbans = $state<ShadowbanItem[]>([]);
  let users = $state<AdminUserItem[]>([]);
  let clients = $state<ClientLeadItem[]>([]);

  // Memory editor state
  let selectedSlug = $state<string>('planes');
  let isNewMemory = $state(false);
  let memSlug = $state('');
  let memTitle = $state('');
  let memPriority = $state(50);
  let memActive = $state(true);
  let memKeywordsStr = $state('');
  let memContent = $state('');

  // Shadowban form state
  let sbIp = $state('');
  let sbReason = $state('Spam / uso abusivo de cuota');
  let sbFakeEs = $state(
    'Gracias por tu consulta. En este momento nuestros especialistas están revisando tu solicitud; podés dejarnos tus datos en el formulario de contacto.'
  );
  let sbFakeEn = $state(
    'Thank you for your inquiry. Our specialists are currently reviewing requests; please leave your details in the contact form.'
  );

  function showToast(msg: string, type: 'ok' | 'err' = 'ok') {
    feedbackMsg = msg;
    feedbackType = type;
    setTimeout(() => {
      if (feedbackMsg === msg) feedbackMsg = '';
    }, 3500);
  }

  function authHeaders(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (adminToken) {
      h['X-Admin-Token'] = adminToken;
      h['Authorization'] = `Bearer ${adminToken}`;
    }
    return h;
  }

  async function loadBackofficeState() {
    loading = true;
    try {
      const res = await fetch(`${apiUrl}/admin/state`, {
        method: 'GET',
        headers: authHeaders(),
        credentials: 'include',
      });
      if (!res.ok) {
        if (res.status === 401) {
          onLogout();
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      currentUser = data.user || null;
      currentIp = data.currentIp || '';
      settings = data.settings || [];
      if (data.aiConfig) aiConfig = data.aiConfig;
      memories = data.memories || [];
      shadowbans = data.shadowbans || [];
      users = data.users || [];
      clients = data.clients || [];

      if (memories.length > 0 && !isNewMemory) {
        const found = memories.find((m) => m.slug === selectedSlug) || memories[0];
        selectMemory(found);
      }
    } catch (err) {
      console.error('Error loading backoffice state:', err);
      showToast('No se pudo cargar el estado del Backoffice', 'err');
    } finally {
      loading = false;
    }
  }

  function selectMemory(m: MemoryItem) {
    isNewMemory = false;
    selectedSlug = m.slug;
    memSlug = m.slug;
    memTitle = m.title;
    memPriority = m.priority ?? 50;
    memActive = m.active !== false;
    memKeywordsStr = (m.keywords || []).join(', ');
    memContent = m.content;
  }

  function startNewMemory() {
    isNewMemory = true;
    selectedSlug = '';
    memSlug = '';
    memTitle = '';
    memPriority = 60;
    memActive = true;
    memKeywordsStr = '';
    memContent = '## Nuevo Bloque de Conocimiento\n\n• Detalle 1...\n• Detalle 2...';
  }

  async function saveMemory() {
    if (!memSlug.trim() || !memTitle.trim() || !memContent.trim()) {
      showToast('Completá slug, título y contenido', 'err');
      return;
    }
    saving = true;
    try {
      const payload = {
        slug: memSlug.trim(),
        title: memTitle.trim(),
        priority: Number(memPriority) || 50,
        active: memActive,
        keywords: memKeywordsStr
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
        content: memContent,
      };
      const res = await fetch(`${apiUrl}/admin/memories`, {
        method: 'POST',
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error guardando memoria');
      const data = await res.json();
      memories = data.memories || [];
      const saved = memories.find((m) => m.slug === payload.slug) || memories[0];
      if (saved) selectMemory(saved);
      showToast('Memoria RAG guardada y activa en el chatbot');
    } catch {
      showToast('Error al guardar la memoria', 'err');
    } finally {
      saving = false;
    }
  }

  async function deleteSelectedMemory() {
    if (!memSlug || memSlug === 'base') return;
    saving = true;
    try {
      const res = await fetch(`${apiUrl}/admin/memories/${encodeURIComponent(memSlug)}`, {
        method: 'DELETE',
        headers: authHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error eliminando memoria');
      const data = await res.json();
      memories = data.memories || [];
      if (memories.length > 0) selectMemory(memories[0]);
      showToast('Memoria eliminada');
    } catch {
      showToast('No se pudo eliminar la memoria', 'err');
    } finally {
      saving = false;
    }
  }

  async function saveAiConfig() {
    saving = true;
    try {
      const res = await fetch(`${apiUrl}/admin/ai-config`, {
        method: 'PUT',
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify(aiConfig),
      });
      if (!res.ok) throw new Error('Error guardando IA');
      const data = await res.json();
      if (data.aiConfig) aiConfig = data.aiConfig;
      showToast('Personalidad, directivas y modelos actualizados en vivo');
    } catch {
      showToast('Error al guardar la configuración IA', 'err');
    } finally {
      saving = false;
    }
  }

  async function saveSettings() {
    saving = true;
    try {
      const res = await fetch(`${apiUrl}/admin/settings`, {
        method: 'PUT',
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          items: settings.map((s) => ({ key: s.key, value: s.value })),
        }),
      });
      if (!res.ok) throw new Error('Error guardando settings');
      const data = await res.json();
      settings = data.settings || settings;
      showToast('Placeholders y precios actualizados en caliente');
    } catch {
      showToast('Error al guardar los parámetros', 'err');
    } finally {
      saving = false;
    }
  }

  async function addShadowban(e: SubmitEvent) {
    e.preventDefault();
    if (!sbIp.trim()) return;
    saving = true;
    try {
      const res = await fetch(`${apiUrl}/admin/shadowbans`, {
        method: 'POST',
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          ip: sbIp.trim(),
          reason: sbReason.trim(),
          fakeReplyEs: sbFakeEs.trim(),
          fakeReplyEn: sbFakeEn.trim(),
        }),
      });
      if (!res.ok) throw new Error('Error creando shadowban');
      const data = await res.json();
      shadowbans = data.shadowbans || [];
      sbIp = '';
      showToast('IP agregada a Shadowban (no consumirá cuota de Gemini)');
    } catch {
      showToast('Error al aplicar Shadowban', 'err');
    } finally {
      saving = false;
    }
  }

  async function removeShadowban(ip: string) {
    saving = true;
    try {
      const res = await fetch(`${apiUrl}/admin/shadowbans/${encodeURIComponent(ip)}`, {
        method: 'DELETE',
        headers: authHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error quitando shadowban');
      const data = await res.json();
      shadowbans = data.shadowbans || [];
      showToast(`Shadowban removido para ${ip}`);
    } catch {
      showToast('No se pudo quitar el Shadowban', 'err');
    } finally {
      saving = false;
    }
  }

  $effect(() => {
    if (isOpen) {
      loadBackofficeState();
    }
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 z-[90] bg-slate-950/90 backdrop-blur-xl flex flex-col text-slate-200 animate-fadeIn">
    <!-- Top Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-slate-900/90 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20">
          PS
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold text-white tracking-tight">
              Pidgeon Shadow Backoffice
            </h2>
            <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {currentUser?.role || 'SUPERADMIN'}
            </span>
          </div>
          <p class="text-xs text-slate-400 font-mono">
            Sesión: <strong class="text-slate-200">{currentUser?.username || 'brianleft'}</strong> · IP actual: {currentIp || '—'} · SQLite RAG activo
          </p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
        <button
          type="button"
          onclick={() => (activeTab = 'memories')}
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {activeTab === 'memories' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}"
        >
          🧠 Memorias RAG ({memories.length})
        </button>
        <button
          type="button"
          onclick={() => (activeTab = 'ai')}
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {activeTab === 'ai' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}"
        >
          🤖 Personalidad & Modelos
        </button>
        <button
          type="button"
          onclick={() => (activeTab = 'settings')}
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {activeTab === 'settings' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}"
        >
          💲 Placeholders & Precios
        </button>
        <button
          type="button"
          onclick={() => (activeTab = 'shadowban')}
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {activeTab === 'shadowban' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}"
        >
          🛡️ Shadowban ({shadowbans.length})
        </button>
        <button
          type="button"
          onclick={() => (activeTab = 'roadmap')}
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {activeTab === 'roadmap' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-white'}"
        >
          🗺️ Planroad & Clientes
        </button>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick={onLogout}
          class="px-3 py-1.5 rounded-lg text-xs font-mono text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all cursor-pointer"
        >
          Cerrar sesión
        </button>
        <button
          type="button"
          onclick={onClose}
          class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
        >
          ✕ Volver al sitio
        </button>
      </div>
    </div>

    <!-- Feedback Toast -->
    {#if feedbackMsg}
      <div class="px-6 py-2.5 text-xs font-mono flex items-center justify-between {feedbackType === 'ok' ? 'bg-emerald-500/15 text-emerald-300 border-b border-emerald-500/30' : 'bg-red-500/15 text-red-300 border-b border-red-500/30'}">
        <span>{feedbackType === 'ok' ? '✓' : '⚠'} {feedbackMsg}</span>
        <button type="button" onclick={() => (feedbackMsg = '')} class="opacity-70 hover:opacity-100">✕</button>
      </div>
    {/if}

    <!-- Body -->
    <div class="flex-1 overflow-y-auto p-6">
      {#if loading}
        <div class="h-full flex items-center justify-center text-sm font-mono text-slate-400">
          Cargando estado de Pidgeon Shadow Backoffice...
        </div>
      {:else if activeTab === 'memories'}
        <!-- TAB 1: MEMORIAS RAG -->
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left List -->
          <div class="lg:col-span-4 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Bloques de Conocimiento
              </h3>
              <button
                type="button"
                onclick={startNewMemory}
                class="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer"
              >
                + Nueva Memoria
              </button>
            </div>

            <div class="space-y-2">
              {#each memories as m (m.slug)}
                <button
                  type="button"
                  onclick={() => selectMemory(m)}
                  class="w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer {!isNewMemory && selectedSlug === m.slug ? 'bg-emerald-500/10 border-emerald-500/50 text-white' : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'}"
                >
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="font-mono text-xs font-bold text-emerald-400">
                      {m.slug}
                    </span>
                    <div class="flex items-center gap-1.5">
                      <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        P:{m.priority}
                      </span>
                      <span class="w-2 h-2 rounded-full {m.active ? 'bg-emerald-400' : 'bg-slate-600'}"></span>
                    </div>
                  </div>
                  <p class="text-xs font-medium text-slate-200 line-clamp-1">
                    {m.title}
                  </p>
                  <p class="text-[11px] text-slate-500 mt-1 line-clamp-1 font-mono">
                    {m.keywords?.slice(0, 5).join(', ')}
                  </p>
                </button>
              {/each}
            </div>
          </div>

          <!-- Right Editor -->
          <div class="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 class="text-base font-bold text-white">
                  {isNewMemory ? 'Crear Nueva Memoria RAG' : `Editando memoria: ${memSlug}`}
                </h3>
                <p class="text-xs text-slate-400">
                  Podés usar placeholders dinámicos como <code class="text-emerald-400">{'{{plan_emprendedor_mo}}'}</code>, <code class="text-emerald-400">{'{{plan_pyme_mo}}'}</code>, <code class="text-emerald-400">{'{{offer_discount}}'}</code> o <code class="text-emerald-400">{'{{whatsapp_number}}'}</code>.
                </p>
              </div>
              <div class="flex items-center gap-2">
                {#if !isNewMemory && memSlug !== 'base'}
                  <button
                    type="button"
                    disabled={saving}
                    onclick={deleteSelectedMemory}
                    class="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold cursor-pointer"
                  >
                    Eliminar
                  </button>
                {/if}
                <button
                  type="button"
                  disabled={saving}
                  onclick={saveMemory}
                  class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Memoria'}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div class="md:col-span-4">
                <label class="block text-xs font-mono text-slate-400 mb-1">
                  Slug identificador
                  <input
                    type="text"
                    bind:value={memSlug}
                    disabled={!isNewMemory}
                    placeholder="ej. casos-exito"
                    class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono disabled:opacity-60"
                  />
                </label>
              </div>
              <div class="md:col-span-5">
                <label class="block text-xs font-mono text-slate-400 mb-1">
                  Título descriptivo
                  <input
                    type="text"
                    bind:value={memTitle}
                    placeholder="Título del bloque de conocimiento"
                    class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </label>
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-mono text-slate-400 mb-1">
                  Prioridad
                  <input
                    type="number"
                    bind:value={memPriority}
                    class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </label>
              </div>
              <div class="md:col-span-1 flex items-end pb-2">
                <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" bind:checked={memActive} class="accent-emerald-500" />
                  Activa
                </label>
              </div>
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Keywords de activación (separadas por coma)
                <input
                  type="text"
                  bind:value={memKeywordsStr}
                  placeholder="plan, planes, precio, cuanto sale, emprendedor..."
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono"
                />
              </label>
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Contenido Markdown (inyectado al contexto de Gemini cuando matchea un keyword)
                <textarea
                  rows="15"
                  bind:value={memContent}
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono leading-relaxed"
                ></textarea>
              </label>
            </div>
          </div>
        </div>

      {:else if activeTab === 'ai'}
        <!-- TAB 2: PERSONALIDAD & MODELOS IA -->
        <div class="max-w-5xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 class="text-base font-bold text-white">
                Personalidad del Chatbot, Directivas Finales y Cadena de Modelos
              </h3>
              <p class="text-xs text-slate-400">
                Misma arquitectura que <code class="text-emerald-400">brianleft-portfolio</code>: las directivas finales se inyectan después de la pregunta del visitante para garantizar voseo y formato.
              </p>
            </div>
            <button
              type="button"
              disabled={saving}
              onclick={saveAiConfig}
              class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Configuración IA'}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Nombre del Asistente
                <input
                  type="text"
                  bind:value={aiConfig.displayName}
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </label>
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Temperatura ({aiConfig.temperature})
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  bind:value={aiConfig.temperature}
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </label>
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Modelo Primario Gemini
                <input
                  type="text"
                  bind:value={aiConfig.primaryModel}
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono"
                />
              </label>
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Modelos Fallback (coma)
                <input
                  type="text"
                  bind:value={aiConfig.fallbackModels}
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-400 font-mono"
                />
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">
              System Prompt Principal (Identidad, Reglas y Formato)
              <textarea
                rows="8"
                bind:value={aiConfig.systemPrompt}
                class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
              ></textarea>
            </label>
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">
              Directiva Especial cuando preguntan por Planes / Precios
              <textarea
                rows="5"
                bind:value={aiConfig.plansDirective}
                class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
              ></textarea>
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Directivas Finales Post-Pregunta (Español · Voseo)
                <textarea
                  rows="5"
                  bind:value={aiConfig.finalDirectivesEs}
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
                ></textarea>
              </label>
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Directivas Finales Post-Pregunta (Inglés)
                <textarea
                  rows="5"
                  bind:value={aiConfig.finalDirectivesEn}
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
                ></textarea>
              </label>
            </div>
          </div>
        </div>

      {:else if activeTab === 'settings'}
        <!-- TAB 3: PLACEHOLDERS & PRECIOS -->
        <div class="max-w-4xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 class="text-base font-bold text-white">
                Parámetros Comerciales & Placeholders Dinámicos
              </h3>
              <p class="text-xs text-slate-400">
                Al cambiar un valor acá, se actualiza instantáneamente en todas las memorias RAG que usen <code class="text-emerald-400">{'{{clave}}'}</code> sin tocar código.
              </p>
            </div>
            <button
              type="button"
              disabled={saving}
              onclick={saveSettings}
              class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Parámetros'}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each settings as item (item.key)}
              <div class="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <span class="text-xs font-bold text-white">{item.label}</span>
                  <code class="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {`{{${item.key}}}`}
                  </code>
                </div>
                <p class="text-[11px] text-slate-500 mb-2.5">{item.description}</p>
                <input
                  type="text"
                  bind:value={item.value}
                  class="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 outline-none"
                />
              </div>
            {/each}
          </div>
        </div>

      {:else if activeTab === 'shadowban'}
        <!-- TAB 4: SHADOWBAN & SEGURIDAD -->
        <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onsubmit={addShadowban} class="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">
              🛡️ Aplicar Shadowban a una IP
            </h3>
            <p class="text-xs text-slate-400">
              Una IP en modo <strong>Shadowban</strong> sigue viendo el chat escribir por chunks con normalidad, pero recibe la respuesta señuelo sin llamar a Gemini ni gastar tokens.
            </p>

            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Dirección IP a bloquear (tu IP actual es <span class="text-emerald-400">{currentIp}</span>)
                <input
                  type="text"
                  bind:value={sbIp}
                  placeholder="ej. 190.18.42.11"
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </label>
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Motivo interno
                <input
                  type="text"
                  bind:value={sbReason}
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </label>
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Respuesta Señuelo (ES)
                <textarea
                  rows="3"
                  bind:value={sbFakeEs}
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                ></textarea>
              </label>
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">
                Respuesta Señuelo (EN)
                <textarea
                  rows="3"
                  bind:value={sbFakeEn}
                  class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                ></textarea>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving || !sbIp.trim()}
              class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-40"
            >
              Activar Shadowban
            </button>
          </form>

          <div class="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">
              IPs actualmente en Shadowban ({shadowbans.length})
            </h3>

            {#if shadowbans.length === 0}
              <div class="p-8 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No hay ninguna IP en Shadowban actualmente.
              </div>
            {:else}
              <div class="space-y-3">
                {#each shadowbans as sb (sb.ip)}
                  <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-mono text-xs font-bold text-amber-400">{sb.ip}</span>
                        <span class="text-[11px] text-slate-400">· {sb.reason}</span>
                      </div>
                      <p class="text-xs text-slate-500 mt-1 line-clamp-2">
                        "{sb.fakeReplyEs}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onclick={() => removeShadowban(sb.ip)}
                      class="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono shrink-0 cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>

      {:else if activeTab === 'roadmap'}
        <!-- TAB 5: PLANROAD & PREVIEW ETAPA 3 (CLIENTES Y ROLES) -->
        <div class="max-w-6xl mx-auto space-y-6">
          <!-- Roadmap Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">
                Etapa 1 · Completada
              </span>
              <h4 class="text-sm font-bold text-white mt-2">Landing + Carrusel IA + Mini-RAG</h4>
              <p class="text-xs text-slate-400 mt-1">
                Redis propio, fix 502, carrusel con GovTech al final (04/04), streaming por chunks y Thomas Pineda en el equipo.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">
                Etapa 2 · Activa Hoy
              </span>
              <h4 class="text-sm font-bold text-white mt-2">Backoffice Oculto & Shadow Word</h4>
              <p class="text-xs text-slate-400 mt-1">
                Login enmascarado vía <code class="text-emerald-300">/shadow</code> en el chat, edición en caliente de Memorias RAG, Prompts, Placeholders y Shadowban.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-bold">
                Etapa 3 · Base Creada
              </span>
              <h4 class="text-sm font-bold text-white mt-2">Catálogo de Clientes & Roles RBAC</h4>
              <p class="text-xs text-slate-400 mt-1">
                Tablas <code class="text-cyan-300">users</code> y <code class="text-cyan-300">clients</code> ya operativas en SQLite. Captura automática de Leads del formulario web.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                Etapa 4 · Futuro
              </span>
              <h4 class="text-sm font-bold text-white mt-2">Auditoría de Chats & Multi-Bot</h4>
              <p class="text-xs text-slate-400 mt-1">
                Conversión de preguntas frecuentes de visitantes en memorias RAG con 1 clic y plantillas de bots por cliente.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Usuarios & Roles Registrados (Cimiento Etapa 3) -->
            <div class="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">
                👥 Usuarios & Roles Internos (Etapa 3)
              </h3>
              <div class="space-y-2">
                {#each users as u (u.username)}
                  <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p class="text-xs font-bold text-white">{u.displayName}</p>
                      <p class="text-[11px] font-mono text-slate-400">@{u.username} · {u.email}</p>
                    </div>
                    <span class="px-2 py-0.5 text-[10px] font-mono rounded border {u.role === 'SUPERADMIN' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'}">
                      {u.role}
                    </span>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Catálogo de Clientes / Leads Capturados -->
            <div class="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">
                📋 Catálogo de Clientes & Leads Recientes ({clients.length})
              </h3>
              {#if clients.length === 0}
                <div class="p-8 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  Todavía no ingresaron consultas por el formulario de contacto. Cada nuevo contacto se guardará acá automáticamente como LEAD.
                </div>
              {:else}
                <div class="space-y-2">
                  {#each clients as c (c.id)}
                    <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3">
                      <div>
                        <p class="text-xs font-bold text-white">
                          {c.name} {c.company ? `· ${c.company}` : ''}
                        </p>
                        <p class="text-[11px] font-mono text-emerald-400">{c.email}</p>
                        <p class="text-xs text-slate-400 mt-1">{c.notes}</p>
                      </div>
                      <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {c.status}
                      </span>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
</style>
