import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment.local';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonBackButton,
  IonButtons, IonIcon, IonTabButton } from '@ionic/angular/standalone';

interface LibraryBook {
  id?: number;
  title: string;
  author?: string;
  notes?: string;
  readingStatus: 'READING' | 'READ';
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
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonTextarea,
    IonSegment,
    IonSegmentButton,
    IonBackButton,
    IonButtons
  ]
})
export class LibraryPage implements OnInit {
  books: LibraryBook[] = [];
  reading: LibraryBook[] = [];
  read: LibraryBook[] = [];

  showAdd = false;
  isSubmitting = false;

  userId = 1;

  form: LibraryBook = {
    title: '',
    author: '',
    notes: '',
    readingStatus: 'READING',
  };

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.loadBooks();
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }

  toggleAdd() {
    this.showAdd = !this.showAdd;
  }

  loadBooks() {
    this.http.get<LibraryBook[]>(`${this.apiUrl}/books/user/${this.userId}`).subscribe({
      next: (res) => {
        this.books = res;
        this.filterBooks();
      },
      error: () => this.presentToast('Erro ao carregar livros', 'danger'),
    });
  }

  filterBooks() {
    this.reading = this.books.filter((b) => b.readingStatus === 'READING');
    this.read = this.books.filter((b) => b.readingStatus === 'READ');
  }

  addBook() {
    if (!this.form.title) return;

    this.isSubmitting = true;
    const payload = { ...this.form, userId: this.userId };

    this.http.post<LibraryBook>(this.apiUrl, payload).subscribe({
      next: (res) => {
        this.books.push(res);
        this.filterBooks();
        this.presentToast('Livro adicionado!');
        this.form = { title: '', author: '', notes: '', readingStatus: 'READING' };
        this.showAdd = false;
      },
      error: () => this.presentToast('Erro ao adicionar livro', 'danger'),
      complete: () => (this.isSubmitting = false),
    });
  }

  updateStatus(book: LibraryBook, newStatus: 'READING' | 'READ') {
    const updated = { ...book, readingStatus: newStatus };

    this.http.put(`${this.apiUrl}/${book.id}`, updated).subscribe({
      next: () => {
        book.readingStatus = newStatus;
        this.filterBooks();
        this.presentToast('Status atualizado!');
      },
      error: () => this.presentToast('Erro ao atualizar status', 'danger'),
    });
  }

  removeBook(book: LibraryBook) {
  const userId = this.userId; // ou pegue do auth service

  this.http
    .request('DELETE', `${this.apiUrl}/books`, {
      body: { bookId: book.id, userId },
    })
    .subscribe({
      next: () => {
        this.books = this.books.filter((b) => b.id !== book.id);
        this.filterBooks();
        this.presentToast('Livro removido');
      },
      error: () => this.presentToast('Erro ao remover livro', 'danger'),
    });
}

  // Atalhos
  markAsRead(book: LibraryBook) {
    this.updateStatus(book, 'READ');
  }

  markAsReading(book: LibraryBook) {
    this.updateStatus(book, 'READING');
  }
}
