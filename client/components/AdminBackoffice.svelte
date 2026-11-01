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

  type UserRole = 'SUPERADMIN' | 'PARTNER' | 'SALES' | 'VIEWER';

  type AdminUserItem = {
    id: number;
    username: string;
    displayName: string;
    email: string;
    role: UserRole;
    active: boolean;
    createdAt: string;
  };

  type ClientStatus = 'LEAD' | 'CONTACTED' | 'DEMO' | 'ACTIVE' | 'PAUSED';

  type ClientLeadItem = {
    id: number;
    name: string;
    company: string;
    email: string;
    phone: string;
    plan: string;
    status: ClientStatus;
    notes: string;
    assignedTo: string;
    source: string;
    createdAt: string;
    updatedAt?: string;
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

  // Etapa 3: User / Partner form state (Thomas Pineda & Gastón Alejandro)
  let isEditingUser = $state(false);
  let usrUsername = $state('thomas');
  let usrDisplayName = $state('Thomas Pineda');
  let usrEmail = $state('thomas@pidgeonsolutions.com');
  let usrRole = $state<UserRole>('PARTNER');
  let usrActive = $state(true);
  let usrPassword = $state('');

  // Etapa 3: Client / Lead form state
  let cliId = $state<number | undefined>(undefined);
  let cliName = $state('');
  let cliCompany = $state('');
  let cliEmail = $state('');
  let cliPhone = $state('');
  let cliPlan = $state('Pequeña Empresa');
  let cliStatus = $state<ClientStatus>('LEAD');
  let cliAssignedTo = $state('brianleft');
  let cliNotes = $state('');
  let clientStatusFilter = $state<'ALL' | ClientStatus>('ALL');

  let filteredClients = $derived(
    clientStatusFilter === 'ALL'
      ? clients
      : clients.filter((c) => c.status === clientStatusFilter)
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

  // --- Etapa 3: Funciones de Socios & Roles Internos (RBAC) ---
  function loadPartnerPreset(preset: 'thomas' | 'gaston' | 'new') {
    if (preset === 'thomas') {
      const existing = users.find((u) => u.username === 'thomas');
      isEditingUser = Boolean(existing);
      usrUsername = 'thomas';
      usrDisplayName = existing?.displayName || 'Thomas Pineda';
      usrEmail = existing?.email || 'thomas@pidgeonsolutions.com';
      usrRole = existing?.role || 'PARTNER';
      usrActive = existing ? existing.active : true;
      usrPassword = '';
    } else if (preset === 'gaston') {
      const existing = users.find((u) => u.username === 'gaston');
      isEditingUser = Boolean(existing);
      usrUsername = 'gaston';
      usrDisplayName = existing?.displayName || 'Gastón Alejandro';
      usrEmail = existing?.email || 'gaston@pidgeonsolutions.com';
      usrRole = existing?.role || 'PARTNER';
      usrActive = existing ? existing.active : true;
      usrPassword = '';
    } else {
      isEditingUser = false;
      usrUsername = '';
      usrDisplayName = '';
      usrEmail = '';
      usrRole = 'PARTNER';
      usrActive = true;
      usrPassword = '';
    }
  }

  function selectUserForEdit(u: AdminUserItem) {
    isEditingUser = true;
    usrUsername = u.username;
    usrDisplayName = u.displayName;
    usrEmail = u.email;
    usrRole = u.role;
    usrActive = u.active;
    usrPassword = '';
  }

  async function saveUser(e: SubmitEvent) {
    e.preventDefault();
    if (!usrUsername.trim() || !usrDisplayName.trim()) {
      showToast('Completá usuario y nombre visible del socio', 'err');
      return;
    }
    saving = true;
    try {
      const res = await fetch(`${apiUrl}/admin/users`, {
        method: 'POST',
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          username: usrUsername.trim().toLowerCase(),
          displayName: usrDisplayName.trim(),
          email: usrEmail.trim(),
          role: usrRole,
          active: usrActive,
          password: usrPassword.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Error guardando usuario');
      }
      const data = await res.json();
      users = data.users || [];
      usrPassword = '';
      isEditingUser = true;
      showToast(`Socio / usuario @${usrUsername.trim().toLowerCase()} guardado en SQLite`);
    } catch (err: any) {
      showToast(err?.message || 'Error al guardar el usuario', 'err');
    } finally {
      saving = false;
    }
  }

  async function removeUser(username: string) {
    if (username === 'brianleft') return;
    saving = true;
    try {
      const res = await fetch(`${apiUrl}/admin/users/${encodeURIComponent(username)}`, {
        method: 'DELETE',
        headers: authHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('No se pudo eliminar el usuario');
      const data = await res.json();
      users = data.users || [];
      showToast(`Usuario @${username} eliminado`);
    } catch {
      showToast('Error al eliminar usuario', 'err');
    } finally {
      saving = false;
    }
  }

  // --- Etapa 3: Funciones de Catálogo de Clientes & Leads ---
  function resetClientForm() {
    cliId = undefined;
    cliName = '';
    cliCompany = '';
    cliEmail = '';
    cliPhone = '';
    cliPlan = 'Pequeña Empresa';
    cliStatus = 'LEAD';
    cliAssignedTo = currentUser?.username || 'brianleft';
    cliNotes = '';
  }

  function selectClientForEdit(c: ClientLeadItem) {
    cliId = c.id;
    cliName = c.name;
    cliCompany = c.company || '';
    cliEmail = c.email || '';
    cliPhone = c.phone || '';
    cliPlan = c.plan || 'General';
    cliStatus = c.status || 'LEAD';
    cliAssignedTo = c.assignedTo || 'brianleft';
    cliNotes = c.notes || '';
  }

  async function saveClient(e: SubmitEvent) {
    e.preventDefault();
    if (!cliName.trim()) {
      showToast('El nombre del cliente o lead es obligatorio', 'err');
      return;
    }
    saving = true;
    try {
      const url = cliId ? `${apiUrl}/admin/clients/${cliId}` : `${apiUrl}/admin/clients`;
      const method = cliId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          id: cliId,
          name: cliName.trim(),
          company: cliCompany.trim(),
          email: cliEmail.trim(),
          phone: cliPhone.trim(),
          plan: cliPlan.trim(),
          status: cliStatus,
          assignedTo: cliAssignedTo.trim(),
          notes: cliNotes.trim(),
        }),
      });
      if (!res.ok) throw new Error('Error guardando cliente');
      const data = await res.json();
      clients = data.clients || [];
      const wasEdit = Boolean(cliId);
      resetClientForm();
      showToast(wasEdit ? 'Ficha de cliente actualizada' : 'Nuevo cliente registrado en el catálogo');
    } catch {
      showToast('Error al guardar el cliente', 'err');
    } finally {
      saving = false;
    }
  }

  async function removeClient(id: number) {
    saving = true;
    try {
      const res = await fetch(`${apiUrl}/admin/clients/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error eliminando cliente');
      const data = await res.json();
      clients = data.clients || [];
      if (cliId === id) resetClientForm();
      showToast('Cliente eliminado del catálogo');
    } catch {
      showToast('No se pudo eliminar el cliente', 'err');
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
          👥 Socios & Clientes ({clients.length})
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
            </label>
            <textarea
              rows="8"
              bind:value={aiConfig.systemPrompt}
              class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">
              Directiva Especial cuando preguntan por Planes / Precios
            </label>
            <textarea
              rows="5"
              bind:value={aiConfig.plansDirective}
              class="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
            ></textarea>
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
        <!-- TAB 5: ETAPA 3 ACTIVA (SOCIOS RBAC, CLIENTES MINI-CRM & PLANROAD) -->
        <div class="max-w-7xl mx-auto space-y-6">
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
                Etapa 2 · Completada
              </span>
              <h4 class="text-sm font-bold text-white mt-2">Backoffice Oculto & Shadow Word</h4>
              <p class="text-xs text-slate-400 mt-1">
                Login enmascarado vía <code class="text-emerald-300">/shadow</code> en el chat, edición en caliente de Memorias RAG, Prompts, Placeholders y Shadowban.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">
                Etapa 3 · Activa Hoy
              </span>
              <h4 class="text-sm font-bold text-white mt-2">Socios RBAC & Catálogo Mini-CRM</h4>
              <p class="text-xs text-slate-400 mt-1">
                Alta y gestión de <strong>Thomas Pineda</strong> y <strong>Gastón Alejandro</strong> (<code class="text-emerald-300">PARTNER</code>), roles RBAC y seguimiento de Clientes/Leads.
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
            <!-- COLUMNA IZQUIERDA (5 cols): ALTA Y GESTIÓN DE SOCIOS (THOMAS PINEDA & GASTÓN ALEJANDRO) -->
            <div class="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    👥 Socios & Roles Internos (RBAC)
                  </h3>
                  <p class="text-[11px] text-slate-400">
                    Habilitá o actualizá las credenciales de acceso a <code class="text-emerald-400">/shadow</code> para los socios.
                  </p>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onclick={() => loadPartnerPreset('thomas')}
                    class="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono cursor-pointer"
                  >
                    ⚡ Thomas Pineda
                  </button>
                  <button
                    type="button"
                    onclick={() => loadPartnerPreset('gaston')}
                    class="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono cursor-pointer"
                  >
                    ⚡ Gastón Alejandro
                  </button>
                  <button
                    type="button"
                    onclick={() => loadPartnerPreset('new')}
                    class="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono cursor-pointer"
                  >
                    + Nuevo
                  </button>
                </div>
              </div>

              <!-- Formulario ABM Socio / Usuario -->
              <form onsubmit={saveUser} class="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Usuario (@login)
                      <input
                        type="text"
                        bind:value={usrUsername}
                        placeholder="ej. thomas"
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </label>
                  </div>
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Nombre y Apellido
                      <input
                        type="text"
                        bind:value={usrDisplayName}
                        placeholder="ej. Thomas Pineda"
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </label>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Email corporativo
                      <input
                        type="email"
                        bind:value={usrEmail}
                        placeholder="thomas@pidgeonsolutions.com"
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </label>
                  </div>
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Rol RBAC
                      <select
                        bind:value={usrRole}
                        disabled={usrUsername === 'brianleft'}
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono"
                      >
                        <option value="SUPERADMIN">SUPERADMIN</option>
                        <option value="PARTNER">PARTNER (Socio)</option>
                        <option value="SALES">SALES (Comercial)</option>
                        <option value="VIEWER">VIEWER (Lectura)</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div class="sm:col-span-8">
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Contraseña {isEditingUser ? '(vacío = mantener actual)' : '(obligatoria o usa default)'}
                      <input
                        type="password"
                        bind:value={usrPassword}
                        placeholder="••••••••••••"
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </label>
                  </div>
                  <div class="sm:col-span-4 pb-1.5">
                    <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        bind:checked={usrActive}
                        disabled={usrUsername === 'brianleft'}
                        class="accent-emerald-500"
                      />
                      Cuenta Activa
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  class="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : `Guardar Socio / Usuario (@${usrUsername || 'nuevo'})`}
                </button>
              </form>

              <!-- Lista de Socios Registrados -->
              <div class="space-y-2">
                {#each users as u (u.username)}
                  <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full {u.active ? 'bg-emerald-400' : 'bg-slate-600'}"></span>
                        <p class="text-xs font-bold text-white">{u.displayName}</p>
                        <span class="px-2 py-0.5 text-[10px] font-mono rounded border {u.role === 'SUPERADMIN' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'}">
                          {u.role}
                        </span>
                      </div>
                      <p class="text-[11px] font-mono text-slate-400 mt-0.5">@{u.username} · {u.email}</p>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <button
                        type="button"
                        onclick={() => selectUserForEdit(u)}
                        class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono cursor-pointer"
                      >
                        Editar
                      </button>
                      {#if u.username !== 'brianleft' && currentUser?.role === 'SUPERADMIN'}
                        <button
                          type="button"
                          onclick={() => removeUser(u.username)}
                          class="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono cursor-pointer"
                        >
                          ✕
                        </button>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- COLUMNA DERECHA (7 cols): CATÁLOGO DE CLIENTES & LEADS (MINI-CRM) -->
            <div class="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    📋 Catálogo de Clientes & Leads ({clients.length})
                  </h3>
                  <p class="text-[11px] text-slate-400">
                    Seguimiento comercial unificado para Brian, Thomas y Gastón.
                  </p>
                </div>
                {#if cliId}
                  <button
                    type="button"
                    onclick={resetClientForm}
                    class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono cursor-pointer"
                  >
                    + Crear Nuevo Cliente
                  </button>
                {/if}
              </div>

              <!-- Formulario ABM Cliente / Lead -->
              <form onsubmit={saveClient} class="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Nombre de Contacto *
                      <input
                        type="text"
                        bind:value={cliName}
                        placeholder="ej. Martín Gómez"
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </label>
                  </div>
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Empresa / Organización
                      <input
                        type="text"
                        bind:value={cliCompany}
                        placeholder="ej. Clínica San Lucas"
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </label>
                  </div>
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Email
                      <input
                        type="email"
                        bind:value={cliEmail}
                        placeholder="contacto@empresa.com"
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </label>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      WhatsApp / Teléfono
                      <input
                        type="text"
                        bind:value={cliPhone}
                        placeholder="+54 9 11 ..."
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </label>
                  </div>
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Plan / Solución
                      <select
                        bind:value={cliPlan}
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="Emprendedor">Emprendedor</option>
                        <option value="Pequeña Empresa">Pequeña Empresa</option>
                        <option value="Sistema a Medida">Sistema a Medida</option>
                        <option value="Chatbot IA">Chatbot IA</option>
                        <option value="GovTech">GovTech</option>
                        <option value="Consulta Web">Consulta Web</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Estado Comercial
                      <select
                        bind:value={cliStatus}
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono"
                      >
                        <option value="LEAD">LEAD</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="DEMO">DEMO</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PAUSED">PAUSED</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label class="block text-[11px] font-mono text-slate-400 mb-1">
                      Socio Responsable
                      <select
                        bind:value={cliAssignedTo}
                        class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono"
                      >
                        <option value="">Sin asignar</option>
                        {#each users as u (u.username)}
                          <option value={u.username}>@{u.username} ({u.displayName})</option>
                        {/each}
                      </select>
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-mono text-slate-400 mb-1">
                    Notas de seguimiento / Requerimientos
                    <textarea
                      rows="2"
                      bind:value={cliNotes}
                      placeholder="Resumen del proyecto, presupuesto estimado o próximos pasos..."
                      class="mt-1 w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200"
                    ></textarea>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  class="w-full py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : cliId ? `Actualizar Cliente #${cliId}` : 'Registrar Cliente / Lead'}
                </button>
              </form>

              <!-- Filtros de Estado -->
              <div class="flex flex-wrap items-center gap-1.5">
                {#each ['ALL', 'LEAD', 'CONTACTED', 'DEMO', 'ACTIVE', 'PAUSED'] as st}
                  <button
                    type="button"
                    onclick={() => (clientStatusFilter = st as any)}
                    class="px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all {clientStatusFilter === st ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'}"
                  >
                    {st === 'ALL' ? `TODOS (${clients.length})` : st}
                  </button>
                {/each}
              </div>

              <!-- Listado de Clientes -->
              {#if filteredClients.length === 0}
                <div class="p-8 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No hay clientes ni leads para este filtro. Podés cargarlos arriba o recibirlos desde el formulario web.
                </div>
              {:else}
                <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {#each filteredClients as c (c.id)}
                    <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="text-xs font-bold text-white">
                            {c.name} {c.company ? `· ${c.company}` : ''}
                          </p>
                          <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {c.status}
                          </span>
                          <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                            {c.plan}
                          </span>
                          {#if c.assignedTo}
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                              @{c.assignedTo}
                            </span>
                          {/if}
                        </div>
                        <p class="text-[11px] font-mono text-emerald-400">
                          {c.email || 'sin email'} {c.phone ? `· ${c.phone}` : ''}
                        </p>
                        {#if c.notes}
                          <p class="text-xs text-slate-400">{c.notes}</p>
                        {/if}
                      </div>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onclick={() => selectClientForEdit(c)}
                          class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onclick={() => removeClient(c.id)}
                          class="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
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
