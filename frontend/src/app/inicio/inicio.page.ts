// src/app/inicio/inicio.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.local';

import { IonicModule } from '@ionic/angular';

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
    IonicModule
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

    if (!token || !userId) {
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(`${this.apiUrl}/user/profile`, { headers }).subscribe({
      next: (res) => {
        const name = res?.name || 'usuário(a)';
        const primeiroNome = name.split(' ')[0];
        this.name = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();
      },
      error: (err) => console.error('❌ Erro ao buscar perfil:', err)
    });

    this.http.get<any>(`${this.apiUrl}/recommendations/user/${userId}`, { headers }).subscribe({
      next: (res) => {
        this.recommendations = (res.suggestions || []).map((book: { coverUrl: any; openLibraryData: { cover_i: any; }; }) => {
  let cover = book.coverUrl;

  // Se não existir coverUrl mas existir cover_i dentro de openLibraryData
  if (!cover && book.openLibraryData?.cover_i) {
    cover = `https://covers.openlibrary.org/b/id/${book.openLibraryData.cover_i}-L.jpg`;
  }

  return {
    ...book,
    coverUrl: cover || 'assets/no-cover.png'
  };
});

      },
      error: (err) => console.error('❌ Erro ao buscar recomendações:', err),
      complete: () => {
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
    console.log('✅ Botão clicado!');
    this.router.navigate(['/library']);
  }

  goToSaved() {
    this.router.navigate(['/savedbooks']);
  }

  goToProfile() {
  this.router.navigate(['/profile']);
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
      coverUrl: book.thumbnail || book.coverUrl || 'assets/no-cover.png'
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
