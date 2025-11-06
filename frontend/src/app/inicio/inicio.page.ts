// src/app/inicio/inicio.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
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
  IonTabButton,
  IonIcon,
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
    IonTabButton,
    IonIcon,
  ]
})
export class InicioPage implements OnInit {
  name: string = '';
  recommendations: any[] = [];
  loading = true;
  private apiUrl = environment.apiUrl;
   private intervalId: any;

  constructor(private router: Router, private http: HttpClient) {
      console.log('Rota atual:', this.router.url);
  }

  ngOnInit() {
    this.loadUserData();
    
  }

  loadUserData() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  console.log('🔑 Token:', token);
  console.log('👤 UserId:', userId);

  if (!token || !userId) {
    console.warn('⚠️ Token ou userId não encontrados no localStorage.');
    this.loading = false;
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  console.log('📡 Fazendo requisição para perfil...');
  this.http.get<any>(`${this.apiUrl}/user/profile`, { headers }).subscribe({
    next: (res) => {
      console.log('✅ Perfil:', res);
      const name = res?.name || 'usuário(a)';
      const primeiroNome = name.split(' ')[0];
      this.name = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();
    },
    error: (err) => console.error('❌ Erro ao buscar perfil:', err)
  });

  console.log('📘 Buscando recomendações...');
  this.http.get<any>(`${this.apiUrl}/recommendations/user/${userId}`, { headers }).subscribe({
    next: (res) => {
      console.log('📗 Resposta da API de recomendações:', res);
      this.recommendations = res.suggestions || [];
    },
    error: (err) => console.error('❌ Erro ao buscar recomendações:', err),
    complete: () => {
      console.log('✅ Recomendações carregadas:', this.recommendations);
      this.loading = false;
    }
  });
}


  goToInicio() {
  this.router.navigate(['/inicio']);        
}

  goToExplore() {                     
    this.router.navigate(['/explore']);
  }

  goToLibrary() {
    this.router.navigate(['/library']);
  }

  addToLibrary(book: any) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const userId = localStorage.getItem('userId');
  const payload = {
  userId,
  title: book.title,
  author: book.author || (book.authors ? book.authors.join(', ') : 'Desconhecido'),
  readingStatus: 'TO_READ',
  notes: '',
  thumbnail: book.thumbnail || book.coverUrl || 'assets/no-cover.png'
};


  this.http.post(`${this.apiUrl}/library/add`, payload, { headers }).subscribe({
    next: () => {
      alert('📚 Livro adicionado à sua biblioteca!');
    },
    error: (err) => {
      console.error('Erro ao adicionar livro:', err);
      alert('❌ Não foi possível adicionar o livro.');
    }
  });
}


}
