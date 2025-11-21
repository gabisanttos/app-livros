// src/app/library/library.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment.local';

export interface LibraryBook {
  id?: number | string;
  title: string;
  author?: string;
  notes?: string;
  thumbnail?: string | null;
  status?: 'lendo' | 'lido';
  isFavorite?: boolean;
  userId?: number;
  readingStatus?: string;
  raw?: any;
}

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonicModule, RouterModule],
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss']
})
export class LibraryPage {
  books: LibraryBook[] = [];
  reading: LibraryBook[] = [];
  read: LibraryBook[] = [];

  savedBooks: LibraryBook[] = [];
  showAdd = false;
  isSubmitting = false;

  updatingId: number | string | null = null;
  deletingId: number | string | null = null;
  savingId: number | string | null = null;

  userId = 1;

  form: Partial<LibraryBook> = {
    title: '',
    author: '',
    notes: '',
    status: 'lendo'
  };

  private apiUrl = environment.apiUrl?.replace(/\/$/, '') || '';

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSavedLocal();
    this.loadBooks();
  }

  ionViewWillEnter() {
    this.loadSavedLocal();
    this.loadBooks();
  }

  goToInicio() { this.router.navigate(['/inicio']); }
  goToExplore() { this.router.navigate(['/explore']); }
  goToLibrary() { this.router.navigate(['/library']); }
  goToSaved() { this.router.navigate(['/savedbooks']); }
  goToProfile() { this.router.navigate(['/profile']); }

  async presentToast(message: string, color: string = 'success') {
    const t = await this.toastCtrl.create({ message, duration: 1400, color });
    await t.present();
  }

  toggleAdd() { this.showAdd = !this.showAdd; }

  loadSavedLocal() {
    try {
      const raw = localStorage.getItem('mySavedBooks');
      this.savedBooks = raw ? JSON.parse(raw) : [];
    } catch {
      this.savedBooks = [];
    }
  }

  isSaved(book: LibraryBook): boolean {
    return this.savedBooks.some(b => String(b.id) === String(book.id));
  }

  loadBooks() {
    if (!this.apiUrl) {
      try {
        const raw = localStorage.getItem('myLibrary');
        this.books = raw ? JSON.parse(raw) : [];
        this.filterBooks();
      } catch {
        this.books = [];
      }
      return;
    }
    const url = `${this.apiUrl}/books/user/${this.userId}`;
    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        this.books = (res || []).map((r) => ({
          id: r.id ?? r._id ?? Math.random().toString(36).slice(2,9),
          title: r.title,
          author: r.author,
          notes: r.notes,
          thumbnail: r.thumbnail ?? (r.cover_i ? `https://covers.openlibrary.org/b/id/${r.cover_i}-M.jpg` : null) ?? null,
          status:
            (r.status as 'lendo' | 'lido') ||
            (r.readingStatus === 'READ' ? 'lido' : r.readingStatus === 'READING' ? 'lendo' : 'lendo'),
          isFavorite: !!r.isFavorite,
          userId: r.userId,
          readingStatus: r.readingStatus,
          raw: r
        }));
        this.filterBooks();
      },
      error: () => this.presentToast('Erro ao carregar livros', 'danger')
    });
  }

  filterBooks() {
    this.reading = this.books.filter((b) => b.status === 'lendo');
    this.read = this.books.filter((b) => b.status === 'lido');
  }

  addBook() {
    const title = (this.form.title || '').toString().trim();
    if (!title) {
      this.presentToast('Título é obrigatório', 'warning');
      return;
    }
    this.isSubmitting = true;
    const payload: any = {
      title,
      author: (this.form.author || '').toString().trim(),
      notes: this.form.notes || '',
      status: this.form.status || 'lendo',
      readingStatus: this.form.status === 'lido' ? 'READ' : 'READING',
      userId: this.userId
    };
    if (!this.apiUrl) {
      try {
        const key = 'myLibrary';
        const raw = localStorage.getItem(key);
        const current: LibraryBook[] = raw ? JSON.parse(raw) : [];
        const saved: LibraryBook = {
          id: Date.now(),
          title: payload.title,
          author: payload.author,
          notes: payload.notes,
          thumbnail: null,
          status: payload.status,
          userId: this.userId,
          readingStatus: payload.readingStatus
        };
        current.unshift(saved);
        localStorage.setItem(key, JSON.stringify(current));
        this.books.unshift(saved);
        this.filterBooks();
        this.presentToast('Livro adicionado!');
        this.form = { title: '', author: '', notes: '', status: 'lendo' };
        this.showAdd = false;
      } catch {
        this.presentToast('Erro ao adicionar livro', 'danger');
      } finally {
        this.isSubmitting = false;
      }
      return;
    }
    const url = `${this.apiUrl}/books`;
    this.http.post<any>(url, payload).subscribe({
      next: (res) => {
        const saved: LibraryBook = {
          id: res.id ?? res._id,
          title: res.title,
          author: res.author,
          notes: res.notes,
          thumbnail: res.thumbnail ?? null,
          status: res.status || (res.readingStatus === 'READ' ? 'lido' : 'lendo'),
          userId: res.userId
        };
        this.books.unshift(saved);
        this.filterBooks();
        this.presentToast('Livro adicionado!');
        this.form = { title: '', author: '', notes: '', status: 'lendo' };
        this.showAdd = false;
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erro ao adicionar livro';
        this.presentToast(msg, 'danger');
      },
      complete: () => (this.isSubmitting = false)
    });
  }

  updateStatus(book: LibraryBook, newStatus: 'lendo' | 'lido') {
  if (this.updatingId === book.id) return;
  this.updatingId = book.id ?? null;

  const payload = {
    bookId: book.id,
    userId: this.userId,
    status: newStatus === 'lido' ? 'READ' : 'READING'
  };

  if (!this.apiUrl) {
    try {
      const idx = this.books.findIndex((b) => b.id === book.id);
      if (idx > -1) {
        this.books[idx] = { ...this.books[idx], status: newStatus, readingStatus: payload.status };
        localStorage.setItem('myLibrary', JSON.stringify(this.books));
        this.filterBooks();
        this.presentToast('Status atualizado!');
      }
    } catch {
      this.presentToast('Erro ao atualizar status', 'danger');
    } finally {
      this.updatingId = null;
    }
    return;
  }

  const url = `${this.apiUrl}/books/status`; // ✅ rota PATCH correta
  this.http.patch<any>(url, payload).subscribe({
    next: (res) => {
      const idx = this.books.findIndex((b) => b.id === book.id);
      if (idx > -1) {
        this.books[idx] = {
          ...this.books[idx],
          status: newStatus,
          readingStatus: payload.status
        };
      }
      this.filterBooks();
      this.presentToast('Status atualizado!');
    },
    error: () => this.presentToast('Erro ao atualizar status', 'danger'),
    complete: () => { this.updatingId = null; }
  });
}


  markAsRead(book: LibraryBook) { this.updateStatus(book, 'lido'); }
  markAsReading(book: LibraryBook) { this.updateStatus(book, 'lendo'); }

  async removeBook(book: LibraryBook) {
    const alert = await this.alertCtrl.create({
      header: 'Remover livro',
      message: `Deseja remover "${book.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Remover', role: 'destructive', handler: () => this._confirmRemove(book) }
      ]
    });
    await alert.present();
  }

  private _confirmRemove(book: LibraryBook) {
    if (this.deletingId === book.id) return;
    this.deletingId = book.id ?? null;
    if (!this.apiUrl) {
      try {
        this.books = this.books.filter((b) => b.id !== book.id);
        localStorage.setItem('myLibrary', JSON.stringify(this.books));
        this.filterBooks();
        this.presentToast('Livro removido');
      } catch {
        this.presentToast('Erro ao remover livro', 'danger');
      } finally {
        this.deletingId = null;
      }
      return;
    }
    const url = `${this.apiUrl}/books/${book.id}`;
    this.http.delete<any>(url).subscribe({
      next: () => {
        this.books = this.books.filter((b) => b.id !== book.id);
        this.filterBooks();
        this.presentToast('Livro removido');
      },
      error: () => this.presentToast('Erro ao remover livro', 'danger'),
      complete: () => { this.deletingId = null; }
    });
  }

  saveToSaved(book: LibraryBook) {
    if (this.savingId === book.id) return;
    this.savingId = book.id ?? null;
    const payload = {
      id: book.id,
      title: book.title,
      author: book.author || '',
      notes: book.notes || '',
      thumbnail: book.thumbnail || null,
      userId: this.userId
    };
    if (!this.apiUrl) {
      try {
        const key = 'mySavedBooks';
        const raw = localStorage.getItem(key);
        const current: LibraryBook[] = raw ? JSON.parse(raw) : [];
        const exists = current.some(b => String(b.id) === String(book.id));
        if (!exists) {
          current.unshift(payload);
          localStorage.setItem(key, JSON.stringify(current));
          this.savedBooks = current;
          this.presentToast('Livro salvo!');
          setTimeout(() => {
            this.savingId = null;
            this.router.navigate(['/savedbooks']);
          }, 360);
          return;
        } else {
          this.presentToast('Livro já salvo', 'warning');
          this.savingId = null;
          return;
        }
      } catch {
        this.presentToast('Erro ao salvar', 'danger');
        this.savingId = null;
        return;
      }
    }
    const url = `${this.apiUrl}/savedbooks`;
    this.http.post<any>(url, payload).subscribe({
      next: () => {
        this.loadSavedLocal();
        this.presentToast('Livro salvo!');
        setTimeout(() => {
          this.savingId = null;
          this.router.navigate(['/savedbooks']);
        }, 360);
      },
      error: () => {
        this.presentToast('Erro ao salvar', 'danger');
        this.savingId = null;
      }
    });
  }
}
