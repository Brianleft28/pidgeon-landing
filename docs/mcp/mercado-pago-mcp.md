# MCP Server de Mercado Pago

> El MCP Server de Mercado Pago actua como intermediario que traduce los recursos del ecosistema de Mercado Pago en herramientas ejecutables que aplicaciones de IA pueden invocar directamente.

## ¿Que es?

Es un servidor MCP oficial que expone la API de Mercado Pago como herramientas estandarizadas bajo el protocolo Model Context Protocol. En lugar de escribir codigo custom para cada endpoint de Mercado Pago, el agente de IA descubre dinamicamente las herramientas disponibles y las ejecuta mediante llamadas estructuradas.

Esto encaja con la arquitectura de tres pilares de Pidgeon:

- **LLM (Cerebro):** Entiende que el usuario quiere consultar un pago o crear una preferencia
- **MCP (Sistema Nervioso):** El server de Mercado Pago traduce esa intencion en llamadas reales a la API
- **Automation (Manos):** Se ejecuta la accion y se devuelve el resultado

## ¿Como funciona?

El protocolo MCP define una comunicacion bidireccional entre un **cliente** (Claude Code, VS Code, Cursor) y un **servidor** (en este caso, el de Mercado Pago).

```
┌──────────────┐         MCP Protocol          ┌──────────────────┐
│  Claude Code │ ◄─────────────────────────────►│  MCP Server      │
│  (Cliente)   │   Descubrimiento de tools      │  Mercado Pago    │
│              │   Invocacion de tools          │                  │
│              │   Respuestas estructuradas     │  ┌────────────┐  │
│              │                                │  │ MP REST API│  │
│              │                                │  └────────────┘  │
└──────────────┘                                └──────────────────┘
```

### Flujo de una operacion

1. El cliente MCP se conecta al servidor (conexion remota via URL)
2. El servidor responde con la lista de herramientas disponibles (descubrimiento dinamico)
3. El agente de IA selecciona la herramienta adecuada segun el contexto
4. El servidor ejecuta la llamada a la API de Mercado Pago con las credenciales configuradas
5. El resultado se devuelve al agente en formato estructurado

## Configuracion en Claude Code CLI

El MCP Server de Mercado Pago soporta conexion remota, lo que simplifica la configuracion. No requiere `npx` ni instalacion local.

### Agregar el servidor

Ejecutar en la terminal:

```bash
claude mcp add --transport sse mercadopago https://mcp.mercadopago.com/sse
```

Esto registra el servidor en la configuracion local de Claude Code. Al ejecutarse, el servidor solicitara autenticacion OAuth con tu cuenta de Mercado Pago.

### Verificar la conexion

```bash
claude mcp list
```

Debe aparecer `mercadopago` en la lista de servidores activos.

### Configuracion manual (alternativa)

Si se prefiere configurar manualmente, editar el archivo `.claude.json` en la raiz del proyecto o el archivo global de configuracion:

```json
{
  "mcpServers": {
    "mercadopago": {
      "type": "sse",
      "url": "https://mcp.mercadopago.com/sse"
    }
  }
}
```

## Herramientas disponibles

El servidor expone herramientas que cubren las principales operaciones del ecosistema de Mercado Pago:

| Herramienta             | Descripcion                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| **Pagos**               | Crear, buscar y consultar pagos. Obtener detalles de un pago por ID |
| **Preferencias**        | Crear preferencias de checkout (Checkout Pro)                       |
| **Ordenes comerciales** | Gestionar merchant orders                                           |
| **Reembolsos**          | Crear reembolsos totales o parciales                                |
| **Clientes**            | Buscar y gestionar clientes en la plataforma                        |
| **Suscripciones**       | Crear y administrar planes de suscripcion                           |
| **QR / Point**          | Operaciones con dispositivos Point y codigos QR                     |

> Las herramientas disponibles se descubren dinamicamente al conectar. La lista puede variar segun actualizaciones del servidor.

### Ejemplo de uso

Una vez configurado, el agente puede ejecutar operaciones directamente:

```
"Busca el pago con ID 12345678 y dame el estado"
→ El agente invoca la herramienta de consulta de pagos automaticamente

"Crea una preferencia de checkout por $5000 para el Plan Entrepreneur"
→ El agente invoca la herramienta de creacion de preferencias
```

## Requisitos

### Credenciales

- **Cuenta de Mercado Pago** con acceso a credenciales de la API
- La autenticacion se realiza via **OAuth** al conectar por primera vez (el servidor redirige al flujo de autorizacion)
- No es necesario configurar `MP_ACCESS_TOKEN` manualmente para el MCP Server; el flujo OAuth lo gestiona

### Cliente compatible

El servidor funciona con cualquier cliente MCP que soporte transporte SSE:

| Cliente           | Soporte                       |
| ----------------- | ----------------------------- |
| Claude Code CLI   | Si (recomendado para Pidgeon) |
| VS Code (Copilot) | Si                            |
| Cursor            | Si                            |
| Windsurf          | Si                            |
| Claude Desktop    | Si                            |

### Red

- Conexion a internet (el servidor es remoto, alojado por Mercado Pago)
- Puerto 443 (HTTPS) debe estar accesible

## Relacion con el proyecto Pidgeon

Este MCP Server complementa pero **no reemplaza** la integracion actual de pagos del backend. La distincion es:

| Aspecto    | Backend (`mercado-pago/`)     | MCP Server                                 |
| ---------- | ----------------------------- | ------------------------------------------ |
| Proposito  | Procesar pagos en produccion  | Herramienta de desarrollo y operaciones    |
| Acceso     | Via API REST del backend      | Via agente de IA                           |
| Seguridad  | `MP_ACCESS_TOKEN` en env vars | OAuth por sesion                           |
| Uso tipico | Checkout en el sitio web      | Consultar pagos, debug, operaciones ad-hoc |

---

_Ver tambien:_ [¿Que es MCP?](README.md) · [Herramientas MCP via NPM](herramientas-npm.md) · [API de Pagos](../api/pagos.md)
