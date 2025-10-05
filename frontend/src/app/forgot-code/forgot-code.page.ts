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
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.email = nav.extras.state['email'] || '';
    }
  }

  verifyCode() {
    if (!this.code) { 
      alert('Por favor, insira o código.'); 
      return; 
    }
    this.loading = true;

    const endpoint = `${this.apiUrl}/verify-reset-token`;

    this.http.post(endpoint, { token: this.code })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/reset-password'], { state: { token: this.code } });
        },
        error: (err) => {
          this.loading = false;
          alert('Código inválido ou expirado.');
        }
      });
  }

  resend() {
    if (!this.email) { 
      alert('Não foi possível encontrar o e-mail para reenviar o código.'); 
      return; 
    }
    
    const endpoint = `${this.apiUrl}/forgot-password`;

    this.http.post(endpoint, { email: this.email }).subscribe({
      next: () => alert('Um novo código foi enviado. Verifique seu e-mail.'),
      error: (err) => alert('Erro ao reenviar: ' + (err.error?.message || err.message))
    });
  }
}