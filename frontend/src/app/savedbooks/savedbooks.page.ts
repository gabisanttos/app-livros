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
  addingId: string | null = null;
  removingId: string | null = null;
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

  toggleFavorite(book: any) {
    // Alterna o status de favorito do livro
    book.isFavorite = !book.isFavorite;
    
    // Aqui você pode adicionar a lógica para salvar no backend/storage
    if (book.isFavorite) {
      console.log(`Livro "${book.title}" adicionado aos favoritos`);
      this.presentToast('Adicionado aos favoritos! ❤️');
    } else {
      console.log(`Livro "${book.title}" removido dos favoritos`);
      this.presentToast('Removido dos favoritos');
    }
  }

  async openReadingStatusModal(book: any) {
    this.addingId = book.id;
    
    try {
      // Simula adição à biblioteca
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Adicionando livro à biblioteca:', book.title);
      this.presentToast(`"${book.title}" adicionado à biblioteca!`);
      
      // Aqui você implementaria a lógica real de adicionar à biblioteca
      
    } catch (error) {
      this.presentToast('Erro ao adicionar livro à biblioteca');
    } finally {
      this.addingId = null;
    }
  }

  async confirmRemove(book: any) {
    this.removingId = book.id;
    
    try {
      // Simula remoção
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove o livro da lista
      const index = this.savedBooks.findIndex(b => b.id === book.id);
      if (index > -1) {
        this.savedBooks.splice(index, 1);
        this.presentToast(`"${book.title}" removido dos salvos`);
      }
      
    } catch (error) {
      this.presentToast('Erro ao remover livro');
    } finally {
      this.removingId = null;
    }
  }

  generateThumbnail(title: string): string {
    // Gera uma URL de placeholder baseada no título
    const encodedTitle = encodeURIComponent(title.substring(0, 20));
    return `https://via.placeholder.com/160x240/8b6b3e/ffffff?text=${encodedTitle}`;
  }

  async presentToast(message: string, color: string = 'success') {
    const t = await this.toastCtrl.create({ message, duration: 1500, color });
    await t.present();
  }
}
