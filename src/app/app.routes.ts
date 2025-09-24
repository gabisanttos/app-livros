import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Router} from '@angular/router';

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full' 
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./inicio/inicio.page').then( m => m.InicioPage)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]

  
})
export class AppRoutingModule {}  

