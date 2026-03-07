# Pidgeon Solutions — Copilot Instructions

## Proyecto

Pidgeon Solutions: estudio de software boutique. Sitio web + API backend.

## Stack

- **Backend:** NestJS 10 + TypeScript + TypeORM + MySQL 8.0
- **Frontend:** Svelte 5 + Vite 6 + Tailwind CSS
- **Auth:** JWT + Passport + bcryptjs
- **Pagos:** Mercado Pago SDK
- **IA:** Google Gemini (via backend proxy, nunca en frontend)
- **Infra:** Docker Compose

## Convenciones

### TypeScript

- Strict mode habilitado
- Interfaces sobre types cuando sea posible
- DTOs como clases simples (no interfaces) en el backend para compatibilidad con NestJS

### NestJS (Backend)

- Feature-based modules: un directorio por dominio bajo `src/`
- Cada módulo tiene: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`
- Controllers: solo routing y delegación, sin lógica de negocio
- Services: toda la lógica de negocio, inyectables via DI
- Entities: decoradas con TypeORM en `db/entities/`
- Usar `@nestjs/config` para variables de entorno (ConfigService)

### Svelte 5 (Frontend)

- Usar runes: `$state`, `$derived`, `$effect` — NO la API legacy (no `let x = writable()` en componentes)
- Componentes en PascalCase: `MiComponente.svelte`
- Todo texto de UI va en `i18n.ts`, nunca hardcodeado
- Estilos con Tailwind utility classes inline
- Estado global en `stores.ts` usando Svelte stores (`writable`, `derived`)

### General

- Código en inglés, documentación en español
- Commits descriptivos en inglés
- No commitear archivos `.env`
- La API key de Gemini solo existe en el backend

## Estructura

```
backend/src/     → NestJS modules (auth, mercado-pago, chat, db)
client/          → Svelte 5 SPA (components/, stores.ts, i18n.ts)
docs/            → Documentación técnica en español (Doc as Code)
```

## Patrones Frecuentes

### Nuevo endpoint en backend

1. Crear DTO en `dto/nombre.dto.ts`
2. Agregar método en el service
3. Agregar ruta en el controller
4. Documentar en `docs/api/`

### Nuevo componente en frontend

1. Crear `components/MiComponente.svelte`
2. Usar `$state` para estado local, `$effect` para side effects
3. Importar `{ t }` de stores para textos i18n
4. Agregar traducciones en `i18n.ts` (ES y EN)

### Nuevo texto de UI

1. Agregar key en `i18n.ts` → `translations.EN.seccion.key` y `translations.ES.seccion.key`
2. Usar en componente: `{$t.seccion.key}`
