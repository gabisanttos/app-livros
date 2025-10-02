import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-email',
  templateUrl: './forgot-email.page.html',
  styleUrls: ['./forgot-email.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput]
})
export class ForgotEmailPage {
  email = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  sendCode() {
    if (!this.email || !this.email.includes('@')) {
      alert('Digite um e-mail válido.');
      return;
    }
    this.loading = true;
    this.http.post('http://localhost:3000/v1/api/auth/forgot', { email: this.email })
      .subscribe({
        next: () => {
          this.loading = false;
          alert('Código enviado para seu e-mail. Verifique a caixa de entrada.');
          this.router.navigate(['/forgot-code'], { state: { email: this.email } });
        },
        error: (err) => {
          this.loading = false;
          alert('Erro: ' + (err.error?.message || err.message));
        }
      });
  }

  goToCode() {
    this.router.navigate(['/forgot-code'], { state: { email: this.email } });
  }
}
