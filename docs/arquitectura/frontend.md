# Arquitectura del Frontend — Svelte 5

## Stack

| Componente | Tecnología                                |
| ---------- | ----------------------------------------- |
| Framework  | Svelte 5.x (Runes)                        |
| Build Tool | Vite 6.x                                  |
| Lenguaje   | TypeScript 5.x                            |
| Estilos    | Tailwind CSS v4                           |
| IA         | Google Gemini (vía backend proxy SSE)     |
| i18n       | Sistema custom con stores (`ES` / `EN`)   |
| Servidor   | Nginx (en Docker, puerto host `3002`)     |

## Estructura de Carpetas

```
client/
├── index.html              ← Entry point HTML
├── main.ts                 ← Bootstrap: monta App.svelte
├── App.svelte              ← Componente raíz (layout de secciones)
├── stores.ts               ← Estado global (lang, ContactModal)
├── i18n.ts                 ← Traducciones ES/EN
├── types.ts                ← Tipos compartidos
├── vite.config.ts          ← Config de Vite + Svelte plugin
├── Dockerfile              ← Build multi-stage + Nginx
├── components/
│   ├── Header.svelte          ← Navegación sticky
│   ├── Sidebar.svelte         ← Menú mobile
│   ├── Hero.svelte            ← Sección hero con typewriter
│   ├── AboutSection.svelte    ← Sobre nosotros
│   ├── RDDSection.svelte      ← Terminal interactivo + pilares + destaque Chatbots IA
│   ├── ChatbotShowcase.svelte ← Carrusel de Chatbots IA (scroll-snap, botones, autoplay 20s, chunks)
│   ├── ServicesGrid.svelte    ← Grid de planes conectado al ContactModal
│   ├── TeamSection.svelte     ← Sección del equipo
│   ├── FAQSection.svelte      ← Preguntas frecuentes
│   ├── TerminalContact.svelte ← CTA final
│   ├── ContactModal.svelte    ← Modal de contacto
│   ├── ChatWidget.svelte      ← Widget flotante de chat (Gemini streaming por chunks)
│   └── FloatingActions.svelte ← Botones flotantes (WhatsApp, scroll)
└── public/
    └── assets/
```
