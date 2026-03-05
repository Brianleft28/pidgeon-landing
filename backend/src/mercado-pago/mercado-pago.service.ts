import { Injectable, InternalServerErrorException } from "@nestjs/common";
import MercadoPagoConfig, { Payment } from "mercadopago";

@Injectable()
export class MercadopagoService {
  private client: MercadoPagoConfig;

  constructor() {
    // RECUERDA: Mueve este string a tus variables de entorno (.env) como MP_ACCESS_TOKEN
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN || "TU_ACCESS_TOKEN_DE_PRUEBA",
    });
  }

  async processPayment(createPaymentDto: any) {
    const payment = new Payment(this.client);

    try {
      const result = await payment.create({
        body: {
          transaction_amount: createPaymentDto.transaction_amount,
          token: createPaymentDto.token,
          description: createPaymentDto.description,
          installments: createPaymentDto.installments,
          payment_method_id: createPaymentDto.payment_method_id,
          payer: {
            email: createPaymentDto.payer.email,
            identification: {
              type: createPaymentDto.payer.identification.type,
              number: createPaymentDto.payer.identification.number,
            },
          },
        },
      });
      return result;
    } catch (error) {
      console.error("Error procesando pago:", error);
      throw new InternalServerErrorException(error);
    }
  }
}
