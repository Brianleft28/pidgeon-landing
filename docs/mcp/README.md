# MCP — Model Context Protocol

## ¿Qué es MCP?

**MCP (Model Context Protocol)** es un protocolo abierto creado por Anthropic que permite a los modelos de IA conectarse a herramientas y datos externos de forma estandarizada. En la filosofía de Pidgeon Solutions, MCP es el **"Sistema Nervioso"** que conecta la inteligencia artificial con los datos reales del negocio.

## Los Tres Pilares de Pidgeon

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     LLM     │    │     MCP     │    │ Automation  │
│  (Cerebro)  │◄──►│  (Sistema   │◄──►│  (Manos)    │
│             │    │  Nervioso)  │    │             │
│ Entiende,   │    │ Conecta con │    │ Ejecuta la  │
│ razona,     │    │ datos reales│    │ tarea:      │
│ decide      │    │ en tiempo   │    │ enviar mail,│
│             │    │ real        │    │ actualizar  │
│             │    │             │    │ CRM, alertar│
└─────────────┘    └─────────────┘    └─────────────┘
```

### Analogía Práctica

| Pilar                      | ¿Qué hace?                                 | Ejemplo                                        |
| -------------------------- | ------------------------------------------ | ---------------------------------------------- |
| **LLM** (Cerebro)          | Entiende lenguaje natural, razona          | "El cliente pregunta por stock del producto X" |
| **MCP** (Sistema Nervioso) | Conecta con bases de datos, APIs, archivos | Lee el inventario real desde la base de datos  |
| **Automation** (Manos)     | Ejecuta acciones                           | Envía la respuesta al cliente por WhatsApp     |

## ¿Cómo usamos MCP en Pidgeon?

### Para Desarrollo (Claude)

Claude Code CLI puede conectarse a herramientas MCP para:

- Leer/buscar archivos del proyecto (`filesystem`)
- Interactuar con GitHub (issues, PRs) (`github`)
- Consultar la base de datos en desarrollo (`database`)

### Para Clientes (Futuro)

Cuando un cliente contrata un sistema Custom, MCP permite:

- Conectar el bot AI a su inventario real
- Leer datos de su Excel/Google Sheets
- Enviar notificaciones automáticas por WhatsApp
- Sincronizar con su CRM existente

## MCP vs API Tradicional

| Aspecto      | API Tradicional                 | MCP                         |
| ------------ | ------------------------------- | --------------------------- |
| Integración  | Código custom por cada servicio | Protocolo estándar          |
| Herramientas | Endpoints fijos                 | Descubrimiento dinámico     |
| IA           | No nativa                       | Diseñado para modelos de IA |
| Setup        | Desarrollo extenso              | Configuración declarativa   |

## Recursos

- [Especificación MCP](https://modelcontextprotocol.io/) — Documentación oficial
- [MCP Servers](https://github.com/modelcontextprotocol/servers) — Servers oficiales de Anthropic
- [Guía de Herramientas NPM](herramientas-npm.md) — Cómo usar herramientas MCP vía npx
- [MCP Server de Mercado Pago](mercado-pago-mcp.md) — Integración de Mercado Pago como herramienta MCP

---

_Ver también:_ [Herramientas MCP via NPM](herramientas-npm.md) · [MCP Server de Mercado Pago](mercado-pago-mcp.md) · [Agente Claude](../claude/README.md) · [Doc as Code](../filosofia/doc-as-code.md)
