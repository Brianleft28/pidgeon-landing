import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { AdminDbService } from "../admin/admin-db.service";

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly adminDb: AdminDbService) {
    this.initTransporter();
  }

  private initTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      this.logger.warn(
        "SMTP credentials not fully configured in environment variables",
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  async sendContactEmail(data: {
    name: string;
    email: string;
    company?: string;
    message: string;
  }) {
    // Guardar siempre el lead en SQLite (Catálogo de Clientes / Leads de Etapa 3)
    try {
      this.adminDb.recordContactLead(data);
    } catch (err) {
      this.logger.warn("Could not record contact lead in SQLite", err);
    }

    if (!this.transporter) {
      this.logger.error("Cannot send email: SMTP not configured");
      throw new InternalServerErrorException(
        "El servicio de correo no está configurado.",
      );
    }

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const to = process.env.SMTP_TO || process.env.SMTP_USER;

    if (!to) {
      this.logger.error("Cannot send email: SMTP_TO not configured");
      throw new InternalServerErrorException(
        "El destinatario del correo no está configurado.",
      );
    }

    try {
      await this.transporter.sendMail({
        from: `"Pidgeon Landing" <${from}>`,
        to: to,
        subject: `Nuevo Contacto: ${data.name} - ${data.company || "Sin Empresa"}`,
        text: `Nombre: ${data.name}\nEmail: ${data.email}\nEmpresa: ${data.company || "N/A"}\n\nMensaje:\n${data.message}`,
        html: `
          <h3>Nuevo mensaje de contacto</h3>
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Empresa:</strong> ${data.company || "N/A"}</p>
          <br/>
          <p><strong>Mensaje:</strong></p>
          <p>${data.message.replace(/\n/g, "<br/>")}</p>
        `,
      });
      this.logger.log(`Contact email sent successfully for ${data.email}`);
    } catch (error) {
      this.logger.error("Failed to send contact email", error);
      throw new InternalServerErrorException(
        "Hubo un problema al enviar el correo.",
      );
    }
  }
}
