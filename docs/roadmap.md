# Roadmap — Pidgeon Solutions

> Hoja de ruta del producto. Actualizada como parte de la filosofía [Doc as Code](filosofia/doc-as-code.md).

---

## Estado Actual (Marzo 2026)

### ✅ Completado

| Feature               | Descripción                                               | Estado        |
| --------------------- | --------------------------------------------------------- | ------------- |
| Sitio Web Principal   | Landing page con Hero, Servicios, Pricing, FAQ, Equipo    | ✅ Producción |
| Sistema i18n          | Soporte bilingüe ES/EN con store reactivo                 | ✅ Producción |
| Autenticación         | JWT + bcrypt con registro y login                         | ✅ Producción |
| Mercado Pago          | Integración de pagos con SDK v2                           | ✅ Producción |
| Docker Compose        | 3 servicios: backend, client, MySQL                       | ✅ Producción |
| Sección RDD           | Terminal interactivo + educación sobre LLM/MCP/Automation | ✅ Producción |
| VeoDemo               | Generación de imágenes y video con Google GenAI           | ✅ Producción |
| Documentación Técnica | Docs completos en español (Doc as Code)                   | ✅ Producción |
| Agente Claude         | Configurado para desarrollo (CLI + VS Code)               | ✅ Producción |

### 🚧 En Desarrollo

| Feature                    | Descripción                                                | Prioridad |
| -------------------------- | ---------------------------------------------------------- | --------- |
| Bot Gemini (Backend Proxy) | Chat widget con Gemini vía backend NestJS (API key segura) | 🔴 Alta   |
| Widget Flotante de Chat    | Rediseño del ChatWidget como burbuja flotante moderna      | 🔴 Alta   |

---

## Q2 2026 (Abril — Junio)

### 🎯 Objetivos del Trimestre

- Lanzar el bot de asistencia al cliente con Gemini
- Establecer pipeline CI/CD
- Primer contratado / colaborador externo

### Planificado

| Feature                   | Descripción                                                 | Prioridad |
| ------------------------- | ----------------------------------------------------------- | --------- |
| CI/CD Pipeline            | GitHub Actions: lint, build, test, deploy automático        | 🔴 Alta   |
| Tests Unitarios (Backend) | Jest para services y controllers de NestJS                  | 🔴 Alta   |
| Tests E2E (Frontend)      | Playwright para flujos críticos (pricing, contact, chat)    | 🟡 Media  |
| Email Transaccional       | Confirmación de pagos aprobados vía email (Resend/SendGrid) | 🟡 Media  |
| Dashboard Admin           | Panel para gestionar clientes, pagos y métricas             | 🟡 Media  |
| Rate Limiting             | Protección contra abuso en endpoints públicos (chat, auth)  | 🟡 Media  |
| Logging Estructurado      | Winston/Pino con niveles, correlación de requests           | 🟢 Baja   |

---

## Q3 2026 (Julio — Septiembre)

### 🎯 Objetivos del Trimestre

- Escalar infraestructura para múltiples clientes
- Multi-tenancy o separación por proyecto
- Primer caso de uso enterprise

### Planificado

| Feature                           | Descripción                                                          | Prioridad |
| --------------------------------- | -------------------------------------------------------------------- | --------- |
| Multi-proyecto                    | Capacidad de gestionar múltiples sitios/clientes desde una instancia | 🔴 Alta   |
| CRM Interno                       | Gestión de leads, seguimiento de prospectos del sitio                | 🔴 Alta   |
| Integración WhatsApp Business API | Automatización de mensajes + bot vía WhatsApp                        | 🟡 Media  |
| Analytics Dashboard               | Métricas de uso, conversiones, tráfico                               | 🟡 Media  |
| PayPal / Stripe                   | Activar pasarelas de pago adicionales (código ya preparado)          | 🟡 Media  |
| MCP Servers Productivos           | Conectar agentes a datos reales de clientes vía MCP                  | 🟢 Baja   |
| Portugués (i18n)                  | Completar traducciones PT para mercado brasileño                     | 🟢 Baja   |

---

## Q4 2026 (Octubre — Diciembre)

### 🎯 Objetivos del Trimestre

- Producto SaaS estable
- Automatizaciones repetibles como servicio
- Base de clientes activa

### Planificado

| Feature                  | Descripción                                                        | Prioridad |
| ------------------------ | ------------------------------------------------------------------ | --------- |
| SaaS: Self-Service       | Clientes pueden registrarse y configurar su sitio sin intervención | 🔴 Alta   |
| Marketplace de Templates | Templates prediseñados para distintas industrias                   | 🟡 Media  |
| API Pública              | Documentación OpenAPI para integraciones de terceros               | 🟡 Media  |
| Mobile App               | App React Native / Expo para gestión on-the-go                     | 🟢 Baja   |

---

## Backlog (Sin Fecha Definida)

| Feature               | Notas                                               |
| --------------------- | --------------------------------------------------- |
| Integración AFIP      | Facturación electrónica para mercado argentino      |
| Bot de Telegram       | Canal adicional de comunicación                     |
| A/B Testing Framework | Para optimizar landing pages de clientes            |
| Kubernetes Migration  | Cuando Docker Compose no sea suficiente             |
| Métricas de IA        | Dashboard de uso/costo de tokens de Gemini y Claude |

---

## Principios de Priorización

1. **Valor para el cliente** sobre complejidad técnica
2. **Seguridad** es siempre prioridad alta
3. **Documentación** acompaña cada feature (Doc as Code)
4. **Automatización** antes que trabajo manual repetitivo
5. **Iteración rápida** — MVP funcional, luego iterar

---

## Cómo Proponer Features

1. Abrir un Issue en GitHub con el tag `feature-request`
2. Describir: qué problema resuelve, para quién, y criterio de aceptación
3. El equipo lo revisa y lo ubica en el roadmap según prioridad
4. Una vez aprobado, se crea la documentación en `docs/` antes o durante la implementación

---

_Última actualización: Marzo 2026_
