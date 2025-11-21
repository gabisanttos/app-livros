import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.local';
import { ToastController, IonicModule, IonSearchbar } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 

type BookResult = {
  id?: number | string;
  title: string;
  authors: string[];
  thumbnail?: string | null;
  publishedDate?: string | null;
  description?: string;
  pageCount?: number;
  publisher?: string;
  isFavorite?: boolean;
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
    IonicModule,
    RouterModule 
  ]
})
export class ExplorePage implements OnInit, AfterViewInit {
  @ViewChild('searchBar', { static: false }) searchBar!: IonSearchbar;
  
  query: string = '';
  books: BookResult[] = [];
  loading = false;
  error: string | null = null;

  private searchTimeout: any = null;
  private apiUrl = environment.apiUrl || '';
  private userId = 1;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private router: Router 
  ) {
    console.log('ExplorePage inicializada — apiUrl =', this.apiUrl);
  }

  ngOnInit() {
    console.log('ExplorePage ngOnInit');
  }

  ngAfterViewInit() {
    console.log('ExplorePage ngAfterViewInit');
    if (this.searchBar) {
      this.searchBar.getInputElement().then((input) => {
        if (input) {
          input.style.display = 'block';
          input.style.visibility = 'visible';
          console.log('Searchbar input configurado');
        }
      }).catch((error) => {
        console.error('Erro ao configurar searchbar:', error);
      });
    }
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

  goToSaved() {
    this.router.navigate(['/savedbooks']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  clearSearch() {
    this.query = '';
    this.books = [];
    this.error = null;
    console.log('Pesquisa limpa');
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

    // ATUALIZADO: Inclui userId para receber informação de favoritos
    const searchUrl = `${this.apiUrl}/books/search?q=${encodeURIComponent(q)}&userId=${this.userId}`;
    
    this.http.get(searchUrl).subscribe({
      next: (res: any) => {
        const items = Array.isArray(res) ? res : [];

        // ATUALIZADO: Mapeia dados do Google Books API
        const mapped = items.map((book: any) => {
          return {
            id: book.id, // Google Books ID
            title: book.title?.trim() || 'Sem título',
            authors: book.authors || [], // Já é array no Google Books
            thumbnail: book.thumbnail || book.coverUrl, // URL direta do Google Books
            publishedDate: book.publishedDate || null,
            description: book.description || null,
            pageCount: book.pageCount || null,
            publisher: book.publisher || null,
            isFavorite: book.isFavorite || false, // Informação de favorito
            raw: book,
          };
        });

        // Remove duplicatas por título e primeiro autor
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

        console.log('Livros encontrados:', this.books);
      },
      error: (error) => {
        console.error('Erro na busca:', error);
        this.loading = false;
        this.error = 'Erro ao buscar livros. Tente novamente.';
      }
    });
  }

  addToLibrary(book: BookResult) {
    const payload = {
      userId: this.userId,
      title: book.title,
      author: book.authors.join(', '), // ATUALIZADO: converte array para string
      thumbnail: book.thumbnail,
      readingStatus: 'TO_READ' // ADICIONADO: campo obrigatório
    };

    console.log('Adicionando livro à biblioteca:', payload);

    this.http.post(`${this.apiUrl}/books`, payload).subscribe({
      next: (response) => {
        console.log('Livro adicionado:', response);
        this.showToast('📚 Livro adicionado à sua biblioteca!');
      },
      error: (error) => {
        console.error('Erro ao adicionar livro:', error);
        this.showToast('❌ Erro ao adicionar livro. Tente novamente.', 'danger');
      }
    });
  }

  // NOVO: Método para favoritar/desfavoritar livros
  toggleFavorite(book: BookResult) {
    if (!book.isFavorite) {
      // Adicionar aos favoritos
      const payload = {
        googleBookId: book.id,
        title: book.title,
        author: book.authors.join(', '),
        thumbnail: book.thumbnail,
        description: book.description,
        publishedDate: book.publishedDate
      };

      this.http.post(`${this.apiUrl}/favorites/${this.userId}`, payload).subscribe({
        next: () => {
          book.isFavorite = true;
          this.showToast('❤️ Livro adicionado aos favoritos!');
        },
        error: (error) => {
          console.error('Erro ao favoritar:', error);
          this.showToast('❌ Erro ao favoritar livro.', 'danger');
        }
      });
    } else {
      // Remover dos favoritos
      const payload = { googleBookId: book.id };
      
      this.http.delete(`${this.apiUrl}favorites/${this.userId}/by-google-id`, { 
        body: payload 
      }).subscribe({
        next: () => {
          book.isFavorite = false;
          this.showToast('💔 Livro removido dos favoritos.');
        },
        error: (error) => {
          console.error('Erro ao desfavoritar:', error);
          this.showToast('❌ Erro ao remover favorito.', 'danger');
        }
      });
    }
  }
}
