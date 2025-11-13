// src/app/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService, UserProfile } from '../services/user'; // assume src/app/services/user.ts

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goBack()" fill="clear">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Perfil</ion-title>

        <ion-buttons slot="end">
          <ion-button (click)="goToSettings()" title="Configurações">
            <ion-icon slot="icon-only" name="settings-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar>
        <ion-segment value="info" (ionChange)="segmentChanged($event)">
          <ion-segment-button value="info">
            <ion-label>Info</ion-label>
          </ion-segment-button>
          <ion-segment-button value="stats">
            <ion-label>Estatísticas</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ng-container *ngIf="!loading; else loadingTpl">

        <ion-card>
          <ion-card-header>
            <ion-avatar slot="start" class="avatar">
              <img [src]="userAvatar" alt="avatar">
            </ion-avatar>
            <ion-card-title>{{ user?.name || 'Usuário' }}</ion-card-title>
            <ion-card-subtitle>{{ user?.email }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>

            <!-- SEGMENT: INFO -->
            <div *ngIf="segment === 'info'">
              <ion-grid>
                <ion-row>
                  <ion-col size="12" size-md="6">
                    <div class="info-item">
                      <div class="label">E-mail</div>
                      <div class="value">{{ user?.email || '—' }}</div>
                    </div>
                  </ion-col>

                  <ion-col size="12" size-md="6">
                    <div class="info-item">
                      <div class="label">Telefone</div>
                      <div class="value">{{ user?.phone || '—' }}</div>
                    </div>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col size="12" size-md="6">
                    <div class="info-item">
                      <div class="label">Idade</div>
                      <div class="value">{{ user?.age ?? '—' }}</div>
                    </div>
                  </ion-col>

                  <ion-col size="12" size-md="6">
                    <div class="info-item">
                      <div class="label">Livros lidos</div>
                      <div class="value">{{ user?.booksRead ?? 0 }}</div>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </div>

            <!-- SEGMENT: STATS (exemplo alternativo) -->
            <div *ngIf="segment === 'stats'">
              <ion-grid>
                <ion-row>
                  <ion-col size="6" class="stat-col">
                    <div class="stat-title">Lidos</div>
                    <div class="stat-value">{{ user?.booksRead ?? 0 }}</div>
                  </ion-col>
                  <ion-col size="6" class="stat-col">
                    <div class="stat-title">Idade</div>
                    <div class="stat-value">{{ user?.age ?? '—' }}</div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </div>

          </ion-card-content>
        </ion-card>

        <ion-row class="action-row">
          <ion-col size="12" size-md="4">
            <ion-button expand="block" color="primary" (click)="goToEditProfile()">
              <ion-icon slot="start" name="create-outline"></ion-icon>
              Editar
            </ion-button>
          </ion-col>

          <ion-col size="12" size-md="4">
            <ion-button expand="block" color="medium" (click)="goToSettings()">
              <ion-icon slot="start" name="settings-outline"></ion-icon>
              Configurar
            </ion-button>
          </ion-col>

          <ion-col size="12" size-md="4">
            <ion-button expand="block" color="danger" (click)="logout()">
              <ion-icon slot="start" name="log-out-outline"></ion-icon>
              Sair
            </ion-button>
          </ion-col>
        </ion-row>

      </ng-container>

      <ng-template #loadingTpl>
        <div class="loading-center">
          <ion-spinner name="crescent"></ion-spinner>
        </div>
      </ng-template>
    </ion-content>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .avatar img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
    .info-item { padding: 12px 0; }
    .info-item .label { color: var(--ion-color-medium); font-size: 0.85rem; }
    .info-item .value { font-weight: 600; margin-top: 4px; }
    .stat-col { text-align: center; padding: 20px 0; }
    .stat-title { color: var(--ion-color-medium); font-size: 0.9rem; }
    .stat-value { font-size: 1.6rem; font-weight: 700; margin-top: 6px; }
    .action-row { margin-top: 18px; display: flex; gap: 8px; }
    .loading-center { height: 60vh; display:flex; align-items:center; justify-content:center; }
  `]
})
export class ProfilePage implements OnInit {
  user: UserProfile | null = null;
  loading = true;
  userAvatar = 'assets/no-avatar.png'; 
  segment: 'info' | 'stats' = 'info';

  constructor(private userService: UserService, private router: Router, private navCtrl: NavController) {}

  ngOnInit() {
    const token = localStorage.getItem('token') || '';
    if (token && (this.userService as any).getProfile) {
      this.userService.getProfile(token).subscribe({
        next: (u: UserProfile) => {
          this.user = u;
       
          if ((u as any).avatarUrl) this.userAvatar = (u as any).avatarUrl;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Erro ao carregar perfil:', err);
     
          if ((this.userService as any).getUser) {
            this.user = (this.userService as any).getUser();
          }
          this.loading = false;
        }
      });
    } else {
      
      if ((this.userService as any).getUser) {
        this.user = (this.userService as any).getUser();
      }
      this.loading = false;
    }
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  logout() {
    (this.userService as any).logout?.();
    
    this.router.navigate(['/inicio']);
  }

  goToEditProfile() {
    this.router.navigate(['/profile/edit']); 
  }

  goToSettings() {
    this.router.navigate(['/profile/settings']); 
  }

  goBack() {
  
    this.navCtrl.back();
  }
}
