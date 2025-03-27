import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';
import { bienvenidoTemplate } from './templates/bienvenido.template';
import { ConfigService } from '@nestjs/config';
import { EmailContext } from './interface/email.interface';
import { EmailTemplate } from './enums/template.enum';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    void this.initializeTransporter();
  }

  private async initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<string>('EMAIL_PORT'), // Asegurar que sea número
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false, // Solo para desarrollo
      },
    } as nodemailer.TransportOptions);

    await this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Conexión con Mailtrap establecida correctamente');
    } catch (error) {
      this.logger.error('Error al conectar con Mailtrap:', error);
      throw new Error(
        'No se pudo establecer conexión con el servidor de correo',
      );
    }
  }

  async sendEmail(
    sendEmailDto: SendEmailDto,
  ): Promise<{ success: boolean; messageId?: string }> {
    const { to, subject, text, html, template, context } = sendEmailDto;

    this.logger.log(`Preparando envío de email a: ${to}`);

    try {
      let finalHtml = html;
      let finalText = text;

      // Procesar plantillas
      if (template) {
        const processed = this.processTemplate(template, context);
        finalHtml = processed.html;
        finalText = processed.text || text;
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('EMAIL_FROM'),
        to,
        subject,
        text: finalText,
        html: finalHtml,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.transporter.sendMail(mailOptions);

      const messageId = (result as { messageId: string }).messageId;

      if (!messageId) {
        throw new Error('No se recibió messageId del servidor de correo');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Email enviado: ${result.accepted}`);

      return { success: true, messageId };
    } catch (error) {
      this.logger.error(
        `Error enviando email: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
      return { success: false };
    }
  }

  private processTemplate(
    template: string,
    context?: EmailContext,
  ): { html: string; text?: string } {
    switch (template) {
      case `${EmailTemplate.BIENVENIDA}`:
        if (!context?.name || !context?.email || !context?.password) {
          throw new Error(
            'Contexto inválido para plantilla de bienvenida. Se requieren name y email',
          );
        }
        return {
          html: bienvenidoTemplate(context),
          text: `Bienvenido ${context.name},\n\nTu cuenta ha sido creada con el email ${context.email}.\n\nGracias por unirte a nosotros!`,
        };
      // Añadir más plantillas aquí
      default:
        throw new Error(`Plantilla no reconocida: ${template}`);
    }
  }
}
