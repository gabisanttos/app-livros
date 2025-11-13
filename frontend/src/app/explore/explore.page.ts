// src/app/explore/explore.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.local';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

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
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    IonicModule
  ]
})
export class ExplorePage {
  query: string = '';
  books: BookResult[] = [];
  loading = false;
  error: string | null = null;

  private searchTimeout: any = null;
  private apiUrl = environment.apiUrl || '';

  private userId = 1;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {
    console.log('ExplorePage inicializada — apiUrl =', this.apiUrl);
  }

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
    const value =
      (event?.detail?.value ?? event?.target?.value ?? event)?.toString?.() ?? '';
    const q = value.trim();
    this.query = q;

    console.log('onSearch fired, query =', q);

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
    this.books = [];

    if (!this.apiUrl) {
      console.warn('API URL vazio — não é possível buscar. query:', q);
      this.error = 'API não configurada (apiUrl vazia).';
      this.loading = false;
      return;
    }

    const url = `${this.apiUrl}/books/search`;
    const params = new HttpParams().set('q', q);

    console.log('Chamando backend:', url, 'params:', params.toString());

    this.http.get(url, { params, observe: 'body' }).subscribe({
      next: (res: any) => {
        console.log('Resposta /books/search:', res);

        const items: any[] = Array.isArray(res)
          ? res
          : Array.isArray(res.items)
            ? res.items
            : Array.isArray(res.results)
              ? res.results
              : [];

        const mapped: BookResult[] = (items || []).map((it: any) => {
          const thumbnail =
            it.thumbnail ||
            (it.cover_i ? `https://covers.openlibrary.org/b/id/${it.cover_i}-M.jpg` : null) ||
            it.coverUrl ||
            null;

          return {
            id: it.id ?? it.key ?? it.cover_i ?? Math.random().toString(36).slice(2, 9),
            title: (it.title || it.name || '').toString().trim() || 'Sem título',
            authors: it.authors || it.author_name || (it.author ? [it.author] : []) || [],
            thumbnail,
            publishedDate: it.publishedDate || it.first_publish_year || it.year || null,
            raw: it
          } as BookResult;
        });

        // Tipagem explícita nos parâmetros do filter para evitar TS7006
        const uniqueBooks = mapped.filter((book: BookResult, index: number, self: BookResult[]) =>
          index === self.findIndex((b: BookResult) =>
            (b.title || '').toLowerCase() === (book.title || '').toLowerCase() &&
            ((b.authors?.[0] || '') === (book.authors?.[0] || ''))
          )
        );

        this.books = uniqueBooks;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao buscar livros', err);
        this.loading = false;
        if (err?.status === 0) {
          this.error = 'Erro de conexão: verifique CORS / se a API está rodando.';
        } else if (err?.status >= 400 && err?.status < 500) {
          this.error = 'Requisição inválida. Tente outro termo.';
        } else {
          this.error = 'Erro ao buscar livros. Tente novamente mais tarde.';
        }
      }
    });
  }

  goToInicio() { this.router.navigate(['/inicio']); }
  goToExplore() { this.router.navigate(['/explore']); }
  goToLibrary() { this.router.navigate(['/library']); }
  goToSaved() { this.router.navigate(['/savedbooks']); }

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
      error: (err: any) => {
        console.error('Erro ao adicionar livro', err);
        this.showToast('❌ Erro ao adicionar livro. Tente novamente.', 'danger');
      }
    });
  }
}
