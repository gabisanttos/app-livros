import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // ✅ importar Router

@Component({
  selector: 'app-savedbooks',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './savedbooks.page.html',
  styleUrls: ['./savedbooks.page.scss'],
})
export class SavedbooksPage {
  savedBooks = [
    {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      notes: 'Um clássico da literatura brasileira.',
    },
    {
      title: '1984',
      author: 'George Orwell',
      notes: 'Uma distopia sobre vigilância e poder.',
    }
  ];

  constructor(
    private navCtrl: NavController,
    private router: Router // ✅ injetando Router
  ) {}

  goBack() {
    this.navCtrl.navigateBack('/library');
  }

  // =============================
  // Navegação do Tab Bar
  // =============================
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

  removeBook(book: any) {
    this.savedBooks = this.savedBooks.filter(b => b !== book);
  }
}
