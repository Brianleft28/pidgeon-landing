# CLAUDE.md — Pidgeon Solutions

> Este archivo es leído automáticamente por asistentes de código al trabajar en la raíz del proyecto.

## Proyecto e Identidad

**Pidgeon Solutions** (`pidgeonsolutions.tech`) es un emprendimiento tecnológico (estudio de software especializado en Chatbots con IA, GovTech, aplicaciones enterprise y automatización) fundado por **Brian Benegas y sus socios** (Gastón Alejandro).

- **Diferenciación estricta:** Este repositorio **NO** es el portfolio personal de Brian Benegas (`/home/brianleft/brianleft-portfolio` · `brianleft.com`).
- **Alcance simplificado:** Funciona exclusivamente como landing page informativa con asistente conversacional IA y formulario de contacto. **Prohibido** incluir inicio de sesión (Auth/Login), base de datos de usuarios, pasarelas de pago online (Mercado Pago/Stripe) o generadores de video Veo.

## Stack Técnico

| Capa             | Tecnología                                        |
| ---------------- | ------------------------------------------------- |
| Backend          | NestJS 10 + TypeScript (Chat + Contact + Throttle)|
| Frontend         | Svelte 5 (Runes) + Vite 6 + Tailwind CSS v4       |
| Rate Limiting    | `@nestjs/throttler` + Redis 7 propio (`pidgeon-net`)|
| IA (Bot Cliente) | Google Gemini (`@google/genai`) con cadena fallback|
| Infraestructura  | Docker Compose (`backend`, `client`, `redis`)     |

## Estructura del Proyecto

```
pidgeon-landing/
├── backend/src/
│   ├── main.ts              # Bootstrap NestJS, puerto 3000, trust proxy
│   ├── app.module.ts        # Root module: AppThrottlerModule + Chat + Contact
│   ├── chat/                # Bot Gemini con streaming SSE y fallback de modelos
│   ├── contact/             # Envío de formulario de contacto vía SMTP
│   └── throttler/           # Rate limiting por IP sobre Redis propio
├── client/
│   ├── App.svelte           # Root component (layout de secciones)
│   ├── stores.ts            # Estado global: lang, t, ContactModal
│   ├── i18n.ts              # Traducciones ES/EN
│   ├── types.ts             # Tipos de UI
│   └── components/          # Hero, RDDSection, ChatbotShowcase, ServicesGrid, ChatWidget, etc.
├── docs/                    # Documentación técnica (Doc as Code)
└── docker-compose.yml       # 3 servicios: backend:4001->3000, client:3002->80, redis:6379 (interno)
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
- **Gastón Alejandro** — Operations & Strategy
