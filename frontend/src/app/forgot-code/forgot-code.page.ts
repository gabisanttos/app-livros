import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput, ToastController, IonIcon
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment.local';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { finalize } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';



@Component({
  selector: 'app-forgot-code',
  templateUrl: './forgot-code.page.html',
  styleUrls: ['./forgot-code.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput,LottieComponent,IonIcon]
})
export class ForgotCodePage {
  email = '';
  code = '';
  isLoading: boolean = false;
  private apiUrl = environment.apiUrl;

    lottieOptions: AnimationOptions = {
    path: '/assets/animations/loading-book.json',
  };

  constructor(private http: HttpClient, private router: Router, private toastController: ToastController) {
    const nav = this.router.getCurrentNavigation();
    addIcons({ alertCircleOutline, checkmarkCircleOutline });
    if (nav?.extras?.state) {
      this.email = nav.extras.state['email'] || '';
    }
  }

  verifyCode() {
    if (!this.code) {
      this.presentToast('Por favor, insira o código.', 'danger');
      return;
    }

    this.isLoading = true;

    this.presentToast('Código  validado com sucesso.', 'success');


    const endpoint = `${this.apiUrl}/verify-reset-token`;

    this.http.post(endpoint, { token: this.code })
    .pipe(
        
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/reset-password'], { state: { token: this.code } });
        },
        error: (err) => {
          this.presentToast('Código inválido ou expirado.', 'danger');
        }
      });
  }

  resend() {
    if (!this.email) {
      this.presentToast('Não foi possível encontrar o e-mail para reenviar o código.', 'danger');
      return;
    }
    
    const endpoint = `${this.apiUrl}/forgot-password`;

    this.http.post(endpoint, { email: this.email }).subscribe({
      next: () => this.presentToast('Um novo código foi enviado. Verifique seu e-mail.', 'success'),
      error: (err) => this.presentToast('Erro ao reenviar: ' + (err.error?.message || err.message), 'danger')
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