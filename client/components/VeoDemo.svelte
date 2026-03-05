<script lang="ts">
  import { GoogleGenAI } from '@google/genai';
  import { t } from '../stores';

  type Mode = 'video' | 'image' | 'edit';

  let mode = $state<Mode>('video');
  let image = $state<string | null>(null);
  let mimeType = $state('');
  let videoUrl = $state<string | null>(null);
  let aspectRatio = $state<'16:9' | '9:16'>('16:9');
  let imageUrl = $state<string | null>(null);
  let imageSize = $state<'1K' | '2K' | '4K'>('1K');
  let isLoading = $state(false);
  let prompt = $state('');
  let error = $state<string | null>(null);
  let fileInputEl = $state<HTMLInputElement>();

  const SAMPLE_PROMPT = 'Cinematic abstract background, dark slate and obsidian, cyan glowing lines, high-tech server room aesthetic. 4K, Unreal Engine 5.';

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      image = reader.result as string;
      mimeType = file.type;
      videoUrl = null;
      imageUrl = null;
      error = null;
    };
    reader.readAsDataURL(file);
  }

  async function checkApiKey() {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey) await aistudio.openSelectKey();
      return true;
    }
    if (!(import.meta as any).env?.VITE_API_KEY) throw new Error('API Key missing.');
    return true;
  }

  async function handleGenerateVideo() {
    if (!image) return;
    error = null; isLoading = true;
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: (import.meta as any).env?.VITE_API_KEY ?? '' });
      const base64Data = image.split(',')[1];
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Animate this image cinematically',
        image: { imageBytes: base64Data, mimeType },
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio },
      });
      while (!operation.done) {
        await new Promise(r => setTimeout(r, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
      }
      const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) throw new Error('No video URI returned');
      const res = await fetch(`${uri}&key=${(import.meta as any).env?.VITE_API_KEY}`);
      if (!res.ok) throw new Error('Failed to fetch generated video');
      videoUrl = URL.createObjectURL(await res.blob());
    } catch (err: any) {
      console.error(err);
      error = err.message || 'Video generation failed';
    } finally { isLoading = false; }
  }

  async function handleEditImage() {
    if (!image || !prompt) { error = 'Image and prompt required for editing.'; return; }
    error = null; isLoading = true;
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: (import.meta as any).env?.VITE_API_KEY ?? '' });
      const base64Data = image.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
      });
      let found = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) { imageUrl = `data:image/png;base64,${part.inlineData.data}`; found = true; break; }
        }
      }
      if (!found) throw new Error('No edited image generated.');
    } catch (err: any) { console.error(err); error = err.message || 'Image edit failed'; }
    finally { isLoading = false; }
  }

  async function handleGenerateImage() {
    if (!prompt) { error = 'Prompt is required for image generation.'; return; }
    error = null; isLoading = true;
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: (import.meta as any).env?.VITE_API_KEY ?? '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { imageSize } },
      });
      let found = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) { imageUrl = `data:image/png;base64,${part.inlineData.data}`; found = true; break; }
        }
      }
      if (!found) throw new Error('No image generated.');
    } catch (err: any) { console.error(err); error = err.message || 'Image gen failed'; }
    finally { isLoading = false; }
  }

  function executeAction() {
    if (mode === 'video') handleGenerateVideo();
    else if (mode === 'edit') handleEditImage();
    else handleGenerateImage();
  }

  let actionDisabled = $derived(isLoading || ((mode === 'video' || mode === 'edit') && !image) || !prompt);
</script>

<div class="w-full">
  <div class="text-center mb-8">
    <div class="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      AI Lab
    </div>
    <h3 class="text-2xl font-bold text-white mb-2">{$t.veo.title}</h3>
    <p class="text-slate-400 text-sm max-w-xl mx-auto">{$t.veo.subtitle}</p>
  </div>

  <div class="max-w-4xl mx-auto bg-[#0b1121] border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl">

    <!-- Tabs -->
    <div class="flex gap-6 mb-8 border-b border-slate-800 pb-4 overflow-x-auto">
      <button
        onclick={() => { mode = 'video'; error = null; }}
        class="text-sm font-bold uppercase tracking-wide pb-4 -mb-4 border-b-2 transition-all whitespace-nowrap {mode === 'video' ? 'text-emerald-400 border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-300'}"
      >{$t.veo.modeVideo} (Veo)</button>
      <button
        onclick={() => { mode = 'edit'; error = null; }}
        class="text-sm font-bold uppercase tracking-wide pb-4 -mb-4 border-b-2 transition-all whitespace-nowrap {mode === 'edit' ? 'text-emerald-400 border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-300'}"
      >Editar (Nano)</button>
      <button
        onclick={() => { mode = 'image'; error = null; }}
        class="text-sm font-bold uppercase tracking-wide pb-4 -mb-4 border-b-2 transition-all whitespace-nowrap {mode === 'image' ? 'text-emerald-400 border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-300'}"
      >{$t.veo.modeImage}</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

      <!-- Input Side -->
      <div class="space-y-6">

        <!-- Upload for video & edit -->
        {#if mode === 'video' || mode === 'edit'}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            onclick={() => fileInputEl?.click()}
            class="relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group
              {image ? 'border-emerald-500/50 bg-slate-900' : 'border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/50'}"
          >
            {#if image}
              <img src={image} alt="Preview" class="w-full h-full object-cover" />
            {:else}
              <svg class="w-10 h-10 text-slate-500 mb-3 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-slate-400 font-medium">{$t.veo.upload}</span>
            {/if}
            <input bind:this={fileInputEl} type="file" onchange={handleFileChange} accept="image/*" class="hidden" />
          </div>

          {#if mode === 'video'}
            <div>
              <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{$t.veo.aspectRatio}</span>
              <div class="flex gap-2" role="group" aria-label="Aspect ratio">
                <button onclick={() => aspectRatio = '16:9'} class="flex-1 py-2 text-sm rounded-lg border transition-all {aspectRatio === '16:9' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}">16:9</button>
                <button onclick={() => aspectRatio = '9:16'} class="flex-1 py-2 text-sm rounded-lg border transition-all {aspectRatio === '9:16' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}">9:16</button>
              </div>
            </div>
          {/if}
        {/if}

        <!-- Image size for image mode -->
        {#if mode === 'image'}
          <div>
            <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{$t.veo.imageSize}</span>
            <div class="flex gap-2" role="group" aria-label="Image size">
              {#each ['1K', '2K', '4K'] as size}
                <button onclick={() => imageSize = size as '1K' | '2K' | '4K'} class="flex-1 py-2 text-sm rounded-lg border transition-all {imageSize === size ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}">{size}</button>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Prompt -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label for="veo-prompt" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {mode === 'edit' ? 'Instrucción de Edición' : $t.veo.promptLabel}
            </label>
            <button onclick={() => prompt = SAMPLE_PROMPT} class="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-wide flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              {$t.veo.magicPrompt}
            </button>
          </div>
          <textarea
            id="veo-prompt"
            rows="4"
            bind:value={prompt}
            placeholder={mode === 'edit' ? 'Ej: Agrega un filtro retro...' : $t.veo.promptPlaceholder}
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-slate-600 resize-none"
          ></textarea>
        </div>

        <!-- Action Button -->
        <button
          onclick={executeAction}
          disabled={actionDisabled}
          class="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
            {actionDisabled
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'}"
        >
          {#if isLoading}
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {mode === 'video' ? 'Animar Video' : mode === 'edit' ? 'Editar Imagen' : 'Generar Imagen'}
          {/if}
        </button>

        {#if error}
          <div class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
        {/if}
      </div>

      <!-- Output Side -->
      <div class="relative rounded-2xl bg-black/50 border border-slate-800 overflow-hidden flex items-center justify-center min-h-[300px]">
        {#if mode === 'video'}
          {#if videoUrl}
            <!-- svelte-ignore a11y_media_has_caption -->
            <video src={videoUrl} controls autoplay loop class="w-full h-full object-contain"></video>
          {:else}
            {#if isLoading}
              <div class="text-center text-slate-600 p-8 space-y-4">
                <div class="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                <p class="animate-pulse">Renderizando Media...</p>
              </div>
            {:else}
              <div class="text-center text-slate-600 p-8">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <p>El contenido generado aparecerá aquí.</p>
              </div>
            {/if}
          {/if}
        {:else}
          {#if imageUrl}
            <img src={imageUrl} alt="Generated" class="w-full h-full object-contain" />
          {:else}
            {#if isLoading}
              <div class="text-center text-slate-600 p-8 space-y-4">
                <div class="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                <p class="animate-pulse">Renderizando Media...</p>
              </div>
            {:else}
              <div class="text-center text-slate-600 p-8">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <p>El contenido generado aparecerá aquí.</p>
              </div>
            {/if}
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>
