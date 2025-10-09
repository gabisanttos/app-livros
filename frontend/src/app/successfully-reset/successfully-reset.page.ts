import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput,ToastController, IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';


@Component({
  selector: 'app-successfully-reset',
  templateUrl: './successfully-reset.page.html',
  styleUrls: ['./successfully-reset.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput, IonIcon]
})

export class SuccessfullyResetPage {

  loading = false;

  constructor(private http: HttpClient, private router: Router, private toastController: ToastController) {
    addIcons({ alertCircleOutline, checkmarkCircleOutline });
  }

  SuccessfullyResetPage() {
    this.router.navigate(['/login']);
  }

}
