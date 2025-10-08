import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, ToastController, IonIcon } from '@ionic/angular/standalone';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { environment } from 'src/environments/environment.local';
import { finalize } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

interface LoginResponse {
  token: string;
}

@Component({    
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule, 
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    LottieComponent, 
    IonIcon
  ]
})

export class LoginPage {
  email: string = '';
  senha: string = '';
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

  
  login() {
    
    if (!this.email || !this.senha) {
      this.presentToast('Por favor, preencha e-mail e senha.', 'danger');
      return;
    }

    this.isLoading = true;
    
    const body = { email: this.email, password: this.senha };
    const endpoint = `${this.apiUrl}/login`;

    this.http.post<LoginResponse>(endpoint, body)
    .pipe(
        
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (res) => {

          localStorage.setItem('token', res.token);

          this.router.navigate(['/inicio']);
        },
        error: (err) => {
          this.presentToast('Email ou senha inválidos.', 'danger');
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

  goToRegister() {
    this.router.navigate(['/register']);
  }

    goToForgotPassword() {
    this.router.navigate(['/forgot-email']);
  }
}
