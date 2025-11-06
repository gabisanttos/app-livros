import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput,ToastController, IonIcon
} from '@ionic/angular/standalone';

import { environment } from 'src/environments/environment.local';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput, IonIcon]
})
export class ResetPasswordPage {
  code = '';
  password = '';
  confirmPassword = '';
  loading = false;

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient, private router: Router, private toastController: ToastController) {
    const nav = this.router.getCurrentNavigation();
    addIcons({ alertCircleOutline, checkmarkCircleOutline });

    if (nav?.extras?.state) {
      this.code = nav.extras.state['token'] || ''; 
    }
  }

  resetPassword() {
    if (!this.password || this.password.length < 6) { alert('Senha mínima 6 caracteres'); return; }
    if (this.password !== this.confirmPassword) { alert('Senhas não conferem'); return; }
    if (!this.code) { alert('Token inválido. Volte e verifique o código.'); return; }

    const endpoint = `${this.apiUrl}/auth/reset-password`;

    this.loading = true;
    const payload = {
      token: this.code,
      newPassword: this.password
    };

    this.http.post(endpoint, payload).subscribe({
      next: () => {
        this.loading = false;
        this.presentToast('Senha alterada com sucesso! Por favor, faça o login.', 'success');
        this.router.navigate(['/successfully-reset']);
      },
      error: (err) => {
        this.loading = false;
        this.presentToast('Erro ao redefinir senha: ' + (err.error?.message || 'Código inválido ou expirado.'), 'danger');
      }
    });
  }
   async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // O toast desaparecerá após 3 segundos
      position: 'top', // Posição do toast na tela
      color: color,    // Cor (danger para erros, success para sucesso)
      icon: color === 'danger' ? 'alert-circle-outline' : 'checkmark-circle-outline',
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

}
