import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment.local';

interface LoginResponse {
  token: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule, IonContent, IonItem, IonInput, IonButton]
})
export class LoginPage {
  email: string = '';
  senha: string = '';
  private apiUrl = environment.apiUrl;


  constructor(private router: Router, private http: HttpClient) {}

  
  login() {
    
    const body = {
      email: this.email,
      password: this.senha
    };

    
    const endpoint = `${this.apiUrl}/login`;

    this.http.post<LoginResponse>(endpoint, body).subscribe({
      next: (res) => {

        localStorage.setItem('token', res.token);

        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        alert('Email ou senha inválidos');
      }
    });

  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

    goToForgotPassword() {
    this.router.navigate(['/forgot-email']);
  }
}
