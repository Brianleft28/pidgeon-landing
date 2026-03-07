# Arquitectura del Frontend — Svelte 5

## Stack

| Componente | Tecnología                                |
| ---------- | ----------------------------------------- |
| Framework  | Svelte 5.x                                |
| Build Tool | Vite 6.x                                  |
| Lenguaje   | TypeScript 5.x                            |
| Estilos    | Tailwind CSS                              |
| IA         | @google/genai (Gemini, via backend proxy) |
| i18n       | Sistema custom con stores                 |
| Servidor   | Nginx (en Docker)                         |

## Estructura de Carpetas

```
client/
├── index.html              ← Entry point HTML
├── main.ts                 ← Bootstrap: monta App.svelte
├── App.svelte              ← Componente raíz (layout de secciones)
├── stores.ts               ← Estado global (lang, modals)
├── i18n.ts                 ← Traducciones ES/EN
├── types.ts                ← Tipos compartidos
├── metadata.json           ← Metadata del sitio
├── vite.config.ts          ← Config de Vite + Svelte plugin
├── svelte.config.js        ← Config de Svelte
├── tsconfig.json           ← Config de TypeScript
├── Dockerfile              ← Build multi-stage + Nginx
├── components/
│   ├── Header.svelte       ← Navegación sticky
│   ├── Hero.svelte         ← Sección hero con typewriter
│   ├── AboutSection.svelte ← Sobre nosotros
│   ├── ServicesGrid.svelte ← Grid de planes/servicios
│   ├── TechEducation.svelte← Educación: LLM, MCP, Automation
│   ├── RDDSection.svelte   ← Terminal interactivo + pilares
│   ├── CaseStudies.svelte  ← Casos de éxito
│   ├── TeamSection.svelte  ← Sección del equipo
│   ├── FAQSection.svelte   ← Preguntas frecuentes
│   ├── ChatWidget.svelte   ← Widget flotante de chat (Gemini)
│   ├── FloatingActions.svelte ← Botones flotantes (WhatsApp, scroll, chat)
│   ├── ContactModal.svelte ← Modal de contacto
│   ├── PaymentModal.svelte ← Modal de pago
│   ├── VeoDemo.svelte      ← Demo de generación de media
│   ├── Sidebar.svelte      ← Sidebar de navegación
│   ├── Logo.svelte         ← Componente del logo
│   └── icons/              ← Iconos SVG como componentes
│       ├── IconBrain.svelte
│       ├── IconConnect.svelte
│       ├── IconAuto.svelte
│       └── ...
└── public/
    └── assets/
        ├── logo.png         ← Logo principal
        ├── logo2.png        ← Logo alternativo
        ├── brian.png        ← Foto del equipo
        ├── thomas.png
        └── alejandro.png
```

## Sistema de Reactividad (Svelte 5 Runes)

El proyecto usa **Svelte 5 runes** — la nueva API de reactividad:

```typescript
// $state — Estado reactivo
let isOpen = $state(false);
let messages = $state<Message[]>([]);

// $derived — Cómputo derivado (equivale a computed)
const t = derived(lang, ($lang) => translations[$lang]);

// $effect — Efectos secundarios reactivos
$effect(() => {
  if (messages.length) {
    messagesEndEl?.scrollIntoView({ behavior: "smooth" });
  }
});
```

## Estado Global (Stores)

```typescript
// stores.ts
export const lang = writable<Language>('ES');          // Idioma activo
export const t = derived(lang, ($lang) => translations[$lang]); // Traducciones

export const isContactModalOpen = writable(false);     // Modal de contacto
export const contactPlan = writable<string | undefined>(undefined);

export const isPaymentModalOpen = writable(false);     // Modal de pago
export const paymentDetails = writable<{ name: string; amount: number }>();

// Helpers
export function openContactModal(planName?: string) { ... }
export function openPaymentModal(planName: string, amount: number) { ... }
```

**Patrón:** Los modales se controlan desde un store centralizado. Cualquier componente puede abrir un modal llamando a las funciones helper.

## Sistema i18n

```typescript
// i18n.ts
export type Language = "EN" | "ES";

export const translations = {
  EN: {
    heroStaticText: "Your business",
    heroRotatingWords: ["organized.", "efficient.", "scalable."],
    // ...200+ keys
  },
  ES: {
    heroStaticText: "Tu negocio",
    heroRotatingWords: ["organizado.", "eficiente.", "escalable."],
    // ...200+ keys
  },
};
```

**Uso en componentes:**

```svelte
<script lang="ts">
  import { t } from '../stores';
</script>

<h1>{$t.heroStaticText}</h1>
```

**Estructura de traducciones:** Objetos anidados por sección:

- `heroStaticText`, `heroRotatingWords`, `heroSubtitle`
- `servicesTitle`, `education.*`, `pricing.*`
- `teamTitle`, `teamMembers[].*`
- `faq.items[].*`
- `chat.*` (strings del bot)

## Tipos Compartidos

```typescript
// types.ts
export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  className?: string;
}

export interface CaseStudyProps {
  client: string;
  metric: string;
  description: string;
  tags: string[];
}
```

## Componentes Principales

### Hero

- Texto estático + typewriter con palabras rotativas
- Background dinámico con nodos tecnológicos
- CTA principal → abre modal de contacto

### ServicesGrid / Pricing

- 3 planes: Entrepreneur ($100/mo), Small Business ($250/mo), Custom System ($1000+)
- Toggle mensual/anual con descuento
- Badge "30% OFF" en oferta de lanzamiento
- Clik en plan → abre `PaymentModal` o `ContactModal`

### RDDSection

- Terminal simulado con tabs (Automation, CRM, AI)
- Logs animados con timestamps
- Panel educativo: LLM, MCP, Automation, Veo

### ChatWidget (Bot Gemini)

- Widget flotante tipo burbuja
- Se comunica con backend via `POST /chat/message`
- Streaming de respuestas
- Persistencia en localStorage

### FloatingActions

- WhatsApp (esquina inferior izquierda)
- Scroll to top (inferior derecha, aparece al scrollear)
- Chat bot (burbuja flotante)

## Build y Despliegue

```bash
# Desarrollo local
cd client && pnpm install && pnpm dev

# Build de producción
pnpm build   # → genera dist/

# Docker (producción)
# Multi-stage: node build → nginx serve
docker build -t pidgeon-client .
```

**Dockerfile:** Build multi-stage con:

1. Stage 1: `node` — `pnpm build` genera archivos estáticos
2. Stage 2: `nginx` — sirve los archivos en puerto 80

## Convenciones

- **Componentes:** PascalCase (`Hero.svelte`, `ChatWidget.svelte`)
- **Stores:** camelCase exportados como funciones/writables
- **Estilos:** Tailwind utility classes inline, sin archivos CSS separados
- **i18n:** Todo texto visible al usuario va en `i18n.ts`, nunca hardcodeado
- **Runes:** Usar `$state`, `$derived`, `$effect` (Svelte 5), no la API legacy

---

_Ver también:_ [Vista General](README.md) · [Backend](backend.md) · [i18n keys en client/i18n.ts](../../client/i18n.ts)
