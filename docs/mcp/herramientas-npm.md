# Herramientas MCP via NPM/NPX

> Las herramientas MCP se ejecutan **externamente** al proyecto (via `npx`). No se instalan como dependencias ni se agregan al `package.json`. Esto mantiene el proyecto limpio.

## ¿Qué son los MCP Servers?

Son programas que exponen herramientas a modelos de IA via el protocolo MCP. Se ejecutan como procesos independientes y se configuran en el cliente de IA (ej: Claude Desktop, VS Code).

## Servidores Recomendados

### 1. Filesystem — Acceso a archivos del proyecto

```bash
npx -y @modelcontextprotocol/server-filesystem /ruta/al/proyecto
```

**Permite al agente:**

- Leer archivos del proyecto
- Buscar contenido en archivos
- Listar estructura de directorios

**Configuración en Claude Desktop (`claude_desktop_config.json`):**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\Brian\\Desktop\\pidgeon"
      ]
    }
  }
}
```

### 2. GitHub — Gestión de repositorios

```bash
npx -y @modelcontextprotocol/server-github
```

**Permite al agente:**

- Crear y leer issues
- Crear y revisar Pull Requests
- Buscar código en el repositorio
- Gestionar branches

**Configuración:**

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxx"
      }
    }
  }
}
```

### 3. Database — Consultas SQL

```bash
npx -y @modelcontextprotocol/server-mysql
```

**Permite al agente:**

- Ejecutar consultas SELECT
- Ver estructura de tablas
- Analizar datos

> **Precaución:** Configurar solo con acceso READ-ONLY en producción.

### 4. Brave Search — Búsqueda web

```bash
npx -y @modelcontextprotocol/server-brave-search
```

**Permite al agente:**

- Buscar documentación actualizada
- Investigar errores y soluciones
- Verificar información técnica

**Configuración:**

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "BSA_xxxx"
      }
    }
  }
}
```

## Configuración Completa para el Proyecto

### Claude Desktop (`claude_desktop_config.json`)

Ubicación del archivo:

- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "pidgeon-files": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\Brian\\Desktop\\pidgeon"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxx"
      }
    }
  }
}
```

## Principio: No Sobrecargar el Proyecto

Los MCP servers son **herramientas externas**, no dependencias del proyecto:

| ✅ Correcto                                   | ❌ Incorrecto                                      |
| --------------------------------------------- | -------------------------------------------------- |
| `npx @modelcontextprotocol/server-filesystem` | `pnpm add @modelcontextprotocol/server-filesystem` |
| Configurar en Claude Desktop config           | Importar en `app.module.ts`                        |
| Ejecutar como proceso separado                | Incluir en Docker Compose                          |

**Razón:** Los MCP servers son herramientas de desarrollo, no parte de la aplicación. Mantenerlos separados evita inflar el proyecto y simplifica el deploy.

## Troubleshooting

### "npx: command not found"

```bash
npm install -g npx
```

### El server no aparece en Claude Desktop

1. Verificar que `claude_desktop_config.json` tiene el JSON válido
2. Reiniciar Claude Desktop completamente
3. Verificar que las rutas de archivos son correctas

### Permiso denegado en filesystem

- Verificar que la ruta apunta a un directorio accesible
- En Windows, usar `\\` o `/` en las rutas

---

_Ver también:_ [¿Qué es MCP?](README.md) · [Agente Claude](../claude/README.md) · [Doc as Code](../filosofia/doc-as-code.md)
