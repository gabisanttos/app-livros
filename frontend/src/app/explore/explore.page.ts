import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  IonBackButton
} from '@ionic/angular/standalone';

type BookResult = {
  id: string;
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
  imports: [
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
    IonBackButton
  ]
})
export class ExplorePage {
  query: string = '';
  books: BookResult[] = []; // inicializado para evitar TS2532
  loading = false;
  error: string | null = null;

  private searchTimeout: any = null;
  private GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
  private BACKEND_ADD_BOOK = 'http://localhost:3000/v1/api/books'; // ajuste se necessário

  constructor(private http: HttpClient) {}

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
    const params = { q, maxResults: '20' };

    this.http.get(this.GOOGLE_BOOKS_API, { params }).subscribe({
      next: (res: any) => {
        const items = res?.items || [];
        this.books = items.map((it: any) => {
          const info = it.volumeInfo || {};
          return {
            id: it.id,
            title: info.title || 'Sem título',
            authors: info.authors || [],
            thumbnail: info.imageLinks?.thumbnail ? info.imageLinks.thumbnail.replace('http:', 'https:') : null,
            publishedDate: info.publishedDate || null,
            raw: it
          } as BookResult;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro busca Google Books', err);
        this.loading = false;
        this.error = 'Erro ao buscar livros. Tente novamente.';
      }
    });
  }

  addToLibrary(book: BookResult) {
    const payload = {
      title: book.title,
      author: (book.authors && book.authors.join(', ')) || '',
      thumbnail: book.thumbnail || null,
      publishedDate: book.publishedDate || null,
      sourceId: book.id
    };

    this.http.post(this.BACKEND_ADD_BOOK, payload).subscribe({
      next: () => {
        alert('Livro adicionado à sua biblioteca!');
      },
      error: (err) => {
        console.error('Erro ao adicionar livro', err);
        alert('Erro ao adicionar livro. Tente novamente.');
      }
    });
  }
}
