# Documentación Técnica — Pidgeon Solutions

> **Filosofía:** En Pidgeon Solutions practicamos **Doc as Code**. Esta documentación no es solo para humanos — es la fuente de conocimiento que alimenta a nuestros agentes de IA (Claude para desarrollo, Gemini para el cliente). Cada archivo `.md` es contexto vivo.
>
> → Más sobre esta filosofía en [filosofia/doc-as-code.md](filosofia/doc-as-code.md)

---

## Índice General

### 🧭 Filosofía y Visión

| Documento                               | Descripción                                                       |
| --------------------------------------- | ----------------------------------------------------------------- |
| [Doc as Code](filosofia/doc-as-code.md) | Por qué la documentación es código y alimenta a los agentes de IA |
| [Roadmap](roadmap.md)                   | Hoja de ruta del producto y próximos hitos                        |

### 📐 Arquitectura

| Documento                                          | Descripción                                     |
| -------------------------------------------------- | ----------------------------------------------- |
| [Vista General](arquitectura/README.md)            | Diagrama de micro-arquitectura y flujo de datos |
| [Backend](arquitectura/backend.md)                 | NestJS, módulos, TypeORM, JWT, estructura       |
| [Frontend](arquitectura/frontend.md)               | Svelte 5, stores, componentes, i18n             |
| [Infraestructura](arquitectura/infraestructura.md) | Docker Compose, MySQL, networking               |

### 🚀 Guías

| Documento                                           | Descripción                                  |
| --------------------------------------------------- | -------------------------------------------- |
| [Configuración Local](guias/configuracion-local.md) | Onboarding para nuevos desarrolladores       |
| [Despliegue](guias/despliegue.md)                   | Deploy con Docker Compose                    |
| [Variables de Entorno](guias/variables-entorno.md)  | Tabla completa de variables de configuración |

### 🔌 API

| Documento                             | Descripción                                       |
| ------------------------------------- | ------------------------------------------------- |
| [Autenticación](api/autenticacion.md) | `POST /auth/login`, `/register`, flujo JWT        |
| [Pagos](api/pagos.md)                 | `POST /mercado-pago/process-payment`              |
| [Chat](api/chat.md)                   | `POST /chat/message` — Bot Gemini (backend proxy) |

### 💳 Integraciones

| Documento                       | Descripción                    |
| ------------------------------- | ------------------------------ |
| [Pagos](integraciones/pagos.md) | Flujo completo de Mercado Pago |

### 🧠 MCP (Model Context Protocol)

| Documento                                   | Descripción                                         |
| ------------------------------------------- | --------------------------------------------------- |
| [¿Qué es MCP?](mcp/README.md)               | Filosofía y rol en Pidgeon Solutions                |
| [Herramientas NPM](mcp/herramientas-npm.md) | Servers MCP vía `npx` (sin instalar en el proyecto) |

### 🤖 Agentes de IA

| Documento                         | Descripción                                  |
| --------------------------------- | -------------------------------------------- |
| [Agente Claude](claude/README.md) | Configuración y uso del agente de desarrollo |

---

## Convenciones

- **Idioma de docs:** Español
- **Idioma de código:** Inglés (variables, funciones, clases)
- **Idioma de UI:** Bilingüe ES/EN (sistema i18n)
- **Formato:** Markdown con diagramas Mermaid cuando aplique
- **Ubicación:** Todo en `docs/` con estructura modular
- **Principio:** Cada documento debe ser autocontenido y linkeable

---

## Stack Técnico (Referencia Rápida)

| Capa            | Tecnología                        | Versión   |
| --------------- | --------------------------------- | --------- |
| Backend         | NestJS + TypeScript               | 10.x      |
| Frontend        | Svelte 5 + Vite                   | 5.x / 6.x |
| Base de Datos   | MySQL                             | 8.0       |
| ORM             | TypeORM                           | 0.3.x     |
| Auth            | JWT + Passport                    | —         |
| Pagos           | Mercado Pago SDK                  | 2.12.x    |
| IA (Cliente)    | Google Gemini (via backend proxy) | —         |
| IA (Desarrollo) | Claude (CLI + VS Code)            | —         |
| Infraestructura | Docker Compose                    | —         |
| Estilos         | Tailwind CSS                      | —         |

---

_Última actualización: Marzo 2026_
