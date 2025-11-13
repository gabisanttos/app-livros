import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Routes } from '@angular/router';
import { authGuard } from './auth-guard'; 

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
  loadComponent: () => import('./inicio/inicio.page').then(m => m.InicioPage),
  canActivate: [authGuard]
},
  {
    path: 'forgot-email',
    loadComponent: () => import('./forgot-email/forgot-email.page').then( m => m.ForgotEmailPage)
  },
  {
    path: 'forgot-code',
    loadComponent: () => import('./forgot-code/forgot-code.page').then( m => m.ForgotCodePage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },

  {
  path: 'forgot-email',
  loadComponent: () => import('./forgot-email/forgot-email.page').then(m => m.ForgotEmailPage)
},
{
  path: 'forgot-code',
  loadComponent: () => import('./forgot-code/forgot-code.page').then(m => m.ForgotCodePage)
},
{
  path: 'reset-password',
  loadComponent: () => import('./reset-password/reset-password.page').then(m => m.ResetPasswordPage)
},
{
  path: 'successfully-reset',
  loadComponent: () => import('./successfully-reset/successfully-reset.page').then(m => m.SuccessfullyResetPage)
},
  {
    path: 'explore',
    loadComponent: () => import('./explore/explore.page').then( m => m.ExplorePage)
  },
{
  path: 'library',
  loadComponent: () => import('./library/library.page').then(m => m.LibraryPage)
},
  {
    path: 'savedbooks',
    loadComponent: () => import('./savedbooks/savedbooks.page').then( m => m.SavedbooksPage)
  },  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}


@NgModule({
  imports: [
    HttpClientModule,
  ],
})
export class AppModule {}
