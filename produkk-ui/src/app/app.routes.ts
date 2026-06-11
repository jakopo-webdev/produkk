import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.RegisterComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy/privacy').then((m) => m.PrivacyComponent),
  },
  {
    path: 'cookie-policy',
    loadComponent: () => import('./features/cookie-policy/cookie-policy').then((m) => m.CookiePolicyComponent),
  },
  {
    path: 'processors',
    loadComponent: () => import('./features/processors/processors').then((m) => m.ProcessorsComponent),
  },
  {
    path: '',
    loadComponent: () => import('./features/tasks/tasks').then((m) => m.TasksComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
