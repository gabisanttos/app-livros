import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput]
})
export class ResetPasswordPage {
  email = '';
  resetToken = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && (nav.extras as any).state) {
      const s = (nav.extras as any).state as any;
      this.email = s.email || '';
      this.resetToken = s.resetToken || '';
    }
  }

  resetPassword() {
    if (!this.password || this.password.length < 6) { alert('Senha mínima 6 caracteres'); return; }
    if (this.password !== this.confirmPassword) { alert('Senhas não conferem'); return; }
    if (!this.resetToken) { alert('Token inválido. Volte e verifique o código.'); return; }

    this.loading = true;
    this.http.post('http://localhost:3000/v1/api/auth/reset', {
      email: this.email, resetToken: this.resetToken, password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        alert('Senha alterada com sucesso. Faça login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        alert('Erro ao redefinir senha: ' + (err.error?.message || err.message));
      }
    });
  }
}
