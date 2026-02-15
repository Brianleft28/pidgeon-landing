
# Pidgeon Solutions - Payment Integration Docs

This document outlines the required backend integration logic to support the frontend `PaymentModal`. The application is designed to be agnostic of the specific backend technology (Node/NestJS, PHP, Python), but expects specific endpoints to handle checkout sessions.

**Note:** Currently, the frontend UI has `paypal` and `card` (Stripe) methods disabled by default, showing an "In Development" tooltip. Only `mp` (Mercado Pago) is enabled.

## 1. Mercado Pago Integration (LATAM)

**Flow:**
1. Frontend sends `plan_id` and `price` to Backend.
2. Backend creates a "Preference" via Mercado Pago API.
3. Backend returns `init_point` (URL).
4. Frontend redirects user or opens MP modal.

**Backend Endpoint Example (NodeJS):**
```javascript
import mercadopago from "mercadopago";

mercadopago.configure({ access_token: "YOUR_ACCESS_TOKEN" });

app.post("/api/create_preference", (req, res) => {
  let preference = {
    items: [
      {
        title: req.body.plan_title,
        unit_price: Number(req.body.price),
        quantity: 1,
      }
    ],
    back_urls: {
        "success": "https://pidgeonsolutions.com/success",
        "failure": "https://pidgeonsolutions.com/failure",
        "pending": "https://pidgeonsolutions.com/pending"
    },
    auto_return: "approved",
  };

  mercadopago.preferences.create(preference)
    .then(function (response) {
      res.json({ id: response.body.id, init_point: response.body.init_point });
    }).catch(function (error) {
      console.log(error);
    });
});
```

## 2. PayPal Integration (Global) - **Disabled in UI**

**Flow:**
1. Backend generates an Order via PayPal REST API.
2. Returns `approve` link.

**Backend Snippet:**
```javascript
// Using @paypal/checkout-server-sdk
const request = new paypal.orders.OrdersCreateRequest();
request.prefer("return=representation");
request.requestBody({
  intent: 'CAPTURE',
  purchase_units: [{
    amount: {
      currency_code: 'USD',
      value: req.body.price
    }
  }]
});
// Execute request...
```

## 3. Stripe / Credit Card - **Disabled in UI**

**Flow:**
1. Frontend collects card details via Stripe Elements (recommended) or redirects to Stripe Checkout.
2. Backend creates a Checkout Session.

**Backend Snippet:**
```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: req.body.plan_title },
      unit_amount: req.body.price * 100, // cents
    },
    quantity: 1,
  }],
  mode: 'payment', // or 'subscription'
  success_url: 'https://yoursite.com/success',
  cancel_url: 'https://yoursite.com/cancel',
});
res.json({ id: session.id });
```

## Frontend Connection

In `components/PaymentModal.tsx`, the `handlePayment` function currently alerts. To connect this:

1. Replace `alert()` with a `fetch()` call to your backend.
2. Handle the redirect URL returned by your backend.

```typescript
const handlePayment = async () => {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ method: selectedMethod, plan: planName, amount })
        });
        const data = await response.json();
        if(data.url) window.location.href = data.url;
    } catch (e) {
        console.error(e);
    }
}
```