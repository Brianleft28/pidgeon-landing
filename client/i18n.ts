

export type Language = 'EN' | 'ES';

export const translations = {
  EN: {
    heroStaticText: "Your business,",
    heroRotatingWords: ["online.", "on autopilot.", "scalable."],
    heroSubtitle: "Inventory control, CRM, and automation without the tech headaches. Designed for growth.",
    aboutTitle: "Transparency & Workflow Evolution",
    aboutBody: "At Pidgeon Solutions, we believe in radical transparency. We don't just build software; we engineer optimized workflows that empower your team to achieve more with less friction. You own the code, you own the data.",
    aboutBadge: "Why Pidgeon?",
    servicesTitle: "Pricing that scales with you",
    rddTitle: "R&D & Core Capabilities",
    teamTitle: "Core Team",
    teamSubtitle: "The architects behind your digital infrastructure.",
    teamMembers: [
      { 
        name: "Brian Benegas", 
        role: "CEO, Software Engineer & DevOps Architect", 
        link: "https://github.com/brianleft28",
        linkType: 'github', 
        image: '/assets/team/brian.jpg',
        imagePosition: 'center 15%' 
      },
      { 
        name: "Gastón Alejandro", 
        role: "Head of Systems & Infrastructure",
        description: "10+ years in support & servers.",
        link: "/assets/gaston_alejandro_cv.pdf", 
        linkType: 'pdf', 
        image: '/assets/team/alejandro.jpg' 
      },
      { 
        name: "Thomas Pineda", 
        role: "Head of Brand & UI/UX", 
        link: "https://www.behance.net/thomasepineda", 
        linkType: 'behance',
        image: '/assets/team/thomas.jpg',
        imagePosition: 'center center' 
      }
    ],
    ctaTitle: "Ready to grow?",
    ctaSubtitle: "Stop struggling with excel sheets and slow websites.",
    navAbout: "About",
    navWork: "R&D",
    navServices: "Services",
    navContact: "Contact",
    navTeam: "Team",
    btnContact: "Start Project",
    caseStudiesTitle: "Case Studies",
    cases: {
      logistics: {
        client: "AeroLogistics",
        metric: "40% faster dispatch times",
        desc: "Automated route planning and fleet management system for a mid-sized logistics firm."
      },
      health: {
        client: "ClinicNet",
        metric: "Zero data breaches",
        desc: "Secure patient portal and appointment scheduling with HIPAA compliance."
      }
    },
    pillars: {
      clarity: { title: "Transparency", desc: "We transform complex operations into clear digital workflows, providing auditable data and unparalleled insight into your business." },
      control: { title: "Control", desc: "You own the code. You own the data. No lock-ins." },
      efficiency: { title: "Efficiency", desc: "Fast systems that don't waste your time or money." }
    },
    pricing: {
      subtitle: "Transparent pricing for businesses of all sizes. No hidden fees, no surprises.",
      offerBanner: "Launch Offer: Get 30% OFF on annual plans.",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save",
      saved: "Saved",
      switchToYearly: "Switch to yearly and save",
      year: "year",
      bestChoice: "Best Choice",
      choosePlan: "Choose Plan",
      plans: [
        { 
          id: "starter",
          title: "Starter",
          price_mo: "$49", price_unit_mo: "/mo",
          price_yr: "$490", price_unit_yr: "/yr",
          desc: "For new businesses and professionals testing an idea.",
          features: ["1 Management App", "Up to 5 Users", "Standard Automation", "Community Support"]
        },
        { 
          id: "business",
          title: "Business",
          price_mo: "$99", price_unit_mo: "/mo",
          price_yr: "$990", price_unit_yr: "/yr",
          desc: "For growing teams that need more power and support.",
          features: ["3 Management Apps", "Up to 25 Users", "Custom Automation Processes", "Dedicated Support Agent", "API Access"],
          recommended: true
        },
        { 
          id: "enterprise",
          title: "Enterprise",
          price_mo: "$500", price_unit_mo: "/mo",
          price_yr: "$5000", price_unit_yr: "/yr",
          desc: "For established businesses with custom requirements.",
          features: ["Unlimited Apps", "Unlimited Users", "Advanced Custom Automation", "On-premise Deployment", "24/7 Priority Support"]
        }
      ],
      modal: {
        title: "Confirm Selection",
        subtitle: "Review your plan details before proceeding.",
        plan: "Plan",
        billingCycle: "Billing Cycle",
        total: "Total",
        close: "Go Back",
        payButton: "Pay with Mercado Pago",
        payButtonPaypal: "Pay with PayPal",
        payButtonStripe: "Pay with Card"
      }
    },
    automation: {
      title: "Custom Automation & Consulting",
      desc: "Do you have specific processes that eat up your time? We build custom bots, scrapers, and integration layers to connect your disparate tools. From WhatsApp bots to automated inventory syncing.",
      cta: "Schedule Consultation",
      badge: "High Impact",
      tags: ["WhatsApp Bots", "Web Scraping", "API Integrations", "Data Migration"]
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Technical insights and service details.",
      items: [
        {
          question: "What is an LLM and how does it help my business?",
          answer: "LLM stands for <strong>Large Language Model</strong>. It's the technology behind AI like Gemini. We integrate it into your systems to automate customer support, analyze contracts, or generate reports instantly, saving thousands of man-hours."
        },
        {
          question: "What is MCP (Model Context Protocol)?",
          answer: "MCP is a standard that allows AI agents to safely connect to your data sources (databases, files, APIs). We use it to ensure our AI solutions understand the <em>context</em> of your business without hallucinations, making them reliable for enterprise use."
        },
        {
          question: "What are the main benefits of working with Pidgeon?",
          answer: "<strong>1. Ownership:</strong> You own the code. <br><strong>2. Speed:</strong> We deploy fast using modern stacks. <br><strong>3. Transparency:</strong> No black boxes. You see how your system works."
        },
        {
          question: "What is 'Custom Automation'?",
          answer: "It refers to software tailored to perform specific repetitive tasks in your business automatically. For example, reading emails and updating a spreadsheet, or syncing inventory between your physical store and e-commerce site."
        },
        {
          question: "Can I upgrade my plan later?",
          answer: "Absolutely. You can scale from Starter to Business or Enterprise at any time as your team grows."
        },
        {
          question: "How can I contact support?",
          answer: "You can reach our dedicated support team at <a href='mailto:soporte@pidgeonsolutions.com' class='text-emerald-400 hover:underline'>soporte@pidgeonsolutions.com</a>. We typically respond within 24 hours."
        }
      ]
    },
    rdd: {
      title: "R&D & Core Capabilities",
      subtitle: "Beyond standard software. We build the engines of tomorrow.",
      cards: {
        ai: { title: "Advanced AI Integration", desc: "Seamlessly embedding intelligence into business workflows to automate the complex. From predictive analytics to autonomous decision support." },
        mcp: { title: "MCP (Model Context Protocol)", desc: "Standardizing how AI agents interact with your data. We build systems that ensure high interoperability and smart context retention." },
        systems: { title: "Complex Systems & LLMs", desc: "Orchestrating multi-agent systems and large language models for scalable enterprise solutions. Precision engineering for the AI era." }
      }
    },
    chat: {
      initial: "PIDGEON CORE // v3.0-pro :: READY. How can I assist you with your digital infrastructure?",
      placeholder: "Execute command or ask a question...",
      error: "ERR::CONNECTION_LOST // Please try again."
    },
    contactModal: {
      title: "Start a Project",
      subtitle: "Tell us about your needs and we'll get back to you within 24 hours.",
      nameLabel: "Full Name",
      companyLabel: "Company Name",
      emailLabel: "Email Address",
      messageLabel: "Project Details",
      messagePlaceholder: "I need a CRM for my logistics company...",
      sendButton: "Send Inquiry"
    },
    veo: {
        title: "Pidgeon Labs: Generative Media",
        subtitle: "Experience the power of Google's Veo and Gemini models for video and image generation.",
        modeVideo: "Video Generation",
        modeImage: "Image Generation",
        upload: "Upload Reference Image",
        aspectRatio: "Aspect Ratio",
        imageSize: "Image Size",
        promptLabel: "Prompt",
        magicPrompt: "Magic Prompt",
        promptPlaceholder: "Describe what you want to generate...",
        generating: "Generating...",
        generate: "Generate Video",
        generateImage: "Generate Image"
    }
  },
  ES: {
    heroStaticText: "Tu negocio,",
    heroRotatingWords: ["en línea.", "en piloto automático.", "escalable."],
    heroSubtitle: "Control de inventario, CRM y automatización sin los dolores de cabeza técnicos. Diseñado para crecer.",
    aboutTitle: "Transparencia y Evolución del Flujo de Trabajo",
    aboutBody: "En Pidgeon Solutions, creemos en la transparencia radical. No solo creamos software; diseñamos flujos de trabajo optimizados que empoderan a tu equipo para lograr más con menos fricción. Eres dueño del código y de los datos.",
    aboutBadge: "¿Por qué Pidgeon?",
    servicesTitle: "Precios que escalan con vos",
    rddTitle: "I+D y Capacidades Centrales",
    teamTitle: "Equipo Principal",
    teamSubtitle: "Los arquitectos detrás de tu infraestructura digital.",
    teamMembers: [
      { 
        name: "Brian Benegas", 
        role: "CEO, Ing. de Software y Arquitecto DevOps", 
        link: "https://github.com/brianleft28",
        linkType: 'github', 
        image: '/assets/team/brian.jpg',
        imagePosition: 'center 15%' 
      },
      { 
        name: "Gastón Alejandro", 
        role: "Jefe de Sistemas e Infraestructura",
        description: "10+ years en soporte y servidores.",
        link: "/assets/gaston_alejandro_cv.pdf", 
        linkType: 'pdf', 
        image: '/assets/team/alejandro.jpg' 
      },
      { 
        name: "Thomas Pineda", 
        role: "Jefe de Marca y UI/UX", 
        link: "https://www.behance.net/thomasepineda", 
        linkType: 'behance',
        image: '/assets/team/thomas.jpg',
        imagePosition: 'center center' 
      }
    ],
    ctaTitle: "¿Listo para escalar?",
    ctaSubtitle: "Dejá de luchar con Excels y webs lentas.",
    navAbout: "Nosotros",
    navWork: "I+D",
    navServices: "Servicios",
    navContact: "Contacto",
    navTeam: "Equipo",
    btnContact: "Iniciar Proyecto",
    caseStudiesTitle: "Casos de Éxito",
    cases: {
      logistics: {
        client: "AeroLogistics",
        metric: "Tiempos de despacho 40% más rápidos",
        desc: "Sistema automatizado de planificación de rutas y gestión de flotas para una empresa de logística mediana."
      },
      health: {
        client: "ClinicNet",
        metric: "Cero brechas de seguridad",
        desc: "Portal seguro de pacientes y programación de citas con cumplimiento de normativas."
      }
    },
    pillars: {
      clarity: { title: "Transparencia", desc: "Transformamos operaciones complexas en flujos de trabajo digitales y claros, proveyendo data auditable y una visión sin precedentes de tu negocio." },
      control: { title: "Control", desc: "Todo lo que hacemos te pertenece. Sin letras chicas." },
      efficiency: { title: "Eficiencia", desc: "Sistemas rápidos que no te hacen perder tiempo." }
    },
    pricing: {
      subtitle: "Precios transparentes para negocios de todos los tamaños. Sin costos ocultos ni sorpresas.",
      offerBanner: "Oferta de Lanzamiento: 30% OFF en planes anuales.",
      monthly: "Mensual",
      yearly: "Anual",
      save: "Ahorrá",
      saved: "Ahorraste",
      switchToYearly: "Pasate a anual y ahorrá",
      year: "año",
      bestChoice: "Recomendado",
      choosePlan: "Elegir Plan",
      plans: [
        { 
          id: "starter",
          title: "Starter",
          price_mo: "$49", price_unit_mo: "/mes",
          price_yr: "$490", price_unit_yr: "/año",
          desc: "Para nuevos negocios y profesionales probando una idea.",
          features: ["1 App de Gestión", "Hasta 5 Usuarios", "Automatización Estándar", "Soporte Comunitario"]
        },
        { 
          id: "business",
          title: "Business",
          price_mo: "$99", price_unit_mo: "/mes",
          price_yr: "$990", price_unit_yr: "/año",
          desc: "Para equipos en crecimiento que necesitan más potencia y soporte.",
          features: ["3 Apps de Gestión", "Hasta 25 Usuarios", "Procesos de Automatización a Medida", "Agente de Soporte Dedicado", "Acceso a API"],
          recommended: true
        },
        { 
          id: "enterprise",
          title: "Enterprise",
          price_mo: "$500", price_unit_mo: "/mes",
          price_yr: "$5000", price_unit_yr: "/año",
          desc: "Para empresas establecidas con requerimientos a medida.",
          features: ["Apps Ilimitadas", "Usuarios Ilimitados", "Automatización Compleja a Medida", "Instalación Local (On-premise)", "Soporte Prioritario 24/7"]
        }
      ],
      modal: {
        title: "Confirmar Selección",
        subtitle: "Revisá los detalles de tu plan antes de continuar.",
        plan: "Plan",
        billingCycle: "Ciclo de Facturación",
        total: "Total",
        close: "Volver",
        payButton: "Pagar con Mercado Pago",
        payButtonPaypal: "Pagar con PayPal",
        payButtonStripe: "Pagar con Tarjeta"
      }
    },
    automation: {
      title: "Automatización a Medida y Consultoría",
      desc: "¿Tenés procesos específicos que consumen tu tiempo? Creamos bots personalizados, scrapers y capas de integración para conectar tus herramientas. Desde bots de WhatsApp hasta sincronización automática de stock.",
      cta: "Agendar Consultoría",
      badge: "Alto Impacto",
      tags: ["Bots de WhatsApp", "Web Scraping", "Integraciones API", "Migración de Datos"]
    },
    faq: {
      title: "Preguntas Frecuentes",
      subtitle: "Detalles técnicos y servicios.",
      items: [
        {
          question: "¿Qué es un LLM y cómo ayuda a mi negocio?",
          answer: "LLM significa <strong>Large Language Model</strong> (Modelo de Lenguaje Grande). Es la tecnología detrás de inteligencias como Gemini. Lo integramos en tus sistemas para automatizar soporte, leer contratos o generar reportes al instante, ahorrando miles de horas hombre."
        },
        {
          question: "¿Qué es MCP (Model Context Protocol)?",
          answer: "MCP es un estándar que permite a los agentes de IA conectarse de forma segura a tus datos (bases de datos, archivos, APIs). Lo usamos para que la IA entienda el <em>contexto</em> de tu negocio sin alucinar, haciéndola confiable para uso empresarial."
        },
        {
          question: "¿Cuáles son los beneficios de trabajar con Pidgeon?",
          answer: "<strong>1. Propiedad:</strong> El código es tuyo. <br><strong>2. Velocidad:</strong> Desarrollamos rápido con tecnologías modernas. <br><strong>3. Transparencia:</strong> Sin cajas negras. Ves cómo funciona tu sistema."
        },
        {
          question: "¿Qué es 'Automatización a Medida'?",
          answer: "Se refiere a software diseñado para realizar tareas repetitivas de tu negocio de forma automática. Por ejemplo, leer correos y actualizar una planilla, o sincronizar stock entre tu local físico y tu web."
        },
        {
          question: "¿Puedo mejorar mi plan después?",
          answer: "Absolutamente. Puedes escalar de Starter a Business o Enterprise en cualquier momento a medida que tu equipo crezca."
        },
        {
          question: "¿Cómo puedo contactar a soporte?",
          answer: "Puedes escribir directamente a nuestro equipo técnico en <a href='mailto:soporte@pidgeonsolutions.com' class='text-emerald-400 hover:underline'>soporte@pidgeonsolutions.com</a>. Respondemos generalmente en menos de 24 horas."
        }
      ]
    },
    rdd: {
      title: "I+D y Capacidades Centrales",
      subtitle: "Más allá del software estándar. Construimos los motores del mañana.",
      cards: {
        ai: { title: "Advanced AI Integration", desc: "Incorporación perfecta de inteligencia en flujos de trabajo empresariales. Desde análisis predictivo hasta soporte de decisiones autónomo." },
        mcp: { title: "MCP (Model Context Protocol)", desc: "Estandarización de la interacción de agentes de IA con tus datos. Sistemas interoperables con retención inteligente de contexto." },
        systems: { title: "Complex Systems & LLMs", desc: "Orquestación de sistemas multi-agente y LLMs para soluciones empresariales escalables. Ingeniería de precisión para la era de la IA." }
      }
    },
    chat: {
      initial: "NÚCLEO PIDGEON // v3.0-pro :: LISTO. ¿En qué puedo ayudarte con tu infraestructura digital?",
      placeholder: "Ejecutar comando o hacer pregunta...",
      error: "ERR::CONEXIÓN_PERDIDA // Por favor intentá de nuevo."
    },
    contactModal: {
      title: "Iniciar Proyecto",
      subtitle: "Contanos qué necesitás y te respondemos en menos de 24hs.",
      nameLabel: "Nombre Completo",
      companyLabel: "Nombre de la Empresa",
      emailLabel: "Correo Electrónico",
      messageLabel: "Detalles del Proyecto",
      messagePlaceholder: "Necesito un CRM para mi logística...",
      sendButton: "Enviar Consulta"
    },
    veo: {
        title: "Pidgeon Labs: Medios Generativos",
        subtitle: "Experimentá el poder de los modelos Veo y Gemini de Google para generación de video e imagen.",
        modeVideo: "Generación de Video",
        modeImage: "Generación de Imagen",
        upload: "Subir Imagen de Referencia",
        aspectRatio: "Relación de Aspecto",
        imageSize: "Tamaño de Imagen",
        promptLabel: "Prompt",
        magicPrompt: "Prompt Mágico",
        promptPlaceholder: "Describí lo que querés generar...",
        generating: "Generando...",
        generate: "Generar Video",
        generateImage: "Generar Imagen"
    }
  }
};
