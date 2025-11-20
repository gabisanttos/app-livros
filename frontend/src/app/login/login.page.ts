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
  user: {
    id: string;
  };
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

  async wakeServer(): Promise<void> {
  try {
    // Requisição simples para uma rota leve do backend
    await fetch('https://api-capitu.onrender.com/health', {
      method: 'GET',
      mode: 'no-cors', // evita bloqueio do navegador nesta requisição inicial
    });
    console.log('Servidor acordado!');
  } catch (err) {
    console.warn('Não foi possível acordar o servidor:', err);
  }
}

async login() {
  if (!this.email || !this.senha) {
    this.presentToast('Por favor, preencha e-mail e senha.', 'danger');
    return;
  }

  this.isLoading = true;

  // ✅ Acorda o servidor antes do login
  await this.wakeServer();

  // Pequeno delay para garantir que o servidor acordou
  await new Promise(res => setTimeout(res, 2000));

  const body = { email: this.email, password: this.senha };
  const endpoint = `${this.apiUrl}/auth/login`;

  this.http.post<LoginResponse>(endpoint, body)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (res) => {
        console.log('🔐 Login Response:', res);

        if (res.token && res.user.id) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', String(res.user.id));
          this.router.navigate(['/inicio']);
        } else {
          this.presentToast('Erro: resposta inválida do servidor.', 'danger');
        }
      },
      error: (err) => {
        console.error('❌ Erro no login:', err);
        this.presentToast('Não foi possível conectar ao servidor.', 'danger');
      }
    });
}
  ngOnInit() {
    this.wakeServer();
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
