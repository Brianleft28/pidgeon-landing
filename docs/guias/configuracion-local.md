# Configuración Local — Guía de Onboarding

> Esta guía está diseñada para que un nuevo desarrollador pueda tener el proyecto corriendo en su máquina en menos de 15 minutos.

## Prerequisitos

| Herramienta    | Versión Mínima | Instalación                           |
| -------------- | -------------- | ------------------------------------- |
| Node.js        | 18.x+          | [nodejs.org](https://nodejs.org/)     |
| pnpm           | 8.x+           | `npm install -g pnpm`                 |
| Docker         | 20.x+          | [docker.com](https://www.docker.com/) |
| Docker Compose | 2.x+           | Incluido con Docker Desktop           |
| Git            | 2.x+           | [git-scm.com](https://git-scm.com/)   |

## Paso 1: Clonar el Repositorio

```bash
git clone <url-del-repo>
cd pidgeon
```

## Paso 2: Configurar Variables de Entorno

### Backend

Crear `backend/.env`:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=pidgeon
DB_PASSWORD=pidgeon
DB_DATABASE=pidgeon_db

# Auth
JWT_SECRET=tu_secret_seguro_cambiar_en_produccion

# Mercado Pago
MP_ACCESS_TOKEN=TEST-xxxxxxxx

# Gemini (Bot de chat)
GEMINI_API_KEY=tu_api_key_de_google

# TypeORM
TYPEORM_SYNC=true
```

> **Nota:** `TYPEORM_SYNC=true` solo en desarrollo. Crea las tablas automáticamente. En producción, usar migraciones.

### Frontend

Crear `client/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

→ Referencia completa de variables en [variables-entorno.md](variables-entorno.md)

## Paso 3: Opción A — Con Docker (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Verificar que los 3 servicios estén running
docker-compose ps
```

Servicios disponibles:

- **Frontend:** http://localhost:80
- **Backend API:** http://localhost:3000
- **MySQL:** localhost:3306

### Verificar que funciona

```bash
# Backend health
curl http://localhost:3000

# Auth endpoint
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## Paso 3: Opción B — Sin Docker (Manual)

### 3.1 MySQL

Necesitás una instancia de MySQL 8.0 corriendo. Podés usar:

- MySQL Server instalado localmente
- Docker solo para MySQL: `docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=pidgeon_db mysql:8.0`

### 3.2 Backend

```bash
cd backend
pnpm install
pnpm run start:dev
```

El backend corre en `http://localhost:3000`.

### 3.3 Frontend

```bash
cd client
pnpm install
pnpm dev
```

El frontend corre en `http://localhost:5173` (Vite dev server).

## Paso 4: Verificar Todo

| Servicio | URL                                         | Esperado                |
| -------- | ------------------------------------------- | ----------------------- |
| Frontend | http://localhost:80 (Docker) o :5173 (Vite) | Landing page de Pidgeon |
| Backend  | http://localhost:3000                       | Respuesta del servidor  |
| MySQL    | localhost:3306                              | Conexión activa         |

## Desarrollo Diario

```bash
# Con Docker (rebuild tras cambios en Dockerfile o dependencias)
docker-compose up -d --build

# Ver logs en tiempo real
docker-compose logs -f backend

# Sin Docker
cd backend && pnpm run start:dev   # Terminal 1
cd client && pnpm dev              # Terminal 2
```

## Estructura de Branches (Convención)

```
main              ← Producción estable
├── develop       ← Integración de features
│   ├── feature/nombre-descriptivo
│   ├── fix/descripcion-del-bug
│   └── docs/seccion-actualizada
```

## Troubleshooting

### "ECONNREFUSED" al conectar a MySQL

- Verificar que MySQL esté corriendo: `docker-compose ps`
- En modo manual, verificar que `DB_HOST=localhost` en `.env`
- En Docker, `DB_HOST=mysql` (nombre del servicio)

### "Module not found" en backend

```bash
cd backend && pnpm install
```

### Puerto 80 ocupado

- En Windows: `netstat -ano | findstr :80`
- Cambiar el puerto en `docker-compose.yml`: `"8080:80"`

### HMR no funciona en Vite

- Verificar que `client/.env.local` existe
- Reiniciar el dev server: `pnpm dev`

---

_Ver también:_ [Variables de Entorno](variables-entorno.md) · [Despliegue](despliegue.md) · [Arquitectura](../arquitectura/README.md)
