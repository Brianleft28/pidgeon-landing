# CLAUDE.md — Pidgeon Solutions

> Este archivo es leído automáticamente por Claude Code CLI al ejecutar `claude` en la raíz del proyecto.

## Proyecto

**Pidgeon Solutions** es un estudio de software boutique especializado en GovTech, aplicaciones enterprise e inteligencia artificial. Este repositorio contiene el sitio web principal y la API backend.

## Stack Técnico

| Capa             | Tecnología                       |
| ---------------- | -------------------------------- |
| Backend          | NestJS 10 + TypeScript + TypeORM |
| Frontend         | Svelte 5 + Vite 6 + Tailwind CSS |
| Base de Datos    | MySQL 8.0                        |
| Auth             | JWT + Passport + bcryptjs        |
| Pagos            | Mercado Pago SDK 2.12            |
| IA (Bot Cliente) | Google Gemini via backend proxy  |
| Infraestructura  | Docker Compose (3 servicios)     |

## Estructura del Proyecto

```
pidgeon/
├── backend/src/
│   ├── main.ts              # Bootstrap NestJS, puerto 3000
│   ├── app.module.ts         # Root module: Auth + MercadoPago + Chat
│   ├── auth/                 # JWT auth: login, register
│   ├── db/entities/          # TypeORM entities (User: UUID, email, roles)
│   ├── mercado-pago/         # Pagos con MP SDK
│   └── chat/                 # Bot Gemini (backend proxy, API key segura)
├── client/
│   ├── App.svelte            # Root component (layout de secciones)
│   ├── stores.ts             # Estado global: lang, t, modals
│   ├── i18n.ts               # Traducciones ES/EN (200+ keys)
│   ├── types.ts              # ServiceCardProps, CaseStudyProps
│   └── components/           # Hero, ServicesGrid, ChatWidget, etc.
├── docs/                     # Documentación técnica (Doc as Code)
└── docker-compose.yml        # 3 servicios: backend:3000, client:80, mysql:3306
```

## Convenciones de Código

- **Idioma del código:** Inglés (variables, funciones, clases, commits)
- **Idioma de la documentación:** Español
- **Idioma de la UI:** Bilingüe ES/EN via `i18n.ts` — nunca hardcodear texto
- **Backend:** Feature-based modules (un directorio por dominio bajo `src/`)
- **Frontend:** Svelte 5 runes (`$state`, `$derived`, `$effect`) — no usar API legacy
- **Estilos:** Tailwind utilities inline, no archivos CSS separados
- **DTOs:** Clases simples en `dto/` para validación de input
- **TypeScript strict** en ambos proyectos

## Comandos

```bash
# Levantar todo con Docker
docker-compose up -d

# Backend (desarrollo local)
cd backend && pnpm install && pnpm run start:dev

# Frontend (desarrollo local)
cd client && pnpm install && pnpm dev

# Build de producción
docker-compose up -d --build

# Migraciones
cd backend && pnpm run migration:run
```

## Variables de Entorno Clave

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` — MySQL
- `JWT_SECRET` — Secret para firmar tokens
- `MP_ACCESS_TOKEN` — Mercado Pago
- `GEMINI_API_KEY` — Google Gemini (solo en backend)
- `TYPEORM_SYNC` — `true` solo en dev

## Reglas Importantes

1. **La API key de Gemini NUNCA va al frontend** — siempre via backend proxy
2. **TYPEORM_SYNC=false en producción** — usar migraciones
3. **Todo texto de UI va en `i18n.ts`** con keys para ES y EN
4. **Documentación se actualiza junto al código** (Doc as Code)
5. **Passwords hasheados con bcrypt, salt rounds = 10**

## Documentación Detallada

Para contexto profundo sobre cualquier aspecto del proyecto, consultar `docs/`:

- Arquitectura: `docs/arquitectura/README.md`
- Backend: `docs/arquitectura/backend.md`
- Frontend: `docs/arquitectura/frontend.md`
- Infraestructura: `docs/arquitectura/infraestructura.md`
- API Auth: `docs/api/autenticacion.md`
- API Pagos: `docs/api/pagos.md`
- API Chat: `docs/api/chat.md`
- Guías: `docs/guias/`
- MCP: `docs/mcp/`
- Roadmap: `docs/roadmap.md`

## Equipo

- **Brian Benegas** — Tech Lead & Infrastructure
- **Thomas Pineda** — Creative Director
- **Gastón Alejandro** — Operations & Strategy
