import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.local';

import { IonicModule, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    IonicModule
  ]
})
export class InicioPage implements OnInit {
  name: string = '';
  recommendations: any[] = [];
  loading = true;
  private apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async wakeServer(): Promise<void> {
    try {
      await fetch('https://api-capitu.onrender.com/health', {
        method: 'GET',
        mode: 'no-cors'
      });
      console.log('Servidor acordado!');
    } catch (err) {
      console.warn('Não foi possível acordar o servidor:', err);
    }
  }

  ngOnInit() {
    this.loadUserData();
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
      buttons: [{ text: 'Fechar', role: 'cancel' }]
    });
    await toast.present();
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(`${this.apiUrl}/user/profile`, { headers }).subscribe({
      next: (res) => {
        const name = res?.name || 'usuário(a)';
        const primeiroNome = name.split(' ')[0];
        this.name =
          primeiroNome.charAt(0).toUpperCase() +
          primeiroNome.slice(1).toLowerCase();
      },
      error: (err) => console.error('❌ Erro ao buscar perfil:', err)
    });

    this.http.get<any>(`${this.apiUrl}/recommendations/user/${userId}`, { headers }).subscribe({
      next: (res) => {
        this.recommendations = (res.suggestions || []).map((book: any) => {
          let cover = book.coverUrl;

          if (!cover && book.openLibraryData?.cover_i) {
            cover = `https://covers.openlibrary.org/b/id/${book.openLibraryData.cover_i}-L.jpg`;
          }

          return { ...book, coverUrl: cover || 'assets/no-cover.png' };
        });
      },
      error: (err) => console.error('❌ Erro ao buscar recomendações:', err),
      complete: () => {
        this.loading = false;
      }
    });
  }

  goToInicio() { this.router.navigate(['/inicio']); }
  goToExplore() { this.router.navigate(['/explore']); }
  goToLibrary() { this.router.navigate(['/library']); }
  goToSaved() { this.router.navigate(['/savedbooks']); }
  goToProfile() { this.router.navigate(['/profile']); }

  async openReadingStatusModal(book: any) {
    const alert = await this.alertController.create({
      header: 'Adicionar à Biblioteca',
      message: 'Selecione o status de leitura:',
      buttons: [
        { text: 'Lendo', handler: () => this.addToLibrary(book, 'READING') },
        { text: 'Lido', handler: () => this.addToLibrary(book, 'READ') },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });

    await alert.present();
  }

  async addToLibrary(book: any, readingStatus: string) {
    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('userId'));

    if (!token || !userId) {
      this.presentToast('Você precisa estar logado.', 'danger');
      return;
    }

    await this.wakeServer();
    await new Promise(res => setTimeout(res, 2000));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      userId,
      title: book.title,
      author: book.author || book.authors?.join(', ') || 'Desconhecido',
      thumbnail: book.coverUrl || 'assets/no-cover.png',
      readingStatus
    };

    this.http.post(`${this.apiUrl}/books`, payload, { headers })
      .subscribe({
        next: () => {
          this.presentToast('📚 Livro adicionado à sua biblioteca!', 'success');
        },
        error: (err) => {
          console.error('Erro ao adicionar livro:', err);
          this.presentToast('❌ Não foi possível adicionar o livro.', 'danger');
        }
      });
  }

 async toggleFavorite(book: any) {
  const token = localStorage.getItem('token');
  const userId = Number(localStorage.getItem('userId'));

  await this.wakeServer();
  await new Promise(res => setTimeout(res, 2000));

  if (!token || !userId) return;

  if (!book.id) {
    console.error("Tentou favoritar um livro sem ID. Adicione à biblioteca primeiro.");
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const payload = {
    bookId: book.id,
    userId: userId
  };

  this.http.patch(`${this.apiUrl}/books/favorite`, payload, { headers })
    .subscribe({
      next: () => {
        console.log("Favorito atualizado ✔");
        book.favorited = !book.favorited;
      },
      error: (err) => {
        console.error("Erro ao favoritar:", err);
      }
    });
}

generateThumbnail(title: string): string {
  const firstLetter = title.charAt(0).toUpperCase();

  // cor baseada no hash
  const colors = ["#6C63FF", "#FF6584", "#3DB2FF", "#00C896", "#FFB830"];
  const color = colors[title.length % colors.length];

  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 450;

  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 150px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(firstLetter, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL("image/png");
}



}
