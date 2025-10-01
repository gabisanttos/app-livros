import * as nodemailer from 'nodemailer';
// O TypeORM já tem um import do 'dotenv/config' no data-source,
// mas para o serviço ser independente, é bom garantir o carregamento.
import 'dotenv/config'; 

/**
 * Configuração do Transportador de E-mail (SMTP) usando variáveis de ambiente.
 */
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: parseInt(process.env.EMAIL_SERVICE_PORT || '587'),
    secure: process.env.EMAIL_SERVICE_PORT === '465', // true para 465, false para outras portas
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
    },
});

/**
 * Envia um e-mail com o CÓDIGO de 6 dígitos para reset de senha para o usuário.
 *
 * @param email O e-mail do destinatário.
 * @param resetToken O código de 6 dígitos gerado para reset de senha (OTP).
 */
export async function sendResetEmail(email: string, resetToken: string): Promise<void> {
    
    // APP_FRONTEND_URL não é mais necessário, mas mantenho o emailFrom.
    const emailFrom = process.env.APP_EMAIL_FROM;

    if (!emailFrom) {
        // Logar um erro crítico se a variável essencial não estiver configurada.
        console.error("FATAL ERROR: APP_EMAIL_FROM não configurado no ambiente.");
        throw new Error("Configurações de e-mail incompletas.");
    }

    // O token é o código de 6 dígitos que o usuário irá digitar no app.
    const otpCode = resetToken;
    
    // Conteúdo HTML do e-mail (melhor para visualização em clientes de e-mail)
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h2 style="color: #6a0dad; text-align: center;">Código de Reset de Senha - Aplicativo Capitu</h2>
            <p>Olá,</p>
            <p>Você solicitou um reset de senha para sua conta no Capitu. Utilize o código de 6 dígitos abaixo no seu aplicativo para confirmar a troca de senha.</p>
            
            <div style="text-align: center; margin: 30px 0; background-color: #f7f3fb; padding: 20px; border-radius: 6px; border: 1px dashed #6a0dad;">
                <p style="font-size: 14px; color: #555; margin-bottom: 5px;">Seu Código de Confirmação (Válido por 1 hora):</p>
                <strong style="font-size: 32px; letter-spacing: 10px; color: #6a0dad;">${otpCode}</strong>
            </div>

            <p>Este código expira em 1 hora. Por favor, não compartilhe este código com ninguém.</p>
            <p>Se você não solicitou esta alteração, por favor, ignore este e-mail.</p>
            <p>Atenciosamente,<br>A Equipe Capitu</p>
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: emailFrom, // Remetente (definido no .env)
            to: email,      // Destinatário
            subject: 'Capitu: Seu Código de Reset de Senha', 
            // Na versão texto, é crucial destacar o código
            text: `Seu código de reset de senha (Válido por 1 hora): ${otpCode}. Insira este código no aplicativo Capitu. Se você não solicitou, ignore.`, 
            html: htmlContent, // Versão HTML
        });

        // Logar o ID da mensagem para referência e debug
        console.log(`[EMAIL] E-mail enviado com sucesso para ${email}. Message ID: ${info.messageId}`);
    } catch (error) {
        console.error(`[EMAIL ERROR] Falha ao enviar e-mail para ${email}:`, error);
        throw new Error("Falha no envio de e-mail.");
    }
}
