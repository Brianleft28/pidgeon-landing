# Pidgeon Solutions — Frontend

> SPA construida con **Svelte 5** + **Vite 6** + **Tailwind CSS**.

## Desarrollo Local

```bash
pnpm install
pnpm run dev          # http://localhost:5173
```

Crear `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

## Build

```bash
pnpm run build        # Output en dist/
```

## Estructura

```
client/
├── components/       # Componentes Svelte (.svelte)
├── i18n.ts           # Traducciones ES/EN
├── stores.ts         # Estado global (writable/derived)
├── types.ts          # Tipos TypeScript compartidos
├── App.svelte        # Componente raíz
└── main.ts           # Entry point
```

## Convenciones

- **Runes**: `$state`, `$derived`, `$effect` (NO API legacy)
- **i18n**: Todo texto de UI en `i18n.ts`, nunca hardcodeado
- **Estilos**: Tailwind utility classes inline
- **Componentes**: PascalCase (`MiComponente.svelte`)

> 📖 Documentación completa: [../docs/arquitectura/frontend.md](../docs/arquitectura/frontend.md)
