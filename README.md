<div align="center">
  <img src="client/public/assets/logo2.png" alt="Pidgeon Solutions" width="280" />

  <h1>Pidgeon Solutions</h1>

  <p><strong>Estudio de software · Sitio web + API backend</strong></p>

  ![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)
  ![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
  ![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google&logoColor=white)
  ![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-SDK-00B1EA)
  ![License](https://img.shields.io/badge/License-Proprietary-lightgrey)

</div>

---

## 📋 Índice

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [Arquitectura](#-arquitectura)
- [Quick Start](#-quick-start)
- [Estructura del Repositorio](#-estructura-del-repositorio)
- [Documentación](#-documentación)
- [Stack Técnico](#-stack-técnico)
- [Variables de Entorno](#-variables-de-entorno)
- [Comandos Útiles](#-comandos-útiles)
- [Roadmap](#-roadmap)
- [Equipo](#-equipo)
- [Licencia](#-licencia)

---

## 🧠 Sobre el Proyecto

**Pidgeon Solutions** es un estudio de software que ofrece soluciones digitales completas: sitios web, automatización con IA, integración de pagos y soporte inteligente para clientes.

Este monorepo contiene:

- **Backend API** — NestJS con autenticación JWT, integración de pagos (Mercado Pago) y proxy de IA (Google Gemini).
- **Frontend SPA** — Svelte 5 con landing page, sistema i18n bilingüe (ES/EN), chat widget con IA y generación de contenido visual.
- **Infraestructura** — Docker Compose con 3 servicios sobre red bridge.

> 💡 Practicamos **[Doc as Code](docs/filosofia/doc-as-code.md)**: la documentación no es solo para humanos, es la fuente de conocimiento que alimenta a nuestros agentes de IA.

---

## 📐 Arquitectura

```mermaid
graph TB
    subgraph Cliente["🌐 Frontend (Svelte 5 · :80)"]
        SPA[SPA + Tailwind CSS]
        i18n[i18n ES/EN]
        Chat[Chat Widget]
    end

    subgraph API["⚙️ Backend (NestJS · :3000)"]
        Auth[Auth Module — JWT + Passport]
        MP[MercadoPago Module]
        ChatSvc[Chat Module — Gemini Proxy]
    end

    subgraph DB["🗄️ MySQL 8.0 (:3306)"]
        Users[(users)]
    end

    subgraph External["☁️ Servicios Externos"]
        Gemini[Google Gemini API]
        MercadoPagoAPI[Mercado Pago API]
    end

    SPA -->|HTTP| Auth
    Chat -->|POST /chat/message| ChatSvc
    SPA -->|POST /mercado-pago| MP
    Auth -->|TypeORM| Users
    ChatSvc -->|@google/genai| Gemini
    MP -->|SDK| MercadoPagoAPI
```

> Para diagramas detallados ver [docs/arquitectura/](docs/arquitectura/README.md).

---

## 🚀 Quick Start

### Prerrequisitos

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose
- [Node.js 18+](https://nodejs.org/) y [pnpm](https://pnpm.io/) (para desarrollo local)

### 1. Clonar el repositorio

```bash
git clone https://github.com/pidgeon-solutions/pidgeon.git
cd pidgeon
```

### 2. Configurar variables de entorno

```bash
# Backend
cp backend/.env.example backend/.env
# Editar: JWT_SECRET, GEMINI_API_KEY, MERCADO_PAGO_ACCESS_TOKEN, DB credentials

# Frontend (solo para desarrollo local sin Docker)
cp client/.env.example client/.env.local
# Editar: VITE_API_URL=http://localhost:3000
```

### 3. Levantar con Docker Compose

```bash
docker-compose up --build
```

| Servicio | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost      |
| Backend  | http://localhost:3000 |
| MySQL    | localhost:3306        |

> 📖 Guía completa de configuración: [docs/guias/configuracion-local.md](docs/guias/configuracion-local.md)

---

## 📁 Estructura del Repositorio

```
pidgeon/
├── backend/                 # API NestJS
│   └── src/
│       ├── auth/            # JWT + Passport + bcryptjs
│       ├── chat/            # Gemini proxy (POST /chat/message)
│       ├── db/              # TypeORM entities + migrations
│       └── mercado-pago/    # Integración de pagos
├── client/                  # SPA Svelte 5
│   ├── components/          # Componentes (.svelte)
│   ├── i18n.ts              # Traducciones ES/EN
│   ├── stores.ts            # Estado global
│   └── types.ts             # Tipos compartidos
├── docs/                    # 📚 Documentación técnica (español)
│   ├── arquitectura/        # Diagramas y decisiones técnicas
│   ├── api/                 # Referencia de endpoints
│   ├── guias/               # Onboarding y despliegue
│   ├── integraciones/       # Mercado Pago, etc.
│   ├── filosofia/           # Doc as Code
│   ├── mcp/                 # Model Context Protocol
│   ├── claude/              # Agente de desarrollo
│   └── roadmap.md           # Hoja de ruta
├── docker-compose.yml
├── CLAUDE.md                # Contexto para Claude Code CLI
└── README.md                # ← Estás aquí
```

---

## 📚 Documentación

Toda la documentación está en **español** dentro de [`docs/`](docs/README.md).

| Sección                                                 | Contenido                               |
| ------------------------------------------------------- | --------------------------------------- |
| [📐 Arquitectura](docs/arquitectura/README.md)          | Diagramas, backend, frontend, infra     |
| [🔌 API](docs/api/autenticacion.md)                     | Endpoints: auth, pagos, chat            |
| [🚀 Guías](docs/guias/configuracion-local.md)           | Setup local, despliegue, variables      |
| [💳 Integraciones](docs/integraciones/pagos.md)         | Flujo de Mercado Pago                   |
| [🧠 MCP](docs/mcp/README.md)                            | Model Context Protocol + herramientas   |
| [🤖 Claude Agent](docs/claude/README.md)                | Agente de desarrollo con IA             |
| [🧭 Doc as Code](docs/filosofia/doc-as-code.md)         | Filosofía de documentación              |
| [📍 Roadmap](docs/roadmap.md)                           | Hoja de ruta Q2–Q4 2026                 |

---

## 🛠 Stack Técnico

| Capa            | Tecnología                         | Versión    |
| --------------- | ---------------------------------- | ---------- |
| Backend         | NestJS + TypeScript                | 10.x       |
| Frontend        | Svelte 5 + Vite                    | 5.x / 6.x |
| Base de Datos   | MySQL                              | 8.0        |
| ORM             | TypeORM                            | 0.3.x      |
| Auth            | JWT + Passport + bcryptjs          | —          |
| Pagos           | Mercado Pago SDK                   | 2.12.x     |
| IA (Clientes)   | Google Gemini (via backend proxy)  | —          |
| IA (Desarrollo) | Claude (CLI + VS Code)             | —          |
| Estilos         | Tailwind CSS                       | —          |
| Infraestructura | Docker Compose                     | —          |

---

## 🔐 Variables de Entorno

| Variable                    | Servicio | Descripción                          |
| --------------------------- | -------- | ------------------------------------ |
| `JWT_SECRET`                | Backend  | Clave para firmar tokens JWT         |
| `GEMINI_API_KEY`            | Backend  | API key de Google Gemini             |
| `MERCADO_PAGO_ACCESS_TOKEN` | Backend  | Token de Mercado Pago                |
| `DB_HOST`                   | Backend  | Host de MySQL (`mysql` en Docker)    |
| `DB_PORT`                   | Backend  | Puerto de MySQL (`3306`)             |
| `DB_USERNAME`               | Backend  | Usuario de MySQL                     |
| `DB_PASSWORD`               | Backend  | Contraseña de MySQL                  |
| `DB_DATABASE`               | Backend  | Nombre de la base de datos           |
| `VITE_API_URL`              | Frontend | URL del backend (`http://localhost:3000`) |

> 📖 Tabla completa: [docs/guias/variables-entorno.md](docs/guias/variables-entorno.md)

---

## ⌨️ Comandos Útiles

```bash
# Docker
docker-compose up --build        # Levantar todo
docker-compose down -v           # Bajar + eliminar volúmenes

# Backend (desde backend/)
pnpm install                     # Instalar dependencias
pnpm run start:dev               # Dev con hot reload
pnpm run build                   # Compilar para producción
pnpm run migration:run           # Ejecutar migraciones

# Frontend (desde client/)
pnpm install                     # Instalar dependencias
pnpm run dev                     # Dev server en :5173
pnpm run build                   # Build para producción
```

---

## 📍 Roadmap

Ver [docs/roadmap.md](docs/roadmap.md) para la hoja de ruta completa.

**Resumen:**

| Período   | Foco Principal                                            |
| --------- | --------------------------------------------------------- |
| ✅ Actual  | Sitio web, auth, pagos, docs, agente Claude, bot Gemini   |
| Q2 2026   | CI/CD, tests, email transaccional, dashboard admin        |
| Q3 2026   | Multi-proyecto, CRM, WhatsApp Business API                |
| Q4 2026   | SaaS self-service, marketplace de templates               |

---

## 👥 Equipo

| Nombre          | Rol                        |
| --------------- | -------------------------- |
| **Brian**       | Founder & Full-Stack Dev   |

---

## 📄 Licencia

Este proyecto es software propietario de **Pidgeon Solutions**. Todos los derechos reservados.

---

<div align="center">
  <sub>Hecho con 🐦 por <strong>Pidgeon Solutions</strong></sub>
</div>
