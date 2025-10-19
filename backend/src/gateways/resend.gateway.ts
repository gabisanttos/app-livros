import { Resend } from 'resend';
import 'dotenv/config';

class EmailGateway {
  private resend: Resend;
  private emailFrom: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.APP_EMAIL_FROM;

    if (!apiKey) {
      throw new Error("Configuração de e-mail incompleta (API Key).");
    }

    if (!emailFrom) {
      throw new Error("Configuração de e-mail incompleta (Email From).");
    }

    this.resend = new Resend(apiKey);
    this.emailFrom = emailFrom;
  }

  /**
   * Envia um e-mail genérico usando o provedor (Resend).
   * @param to
   * @param subject
   * @param html
   */
  public async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.emailFrom,
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        throw new Error("Falha no provedor de envio de e-mail.");
      }

    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : "Erro desconhecido";
      throw new Error(`Falha no envio de e-mail: ${errorMessage}`);
    }
  }
}

export default new EmailGateway();