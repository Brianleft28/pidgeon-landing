# Despliegue — Docker Compose

## Requisitos del Servidor

| Recurso        | Mínimo                | Recomendado      |
| -------------- | --------------------- | ---------------- |
| CPU            | 1 vCPU                | 2 vCPU           |
| RAM            | 1 GB                  | 2 GB             |
| Disco          | 10 GB                 | 20 GB            |
| OS             | Linux (Ubuntu 22.04+) | Ubuntu 24.04 LTS |
| Docker         | 20.x+                 | Última estable   |
| Docker Compose | 2.x+                  | Última estable   |

## Paso 1: Preparar el Servidor

```bash
# Instalar Docker (Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Verificar
docker --version
docker compose version
```

## Paso 2: Clonar el Repositorio

```bash
git clone <url-del-repo>
cd pidgeon
```

## Paso 3: Configurar Variables de Producción

Crear `backend/.env` con valores de producción:

```env
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=pidgeon
DB_PASSWORD=<password_seguro_generado>
DB_DATABASE=pidgeon_db

JWT_SECRET=<secret_seguro_generado>

MP_ACCESS_TOKEN=<token_produccion_mercadopago>

GEMINI_API_KEY=<api_key_gemini>

TYPEORM_SYNC=false
```

> **Importante:**
>
> - `TYPEORM_SYNC=false` en producción — usar migraciones
> - Generar passwords seguros: `openssl rand -base64 32`
> - Nunca commitear el archivo `.env`

Actualizar contraseñas de MySQL en `docker-compose.yml`:

```yaml
mysql:
  environment:
    - MYSQL_ROOT_PASSWORD=<password_seguro>
    - MYSQL_PASSWORD=<mismo_que_DB_PASSWORD>
```

## Paso 4: Build y Deploy

```bash
# Build y levantar en background
docker compose up -d --build

# Verificar estado
docker compose ps

# Ver logs
docker compose logs -f
```

## Paso 5: Ejecutar Migraciones

```bash
# Entrar al contenedor del backend
docker compose exec backend sh

# Correr migraciones
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d src/db/data-source.ts
```

## Verificación Post-Deploy

```bash
# Frontend (debería cargar la landing page)
curl -I http://localhost:80

# Backend (debería responder)
curl http://localhost:3000

# MySQL (debería conectar)
docker compose exec mysql mysql -u pidgeon -p pidgeon_db -e "SHOW TABLES;"
```

## HTTPS con Nginx Reverse Proxy

Para producción, se recomienda agregar un reverse proxy con SSL:

```nginx
# /etc/nginx/sites-available/pidgeon
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name tu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Instalar Certbot para SSL gratuito
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

## Actualización (Re-deploy)

```bash
cd pidgeon

# Traer últimos cambios
git pull origin main

# Rebuild y restart
docker compose up -d --build

# Correr nuevas migraciones (si hay)
docker compose exec backend sh -c "npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d src/db/data-source.ts"
```

## Backup de Base de Datos

```bash
# Backup
docker compose exec mysql mysqldump -u pidgeon -p pidgeon_db > backup_$(date +%Y%m%d).sql

# Restore
docker compose exec -T mysql mysql -u pidgeon -p pidgeon_db < backup_20260307.sql
```

## Monitoreo Básico

```bash
# Estado de los contenedores
docker compose ps

# Uso de recursos
docker stats

# Logs del backend (últimas 100 líneas)
docker compose logs --tail=100 backend

# Logs en tiempo real
docker compose logs -f
```

---

_Ver también:_ [Variables de Entorno](variables-entorno.md) · [Infraestructura](../arquitectura/infraestructura.md) · [Configuración Local](configuracion-local.md)
