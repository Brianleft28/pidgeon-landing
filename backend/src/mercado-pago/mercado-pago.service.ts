import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import MercadoPagoConfig, { Payment } from "mercadopago";

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private readonly logger = new Logger(MercadoPagoService.name);

  constructor() {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      this.logger.warn("MP_ACCESS_TOKEN not set — payments will fail");
    }
    this.client = new MercadoPagoConfig({ accessToken: accessToken || "" });
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

      // TODO: On approved payment, send confirmation email from Pidgeon domain
      // if (result.status === 'approved') {
      //   await this.emailService.sendPaymentConfirmation({
      //     to: createPaymentDto.payer.email,
      //     planName: createPaymentDto.description,
      //     amount: createPaymentDto.transaction_amount,
      //     paymentId: result.id,
      //   });
      // }

      return result;
    } catch (error) {
      this.logger.error("Error procesando pago:", error);
      throw new InternalServerErrorException("Payment processing failed");
    }
  }
}
