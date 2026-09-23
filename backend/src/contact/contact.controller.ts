import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async sendContact(
    @Body() body: { name: string; email: string; company?: string; message: string }
  ) {
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      throw new BadRequestException('El nombre, correo y mensaje son obligatorios');
    }

    await this.contactService.sendContactEmail({
      name: body.name,
      email: body.email,
      company: body.company,
      message: body.message,
    });

    return { success: true, message: 'Correo enviado correctamente' };
  }
}
