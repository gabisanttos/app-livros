import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonLabel
  ]
})
export class RegisterPage {
  // Propriedades do formulário
  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Navegar para login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Criar conta
  criarConta() {
    if (this.senha !== this.confirmarSenha) {
      alert('As senhas não conferem!');
      return;
    }

    const usuario = {
      name: this.nome,
      email: this.email,
      password: this.senha
    };

    this.http.post('http://localhost:3000/v1/api/register', usuario)
      .subscribe({
        next: () => {
          alert('Conta criada com sucesso!');
          this.router.navigate(['/login']); // redireciona para login
        },
        error: (err) => {
          alert('Erro ao criar conta: ' + (err.error?.message || err.message));
        }
      });
  }
}
