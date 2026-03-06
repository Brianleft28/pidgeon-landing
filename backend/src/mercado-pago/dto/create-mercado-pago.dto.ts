export class PayerIdentificationDto {
  type: string;
  number: string;
}

export class PayerDto {
  email: string;
  identification: PayerIdentificationDto;
}

export class CreateMercadoPagoDto {
  transaction_amount: number;
  token: string;
  description: string;
  installments: number;
  payment_method_id: string;
  payer: PayerDto;
}
