# Guía de Integración de Pagos (Payment Integration Guide)

Este documento detalla cómo conectar la lógica de negocio a los botones de pago existentes en `components/ServicesGrid.tsx`.

---

## 1. Mercado Pago (Latinoamérica)

Ideal para cobros en moneda local (ARS, MXN, COP, etc.).

![Mercado Pago Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/MercadoPago_Logo.png/320px-MercadoPago_Logo.png)

### Implementación

1.  **Instalar SDK:**
    ```bash
    npm install @mercadopago/sdk-react
    ```

2.  **Configuración en `components/ServicesGrid.tsx`:**

    ```typescript
    import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

    // Inicializa con tu Public Key (Obtenida del panel de desarrollador de MP)
    initMercadoPago('TU_PUBLIC_KEY', { locale: 'es-AR' });
    ```

3.  **Flujo de Backend (Preferencia):**
    No puedes cobrar directamente desde el frontend por seguridad.
    1.  El usuario selecciona un plan.
    2.  Haces un `POST` a tu backend `/api/create-preference`.
    3.  Tu backend contacta a MP y devuelve un `preferenceId`.
    4.  Renderizas el botón `<Wallet />` con ese ID.

---

## 2. PayPal (Global)

Estándar para clientes internacionales (USD, EUR).

![PayPal Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png)

### Implementación

1.  **Instalar SDK:**
    ```bash
    npm install @paypal/react-paypal-js
    ```

2.  **Provider Global (`App.tsx`):**
    
    ```typescript
    import { PayPalScriptProvider } from "@paypal/react-paypal-js";

    // Envuelve tu app o la sección de servicios
    <PayPalScriptProvider options={{ "client-id": "TU_CLIENT_ID_DE_PAYPAL" }}>
       <App />
    </PayPalScriptProvider>
    ```

3.  **Botón en `ServicesGrid.tsx`:**

    ```typescript
    import { PayPalButtons } from "@paypal/react-paypal-js";

    <PayPalButtons
        style={{ layout: "horizontal", color: "blue" }}
        createOrder={(data, actions) => {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: "99.00" } // Precio dinámico según el plan
                }]
            });
        }}
    />
    ```

---

## 3. Stripe (Tarjetas de Crédito Global)

La opción más limpia para suscripciones recurrentes (SaaS).

![Stripe Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/200px-Stripe_Logo%2C_revised_2016.svg.png)

### Implementación

1.  Requiere `npm install @stripe/stripe-js @stripe/react-stripe-js`.
2.  Normalmente se redirige al usuario a una página de **Stripe Checkout** alojada por Stripe para mayor seguridad, o se usa el `PaymentElement` integrado.
3.  El botón "Pagar con Tarjeta" en el modal debe disparar una función `redirectToCheckout({ sessionId })`.

---

## 🔒 Notas de Seguridad

*   **Nunca expongas tus Access Tokens (Private Keys)** en el código frontend.
*   Usa **Variables de Entorno** (`.env`) para las Public Keys.
*   Configura **Webhooks** en tu backend para escuchar cuando un pago ha sido aprobado (`payment.created`, `checkout.session.completed`) y activar la cuenta del usuario automáticamente.
