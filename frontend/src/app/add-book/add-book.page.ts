import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonTextarea,
  IonDatetime,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.page.html',
  styleUrls: ['./add-book.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonTextarea,
    IonDatetime,
    IonButtons,
    IonBackButton
  ]
})
export class AddBookPage {
  title: string = '';
  author: string = '';
  genre: string = '';
  rating: number | null = null;
  readDate: string | undefined;
  notes: string = '';
  isSubmitting = false;

  // ajuste conforme seu backend
  private API = 'http://localhost:3000/v1/api/books';

  constructor(private router: Router, private http: HttpClient) {}

  // método do formulário
  submit() {
    if (!this.title.trim() || !this.author.trim()) {
      alert('Título e autor são obrigatórios.');
      return;
    }

    this.isSubmitting = true;

    const payload: any = {
      title: this.title.trim(),
      author: this.author.trim(),
      genre: this.genre || null,
      rating: this.rating || null,
      readDate: this.readDate || null,
      notes: this.notes || null
    };

    this.http.post(this.API, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Livro adicionado com sucesso!');
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        alert('Erro ao adicionar livro: ' + (err.error?.message || err.message));
      }
    });
  }
}
