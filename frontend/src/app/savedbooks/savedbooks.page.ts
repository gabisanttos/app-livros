import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

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

  constructor(private navCtrl: NavController) {}

  goBack() {
    this.navCtrl.navigateBack('/library');
  }

  removeBook(book: any) {
    this.savedBooks = this.savedBooks.filter(b => b !== book);
  }
}
