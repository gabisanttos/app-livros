import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment.local';

interface LibraryBook {
  id?: number;
  title: string;
  author?: string;
  notes?: string;
  thumbnail?: string | null;
  status?: 'lendo' | 'lido';
  isFavorite?: boolean;
  userId?: number;
}

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    RouterModule
  ]
})
export class LibraryPage implements OnInit {
  books: LibraryBook[] = [];
  reading: LibraryBook[] = [];
  read: LibraryBook[] = [];

  showAdd = false;
  isSubmitting = false;

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
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBooks();
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

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  toggleAdd() {
    this.showAdd = !this.showAdd;
  }

  loadBooks() {
   
    const url = `${this.apiUrl}/books/user/${this.userId}`;

    this.http.get<any[]>(url).subscribe({
      next: (res) => {
       
        this.books = (res || []).map((r) => ({
          id: r.id,
          title: r.title,
          author: r.author,
          notes: r.notes,
          thumbnail: r.thumbnail ?? null,
          status:
            (r.status as 'lendo' | 'lido') ||
            (r.readingStatus === 'READ' ? 'lido' : r.readingStatus === 'READING' ? 'lendo' : 'lendo'),
          isFavorite: !!r.isFavorite,
          userId: r.userId
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
    if (!this.form.title || !this.form.title.toString().trim()) return;

    this.isSubmitting = true;

    const payload = {
      title: (this.form.title || '').toString().trim(),
      author: (this.form.author || '').toString().trim(),
      notes: this.form.notes || '',
  
      status: this.form.status || 'lendo',
      readingStatus: this.form.status === 'lido' ? 'READ' : 'READING',
      userId: this.userId
    };

    const url = `${this.apiUrl}/books`; 

    this.http.post<any>(url, payload).subscribe({
      next: (res) => {
      
        const saved: LibraryBook = {
          id: res.id,
          title: res.title,
          author: res.author,
          notes: res.notes,
          thumbnail: res.thumbnail ?? null,
          status: res.status || (res.readingStatus === 'READ' ? 'lido' : 'lendo'),
          userId: res.userId
        };
        this.books.push(saved);
        this.filterBooks();
        this.presentToast('Livro adicionado!');
        this.form = { title: '', author: '', notes: '', status: 'lendo' };
        this.showAdd = false;
      },
      error: () => this.presentToast('Erro ao adicionar livro', 'danger'),
      complete: () => (this.isSubmitting = false)
    });
  }

  updateStatus(book: LibraryBook, newStatus: 'lendo' | 'lido') {
    const updated = { ...book, status: newStatus, readingStatus: newStatus === 'lido' ? 'READ' : 'READING' };

    const url = `${this.apiUrl}/books/${book.id}`;

    this.http.put(url, updated).subscribe({
      next: () => {
        book.status = newStatus;
        this.filterBooks();
        this.presentToast('Status atualizado!');
      },
      error: () => this.presentToast('Erro ao atualizar status', 'danger')
    });
  }

  removeBook(book: LibraryBook) {
    const userId = this.userId;


    const url = `${this.apiUrl}/books/${book.id}`;

    this.http.delete(url).subscribe({
      next: () => {
        this.books = this.books.filter((b) => b.id !== book.id);
        this.filterBooks();
        this.presentToast('Livro removido');
      },
      error: () => this.presentToast('Erro ao remover livro', 'danger')
    });
  }

  markAsRead(book: LibraryBook) {
    this.updateStatus(book, 'lido');
  }

  markAsReading(book: LibraryBook) {
    this.updateStatus(book, 'lendo');
  }
}
