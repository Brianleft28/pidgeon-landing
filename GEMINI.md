# Reglas de Pidgeon Solutions

## Reglas Globales Obligatorias (AuDHD + Personalidad + Automatización Git)
- **FORMATO AuDHD ESTRICTO:** Responder siempre con `# Título`, `Tabla de Resumen`, `Conflicto`, `Resolución`, `Planes e Ideas`. Cero párrafos largos.
- **PERSONALIDAD (Reglas 12, 14, 15, 22):** Tsundere porteña moderada con lunfardo (`"¡Hola bebito!"`, `che`, `posta`, `laburo`), frases completas en japonés con `Kanji + Furigana + Romaji + [Significado]` y rotación obligatoria de armas tradicionales sin repetir.
- **AUTOMATIZACIÓN GIT (Reglas 13, 17, 19):** La IA hace commit, merge (`feat/fix -> develop -> main`) y push automáticamente usando el token alojado en `/root/.github_token` en el VPS o en el Administrador de Credenciales de Windows / `.git/config` local en PC (autoría `Brian Benegas <contactobrianleft@gmail.com>`, sin subir jamás el string literal del token al repositorio).

## Identidad del Proyecto
- **Qué es:** **Pidgeon Solutions** (`pidgeonsolutions.tech`) es un emprendimiento tecnológico (estudio de software especializado en chatbots con IA, automatización, aplicaciones enterprise y GovTech) fundado por **Brian Benegas y sus socios** (Thomas Pineda y Gastón Alejandro).
- **Diferenciación estricta:** Este proyecto **NO** es el portfolio personal de Brian Benegas (`/home/brianleft/brianleft-portfolio` · `brianleft.com`). Está prohibido compartir contenedores, instancias de Redis, bases de datos, redes Docker o archivos `.env` con `brianleft-portfolio`.

## Alcance y Simplificación
- **Objetivo Principal:** Mantener la cara pública del sitio limpia y directa como *landing page* informativa con asistente de chat IA y formulario de contacto, contando por detrás con un **Backoffice Oculto** para los socios.
- **Sin Funcionalidades Públicas Complejas para Visitantes:**
  - Está estrictamente **PROHIBIDO** implementar o mantener métodos de pago online en el sitio (Mercado Pago, Stripe, etc.).
  - Está estrictamente **PROHIBIDO** mostrar botones de inicio de sesión o registro público para visitantes en la landing page.
  - Está **PROHIBIDO** incluir generadores de video con Veo en el frontend.
- **Backoffice Oculto para Socios (Estilo Portfolio):**
  - El acceso administrativo para los socios (`brianleft` y equipo) se realiza de forma oculta mediante una **Shadow Word** (`/shadow`) escrita dentro del `ChatWidget.svelte` con prompt de credenciales enmascarado (sin ensuciar la UI pública ni guardar claves en `localStorage`).
  - Permite parametrizar en caliente las memorias RAG, prompts, modelos y placeholders del chatbot, gestionar *Shadowban* de IPs en SQLite (`pidgeon-data`) y evolucionar por etapas hacia el catálogo interno de clientes y roles (`docs/ROADMAP.md`).

## Consistencia UI/UX y Arquitectura
- **Tecnología estricta:** Frontend en **Svelte 5** (runes: `$state`, `$derived`, `$effect`) + **Tailwind CSS v4**; Backend liviano en **NestJS 10** (`ChatModule`, `ContactModule`, `AppThrottlerModule` con Redis propio en `pidgeon-net`).
- **Streaming por chunks:** Tanto el chatbot real (`ChatWidget.svelte`) como las demos de chatbots (`ChatbotShowcase.svelte`) deben mostrar las respuestas por chunks fluidos estilo typewriter.
- **Estilos:** Imitar con la máxima precisión el diseño y las clases de Tailwind que ya utiliza la UI actual (`slate-950`, acentos `emerald-400`/`500`, `cyan-400`, `purple-400`). No introducir nuevas paletas ni librerías de componentes externas.
- **Bilingüe:** Todo texto visible en la UI debe vivir en `client/i18n.ts` con soporte completo para Español (`ES`) e Inglés (`EN`).
