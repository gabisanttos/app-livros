// Importa o SDK da Resend
import { Resend } from 'resend';
// Garante o carregamento das variáveis de ambiente
import 'dotenv/config'; 

/**
 * Instancia o cliente da Resend.
 * A chave de API é lida automaticamente da variável de ambiente 'RESEND_API_KEY'.
 * Certifique-se de configurar esta variável no seu ambiente (.env e no Render).
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envia um e-mail com o CÓDIGO de 6 dígitos para reset de senha usando a API da Resend.
 *
 * @param email O e-mail do destinatário.
 * @param resetToken O código de 6 dígitos gerado para reset de senha (OTP).
 */
export async function sendResetEmail(email: string, resetToken: string): Promise<void> {
    
    /**
     * O e-mail de remetente.
     * IMPORTANTE: Deve ser um e-mail de um domínio que você verificou na sua conta Resend.
     * Ex: 'naoresponda@app.capitu.com'
     * Configure a variável 'RESEND_EMAIL_FROM' no seu ambiente.
     */
    const emailFrom = process.env.RESEND_EMAIL_FROM;

    if (!emailFrom) {
        // Logar um erro crítico se a variável essencial não estiver configurada.
        console.error("FATAL ERROR: RESEND_EMAIL_FROM não configurado no ambiente.");
        throw new Error("Configurações de e-mail incompletas.");
    }
    
    const otpCode = resetToken;
    
    // O conteúdo HTML do e-mail permanece o mesmo.
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
        // A chamada de envio agora usa o SDK da Resend
        const { data, error } = await resend.emails.send({
            from: emailFrom,
            to: [email], // A Resend espera um array de e-mails
            subject: 'Capitu: Seu Código de Reset de Senha',
            html: htmlContent,
        });

        // O SDK da Resend retorna um objeto de erro em caso de falha
        if (error) {
            console.error(`[RESEND ERROR] Falha ao enviar e-mail para ${email}:`, error);
            throw new Error("Falha no envio de e-mail com a Resend.");
        }

        // Logar o ID da mensagem para referência e debug
        console.log(`[EMAIL] E-mail enviado com sucesso para ${email}. Message ID: ${data?.id}`);
    } catch (err) {
        // Este 'catch' lida com erros de rede ou outras exceções inesperadas
        console.error(`[EMAIL SERVICE ERROR] Exceção ao tentar enviar e-mail para ${email}:`, err);
        throw new Error("Falha no envio de e-mail.");
    }
}
