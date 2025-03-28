import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGuard } from './utils/auth.guard';
import { NoAuthGuard } from './utils/no-auth.guard';

export const routes: Routes = [
  { path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [NoAuthGuard]
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'about', loadComponent: () => import('./pages/sobre/sobre.component').then(m => m.SobreComponent) },
      { path: 'call-us', loadComponent: () => import('./pages/fale-conosco/fale-conosco.component').then(m => m.FaleConoscoComponent) },
      { path: '', redirectTo: '/home', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
