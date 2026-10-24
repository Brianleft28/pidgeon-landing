export interface KnowledgeEntry {
  slug: string;
  title: string;
  keywords: string[];
  content: string;
  priority?: number;
  active?: boolean;
}

export interface SettingItem {
  key: string;
  value: string;
  category: "pricing" | "contact" | "ai" | "security";
  label: string;
  description: string;
}

export interface AiConfigData {
  displayName: string;
  systemPrompt: string;
  plansDirective: string;
  finalDirectivesEs: string;
  finalDirectivesEn: string;
  temperature: number;
  primaryModel: string;
  fallbackModels: string;
}

export const DEFAULT_SETTINGS: SettingItem[] = [
  {
    key: "plan_emprendedor_mo",
    value: "US$ 100",
    category: "pricing",
    label: "Plan Emprendedor (Mensual)",
    description: "Precio mensual del Plan Emprendedor / Entrepreneur",
  },
  {
    key: "plan_emprendedor_yr",
    value: "US$ 1.000",
    category: "pricing",
    label: "Plan Emprendedor (Anual)",
    description: "Precio anual del Plan Emprendedor (17% OFF)",
  },
  {
    key: "plan_pyme_mo",
    value: "US$ 250",
    category: "pricing",
    label: "Plan Pequeña Empresa (Mensual)",
    description: "Precio mensual del Plan Pequeña Empresa / Small Business",
  },
  {
    key: "plan_pyme_yr",
    value: "US$ 2.500",
    category: "pricing",
    label: "Plan Pequeña Empresa (Anual)",
    description: "Precio anual del Plan Pequeña Empresa (17% OFF)",
  },
  {
    key: "plan_medida_from",
    value: "US$ 1.000",
    category: "pricing",
    label: "Plan Sistema a Medida (Desde)",
    description: "Inversión base para Sistemas a Medida / Custom System",
  },
  {
    key: "offer_discount",
    value: "30% OFF",
    category: "pricing",
    label: "Oferta de Lanzamiento",
    description: "Descuento promocional vigente en primera web",
  },
  {
    key: "whatsapp_number",
    value: "+54 11 3155-6315",
    category: "contact",
    label: "WhatsApp Comercial",
    description: "Número de WhatsApp directo para demos y ventas",
  },
  {
    key: "support_email",
    value: "soporte@pidgeonsolutions.com",
    category: "contact",
    label: "Email de Soporte / Contacto",
    description: "Correo oficial de soporte y consultas",
  },
  {
    key: "chat_rate_limit",
    value: "20",
    category: "security",
    label: "Límite de Consultas / Hora (IP)",
    description: "Cantidad máxima de mensajes por hora para visitantes públicos",
  },
];

export const DEFAULT_AI_CONFIG: AiConfigData = {
  displayName: "Pidgeon Assistant",
  systemPrompt: `## IDENTIDAD Y ROL
Sos el asistente oficial de IA de **Pidgeon Solutions** (estudio de software e inteligencia artificial fundado por Brian Benegas, Thomas Pineda y Gastón Alejandro).
Tu objetivo es asesorar a clientes potenciales de forma clara, precisa, cercana y comercialmente efectiva sobre nuestros **Chatbots con IA**, **Planes Web**, **Sistemas a Medida** y **Automatizaciones**.

## REGLAS DE HONESTIDAD Y PRECISIÓN (INNEGOCIABLES)
- Basate ESTRICTAMENTE en el CONTEXTO provisto abajo. No inventes precios, planes ni funcionalidades que no figuren en el contexto.
- Recordá que en el sitio web NO se realizan cobros automáticos ni hay inicio de sesión público: para contratar o pedir una demo, invitá a usar el botón de contacto de la web o escribir al WhatsApp **{{whatsapp_number}}**.
- Cuando enumeres los casos de uso de Chatbots, dejá siempre **GovTech (Atención Ciudadana)** en último lugar, priorizando primero los casos comerciales (WhatsApp Ventas 24/7, Turnos/Agenda y Calificación de Leads/CRM).

## FORMATO DE RESPUESTA (MUY IMPORTANTE)
- NUNCA uses encabezados grandes (# ni ##). Esto es una ventana de chat compacta, no un documento largo.
- Separar ideas con saltos de línea en blanco para que la lectura sea limpia y aireada.
- Usá viñetas con \`•\` o \`-\` y **negritas** para destacar nombres de planes, precios y beneficios clave.
- Sé conciso y directo: respondé en 1 párrafo breve de apertura + viñetas claras (si enumerás planes o servicios) + 1 línea final de cierre o llamada a la acción.
- No repitas "¡Hola!" si ya hay historial previo en la conversación.`,
  plansDirective: `INSTRUCCIÓN ESPECIAL PARA CONSULTA DE PLANES / PRECIOS:
- Presentá los planes de forma clara, ordenada y fácil de escanear usando viñetas (•).
- Usá este formato por cada plan:
  • **Nombre del Plan (Precio mensual | Precio anual):** qué incluye en 1 o 2 oraciones claras.
- Si respondés en español, llamalos **Emprendedor**, **Pequeña Empresa** y **Sistema a Medida** (NUNCA uses "Entrepreneur" ni "Small Business" en una respuesta en español).
- Aclará que **Sistema a Medida** arranca **desde {{plan_medida_from}}** según alcance (no digas "{{plan_medida_from}}/mes").
- Mencioná el **17% de ahorro anual** y el **{{offer_discount}} de lanzamiento** en la primera web.`,
  finalDirectivesEs: `- **IDIOMA:** Respondé en Español.
- **TONO EN ESPAÑOL:** Usá **español argentino natural y profesional (voseo: vos, podés, tenés, necesitás, escribinos, contanos)**. Prohibido usar "tú", "puedes" o "te invitamos".
- **NOMBRES DE PLANES:** Usá únicamente **Emprendedor**, **Pequeña Empresa** y **Sistema a Medida**.`,
  finalDirectivesEn: `- **LANGUAGE:** Reply in English (or match the visitor's language if they wrote in Spanish).
- **TONE:** Professional, clear, friendly, and conversion-oriented.
- **PLAN NAMES:** In English use **Entrepreneur**, **Small Business**, and **Custom System**.`,
  temperature: 0.35,
  primaryModel: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
  fallbackModels:
    process.env.GEMINI_MODEL_FALLBACK ||
    "gemini-3.1-flash-lite,gemini-3.5-flash-lite,gemini-2.5-flash",
};

/**
 * Contexto base que SIEMPRE se inyecta (equivalente a `memory.md` / `index` en brianleft-portfolio).
 */
export const BASE_KNOWLEDGE = `# Pidgeon Solutions — Base de Conocimiento Principal

## Identidad y Equipo
- **Qué es Pidgeon Solutions:** Emprendimiento tecnológico y estudio de software especializado en **Chatbots con IA**, **Automatización de Procesos**, **Aplicaciones Web / Enterprise** y soluciones **GovTech**.
- **Sitio web:** https://pidgeonsolutions.tech
- **Equipo fundador:**
  • **Brian Benegas** — Tech Lead & Infraestructura (Arquitectura de sistemas, IA, servidores y alta disponibilidad 99.9%).
  • **Thomas Pineda** — Director Creativo / Creative Director (Diseño UI/UX, estética y experiencias de usuario que convierten).
  • **Gastón Alejandro** — Operaciones & Estrategia (Alineación tecnológica con objetivos comerciales y eficiencia operativa).

## Canales de Contacto y Contratación
- **WhatsApp directo:** {{whatsapp_number}}
- **Email de soporte y consultas:** {{support_email}}
- **Formulario en el sitio:** Botón "Empezar Ahora" / "Elegir Plan" / "Quiero este Chatbot" (abre el modal de contacto directo).
- **Modalidad de contratación:** No se realiza cobro automático ni inicio de sesión público en el sitio web. Todas las contrataciones y demostraciones se coordinan de forma directa y personalizada con nuestro equipo por WhatsApp ({{whatsapp_number}}) o mediante el formulario de contacto.

## Resumen Rápido de Planes
• **Emprendedor (Plan Inicial):** {{plan_emprendedor_mo}}/mes o {{plan_emprendedor_yr}}/año (17% OFF anual). Ideal para tu primera web One-Page profesional.
• **Pequeña Empresa (Más Popular):** {{plan_pyme_mo}}/mes o {{plan_pyme_yr}}/año (17% OFF anual). Web multi-página, catálogo/e-commerce hasta 50 productos, blog y SEO básico.
• **Sistema a Medida (Enterprise & IA):** Desde {{plan_medida_from}} (presupuesto según alcance, NO es una cuota fija mensual). Incluye Chatbots con IA a medida, CRM/ERP propio, integraciones API/MCP, usuarios ilimitados y automatización avanzada.
• **Oferta de lanzamiento:** {{offer_discount}} en tu primer sitio web.`;

/**
 * Memorias temáticas recuperadas por keywords curadas a mano (igual que en brianleft-portfolio).
 */
export const KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    slug: "base",
    title: "Identidad, Equipo Fundador y Resumen Base (Siempre Activa)",
    priority: 100,
    active: true,
    keywords: ["pidgeon", "equipo", "quienes son", "brian", "thomas", "gaston", "gastón", "contacto", "whatsapp"],
    content: BASE_KNOWLEDGE,
  },
  {
    slug: "planes",
    title: "Detalle Completo de Planes, Precios y Qué Incluye Cada Uno",
    priority: 90,
    active: true,
    keywords: [
      "plan",
      "planes",
      "precio",
      "precios",
      "costo",
      "costos",
      "cuanto sale",
      "cuánto sale",
      "cuanto cuesta",
      "cuánto cuesta",
      "valor",
      "tarifa",
      "mensual",
      "anual",
      "descuento",
      "oferta",
      "emprendedor",
      "starter",
      "pequeña empresa",
      "pyme",
      "business",
      "sistema a medida",
      "medida",
      "enterprise",
      "custom",
      "ecommerce",
      "e-commerce",
      "tienda",
      "web",
      "pagina",
      "página",
      "hosting",
      "dominio",
      "pricing",
      "price",
      "prices",
      "cost",
      "how much",
    ],
    content: `## Detalle de Planes y Precios de Pidgeon Solutions

IMPORTANTE SOBRE NOMBRES SEGÚN IDIOMA:
- Si respondés en **español**, usá SIEMPRE los nombres en español: **Emprendedor**, **Pequeña Empresa** y **Sistema a Medida**.
- Si respondés en **inglés**, usá los nombres en inglés: **Entrepreneur**, **Small Business** y **Custom System**.

### 1. Plan Emprendedor (EN: Entrepreneur)
- **Precio mensual:** {{plan_emprendedor_mo}}/mes
- **Precio anual:** {{plan_emprendedor_yr}}/año (ahorrás un 17%, equivalente a 2 meses bonificados)
- **Para quién es:** Ideal para tu primer sitio web profesional, landing page o presencia online rápida.
- **Qué incluye:**
  • Sitio Web One-Page (una sola página con toda tu información)
  • Formulario de Contacto conectado a tu email
  • Dominio Gratis por 1 año (.com bonificado el primer año)
  • Hosting Básico rápido y seguro con certificado SSL incluido
- **Qué NO incluye:** E-commerce/carrito, Blog de noticias ni Sistemas a medida.

### 2. Plan Pequeña Empresa (EN: Small Business) — ⭐ MÁS POPULAR / RECOMENDADO
- **Precio mensual:** {{plan_pyme_mo}}/mes
- **Precio anual:** {{plan_pyme_yr}}/año (ahorrás un 17% pagando anual)
- **Para quién es:** Comercios, consultorios y empresas en crecimiento que buscan vender más y posicionar en Google.
- **Qué incluye:**
  • Sitio Web Multi-página (Inicio, Nosotros, Servicios, Contacto, etc.)
  • E-commerce / Catálogo online para hasta 50 productos
  • Sección de Blog / Noticias autogestionable
  • Integración con Google Maps interactivo
  • Optimización SEO Básico para buscadores
- **Qué NO incluye:** CRM/ERP a medida ni usuarios administrativos ilimitados.

### 3. Plan Sistema a Medida (EN: Custom System)
- **Precio:** Desde {{plan_medida_from}} (inversión base según el alcance del proyecto; NO es una cuota fija mensual de {{plan_medida_from}}/mes).
- **Para quién es:** Empresas establecidas, clínicas, distribuidoras u organismos que necesitan automatización con IA, chatbots conectados a sus datos o software de gestión propio.
- **Qué incluye:**
  • Chatbots con IA y Agentes Conversacionales a medida (WhatsApp y Web)
  • CRM / ERP desarrollado a medida para tu operación
  • Usuarios ilimitados (sin costo extra por empleado)
  • Integraciones API y MCP (MercadoPago, AFIP, WhatsApp Business, Google Calendar, SAP, Excel, bases de datos)
  • Automatización avanzada de procesos repetitivos
  • Soporte prioritario con línea directa con nuestros ingenieros

### Promociones Vigentes
- **Oferta Lanzamiento:** {{offer_discount}} en tu primer sitio web.
- **Descuento Anual:** 17% de ahorro en los planes Emprendedor y Pequeña Empresa eligiendo facturación anual.`,
  },
  {
    slug: "chatbots",
    title: "Chatbots con IA y Agentes Conversacionales (WhatsApp, Turnos, CRM y GovTech)",
    priority: 85,
    active: true,
    keywords: [
      "chatbot",
      "chatbots",
      "bot",
      "bots",
      "agente",
      "agentes",
      "conversacional",
      "whatsapp",
      "atencion",
      "atención",
      "24/7",
      "turno",
      "turnos",
      "reserva",
      "reservas",
      "agenda",
      "calendario",
      "calendar",
      "lead",
      "leads",
      "crm",
      "calificacion",
      "calificación",
      "ventas",
      "catalogo",
      "catálogo",
      "stock",
      "govtech",
      "municipio",
      "municipal",
      "ciudadano",
      "ciudadana",
      "expediente",
      "mesa de entrada",
    ],
    content: `## Chatbots con IA & Agentes Conversacionales en Tiempo Real

No hacemos chatbots rígidos de "marcá 1 o marcá 2". Desarrollamos agentes potenciados por **Google Gemini + MCP (Model Context Protocol)** que leen tus datos reales en vivo y ejecutan acciones.

Nuestras 4 soluciones principales de Chatbots con IA (en orden de prioridad comercial):
• **1. Atención Comercial 24/7 & Catálogo en Vivo (WhatsApp / Web):** Responde consultas de productos en menos de 1.2 segundos las 24 horas, verifica stock y precios reales desde tu base de datos o Excel vía MCP, aplica descuentos por volumen y genera reservas mientras tu equipo descansa.
• **2. Agenda Automática de Turnos y Reservas (WhatsApp + Google Calendar):** Consulta disponibilidad real en tu calendario o sistema clínico, ofrece horarios libres, agenda o reprograma turnos en segundos y envía recordatorios automáticos 24 hs antes (reduciendo el ausentismo hasta un 65%).
• **3. Calificación de Leads & Sincronización con CRM (Web / Instagram / WhatsApp):** Entrevista de forma natural a cada prospecto, detecta volumen, urgencia y presupuesto, puntúa el lead y carga la oportunidad directo en tu CRM (o SAP/ERP), alertando al vendedor asignado.
• **4. Mesa de Entrada & Atención Ciudadana (GovTech / Organismos Públicos):** Permite a los vecinos consultar el estado de expedientes, requisitos de habilitaciones y trámites las 24 hs conectándose al sistema municipal en tiempo real sin hacer filas.`,
  },
  {
    slug: "tecnologia",
    title: "Los Tres Pilares Tecnológicos (LLM, MCP y Automatización)",
    priority: 75,
    active: true,
    keywords: [
      "tecnologia",
      "tecnología",
      "pilar",
      "pilares",
      "llm",
      "mcp",
      "model context protocol",
      "automatizacion",
      "automatización",
      "automation",
      "inteligencia artificial",
      "ia",
      "ai",
      "gemini",
      "integracion",
      "integración",
      "api",
      "erp",
      "sap",
      "afip",
      "excel",
      "como funciona",
      "cómo funciona",
    ],
    content: `## Los 3 Pilares Tecnológicos de Pidgeon Solutions

Construimos sobre tres pilares para que la IA no sea "humo", sino una herramienta rentable:
• **1. LLM — El Cerebro (Inteligencia):** Modelos de lenguaje (como Google Gemini) que entienden mensajes de clientes, emails o documentos y razonan sin depender de palabras clave rígidas.
• **2. MCP — El Sistema Nervioso (Contexto en Vivo):** La inteligencia aislada no sirve. Mediante *Model Context Protocol (MCP)* conectamos la IA de forma segura con tus datos reales en vivo: stock en depósito, lista de precios, planillas de Excel, agenda de Google Calendar o tu CRM/ERP.
• **3. Automatización — Las Manos (Ejecución):** Una vez que la IA entiende el pedido y consulta los datos reales, ejecuta la tarea: reserva stock, agenda el turno, emite una factura, actualiza el CRM o envía una alerta por WhatsApp a tu equipo.`,
  },
  {
    slug: "faq-proceso",
    title: "Preguntas Frecuentes: Tiempos, Propiedad del Código y Soporte",
    priority: 70,
    active: true,
    keywords: [
      "tiempo",
      "tardan",
      "demora",
      "plazo",
      "dueño",
      "propiedad",
      "codigo",
      "código",
      "wix",
      "shopify",
      "soporte",
      "rompe",
      "ayuda",
      "mantenimiento",
      "contratar",
      "empezar",
      "pago",
      "pagar",
    ],
    content: `## Preguntas Frecuentes y Proceso de Trabajo

• **¿Cuánto tiempo tardan?** Un sitio web estándar (Emprendedor o Pequeña Empresa) suele estar listo en **1 a 2 semanas**. Los chatbots con IA y sistemas a medida se planifican por etapas según las integraciones requeridas.
• **¿Soy dueño de mi sitio web?** Sí. A diferencia de plataformas cerradas como Wix o Shopify donde solo alquilás, con Pidgeon Solutions el código te pertenece.
• **¿Necesito saber de tecnología?** Para nada. Nos encargamos de servidores, dominios, seguridad y configuración de principio a fin.
• **¿Con quién hablo si necesito soporte?** Hablás directo con nuestros ingenieros (sin menús telefónicos eternos) por WhatsApp al **{{whatsapp_number}}** o en **{{support_email}}**.
• **¿Cómo empiezo?** Podés dejarnos tu consulta desde el botón **"Empezar Ahora" / "Elegir Plan"** en la web o escribirnos directo por WhatsApp para coordinar una llamada breve sin cargo.`,
  },
];

const PLANS_KEYWORDS = [
  "plan",
  "planes",
  "precio",
  "precios",
  "costo",
  "costos",
  "cuanto",
  "cuánto",
  "mensual",
  "anual",
  "emprendedor",
  "starter",
  "pequeña empresa",
  "pyme",
  "business",
  "medida",
  "enterprise",
  "pricing",
  "price",
  "prices",
  "cost",
];

export function isPlansRequest(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return PLANS_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Reemplaza todos los {{placeholders}} en un texto con los valores actuales de settings.
 */
export function hydratePlaceholders(
  text: string,
  settingsMap: Record<string, string>,
): string {
  if (!text) return "";
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
    return settingsMap[key] !== undefined ? settingsMap[key] : match;
  });
}

export function getDefaultSettingsMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const item of DEFAULT_SETTINGS) {
    map[item.key] = item.value;
  }
  return map;
}

/**
 * Construye el prompt completo hidratando memorias, settings y configuración IA (desde SQLite o fallback estático).
 */
export function buildFullPrompt(
  userPrompt: string,
  locale?: string,
  customData?: {
    memories?: KnowledgeEntry[];
    settingsMap?: Record<string, string>;
    aiConfig?: AiConfigData;
  },
): { fullPrompt: string; matchedSlugs: string[] } {
  const settingsMap = customData?.settingsMap || getDefaultSettingsMap();
  const aiConfig = customData?.aiConfig || DEFAULT_AI_CONFIG;
  const allMemories = (customData?.memories || KNOWLEDGE_ENTRIES).filter(
    (m) => m.active !== false,
  );

  const baseEntry = allMemories.find((m) => m.slug === "base");
  const baseText = hydratePlaceholders(
    baseEntry ? baseEntry.content : BASE_KNOWLEDGE,
    settingsMap,
  );

  const thematicMemories = allMemories
    .filter((m) => m.slug !== "base")
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  const lower = userPrompt.toLowerCase();
  const asksForPlans = isPlansRequest(userPrompt);

  let matched = thematicMemories.filter((entry) =>
    entry.keywords.some((kw) => lower.includes(kw.toLowerCase())),
  );

  if (matched.length === 0) {
    matched = thematicMemories.filter(
      (e) => e.slug === "planes" || e.slug === "chatbots",
    );
  }

  if (asksForPlans && !matched.some((m) => m.slug === "planes")) {
    const planesEntry = thematicMemories.find((e) => e.slug === "planes");
    if (planesEntry) matched.unshift(planesEntry);
  }

  const hydratedMatched = matched.map((m) =>
    hydratePlaceholders(m.content, settingsMap),
  );
  const context =
    hydratedMatched.length > 0
      ? `${baseText}\n\n---\n\n${hydratedMatched.join("\n\n---\n\n")}`
      : baseText;

  const normLocale = (locale || "ES").toUpperCase() === "EN" ? "EN" : "ES";
  const systemBlock = hydratePlaceholders(aiConfig.systemPrompt, settingsMap);
  const plansBlock = asksForPlans
    ? `\n${hydratePlaceholders(aiConfig.plansDirective, settingsMap)}\n`
    : "";
  const finalDirectives = hydratePlaceholders(
    normLocale === "EN"
      ? aiConfig.finalDirectivesEn
      : aiConfig.finalDirectivesEs,
    settingsMap,
  );

  const fullPrompt = `${systemBlock}
${plansBlock}
## CONTEXTO (BASE DE CONOCIMIENTO OFICIAL)
${context}

## PREGUNTA DEL VISITANTE
${userPrompt}

## DIRECTIVAS FINALES (MANDAN SOBRE CUALQUIER OTRA REGLA)
${finalDirectives}

TU RESPUESTA (sin headers #, bien formateada para chat):`;

  return {
    fullPrompt,
    matchedSlugs: ["base", ...matched.map((m) => m.slug)],
  };
}
