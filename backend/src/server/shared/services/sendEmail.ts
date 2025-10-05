import { User } from './../../database/models/User';
import { Resend } from 'resend';
import 'dotenv/config'; 

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envia um e-mail com o CÓDIGO de 6 dígitos para reset de senha usando a API da Resend.
 *
 * @param email O e-mail do destinatário.
 * @param resetToken O código de 6 dígitos gerado para reset de senha (OTP).
 * @param name O nome do usuário (opcional).
 */
export async function sendResetEmail(email: string, resetToken: string, name: string): Promise<void> {

    const emailFrom = process.env.RESEND_EMAIL_FROM;

    if (!emailFrom) {
        console.error("FATAL ERROR: RESEND_EMAIL_FROM não configurado no ambiente.");
        throw new Error("Configurações de e-mail incompletas.");
    }
    
    const otpCode = resetToken;
    
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h1 style="color: #a07d4c; text-align: start;">
                Capitu - 
                <span style="font-size: 0.7em; font-weight: bold;">Descubra seu próximo livro favorito</span>
            </h1>
            <h2 style="color: #a07d4c; text-align: center;">Código de Reset de Senha</h2>
            <p>Olá, ${name}</p>
            <p>Você solicitou um reset de senha para sua conta no Capitu. Utilize o código de 6 dígitos abaixo no seu aplicativo para confirmar a troca de senha.</p>
            
            <div style="text-align: center; margin: 30px 0; background-color: #f7f3fb; padding: 20px; border-radius: 6px; border: 1px dashed #a07d4c;">
                <p style="font-size: 14px; color: #555; margin-bottom: 5px;">Seu Código de Confirmação (Válido por 1 hora):</p>
                <strong style="font-size: 32px; letter-spacing: 10px; color: #a07d4c;">${otpCode}</strong>
            </div>

            <p>Este código expira em 1 hora. Por favor, não compartilhe este código com ninguém.</p>
            <p>Se você não solicitou esta alteração, por favor, ignore este e-mail.</p>
            <p>Atenciosamente,<br>A Equipe Capitu</p>
        </div>
    `;

    try {
        const { data, error } = await resend.emails.send({
            from: 'Capitu <' + emailFrom + '>',
            to: [email], 
            subject: 'Capitu: Seu Código de Reset de Senha',
            html: htmlContent,
        });

        if (error) {
            console.error(`[RESEND ERROR] Falha ao enviar e-mail para ${email}:`, error);
            throw new Error("Falha no envio de e-mail com a Resend.");
        }

        console.log(`[EMAIL] E-mail enviado com sucesso para ${email}. Message ID: ${data?.id}`);
    } catch (err) {
        console.error(`[EMAIL SERVICE ERROR] Exceção ao tentar enviar e-mail para ${email}:`, err);
        throw new Error("Falha no envio de e-mail.");
    }
}