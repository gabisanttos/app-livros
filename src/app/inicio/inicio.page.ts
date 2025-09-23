import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardContent,
  IonList, IonItem, IonThumbnail, IonLabel, IonButton,
  IonSegment, IonSegmentButton,
  IonFooter, IonTabBar, IonTabButton, IonIcon, IonButtons, IonAvatar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardContent,
    IonList, IonItem, IonThumbnail, IonLabel, IonButton,
    IonSegment, IonSegmentButton,
    IonFooter, IonTabBar, IonTabButton, IonIcon, IonButtons, IonAvatar
  ]
})
export class InicioPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
