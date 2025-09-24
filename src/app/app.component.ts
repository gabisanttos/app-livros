import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet,
  IonButton,
  IonContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonButton,
    IonContent
  ]
})
export class AppComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  } 
}
