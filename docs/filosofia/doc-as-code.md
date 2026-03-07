# Doc as Code — Filosofía de Documentación en Pidgeon Solutions

## ¿Qué es Doc as Code?

**Doc as Code** es la práctica de tratar la documentación con el mismo rigor que el código fuente:

- Se versiona en Git junto al código
- Se revisa en Pull Requests
- Se mantiene actualizada como parte del ciclo de desarrollo
- Se estructura de forma modular y linkeable

## ¿Por qué lo adoptamos?

En Pidgeon Solutions, la documentación cumple un rol **doble**:

### 1. Para Humanos

- **Onboarding:** Un nuevo desarrollador puede entender el proyecto leyendo `docs/` sin necesidad de una sesión de explicación
- **Referencia:** Cada decisión técnica, endpoint y flujo está documentado
- **Consistencia:** Todos trabajamos con la misma fuente de verdad

### 2. Para Agentes de IA (Knowledge Base)

Esto es lo que nos diferencia. Cada archivo `.md` en `docs/` funciona como **contexto inyectable** para nuestros agentes:

| Agente                  | Fuente de Conocimiento            | Propósito                                     |
| ----------------------- | --------------------------------- | --------------------------------------------- |
| **Claude** (desarrollo) | `CLAUDE.md` + `docs/`             | Asiste en código, arquitectura, debugging     |
| **Gemini** (cliente)    | System prompt + `docs/`           | Bot de asistencia para clientes del sitio web |
| **Copilot** (VS Code)   | `.github/copilot-instructions.md` | Autocompletado con contexto del proyecto      |

### Flujo: Documentación → Agente

```
docs/arquitectura/backend.md  ──┐
docs/api/autenticacion.md     ──┤
docs/integraciones/pagos.md   ──┼──→  CLAUDE.md (referencia centralizada)
docs/guias/variables-entorno.md┘      ↓
                                   Claude CLI lee CLAUDE.md
                                   y tiene contexto completo
                                   del proyecto
```

Para **Gemini** (bot del cliente), el system prompt contiene información extraída de:

- Planes y precios (`i18n.ts`)
- Servicios ofrecidos
- Información del equipo
- Preguntas frecuentes

## Reglas de Documentación

### 1. Cada cambio significativo incluye su doc

Si agregás un endpoint, documentalo en `docs/api/`. Si cambiás la arquitectura, actualizá `docs/arquitectura/`.

### 2. Markdown puro

- Sin herramientas externas (no Notion, no Confluence)
- Diagramas en Mermaid (renderiza en GitHub y VS Code)
- Links relativos entre documentos

### 3. Español para docs, inglés para código

- Documentación técnica: **español** (nuestro equipo es hispanohablante)
- Variables, funciones, clases: **inglés** (estándar de la industria)
- UI del producto: **bilingüe** vía sistema i18n

### 4. Estructura modular

Cada documento debe ser:

- **Autocontenido:** Se entiende sin leer otros docs
- **Linkeable:** Tiene una ruta única en `docs/`
- **Conciso:** Va al punto, sin relleno

### 5. Actualización continua

La documentación desactualizada es peor que no tener documentación. Si algo cambia en el código, el doc correspondiente se actualiza en el mismo PR.

## Estructura del Knowledge Base

```
proyecto/
├── CLAUDE.md                    ← Punto de entrada para Claude CLI
├── .github/
│   └── copilot-instructions.md  ← Contexto para VS Code Copilot
├── .claude/
│   └── agents/
│       └── pidgeon-claude.agent.md  ← Agente Claude personalizado
└── docs/
    ├── README.md                ← Índice maestro (este directorio)
    ├── filosofia/               ← Doc as Code, principios
    ├── roadmap.md               ← Hoja de ruta
    ├── arquitectura/            ← Cómo está construido
    ├── guias/                   ← Cómo trabajar con el proyecto
    ├── api/                     ← Referencia de endpoints
    ├── integraciones/           ← Servicios externos
    ├── mcp/                     ← Model Context Protocol
    └── claude/                  ← Guía del agente de desarrollo
```

## ¿Cómo contribuir a la documentación?

1. Identificá qué sección de `docs/` corresponde al cambio
2. Si no existe, creá un nuevo `.md` en la carpeta apropiada
3. Agregá el link en `docs/README.md` (índice maestro)
4. Si afecta al agente Claude, verificá que `CLAUDE.md` siga siendo preciso
5. Commiteá la doc junto al código en el mismo PR

---

> **Principio fundamental:** Si no está en `docs/`, no existe. Si un agente no puede leerlo, no puede ayudarte.
