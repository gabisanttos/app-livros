import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput,ToastController, IonIcon
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment.local'
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { finalize } from 'rxjs/operators';

import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';


@Component({
  selector: 'app-forgot-email',
  templateUrl: './forgot-email.page.html',
  styleUrls: ['./forgot-email.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput,  IonIcon,  LottieComponent, 
]
})
export class ForgotEmailPage {
  email = '';
  isLoading: boolean = false;
  private apiUrl = environment.apiUrl;

    lottieOptions: AnimationOptions = {
    path: '/assets/animations/loading-book.json',
  };

  constructor(
    private router: Router, 
    private http: HttpClient,
    private toastController: ToastController
  ) {
    addIcons({ alertCircleOutline, checkmarkCircleOutline });
  }

  sendCode() {
    if (!this.email || !this.email.includes('@')) {
       this.presentToast('Digite um e-mail válido.', 'danger');
      return;
    }

    this.isLoading = true;

    const endpoint = `${this.apiUrl}/auth/forgot-password`;

    this.http.post(endpoint, { email: this.email })
      .pipe(
        
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.presentToast('Código enviado para seu e-mail. Verifique a caixa de entrada.', 'success');
          this.router.navigate(['/forgot-code'], { state: { email: this.email } });
        },
        error: (err) => {
          this.presentToast('Erro: ' + (err.error?.message || err.message), 'danger');
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

  goToCode() {
    this.router.navigate(['/forgot-code'], { state: { email: this.email } });
  }
}
