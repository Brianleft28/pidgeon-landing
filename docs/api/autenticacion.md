# API — Autenticación

## Resumen

El sistema de autenticación usa **JWT (JSON Web Tokens)** con **bcrypt** para hashing de contraseñas. Implementado con **Passport.js** en NestJS.

## Endpoints

### `POST /auth/register`

Registra un nuevo usuario.

**Request:**

```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "mi_password_seguro"
}
```

**Response (201 Created):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errores:**
| Status | Body | Causa |
|--------|------|-------|
| 401 | `{ "message": "User already exists" }` | Email ya registrado |

**Notas:**

- El password se hashea con `bcrypt.hash(password, 10)` antes de guardarse
- Al registrar, se asigna el rol `['user']` por defecto
- Retorna un JWT inmediatamente (login automático post-registro)

---

### `POST /auth/login`

Autentica un usuario existente.

**Request:**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "mi_password_seguro"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errores:**
| Status | Body | Causa |
|--------|------|-------|
| 200 | `{ "error": "Invalid credentials" }` | Email no encontrado o password incorrecta |

**Notas:**

- Compara el password con `bcrypt.compare(password, user.password)`
- No expone si el error fue por email o password (seguridad)

---

## JWT Token

### Payload

```json
{
  "sub": "uuid-del-usuario",
  "email": "usuario@email.com",
  "roles": ["user"],
  "iat": 1679000000
}
```

### Uso en Requests Protegidos

```http
GET /ruta-protegida
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Configuración

| Parámetro  | Valor                           | Fuente                    |
| ---------- | ------------------------------- | ------------------------- |
| Algoritmo  | HS256                           | Default de `@nestjs/jwt`  |
| Secret     | `JWT_SECRET`                    | Variable de entorno       |
| Extracción | `Authorization: Bearer <token>` | Header                    |
| Expiración | Sin configurar                  | TODO: agregar `expiresIn` |

## Flujo Visual

```mermaid
graph TD
    A[POST /auth/register] -->|email + password| B{¿Existe el email?}
    B -->|Sí| C[401: User already exists]
    B -->|No| D[bcrypt.hash password]
    D --> E[Crear User en DB]
    E --> F[Generar JWT]
    F --> G[200: access_token]

    H[POST /auth/login] -->|email + password| I[Buscar User por email]
    I -->|No encontrado| J[200: error Invalid credentials]
    I -->|Encontrado| K[bcrypt.compare]
    K -->|No match| J
    K -->|Match| F
```

## Modelo de Datos: User

```typescript
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hash bcrypt, nunca plain text

  @Column({ type: "simple-array", default: "user" })
  roles: UserRole[]; // 'admin' | 'user'

  @CreateDateColumn()
  createdAt: Date;
}
```

## Pendiente (TODO)

- [ ] Agregar `expiresIn` al JWT (ej: `'7d'`)
- [ ] Refresh tokens para sesiones largas
- [ ] Rate limiting en `/auth/login` contra brute force
- [ ] Validación de email (formato, MX record)
- [ ] Validación de password (longitud mínima, complejidad)
- [ ] Endpoint `POST /auth/forgot-password`
- [ ] Roles-based guards (`@Roles('admin')`)

---

_Ver también:_ [Backend Architecture](../arquitectura/backend.md) · [Variables de Entorno](../guias/variables-entorno.md)
