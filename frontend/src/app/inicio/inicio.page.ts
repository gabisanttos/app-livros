// src/app/inicio/inicio.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.local';


import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonTabs,
  IonTabBar,
  IonTabButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    // Ionic standalone components usados no template:
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonTabs,
    IonTabBar,
    IonTabButton
  ]
})

export class InicioPage {
  recommendations = [
    {
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      thumbnail: 'assets/img/fahrenheit.jpg',
      info: '⭐ 4.8 — Distopia, Ficção Científica'
    },
    {
      title: 'Nós',
      author: 'Yevgeny Zamyatin',
      thumbnail: 'assets/img/nos.jpg',
      info: '⭐ 4.3 — Distopia, Clássico'
    }
  ];

  name: string = '';
  private apiUrl = environment.apiUrl;


  constructor(private router: Router, private http: HttpClient) {

    const token = localStorage.getItem('token'); // ou de onde estiver salvo

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const endpoint = `${this.apiUrl}/profile`;

    this.http.get<any>(endpoint, { headers })
      .subscribe({
        next: (res) => {
          const name = res?.name || 'usuário(a)';
          const primeiroNome = name.split(' ')[0]; // pega só o primeiro nome

          // capitaliza a primeira letra
          this.name = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();

        },
        error: (err) => {
          console.error('Erro ao buscar perfil:', err);
        }
      });
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  goToExplore() {
    this.router.navigate(['/explore']);
  }
}
