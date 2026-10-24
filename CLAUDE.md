# CLAUDE.md — Pidgeon Solutions

> Este archivo es leído automáticamente por asistentes de código al trabajar en la raíz del proyecto.

## Proyecto e Identidad

**Pidgeon Solutions** (`pidgeonsolutions.tech`) es un emprendimiento tecnológico (estudio de software especializado en Chatbots con IA, automatización, aplicaciones enterprise y GovTech) fundado por **Brian Benegas y sus socios** (Thomas Pineda y Gastón Alejandro).

- **Diferenciación estricta:** Este repositorio **NO** es el portfolio personal de Brian Benegas (`/home/brianleft/brianleft-portfolio` · `brianleft.com`).
- **Alcance simplificado:** Funciona exclusivamente como landing page informativa con asistente conversacional IA y formulario de contacto. **Prohibido** incluir inicio de sesión (Auth/Login), base de datos de usuarios, pasarelas de pago online (Mercado Pago/Stripe) o generadores de video Veo.

## Stack Técnico

| Capa             | Tecnología                                        |
| ---------------- | ------------------------------------------------- |
| Backend          | NestJS 10 + TypeScript (Admin + Chat + Contact + Throttle)|
| Frontend         | Svelte 5 (Runes) + Vite 6 + Tailwind CSS v4       |
| Persistencia     | SQLite nativo (`node:sqlite` en volumen `pidgeon-data`) |
| Rate Limiting    | `@nestjs/throttler` + Redis 7 propio (`pidgeon-net`)|
| IA (Bot Cliente) | Google Gemini (`@google/genai`) + Mini-RAG dinámico + fallback|
| Infraestructura  | Docker Compose (`backend`, `client`, `redis`)     |

## Estructura del Proyecto

```
pidgeon-landing/
├── backend/src/
│   ├── main.ts              # Bootstrap NestJS, puerto 3000, trust proxy
│   ├── app.module.ts        # Root module: Admin + AppThrottler + Chat + Contact
│   ├── admin/               # Backoffice Oculto (SQLite, Shadow Word, Memorias, Settings, Shadowban)
│   ├── chat/                # Bot Gemini con Mini-RAG dinámico, streaming SSE y fallback
│   ├── contact/             # Envío de contacto vía SMTP + registro automático de LEAD en SQLite
│   └── throttler/           # Rate limiting por IP sobre Redis propio (admins exentos)
├── client/
│   ├── App.svelte           # Root component (layout de secciones)
│   ├── stores.ts            # Estado global: lang, t, ContactModal
│   ├── i18n.ts              # Traducciones ES/EN
│   ├── types.ts             # Tipos de UI
│   └── components/          # Hero, RDDSection, ChatbotShowcase, ChatWidget, AdminBackoffice, etc.
├── docs/                    # Documentación técnica y Planroad (docs/ROADMAP.md)
└── docker-compose.yml       # 3 servicios + volumen persistente pidgeon-data
```

## Convenciones de Código

- **Idioma del código:** Inglés (variables, funciones, clases, commits)
- **Idioma de la documentación:** Español
- **Idioma de la UI:** Bilingüe ES/EN via `i18n.ts` — nunca hardcodear texto
- **Frontend:** Svelte 5 runes (`$state`, `$derived`, `$effect`) — no usar API legacy
- **Streaming por chunks:** Tanto `ChatWidget.svelte` como `ChatbotShowcase.svelte` emiten los mensajes del bot por chunks fluidos (2–4 caracteres cada 15ms)
- **Estilos:** Tailwind utilities inline consistentes con la paleta oscura `slate-950` + `emerald`/`cyan`/`purple`

## Variables de Entorno Clave

- `GEMINI_API_KEY` — Google Gemini (solo en backend)
- `GEMINI_MODEL` — Modelo primario (ej. `gemini-2.5-flash-lite`)
- `GEMINI_MODEL_FALLBACK` — Lista de modelos fallback separados por coma
- `REDIS_HOST`, `REDIS_PORT` — Instancia Redis propia (`redis:6379`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_TO` — Contacto por email

## Equipo

- **Brian Benegas** — Tech Lead & Infrastructure
- **Thomas Pineda** — Creative Director
- **Gastón Alejandro** — Operations & Strategy
