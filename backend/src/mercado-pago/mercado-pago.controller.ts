import { Controller, Post, Body } from "@nestjs/common";
import { MercadoPagoService } from "./mercado-pago.service";
import { CreateMercadoPagoDto } from "./dto/create-mercado-pago.dto";

@Controller("mercado-pago")
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post("process-payment")
  processPayment(@Body() createPaymentDto: CreateMercadoPagoDto) {
    return this.mercadoPagoService.processPayment(createPaymentDto);
  }
}
