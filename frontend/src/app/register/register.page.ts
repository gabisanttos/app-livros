import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule,HttpClientModule, FormsModule, IonContent, IonItem, IonInput, IonButton]
})
export class RegisterPage {
  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';

  constructor(private http: HttpClient) {}

  criarConta() {
    if(this.senha !== this.confirmarSenha) {
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
        next: (res) => {
          alert('Conta criada com sucesso!');
        },
        error: (err) => {
          alert('Erro ao criar conta: ' + err.error.message || err.message);
        }
      });
  }
}
