import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-savedbooks',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon
  ],  
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

  constructor(private navCtrl: NavController, private router: Router) {}

  goBack() {
    this.navCtrl.navigateBack('/library');
  }

  removeBook(book: any) {
    this.savedBooks = this.savedBooks.filter(b => b !== book);
  }

  goToInicio() {
    this.router.navigate(['/inicio']);        
  }

  goToExplore() {                     
    this.router.navigate(['/explore']);
  }

  goToLibrary() {
    console.log('✅ Botão clicado!');
    this.router.navigate(['/library']);
  }

  goToSaved() {
    this.router.navigate(['/savedbooks']);
  }
}
