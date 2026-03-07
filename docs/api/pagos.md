# API — Pagos

## Resumen

Endpoint para procesar pagos con Mercado Pago. El controller delega toda la lógica al service, que interactúa con el SDK de Mercado Pago.

## Endpoint

### `POST /mercado-pago/process-payment`

Procesa un pago con tarjeta de crédito/débito.

**Request:**

```http
POST /mercado-pago/process-payment
Content-Type: application/json

{
  "transaction_amount": 100,
  "token": "card_token_from_mp_cardform",
  "description": "Plan Entrepreneur - Pidgeon Solutions",
  "installments": 1,
  "payment_method_id": "visa",
  "payer": {
    "email": "cliente@email.com",
    "identification": {
      "type": "DNI",
      "number": "12345678"
    }
  }
}
```

### Campos del DTO

| Campo                         | Tipo     | Descripción                                          |
| ----------------------------- | -------- | ---------------------------------------------------- |
| `transaction_amount`          | `number` | Monto en la moneda local                             |
| `token`                       | `string` | Token de tarjeta generado por Mercado Pago Card Form |
| `description`                 | `string` | Descripción del pago (nombre del plan)               |
| `installments`                | `number` | Número de cuotas                                     |
| `payment_method_id`           | `string` | Método de pago (`visa`, `master`, `amex`, etc.)      |
| `payer.email`                 | `string` | Email del pagador                                    |
| `payer.identification.type`   | `string` | Tipo de documento (`DNI`, `CUIL`, `CUIT`)            |
| `payer.identification.number` | `string` | Número de documento                                  |

### Response (200 OK)

```json
{
  "id": 1234567890,
  "status": "approved",
  "status_detail": "accredited",
  "transaction_amount": 100,
  "currency_id": "ARS",
  "payment_method_id": "visa",
  "payer": {
    "email": "cliente@email.com"
  }
}
```

### Errores

| Status | Causa                                         |
| ------ | --------------------------------------------- |
| 500    | Error interno al comunicarse con Mercado Pago |

> El service captura excepciones del SDK y lanza `InternalServerErrorException` con un mensaje genérico por seguridad.

## Dependencia

- **SDK:** `mercadopago` v2.12.x
- **Variable:** `MP_ACCESS_TOKEN` en el entorno del backend

---

_Ver también:_ [Integración de Pagos](../integraciones/pagos.md) · [Backend Architecture](../arquitectura/backend.md)
