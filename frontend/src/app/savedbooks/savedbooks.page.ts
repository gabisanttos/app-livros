// src/app/savedbooks/savedbooks.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.local';

export interface SavedBook {
  id?: number | string;
  title: string;
  author?: string;
  notes?: string;
  thumbnail?: string | null;
  raw?: any;
}

@Component({
  selector: 'app-savedbooks',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  templateUrl: './savedbooks.page.html',
  styleUrls: ['./savedbooks.page.scss']
})
export class SavedbooksPage implements OnInit {
  savedBooks: SavedBook[] = [];
  deletingId: number | string | null = null;
  private apiUrl = environment.apiUrl?.replace(/\/$/, '') || '';

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadSaved();
  }

  ionViewWillEnter() {
    this.loadSaved();
  }

  loadSaved() {
    if (!this.apiUrl) {
      const raw = localStorage.getItem('mySavedBooks');
      this.savedBooks = raw ? JSON.parse(raw) : this.savedBooks;
      return;
    }
    this.http.get<any[]>(`${this.apiUrl}/savedbooks/user/1`).subscribe({
      next: (res) => {
        this.savedBooks = (res || []).map(r => ({
          id: r.id ?? r._id ?? Math.random().toString(36).slice(2,9),
          title: r.title,
          author: r.author,
          notes: r.notes,
          thumbnail: r.thumbnail ?? (r.cover_i ? `https://covers.openlibrary.org/b/id/${r.cover_i}-M.jpg` : null) ?? null,
          raw: r
        }));
      },
      error: () => {
        const raw = localStorage.getItem('mySavedBooks');
        this.savedBooks = raw ? JSON.parse(raw) : this.savedBooks;
      }
    });
  }

  goBack() {
    this.navCtrl.navigateBack('/library');
  }

  goToInicio() { this.router.navigate(['/inicio']); }
  goToExplore() { this.router.navigate(['/explore']); }
  goToLibrary() { this.router.navigate(['/library']); }
  goToSaved() { this.router.navigate(['/savedbooks']); }
  goToProfile() { this.router.navigate(['/profile']); }

  async confirmRemove(book: SavedBook) {
    const alert = await this.alertCtrl.create({
      header: 'Remover livro',
      message: `Remover "${book.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Remover', role: 'destructive', handler: () => this.removeBook(book) }
      ]
    });
    await alert.present();
  }

  removeBook(book: SavedBook) {
    if (this.deletingId === book.id) return;
    this.deletingId = book.id ?? null;
    if (!this.apiUrl) {
      try {
        this.savedBooks = this.savedBooks.filter(b => b.id !== book.id);
        localStorage.setItem('mySavedBooks', JSON.stringify(this.savedBooks));
        this.presentToast('Livro removido');
      } catch {
        this.presentToast('Erro ao remover', 'danger');
      } finally {
        this.deletingId = null;
      }
      return;
    }
    this.http.delete(`${this.apiUrl}/savedbooks/${book.id}`).subscribe({
      next: () => {
        this.savedBooks = this.savedBooks.filter(b => b.id !== book.id);
        this.presentToast('Livro removido');
      },
      error: () => this.presentToast('Erro ao remover', 'danger'),
      complete: () => this.deletingId = null
    });
  }

  openBook(book: SavedBook) {
    if (book.id) {
      this.router.navigate(['/book', book.id]);
      return;
    }
    this.presentToast('Abrindo detalhes não disponível', 'warning');
  }

  async presentToast(message: string, color: string = 'success') {
    const t = await this.toastCtrl.create({ message, duration: 1500, color });
    await t.present();
  }
}
