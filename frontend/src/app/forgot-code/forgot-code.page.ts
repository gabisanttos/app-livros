import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment.local';

@Component({
  selector: 'app-forgot-code',
  templateUrl: './forgot-code.page.html',
  styleUrls: ['./forgot-code.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput]
})
export class ForgotCodePage {
  email = '';
  code = '';
  loading = false;
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient, private router: Router) {
    // se vier do estado, preenche o email
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && (nav.extras as any).state) {
      this.email = ((nav.extras as any).state as any).email || '';
    }
  }

  verifyCode() {
    if (!this.email || !this.code) { alert('Preencha email e código.'); return; }
    this.loading = true;

    const endpoint = `${this.apiUrl}/verify-reset-token`;

    this.http.post(endpoint, { email: this.email, code: this.code })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          // backend envia resetToken (curto) para permitir mudar senha
          const resetToken = res.resetToken;
          // navegar para tela de reset com token e email
          this.router.navigate(['/reset-password'], { state: { email: this.email, resetToken } });
        },
        error: (err) => {
          this.loading = false;
          alert('Código inválido ou expirado.');
        }
      });
  }

  resend() {
    if (!this.email) { alert('Informe o e-mail para reenviar.'); return; }
    this.http.post('http://localhost:3000/v1/api/auth/forgot', { email: this.email }).subscribe({
      next: () => alert('Código reenviado. Verifique o e-mail.'),
      error: (err) => alert('Erro ao reenviar: ' + (err.error?.message || err.message))
    });
  }
}
