# Agente Claude — Guía de Uso

## ¿Qué es el Agente Claude?

En Pidgeon Solutions, **Claude** es nuestro agente de IA para desarrollo. Está configurado para entender la arquitectura, convenciones y stack del proyecto. Funciona en dos modos:

| Modo        | Herramienta         | Descripción                               |
| ----------- | ------------------- | ----------------------------------------- |
| **CLI**     | `claude` (terminal) | Claude Code — agente autónomo en terminal |
| **VS Code** | Copilot Chat        | Agente personalizado en el editor         |

## Claude Code CLI

### Instalación

```bash
npm install -g @anthropic-ai/claude-code
```

### Uso Básico

```bash
# Desde la raíz del proyecto
cd pidgeon
claude
```

Claude Code lee automáticamente `CLAUDE.md` en la raíz del proyecto, que contiene:

- Descripción del stack
- Estructura del proyecto
- Convenciones de código
- Comandos útiles
- Referencias a la documentación

### Ejemplos de Uso

```bash
# Pedir que agregue un endpoint
claude "Agregar endpoint GET /auth/me que retorne el usuario autenticado"

# Debugging
claude "El PaymentModal no se cierra después de un pago exitoso"

# Refactoring
claude "Refactorizar el ChatService para usar inyección de dependencias para la API key"

# Documentación
claude "Actualizar docs/api/autenticacion.md con el nuevo endpoint /auth/me"
```

### Cómo Funciona el Contexto

```
CLAUDE.md (raíz)
    ↓ Claude lee automáticamente
    ↓
Claude entiende:
    ├── Stack: NestJS + Svelte 5 + MySQL
    ├── Estructura: backend/src/, client/components/
    ├── Convenciones: TypeScript, feature modules, runes
    ├── Comandos: pnpm install, docker-compose up
    └── Referencias: docs/ para profundizar
```

## VS Code (Copilot Chat)

### Agente Personalizado

El archivo `.claude/agents/pidgeon-claude.agent.md` define un agente personalizado que aparece en VS Code al usar Copilot Chat.

### Uso

1. Abrir Copilot Chat en VS Code
2. Seleccionar el agente "Pidgeon Claude Agent"
3. Hacer preguntas sobre el proyecto con contexto automático

### Copilot Instructions

El archivo `.github/copilot-instructions.md` proporciona contexto adicional a GitHub Copilot para autocompletado y sugerencias más precisas.

## Qué Puede Hacer el Agente

### ✅ Optimizado Para

- Generar código NestJS (módulos, controllers, services, DTOs)
- Generar componentes Svelte 5 con runes
- Agregar traducciones al sistema i18n
- Crear/modificar TypeORM entities y migraciones
- Configurar Docker y docker-compose
- Escribir documentación en español
- Debugging con contexto del proyecto

### ❌ No Optimizado Para

- Diseño visual / CSS complejo (mejor usar un designer)
- Decisiones de negocio (eso es humano)
- Acceso a APIs externas en producción

## Alimentar al Agente (Knowledge Base)

El agente es tan bueno como el contexto que tiene. Seguir la filosofía [Doc as Code](../filosofia/doc-as-code.md):

1. **Cada cambio importante → actualizar docs**
2. **Cada nuevo módulo → documentar en `docs/arquitectura/`**
3. **Cada nuevo endpoint → documentar en `docs/api/`**
4. **CLAUDE.md** se mantiene como resumen ejecutivo

Esto asegura que Claude siempre tiene información actualizada del proyecto.

## Archivos de Configuración

| Archivo                                  | Propósito                       | Leído por         |
| ---------------------------------------- | ------------------------------- | ----------------- |
| `CLAUDE.md`                              | Contexto principal del proyecto | Claude Code CLI   |
| `.claude/agents/pidgeon-claude.agent.md` | Agente personalizado en VS Code | VS Code Copilot   |
| `.github/copilot-instructions.md`        | Instrucciones de autocompletado | GitHub Copilot    |
| `docs/`                                  | Knowledge base detallado        | Todos los agentes |

---

_Ver también:_ [Doc as Code](../filosofia/doc-as-code.md) · [MCP](../mcp/README.md) · [Roadmap](../roadmap.md)
