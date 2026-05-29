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
    path: '',
    loadComponent: () => import('./features/tasks/tasks').then((m) => m.TasksComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
