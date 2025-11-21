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
    // Força a renderização do searchbar
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

    this.http.get(`${this.apiUrl}/books/search?q=${encodeURIComponent(q)}`).subscribe({
      next: (res: any) => {
        const items = Array.isArray(res) ? res : [];

        const mapped = items.map((it: any) => {
          const thumbnail = it.cover_i
            ? `https://covers.openlibrary.org/b/id/${it.cover_i}-M.jpg`
            : null;

          return {
            id: it.key,
            title: it.title?.trim() || 'Sem título',
            authors: it.author_name || [],
            thumbnail,
            publishedDate: it.first_publish_year?.toString() ?? null,
            raw: it,
          };
        });

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
      error: () => {
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
      error: () => {
        this.showToast('❌ Erro ao adicionar livro. Tente novamente.', 'danger');
      }
    });
  }
}
