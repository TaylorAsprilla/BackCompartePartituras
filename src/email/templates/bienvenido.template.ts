import { EmailContext } from '../interface/email.interface';

export const bienvenidoTemplate = (context: EmailContext) => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { margin-top: 20px; padding: 10px; text-align: center; font-size: 12px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenido a nuestra plataforma</h1>
          </div>
          <div class="content">
            <p>Hola ${context.name},</p>
            <p>Tu cuenta ha sido creada exitosamente con el correo: ${context.email}</p>
            ${context.password ? `<p>Tu contraseña temporal es: <strong>${context.password}</strong></p>` : ''}
            <p>Por favor, inicia sesión y cambia tu contraseña lo antes posible.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Tu Aplicación. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};
