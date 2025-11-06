import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.local';
import { ToastController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonButtons,
  IonBackButton, IonIcon, IonTabButton, IonTabBar, IonTabs } from '@ionic/angular/standalone';

type BookResult = {
  id?: number | string;
  title: string;
  authors: string[];
  thumbnail?: string | null;
  publishedDate?: string | null;
  raw?: any;
};

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, 
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonButtons,
    IonBackButton,
  ]
})
export class ExplorePage {
  query: string = '';
  books: BookResult[] = [];
  loading = false;
  error: string | null = null;

  private searchTimeout: any = null;
  private apiUrl = environment.apiUrl;

  // Aqui você pode obter o userId do usuário logado (por exemplo, via auth service)
  private userId = 1; // ⚠️ Troque isso depois para o ID real do usuário autenticado

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }

  onSearch(event: any) {
    const q = (event?.detail?.value ?? event?.target?.value ?? '').trim();
    this.query = q;

    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    if (!q || q.length < 2) {
      this.books = [];
      this.loading = false;
      this.error = null;
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.searchBooks(q);
    }, 300);
  }

  private searchBooks(q: string) {
  this.loading = true;
  this.error = null;

  this.http.get(`${this.apiUrl}/books/search?q=${encodeURIComponent(q)}`).subscribe({
    next: (res: any) => {
      const items = Array.isArray(res) ? res : [];

      // Mapeia resultados e monta capa
      const mapped = items.map((it: any) => {
        const thumbnail = it.cover_i
          ? `https://covers.openlibrary.org/b/id/${it.cover_i}-M.jpg`
          : null;

        return {
          id: it.key, // "/works/OL12345W"
          title: it.title?.trim() || 'Sem título',
          authors: it.author_name || [],
          thumbnail,
          publishedDate: it.first_publish_year
            ? it.first_publish_year.toString()
            : null,
          raw: it,
        };
      });

      // 🔹 Remove duplicados por título + autor principal
      const uniqueBooks = mapped.filter(
        (book, index, self) =>
          index ===
          self.findIndex(
            (b) =>
              b.title.toLowerCase() === book.title.toLowerCase() &&
              (b.authors[0] || '') === (book.authors[0] || '')
          )
      );

      this.books = uniqueBooks;
      this.loading = false;
    },
    error: (err) => {
      console.error('Erro ao buscar livros', err);
      this.loading = false;
      this.error = 'Erro ao buscar livros. Tente novamente.';
    }
  }); 
}

  addToLibrary(book: BookResult) {
    const payload = {
      userId: this.userId,
      title: book.title,
      author: (book.authors && book.authors.join(', ')) || '',
    };

    this.http.post(`${this.apiUrl}/books`, payload).subscribe({
      next: () => {
        this.showToast('📚 Livro adicionado à sua biblioteca!');
      },
      error: (err) => {
        console.error('Erro ao adicionar livro', err);
        this.showToast('❌ Erro ao adicionar livro. Tente novamente.', 'danger');
      }
    });
  }
  
}
