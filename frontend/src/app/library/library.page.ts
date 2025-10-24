import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonThumbnail,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonBackButton,
  IonButtons
} from '@ionic/angular/standalone';

type LibraryBook = {
  id: string;
  title: string;
  author?: string;
  thumbnail?: string | null;
  notes?: string;
  status: 'reading' | 'read';
  createdAt: number;
};

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
    IonThumbnail,
    IonTextarea,
    IonSegment,
    IonSegmentButton,
    IonBackButton,
    IonButtons
  ]
})
export class LibraryPage {
  reading: LibraryBook[] = [];
  read: LibraryBook[] = [];

  showAdd = false;
  isSubmitting = false;

  form = {
    title: '',
    author: '',
    notes: '',
    status: 'reading' as 'reading' | 'read',
    thumbnail: ''
  };

  private STORAGE_KEY = 'capitu_library_v1';

  constructor() {
    this.loadFromStorage();
  }

  toggleAdd() {
    this.showAdd = !this.showAdd;
  }

  private generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  addBook() {
    if (!this.form.title || this.form.title.trim().length === 0) {
      alert('Preencha o título do livro.');
      return;
    }

    this.isSubmitting = true;

    const book: LibraryBook = {
      id: this.generateId(),
      title: this.form.title.trim(),
      author: this.form.author?.trim() || '',
      thumbnail: this.form.thumbnail || null,
      notes: this.form.notes?.trim() || '',
      status: this.form.status,
      createdAt: Date.now()
    };

    if (book.status === 'reading') {
      this.reading.unshift(book);
    } else {
      this.read.unshift(book);
    }

    this.saveToStorage();

    // limpa o formulário
    this.form.title = '';
    this.form.author = '';
    this.form.notes = '';
    this.form.status = 'reading';
    this.form.thumbnail = '';

    this.isSubmitting = false;
    this.showAdd = false;
  }

  markAsRead(book: LibraryBook) {
    this._moveBook(book, 'read');
  }

  markAsReading(book: LibraryBook) {
    this._moveBook(book, 'reading');
  }

  removeBook(book: LibraryBook) {
    this.reading = this.reading.filter(b => b.id !== book.id);
    this.read = this.read.filter(b => b.id !== book.id);
    this.saveToStorage();
  }

  private _moveBook(book: LibraryBook, to: 'reading' | 'read') {
    this.reading = this.reading.filter(b => b.id !== book.id);
    this.read = this.read.filter(b => b.id !== book.id);

    const moved = { ...book, status: to, createdAt: Date.now() };
    if (to === 'reading') this.reading.unshift(moved);
    else this.read.unshift(moved);

    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({ reading: this.reading, read: this.read })
      );
    } catch (err) {
      console.error('Erro ao salvar biblioteca no localStorage', err);
    }
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      this.reading = parsed.reading || [];
      this.read = parsed.read || [];
    } catch (err) {
      console.error('Erro ao carregar biblioteca do localStorage', err);
    }
  }
}
