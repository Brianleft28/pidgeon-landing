

export type Language = 'EN' | 'ES';

export const translations = {
  EN: {
    heroStaticText: "Your business",
    heroRotatingWords: ["organized.", "efficient.", "scalable."],
    heroSubtitle:
      "We simplify complex technology. From your first landing page to advanced AI systems, we help you think big and grow faster.",
    aboutTitle: "Transparent Technology",
    aboutBody:
      "At Pidgeon Solutions, we transform technical complexity into operational efficiency. We don't just write code; we design digital ecosystems that scale with your business. From fleet management to healthcare systems, we connect the latest in Artificial Intelligence with your company's real needs. Innovation, structure, and results.",
    aboutBadge: " SEAMLESS INTEGRATION ",
    servicesTitle: "Plans for every stage",
    education: {
      title: "How it empowers you",
      subtitle:
        "The three pillars of modern technology that we apply to your business.",
      llm: {
        title: "LLM (Intelligence)",
        desc: "Large Language Models are the 'Brain'. They allow your system to understand customer emails, summarize documents, and make logical decisions without human intervention.",
        tag: "Reasoning",
      },
      mcp: {
        title: "MCP (Context)",
        desc: "The 'Nervous System'. Intelligence is useless if isolated. MCP connects the AI to your REAL data: Stock, Calendar, and Prices, in real-time.",
        tag: "Connection",
      },
      auto: {
        title: "Automation",
        desc: "The 'Hands'. Once the AI understands and has the data, automation executes the task. Sending the invoice, updating the CRM, or alerting your team.",
        tag: "Execution",
      },
    },
    rddTitle: "Robust Infrastructure",
    rddSubtitle:
      "Security is non-negotiable. We build systems that protect your data and connect with everything you already use.",
    teamTitle: "Our Team",
    teamSubtitle: "Real people building digital solutions for real businesses.",
    teamMembers: [
      {
        name: "Brian Benegas",
        role: "Tech Lead & Infrastructure",
        description:
          "Guardian of the code and servers. Ensuring 99.9% uptime and robust architecture.",
        link: "https://www.linkedin.com/in/brian-benegas-44770729b/",
        linkType: "linkedin",
        image: "/assets/brian.png",
        imagePosition: "center 15%",
      },
      {
        name: "Thomas Pineda",
        role: "Creative Director",
        description:
          "The mind behind the aesthetics. Visualizing user experiences that convert.",
        link: "https://www.behance.net/thomasepineda",
        linkType: "behance",
        image: "/assets/thomas.png",
        imagePosition: "center center",
      },
      {
        name: "Gastón Alejandro",
        role: "Operations & Strategy",
        description:
          "Aligning technology with business goals for maximum efficiency.",
        link: "/assets/gaston_alejandro_cv.pdf",
        linkType: "pdf",
        image: "/assets/alejandro.png",
      },
    ],
    ctaTitle: "Ready to launch?",
    ctaSubtitle:
      "Don't let technology hold you back. Let's build something great together.",
    navAbout: "About",
    navWork: "Tech",
    navChatbots: "Chatbots",
    navServices: "Services",
    navContact: "Contact",
    navTeam: "Team",
    btnContact: "Start Now",
    whatsappMessage: "Hi! I wanted to ask you about...",
    caseStudiesTitle: "Success Stories",
    cases: {
      logistics: {
        client: "Local Logistics",
        metric: "Saved 20hrs/week",
        desc: "Automated orders from WhatsApp directly to a dashboard.",
      },
      health: {
        client: "Dr. Smith Clinic",
        metric: "2x Appointments",
        desc: "Simple online booking system for a private practice.",
      },
    },
    pillars: {
      clarity: { title: "Simple Pages", desc: "Affordable & Fast." },
      control: { title: "Full Control", desc: "Stock & Inventory." },
      efficiency: { title: "Big Data", desc: "Logistics Analytics." },
    },
    pricing: {
      subtitle:
        "Affordable options to get you started and scalable power for when you grow.",
      offerBanner: "Launch Offer: 30% OFF on your first website!",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save",
      bestChoice: "Most Popular",
      choosePlan: "Select Plan",
      plans: [
        {
          id: "starter",
          title: "Entrepreneur",
          price_mo_num: 100,
          price_yr_num: 1000,
          price_unit_mo: "/mo",
          price_unit_yr: "/yr",
          currency: "US$ ",
          desc: "Perfect for your first professional website or portfolio.",
          ctaTooltip: "Launch your presence online.",
          features: [
            {
              name: "One-Page Website",
              tooltip: "A single scrolling page containing all your info.",
            },
            {
              name: "Contact Form",
              tooltip: "Receive emails directly from your site.",
            },
            {
              name: "Free Domain (1 yr)",
              tooltip: "We cover the cost of your .com for the first year.",
            },
            {
              name: "Basic Hosting",
              tooltip: "Fast and secure hosting included.",
            },
          ],
          notIncluded: [
            {
              name: "E-commerce",
              tooltip: "Online store functionality not included.",
            },
            {
              name: "Blog / News",
              tooltip: "Content management system for articles.",
            },
            {
              name: "Custom Systems",
              tooltip: "Advanced backend logic or databases.",
            },
          ],
        },
        {
          id: "business",
          title: "Small Business",
          price_mo_num: 250,
          price_yr_num: 2500,
          price_unit_mo: "/mo",
          price_unit_yr: "/yr",
          currency: "US$ ",
          desc: "For shops and service providers ready to expand.",
          ctaTooltip: "Boost your sales and reach.",
          features: [
            {
              name: "Multi-page Site",
              tooltip: "Home, About, Services, Contact, etc.",
            },
            {
              name: "E-commerce (50 products)",
              tooltip: "Sell products online with a shopping cart.",
            },
            {
              name: "Blog / News",
              tooltip: "Post updates and news to engage customers.",
            },
            { name: "Google Maps", tooltip: "Interactive map integration." },
            {
              name: "Basic SEO",
              tooltip: "Optimization to help you rank on Google.",
            },
          ],
          recommended: true,
          notIncluded: [
            {
              name: "Custom CRM/ERP",
              tooltip: "Internal management tools not included.",
            },
            {
              name: "Unlimited Users",
              tooltip: "Restricted to standard admin access.",
            },
          ],
        },
        {
          id: "enterprise",
          title: "Custom System",
          price_mo_num: 1000,
          price_yr_num: 1000,
          price_unit_mo: "",
          price_unit_yr: "",
          currency: "US$ ",
          desc: "Automation and management apps for established companies.",
          ctaTooltip: "Full power for your organization.",
          features: [
            {
              name: "Custom CRM/ERP",
              tooltip: "Tailor-made software to run your business.",
            },
            { name: "Unlimited Users", tooltip: "No per-seat pricing." },
            {
              name: "API Integrations",
              tooltip: "Connect with MercadoPago, AFIP, WhatsApp, etc.",
            },
            {
              name: "Advanced Automation",
              tooltip: "Bots and scripts to save manual work.",
            },
            {
              name: "Priority Support",
              tooltip: "Direct line to our engineering team.",
            },
          ],
          notIncluded: [],
        },
      ],
    },
    automation: {
      title: "Need something specific?",
      desc: "Do you spend hours copying data from Excel to email? Do you need a bot to answer common questions? We build custom tools to automate the boring stuff so you can focus on your business.",
      cta: "Free Consultation",
      badge: "Save Time",
      tags: ["WhatsApp Bots", "Excel Automation", "Stock Sync", "Custom Tools"],
    },
    faq: {
      title: "Common Questions",
      subtitle: "Everything you need to know before starting.",
      items: [
        {
          question: "I'm not tech-savvy. Is this for me?",
          answer:
            "Absolutely! That's exactly why we exist. We handle all the technical details (servers, domains, code) so you can focus on running your business.",
        },
        {
          question: "Do you handle high-traffic Enterprise projects?",
          answer:
            "Yes. Our team has experience building systems that handle millions of requests. For larger organizations, we offer dedicated infrastructure, SLAs, and custom security protocols.",
        },
        {
          question: "What is AI and how can it help my small business?",
          answer:
            "AI can be as simple as a chatbot that answers customers while you sleep, or a tool that helps you write emails faster. We find practical uses that actually save you money.",
        },
        {
          question: "Do I own my website?",
          answer:
            "Yes. Unlike builders like Wix or Shopify where you rent the platform, with us, the code belongs to you. If you ever want to leave, you can take your site with you.",
        },
        {
          question: "How long does it take?",
          answer:
            "A standard website usually takes 1-2 weeks. More complex systems depend on your specific needs.",
        },
        {
          question: "Who do I talk to if something breaks?",
          answer:
            "You talk to us directly. No automated phone menus. Email us at <a href='mailto:soporte@pidgeonsolutions.com' class='text-emerald-400 hover:underline'>soporte@pidgeonsolutions.com</a>.",
        },
      ],
    },
    rdd: {
      title: "The Era of Intelligence",
      subtitle:
        "Technology is no longer just rigid tools. Now it understands, reasons, and connects.",
      llm: {
        title: "The Brain (LLM)",
        desc: "Large Language Models (like Gemini) are the reasoning engine. They understand human language, summarize texts, and make logical decisions.",
        analogy: "Like a genius intern who read the entire internet.",
      },
      mcp: {
        title: "The Nervous System (MCP)",
        desc: "Intelligence alone is useless if isolated. The 'Model Context Protocol' allows AI to read your Excel files, database, and send WhatsApp messages.",
        analogy: "Giving the intern keys to the office.",
      },
    },
    chat: {
      initial:
        "Hi! I'm the Pidgeon Assistant. How can I help launch your idea today?",
      placeholder: "Ask about chatbots, websites, prices, or automation...",
      error: "Oops, connection blip. Try again.",
      rateLimited:
        "You've reached the hourly query limit. Write to us directly on WhatsApp (+54 11 3155-6315) and we'll continue right away!",
    },
    contactModal: {
      title: "Start Your Project",
      subtitle: "Tell us a bit about what you do.",
      nameLabel: "Your Name",
      companyLabel: "Business Name (Optional)",
      emailLabel: "Email",
      messageLabel: "What do you need?",
      messagePlaceholder: "I need an AI chatbot for WhatsApp and a website...",
      sendButton: "Send Message",
    },
    rddChatbotHighlight: {
      badge: "Featured",
      title: "AI Chatbots & Conversational Agents",
      desc: "We deploy custom conversational agents on WhatsApp and Web connected to your real inventory, calendar, and CRM. Responses stream in real time, 24/7.",
      cta: "Explore live demos →",
    },
    chatbots: {
      badge: "CONVERSATIONAL AI · 24/7",
      titleStart: "Chatbots that",
      titleHighlight: "execute",
      titleEnd: "for your business.",
      subtitle:
        "Beyond static menus: agents powered by Gemini + MCP that read your live data, qualify leads, book appointments, and answer customers in chunks in real time.",
      prevLabel: "Previous chatbot demo",
      nextLabel: "Next chatbot demo",
      autoAdvanceLabel: "Auto-advances every 20s",
      pausedLabel: "Paused",
      ctaButton: "Request this Chatbot",
      liveHeader: "pidgeon-agent-stream · live",
      typingLabel: "streaming chunks...",
      slides: [
        {
          id: "whatsapp-sales",
          channel: "WhatsApp Business · 24/7",
          accent: "emerald",
          title: "24/7 Customer Care & Instant Catalog",
          desc: "Answers product inquiries, checks live stock via MCP, and closes sales while your team rests—without rigid option trees.",
          metrics: [
            "Response time under 1.2s, 24/7",
            "Live stock & pricing lookup from your DB/Excel",
            "Seamless handoff to a human advisor when needed",
          ],
          planTag: "AI Chatbot — WhatsApp 24/7",
          messages: [
            {
              role: "user",
              time: "23:14",
              text: "Hi! Do you have the industrial thermal printer in stock? Need 3 units for tomorrow in CABA.",
            },
            {
              role: "assistant",
              time: "23:14",
              text: "Hi! Yes, I just checked our warehouse: we have 7 units of the Thermal Pro 80mm ready for immediate dispatch. For 3 units you get a 10% volume discount (US$ 405 total), and express shipping to CABA arrives tomorrow between 9:00 and 13:00.",
              status: "✓ Stock verified via MCP · Warehouse #1 (7 units)",
            },
            {
              role: "user",
              time: "23:15",
              text: "Awesome, reserve those 3 for me under Logistics Sur.",
            },
            {
              role: "assistant",
              time: "23:15",
              text: "Done! Order #842 reserved for Logistics Sur (3x Thermal Pro 80mm). I've notified our dispatch team so they coordinate delivery with you first thing at 8:00 AM.",
              status: "✓ Reservation #842 created · Sales team alerted",
            },
          ],
        },
        {
          id: "appointments",
          channel: "WhatsApp · Google Calendar",
          accent: "cyan",
          title: "Automated Bookings & Reminders",
          desc: "Checks real-time schedule availability, books or reschedules appointments in seconds, and cuts absenteeism with automatic reminders.",
          metrics: [
            "Two-way sync with Google Calendar / clinical systems",
            "Automatic confirmation & 24h prior reminder",
            "Reduces no-shows by up to 65%",
          ],
          planTag: "AI Chatbot — Appointments & Bookings",
          messages: [
            {
              role: "user",
              time: "16:08",
              text: "Hi! Do you have an opening with Dr. Lopez this Thursday afternoon?",
            },
            {
              role: "assistant",
              time: "16:08",
              text: "Hi! Checking Dr. Lopez's live calendar for this Thursday: I have slots open at 15:30 and 17:00 hs. Which one works best for you?",
              status: "✓ Calendar queried in real time · 2 slots available",
            },
            {
              role: "user",
              time: "16:09",
              text: "17:00 hs please, my name is Martina Gomez.",
            },
            {
              role: "assistant",
              time: "16:09",
              text: "Confirmed, Martina! Your appointment with Dr. Lopez is set for Thursday at 17:00 hs. I'll send you a reminder here 24 hours before.",
              status: "✓ Event booked in Calendar · Reminder scheduled",
            },
          ],
        },
        {
          id: "crm-leads",
          channel: "Web & Instagram · CRM Sync",
          accent: "purple",
          title: "Smart Lead Qualification & CRM Sync",
          desc: "Interviews incoming prospects naturally, identifies volume, urgency, and budget, and creates the deal in your CRM automatically.",
          metrics: [
            "Filters & scores high-intent leads automatically",
            "Registers contact, company & notes directly in CRM",
            "Notifies the assigned account executive on WhatsApp",
          ],
          planTag: "AI Chatbot — Lead Qualification & CRM",
          messages: [
            {
              role: "user",
              time: "10:42",
              text: "Hello, we want to automate order intake across our 12 branches.",
            },
            {
              role: "assistant",
              time: "10:42",
              text: "We'd love to help! To assign the right specialist, roughly how many daily orders do those 12 branches process, and do you currently use an ERP or CRM?",
              status: "✓ Intent detected: Multi-branch Enterprise Automation",
            },
            {
              role: "user",
              time: "10:43",
              text: "Around 450 orders/day, we use SAP Business One.",
            },
            {
              role: "assistant",
              time: "10:43",
              text: "Perfect. We connect directly with SAP via API/MCP. I've registered your profile with High Priority and scheduled a technical briefing with our Tech Lead for tomorrow at 11:00 AM.",
              status: "✓ Lead scored (94%) · Synced to CRM & SAP pipeline",
            },
          ],
        },
        {
          id: "govtech-desk",
          channel: "GovTech · Citizen Portal",
          accent: "emerald",
          title: "Citizen Service Desk & File Tracking",
          desc: "Designed for municipalities and public agencies: lets citizens check file status, requirements, and shifts 24/7 without queuing.",
          metrics: [
            "Real-time connection to municipal expediente systems",
            "Clear step-by-step guidance in plain language",
            "Decongests in-person desks and phone lines",
          ],
          planTag: "AI Chatbot — GovTech Citizen Desk",
          messages: [
            {
              role: "user",
              time: "09:15",
              text: "Good morning, I want to check the status of commercial license file #2026-04192.",
            },
            {
              role: "assistant",
              time: "09:15",
              text: "Good morning! File #2026-04192 (Commercial Enablement) passed technical inspection yesterday and is now at the Signatures Desk. Estimated digital certificate issuance: 48 business hours.",
              status: "✓ Queried Municipal System · Stage 4/5 Approved",
            },
            {
              role: "user",
              time: "09:16",
              text: "Do I need to bring any paper documents in person?",
            },
            {
              role: "assistant",
              time: "09:16",
              text: "No need to come in person. All documentation is validated; you'll receive the signed certificate with QR code directly at your registered email.",
              status: "✓ Citizen query resolved without human escalation",
            },
          ],
        },
      ],
    },
  },
  ES: {
    heroStaticText: "Tu negocio",
    heroRotatingWords: ["organizado.", "eficiente.", "escalable."],
    heroSubtitle:
      "Simplificamos la tecnología compleja. Desde tu primera web hasta sistemas de IA, te ayudamos a pensar en grande y crecer rápido.",
    aboutTitle: "Tecnología Transparente",
    aboutBody:
      "En Pidgeon Solutions transformamos la complejidad tecnológica en eficiencia operativa. No solo escribimos código; diseñamos ecosistemas digitales que escalan con tu negocio. Desde la gestión de flotas hasta sistemas de salud, conectamos lo último en Inteligencia Artificial con las necesidades reales de tu empresa. Innovación, estructura y resultados.",
    aboutBadge: " INTEGRACIÓN FLUIDA ",
    servicesTitle: "Planes para cada etapa",
    education: {
      title: "Tecnología que te potencia",
      subtitle:
        "Los tres pilares de la tecnología moderna aplicados a tu PyME.",
      llm: {
        title: "LLM (Inteligencia)",
        desc: "El 'Cerebro'. Permite que tu sistema entienda emails de clientes, resuma documentos legales o tome decisiones lógicas sin intervención humana.",
        tag: "Razonamiento",
      },
      mcp: {
        title: "MCP (Contexto)",
        desc: "El 'Sistema Nervioso'. La inteligencia no sirve si está aislada. MCP conecta la IA con tus datos REALES: Stock, Agenda y Precios, en vivo.",
        tag: "Conexión",
      },
      auto: {
        title: "Automatización",
        desc: "Las 'Manos'. Una vez que la IA entiende y tiene los datos, la automatización ejecuta. Manda la factura, actualiza el CRM o alerta a tu equipo.",
        tag: "Ejecución",
      },
    },
    rddTitle: "Infraestructura Robusta",
    rddSubtitle:
      "La seguridad no es negociable. Creamos sistemas que protegen tus datos y se conectan con todo lo que ya usás.",
    teamTitle: "Nuestro Equipo",
    teamSubtitle:
      "Personas reales construyendo soluciones digitales para negocios reales.",
    teamMembers: [
      {
        name: "Brian Benegas",
        role: "Tech Lead & Infraestructura",
        description:
          "Guardián del código y los servidores. Asegurando 99.9% uptime y arquitectura robusta.",
        link: "https://www.linkedin.com/in/brian-benegas-44770729b/",
        linkType: "linkedin",
        image: "/assets/brian.png",
        imagePosition: "center 15%",
      },
      {
        name: "Thomas Pineda",
        role: "Director Creativo",
        description:
          "La mente detrás de la estética. Visualizando experiencias de usuario que convierten.",
        link: "https://www.behance.net/thomasepineda",
        linkType: "behance",
        image: "/assets/thomas.png",
        imagePosition: "center center",
      },
      {
        name: "Gastón Alejandro",
        role: "Operaciones & Estrategia",
        description:
          "Alineando la tecnología con los objetivos de negocio para máxima eficiencia.",
        link: "/assets/gaston_alejandro_cv.pdf",
        linkType: "pdf",
        image: "/assets/alejandro.png",
      },
    ],
    ctaTitle: "¿Listo para lanzar?",
    ctaSubtitle:
      "No dejes que la tecnología te frene. Construyamos algo genial juntos.",
    navAbout: "Nosotros",
    navPlatform: "Plataforma",
    navWork: "Tecnología",
    navChatbots: "Chatbots",
    navServices: "Servicios",
    navContact: "Contacto",
    navTeam: "Equipo",
    btnContact: "Empezar Ahora",
    whatsappMessage: "Hola! Quería consultarles sobre...",
    caseStudiesTitle: "Historias de Éxito",
    cases: {
      logistics: {
        client: "Logística Local",
        metric: "Ahorro de 20hs/sem",
        desc: "Automatización de pedidos desde WhatsApp directo a un panel de control.",
      },
      health: {
        client: "Consultorio Dr. Lopez",
        metric: "Doble de Turnos",
        desc: "Sistema simple de reserva de turnos online para consultorio privado.",
      },
    },
    pillars: {
      clarity: { title: "Páginas Simples", desc: "Baratas y Rápidas." },
      control: { title: "Control Total", desc: "Stock e Inventario." },
      efficiency: { title: "Big Data", desc: "Logística y Estadísticas." },
    },
    pricing: {
      subtitle:
        "Opciones accesibles para empezar y potencia escalable para cuando crezcas.",
      offerBanner: "Oferta Lanzamiento: 30% OFF en tu primera web!",
      monthly: "Mensual",
      yearly: "Anual",
      save: "Ahorrá",
      bestChoice: "Más Popular",
      choosePlan: "Elegir Plan",
      plans: [
        {
          id: "starter",
          title: "Emprendedor",
          price_mo_num: 100,
          price_yr_num: 1000,
          price_unit_mo: "/mes",
          price_unit_yr: "/año",
          currency: "US$ ",
          desc: "Perfecto para tu primer sitio web profesional o portfolio.",
          ctaTooltip: "Lanzá tu presencia online.",
          features: [
            {
              name: "Sitio Web One-Page",
              tooltip: "Una sola página con toda tu información.",
            },
            {
              name: "Formulario de Contacto",
              tooltip: "Recibí consultas directo a tu mail.",
            },
            {
              name: "Dominio Gratis (1 año)",
              tooltip: "Te bonificamos el .com el primer año.",
            },
            {
              name: "Hosting Básico",
              tooltip: "Alojamiento rápido y seguro incluido.",
            },
          ],
          notIncluded: [
            { name: "E-commerce", tooltip: "No incluye tienda online." },
            {
              name: "Blog / Noticias",
              tooltip: "Sin sistema de gestión de artículos.",
            },
            {
              name: "Sistemas a Medida",
              tooltip: "Lógica avanzada no incluida.",
            },
          ],
        },
        {
          id: "business",
          title: "Pequeña Empresa",
          price_mo_num: 250,
          price_yr_num: 2500,
          price_unit_mo: "/mes",
          price_unit_yr: "/año",
          currency: "US$ ",
          desc: "Para locales y servicios listos para expandirse.",
          ctaTooltip: "Potenciá tus ventas y alcance.",
          features: [
            {
              name: "Sitio Multi-página",
              tooltip: "Inicio, Nosotros, Servicios, Contacto, etc.",
            },
            {
              name: "E-commerce (50 productos)",
              tooltip: "Vendé tus productos online con carrito.",
            },
            {
              name: "Blog / Noticias",
              tooltip: "Publicá novedades para atraer clientes.",
            },
            {
              name: "Google Maps",
              tooltip: "Mapa interactivo de tu ubicación.",
            },
            {
              name: "SEO Básico",
              tooltip: "Optimización para aparecer en Google.",
            },
          ],
          recommended: true,
          notIncluded: [
            {
              name: "Custom CRM/ERP",
              tooltip: "Herramientas de gestión interna no incluidas.",
            },
            {
              name: "Usuarios Ilimitados",
              tooltip: "Acceso restringido a administradores estándar.",
            },
          ],
        },
        {
          id: "enterprise",
          title: "Sistema a Medida",
          price_mo_num: 1000,
          price_yr_num: 1000,
          price_unit_mo: "",
          price_unit_yr: "",
          currency: "US$ ",
          desc: "Automatización y apps de gestión para empresas establecidas.",
          ctaTooltip: "Todo el poder para tu organización.",
          features: [
            {
              name: "CRM/ERP a Medida",
              tooltip: "Software hecho a tu medida para tu negocio.",
            },
            {
              name: "Usuarios Ilimitados",
              tooltip: "Sin costo extra por empleado.",
            },
            {
              name: "Integraciones API",
              tooltip: "Conectamos MercadoPago, AFIP, WhatsApp, etc.",
            },
            {
              name: "Automatización Avanzada",
              tooltip: "Bots y scripts para ahorrar trabajo manual.",
            },
            {
              name: "Soporte Prioritario",
              tooltip: "Línea directa con nuestros ingenieros.",
            },
          ],
          notIncluded: [],
        },
      ],
    },
    automation: {
      title: "¿Necesitás algo específico?",
      desc: "¿Pasás horas copiando datos de Excel al mail? ¿Necesitás un bot que responda preguntas frecuentes? Construimos herramientas a medida para automatizar lo aburrido y que te enfoques en tu negocio.",
      cta: "Consultoría Gratis",
      badge: "Ahorrá Tiempo",
      tags: [
        "Bots de WhatsApp",
        "Automatización Excel",
        "Control de Stock",
        "Herramientas a Medida",
      ],
    },
    faq: {
      title: "Preguntas Comunes",
      subtitle: "Todo lo que necesitás saber antes de empezar.",
      items: [
        {
          question: "No sé nada de tecnología. ¿Esto es para mí?",
          answer:
            "¡Absolutamente! Justamente para eso estamos. Nos encargamos de todos los detalles técnicos (servidores, dominios, código) para que vos te ocupes de tu negocio.",
        },
        {
          question: "¿Trabajan con grandes volúmenes (Enterprise)?",
          answer:
            "Sí. Nuestro equipo tiene experiencia en sistemas que manejan millones de peticiones. Para grandes empresas ofrecemos infraestructura dedicada, SLAs y protocolos de seguridad a medida.",
        },
        {
          question: "¿Qué es la IA y cómo ayuda a mi emprendimiento?",
          answer:
            "La IA puede ser tan simple como un chat que responde a tus clientes mientras dormís, o una herramienta que te ayuda a escribir emails más rápido. Buscamos usos prácticos que realmente te ahorren dinero.",
        },
        {
          question: "¿Soy dueño de mi sitio web?",
          answer:
            "Sí. A diferencia de plataformas como Wix o Shopify donde alquilás, con nosotros el código te pertenece. Si alguna vez querés irte, te llevás tu sitio.",
        },
        {
          question: "¿Cuánto tiempo tardan?",
          answer:
            "Un sitio web estándar suele demorar 1-2 semanas. Sistemas más complejos dependen de lo que necesites específicamente.",
        },
        {
          question: "¿Con quién hablo si algo se rompe?",
          answer:
            "Hablás directamente con nosotros. Nada de menús telefónicos automáticos. Escribinos a <a href='mailto:soporte@pidgeonsolutions.com' class='text-emerald-400 hover:underline'>soporte@pidgeonsolutions.com</a>.",
        },
      ],
    },
    rdd: {
      title: "La Era de la Inteligencia",
      subtitle:
        "La tecnología ya no es solo herramientas rígidas. Ahora entiende, razona y conecta.",
      llm: {
        title: "El Cerebro (LLM)",
        desc: "Los Modelos de Lenguaje (como Gemini) son el motor de razonamiento. Entienden el lenguaje humano, resumen textos y toman decisiones lógicas.",
        analogy: "Como un pasante genio que leyó todo internet.",
      },
      mcp: {
        title: "El Sistema Nervioso (MCP)",
        desc: "La inteligencia sola no sirve si está aislada. El 'Model Context Protocol' permite a la IA leer tus Excels, tu base de datos y mandar WhatsApps.",
        analogy: "Darle las llaves de la oficina al pasante.",
      },
    },
    chat: {
      initial:
        "¡Hola! Soy el asistente de Pidgeon. ¿Cómo puedo ayudarte a lanzar tu idea hoy?",
      placeholder: "Preguntá sobre chatbots, webs, precios o automatización...",
      error: "Ups, un parpadeo en la conexión. Intentá de nuevo.",
      rateLimited:
        "Llegaste al límite de consultas por ahora. ¡Escribinos directo por WhatsApp (+54 11 3155-6315) y seguimos charlando al instante!",
    },
    contactModal: {
      title: "Empezar Proyecto",
      subtitle: "Contanos un poco qué hacés.",
      nameLabel: "Tu Nombre",
      companyLabel: "Nombre del Negocio (Opcional)",
      emailLabel: "Email",
      messageLabel: "¿Qué necesitás?",
      messagePlaceholder: "Necesito un chatbot con IA para WhatsApp y una web...",
      sendButton: "Enviar Mensaje",
    },
    rddChatbotHighlight: {
      badge: "Destacado",
      title: "Chatbots con IA & Agentes Conversacionales",
      desc: "Desplegamos agentes conversacionales a medida en WhatsApp y Web conectados a tu stock real, agenda y CRM. Respuestas por chunks en tiempo real, 24/7.",
      cta: "Ver demos en vivo →",
    },
    chatbots: {
      badge: "IA CONVERSACIONAL · 24/7",
      titleStart: "Chatbots que",
      titleHighlight: "ejecutan",
      titleEnd: "por tu negocio.",
      subtitle:
        "Más allá de los menús rígidos: agentes potenciados por Gemini + MCP que leen tus datos en vivo, califican leads, agendan turnos y responden por chunks en tiempo real.",
      prevLabel: "Demo anterior",
      nextLabel: "Siguiente demo",
      autoAdvanceLabel: "Avanza solo cada 20s",
      pausedLabel: "En pausa",
      ctaButton: "Quiero este Chatbot",
      liveHeader: "pidgeon-agent-stream · en vivo",
      typingLabel: "transmitiendo chunks...",
      slides: [
        {
          id: "whatsapp-sales",
          channel: "WhatsApp Business · 24/7",
          accent: "emerald",
          title: "Atención Comercial 24/7 & Catálogo en Vivo",
          desc: "Responde consultas de productos, verifica stock real mediante MCP y cierra ventas mientras tu equipo descansa, sin árboles de opciones rígidos.",
          metrics: [
            "Tiempo de respuesta menor a 1.2s las 24 horas",
            "Consulta de stock y precios en vivo desde tu DB o Excel",
            "Derivación fluida a un asesor humano cuando hace falta",
          ],
          planTag: "Chatbot IA — WhatsApp 24/7",
          messages: [
            {
              role: "user",
              time: "23:14",
              text: "¡Hola! ¿Tienen stock de la impresora térmica industrial? Necesito 3 unidades para mañana en CABA.",
            },
            {
              role: "assistant",
              time: "23:14",
              text: "¡Hola! Sí, acabo de verificar el depósito en vivo: tenemos 7 unidades del modelo Thermal Pro 80mm listas para despacho inmediato. Llevando 3 tenés 10% de descuento por volumen (US$ 405 final) y el envío express a CABA llega mañana entre las 9:00 y las 13:00 hs.",
              status: "✓ Stock verificado vía MCP · Depósito #1 (7 u.)",
            },
            {
              role: "user",
              time: "23:15",
              text: "Buenísimo, reservame las 3 a nombre de Logística Sur.",
            },
            {
              role: "assistant",
              time: "23:15",
              text: "¡Listo! Quedó generada la reserva #842 para Logística Sur (3x Thermal Pro 80mm). Ya dejé el aviso prioritario al equipo de despacho para que te contacten a primera hora (08:00 hs).",
              status: "✓ Reserva #842 creada · Equipo comercial notificado",
            },
          ],
        },
        {
          id: "appointments",
          channel: "WhatsApp · Google Calendar",
          accent: "cyan",
          title: "Agenda Automática de Turnos y Reservas",
          desc: "Consulta disponibilidad real en tu calendario, asigna o reprograma turnos en segundos y reduce el ausentismo con recordatorios automáticos.",
          metrics: [
            "Sincronización bidireccional con Google Calendar / sistemas clínicos",
            "Confirmación inmediata y recordatorio automático 24 hs antes",
            "Reduce el ausentismo en consultorios y servicios hasta un 65%",
          ],
          planTag: "Chatbot IA — Turnos y Reservas",
          messages: [
            {
              role: "user",
              time: "16:08",
              text: "¡Hola! ¿Tienen turno disponible con el Dr. López para este jueves por la tarde?",
            },
            {
              role: "assistant",
              time: "16:08",
              text: "¡Hola! Consultando la agenda en vivo del Dr. López para este jueves: tengo disponibles los horarios de las 15:30 y las 17:00 hs. ¿Cuál te queda más cómodo?",
              status: "✓ Agenda consultada en tiempo real · 2 turnos libres",
            },
            {
              role: "user",
              time: "16:09",
              text: "A las 17:00 hs por favor, soy Martina Gómez.",
            },
            {
              role: "assistant",
              time: "16:09",
              text: "¡Confirmado, Martina! Te agendé con el Dr. López para este jueves a las 17:00 hs. Te voy a enviar un recordatorio por acá 24 horas antes.",
              status: "✓ Evento agendado en Calendar · Recordatorio programado",
            },
          ],
        },
        {
          id: "crm-leads",
          channel: "Web & Instagram · Sincronización CRM",
          accent: "purple",
          title: "Calificación de Leads & Carga en CRM",
          desc: "Entrevista de forma natural a cada prospecto, detecta volumen, urgencia y presupuesto, y crea la oportunidad calificada directo en tu CRM.",
          metrics: [
            "Filtra y puntúa leads de alta intención automáticamente",
            "Registra contacto, empresa y notas directo en tu CRM",
            "Notifica por WhatsApp al ejecutivo de cuentas asignado",
          ],
          planTag: "Chatbot IA — Calificación de Leads & CRM",
          messages: [
            {
              role: "user",
              time: "10:42",
              text: "Hola, buscamos automatizar la toma de pedidos de nuestras 12 sucursales.",
            },
            {
              role: "assistant",
              time: "10:42",
              text: "¡Excelente! Para asignarte al especialista indicado, ¿aproximadamente cuántos pedidos diarios procesan entre las 12 sucursales y qué sistema ERP o CRM utilizan hoy?",
              status: "✓ Intención detectada: Automatización Enterprise Multi-sucursal",
            },
            {
              role: "user",
              time: "10:43",
              text: "Unos 450 pedidos por día, usamos SAP Business One.",
            },
            {
              role: "assistant",
              time: "10:43",
              text: "Perfecto. Nos integramos de forma nativa con SAP vía API/MCP. Ya cargué tu ficha con Prioridad Alta en nuestro CRM y agendé una reunión técnica con nuestro Tech Lead para mañana a las 11:00 hs.",
              status: "✓ Lead calificado (Score 94%) · Sincronizado en CRM y SAP",
            },
          ],
        },
        {
          id: "govtech-desk",
          channel: "GovTech · Portal Ciudadano",
          accent: "emerald",
          title: "Mesa de Entrada & Atención Ciudadana",
          desc: "Diseñado para municipios y organismos públicos: permite consultar estado de expedientes, requisitos y turnos las 24 hs sin hacer fila.",
          metrics: [
            "Conexión en vivo al sistema de expedientes y trámites",
            "Guía paso a paso en lenguaje claro para el vecino",
            "Descongestiona mesas de entrada presenciales y líneas telefónicas",
          ],
          planTag: "Chatbot IA — GovTech Atención Ciudadana",
          messages: [
            {
              role: "user",
              time: "09:15",
              text: "Buen día, quiero consultar el estado del expediente de habilitación comercial N° 2026-04192.",
            },
            {
              role: "assistant",
              time: "09:15",
              text: "¡Buen día! El expediente N° 2026-04192 (Habilitación Comercial) aprobó ayer la inspección técnica y se encuentra en Despacho de Firma. Plazo estimado de emisión del certificado digital: 48 hs hábiles.",
              status: "✓ Consulta a Sistema Municipal · Etapa 4/5 Aprobada",
            },
            {
              role: "user",
              time: "09:16",
              text: "¿Tengo que presentar algún papel más de forma presencial?",
            },
            {
              role: "assistant",
              time: "09:16",
              text: "No hace falta que te acerques. Toda la documentación está validada; vas a recibir el certificado firmado con código QR directamente en tu correo electrónico declarado.",
              status: "✓ Consulta resuelta sin derivación humana",
            },
          ],
        },
      ],
    },
  },
};
