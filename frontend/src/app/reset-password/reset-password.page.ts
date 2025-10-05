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
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput]
})
export class ResetPasswordPage {
  code = '';
  password = '';
  confirmPassword = '';
  loading = false;

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.code = nav.extras.state['token'] || ''; 
    }
  }

  resetPassword() {
    if (!this.password || this.password.length < 6) { alert('Senha mínima 6 caracteres'); return; }
    if (this.password !== this.confirmPassword) { alert('Senhas não conferem'); return; }
    if (!this.code) { alert('Token inválido. Volte e verifique o código.'); return; }

    const endpoint = `${this.apiUrl}/reset-password`;

    this.loading = true;
    const payload = {
      token: this.code,
      newPassword: this.password
    };

    this.http.post(endpoint, payload).subscribe({
      next: () => {
        this.loading = false;
        alert('Senha alterada com sucesso! Por favor, faça o login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        alert('Erro ao redefinir senha: ' + (err.error?.message || 'Código inválido ou expirado.'));
      }
    });
  }
}
