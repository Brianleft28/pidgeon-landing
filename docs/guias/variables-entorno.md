# Variables de Entorno

## Backend (`backend/.env`)

| Variable          | Requerida | Default              | Descripción                                                             |
| ----------------- | --------- | -------------------- | ----------------------------------------------------------------------- |
| `DB_HOST`         | Sí        | `localhost`          | Host de MySQL. En Docker: `mysql` (nombre del servicio)                 |
| `DB_PORT`         | No        | `3306`               | Puerto de MySQL                                                         |
| `DB_USERNAME`     | Sí        | `root`               | Usuario de la base de datos                                             |
| `DB_PASSWORD`     | Sí        | —                    | Contraseña del usuario de DB                                            |
| `DB_DATABASE`     | Sí        | `pidgeon_db`         | Nombre de la base de datos                                              |
| `JWT_SECRET`      | Sí        | `change_this_secret` | Secret para firmar tokens JWT. **Cambiar en producción**                |
| `MP_ACCESS_TOKEN` | Sí\*      | —                    | Token de acceso de Mercado Pago. Sin él, los pagos fallan               |
| `GEMINI_API_KEY`  | Sí\*      | —                    | API key de Google Gemini para el bot de chat                            |
| `TYPEORM_SYNC`    | No        | `false`              | `true` = TypeORM sincroniza schema automáticamente. **Solo desarrollo** |
| `NODE_ENV`        | No        | —                    | `production` o `development`. Se pasa como build arg en Docker          |

> \* Necesarias para que sus respectivas funcionalidades operen. La app arranca sin ellas pero con funcionalidad limitada.

## Frontend (`client/.env.local`)

| Variable       | Requerida | Default | Descripción                                                         |
| -------------- | --------- | ------- | ------------------------------------------------------------------- |
| `VITE_API_URL` | Sí        | —       | URL base de la API del backend. En Docker se inyecta como build arg |

> **Nota:** En Vite, solo las variables con prefijo `VITE_` son accesibles en el código del cliente. Se acceden con `import.meta.env.VITE_*`.

## Docker Compose (`docker-compose.yml`)

| Variable                   | Servicio | Descripción                             |
| -------------------------- | -------- | --------------------------------------- |
| `MYSQL_ROOT_PASSWORD`      | mysql    | Password del usuario root de MySQL      |
| `MYSQL_DATABASE`           | mysql    | Nombre de la DB a crear automáticamente |
| `MYSQL_USER`               | mysql    | Usuario adicional con permisos en la DB |
| `MYSQL_PASSWORD`           | mysql    | Password del usuario adicional          |
| `VITE_API_URL` (build arg) | client   | URL de la API, inyectada en build-time  |
| `NODE_ENV` (build arg)     | backend  | Modo de ejecución                       |

## Ejemplo: Desarrollo Local

### `backend/.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=pidgeon_db
JWT_SECRET=dev_secret_no_usar_en_prod
MP_ACCESS_TOKEN=TEST-xxxx
GEMINI_API_KEY=AIzaSy-xxxx
TYPEORM_SYNC=true
```

### `client/.env.local`

```env
VITE_API_URL=http://localhost:3000
```

## Ejemplo: Docker Compose

### `backend/.env`

```env
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=pidgeon
DB_PASSWORD=pidgeon_seguro
DB_DATABASE=pidgeon_db
JWT_SECRET=produccion_secret_aleatorio_largo
MP_ACCESS_TOKEN=APP_USR-xxxx
GEMINI_API_KEY=AIzaSy-xxxx
TYPEORM_SYNC=false
```

> En Docker, `DB_HOST=mysql` porque es el nombre del servicio en la red bridge.

## Seguridad

- **Nunca commitear** archivos `.env` al repositorio
- Verificar que `.gitignore` incluye:
  ```
  .env
  .env.local
  .env.production
  ```
- En producción, generar secrets seguros:
  ```bash
  openssl rand -base64 32
  ```
- Considerar usar Docker Secrets o un vault (HashiCorp Vault, AWS Secrets Manager) para producción enterprise

---

_Ver también:_ [Configuración Local](configuracion-local.md) · [Despliegue](despliegue.md) · [Infraestructura](../arquitectura/infraestructura.md)
