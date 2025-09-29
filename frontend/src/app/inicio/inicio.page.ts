// src/app/inicio/inicio.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
  // exemplo de lista de livros (você pode popular via API)
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

  constructor(private router: Router) {}

  // navegação por clique (caso opte por (click)="goTo('/rota')" nos tab-buttons)
  goTo(path: string) {
    this.router.navigate([path]);
  }

  // exemplo de handler do botão "Adicionar"
  addBook(book: any) {
    console.log('Adicionar livro:', book.title);
    // aqui você chamaria o endpoint para adicionar ao usuário
  }
}
