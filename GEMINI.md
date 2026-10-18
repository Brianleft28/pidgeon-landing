# Reglas de Pidgeon Solutions

## Identidad del Proyecto
- **Qué es:** **Pidgeon Solutions** (`pidgeonsolutions.tech`) es un emprendimiento tecnológico (estudio de software especializado en GovTech, aplicaciones enterprise, automatización y chatbots con IA) fundado por **Brian Benegas y sus socios** (Gastón Alejandro).
- **Diferenciación estricta:** Este proyecto **NO** es el portfolio personal de Brian Benegas (`/home/brianleft/brianleft-portfolio` · `brianleft.com`). Está prohibido compartir contenedores, instancias de Redis, bases de datos, redes Docker o archivos `.env` con `brianleft-portfolio`.

## Alcance y Simplificación
- **Objetivo Principal:** Mantener la aplicación lo más simple posible, funcionando exclusivamente como una *landing page* informativa con asistente de chat IA y formulario de contacto.
- **Sin Funcionalidades Complejas:**
  - Está estrictamente **PROHIBIDO** implementar o mantener métodos de pago en el sitio (Mercado Pago, Stripe, etc.).
  - Está estrictamente **PROHIBIDO** implementar o mantener sistemas de inicio de sesión o registro (Login, Auth, JWT, base de datos de usuarios).
  - Está **PROHIBIDO** incluir generadores de video con Veo en el frontend.

## Consistencia UI/UX y Arquitectura
- **Tecnología estricta:** Frontend en **Svelte 5** (runes: `$state`, `$derived`, `$effect`) + **Tailwind CSS v4**; Backend liviano en **NestJS 10** (`ChatModule`, `ContactModule`, `AppThrottlerModule` con Redis propio en `pidgeon-net`).
- **Streaming por chunks:** Tanto el chatbot real (`ChatWidget.svelte`) como las demos de chatbots (`ChatbotShowcase.svelte`) deben mostrar las respuestas por chunks fluidos estilo typewriter.
- **Estilos:** Imitar con la máxima precisión el diseño y las clases de Tailwind que ya utiliza la UI actual (`slate-950`, acentos `emerald-400`/`500`, `cyan-400`, `purple-400`). No introducir nuevas paletas ni librerías de componentes externas.
- **Bilingüe:** Todo texto visible en la UI debe vivir en `client/i18n.ts` con soporte completo para Español (`ES`) e Inglés (`EN`).
