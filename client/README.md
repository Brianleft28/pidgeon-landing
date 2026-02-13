# Pidgeon Solutions - Enterprise Landing Page

Una Landing Page de alto rendimiento diseñada para una agencia de desarrollo de software y automatización. Construida con React, TypeScript y Tailwind CSS, con un enfoque en estética "Dark Mode", animaciones fluidas y arquitectura modular.

## 🚀 Características Principales

*   **Diseño Responsivo & Cinemático:** Navbar reactivo al scroll, efectos de paralaje y gradientes dinámicos.
*   **Internacionalización (i18n):** Soporte nativo para Inglés (EN) y Español (ES) con detección automática del navegador.
*   **Secciones Modulares:**
    *   **Hero:** Diseño dividido con efecto de escritura (Typewriter).
    *   **Servicios:** Grid de precios con toggle Mensual/Anual.
    *   **I+D (R&D):** Visualización de red neuronal en canvas HTML5.
    *   **Terminal Chat:** Widget flotante que simula una IA de soporte.
*   **Integración de Pagos:** UI preparada para Mercado Pago, PayPal y Stripe.

## 📂 Estructura del Proyecto

```
/
├── components/          # Componentes de UI (Hero, Navbar, Modals, etc.)
├── docs/                # Documentación técnica e integraciones
│   └── PAYMENT_INTEGRATION.md
├── public/
│   └── assets/          # Imágenes estáticas (Logos, fotos de equipo)
├── App.tsx              # Layout principal y Router
├── i18n.ts              # Archivo de traducciones (EN/ES)
└── index.tsx            # Punto de entrada
```

## 🎨 Gestión de Assets (Logos)

Para que la aplicación se visualice correctamente, debes colocar tus archivos de imagen en la carpeta pública:

1.  **Logo Principal:** `/public/assets/logo.png` (Usado en el Hero).
2.  **Icono Footer:** `/public/assets/logo-icon.png` (Usado en el pie de página).
3.  **Fotos de Equipo:** `/public/assets/team/` (brian.jpg, alejandro.jpg, thomas.jpg).

## 💳 Integración de Pagos

La aplicación incluye la interfaz de usuario (UI) para procesar pagos. Para conectar la lógica real con las pasarelas de pago, consulta la documentación detallada:

👉 **[Ver Guía de Implementación de Pagos](docs/PAYMENT_INTEGRATION.md)**

## 🛠️ Comandos

*   `npm install`: Instalar dependencias.
*   `npm start`: Iniciar servidor de desarrollo.
*   `npm build`: Compilar para producción.

---
© 2025 Pidgeon Solutions.
