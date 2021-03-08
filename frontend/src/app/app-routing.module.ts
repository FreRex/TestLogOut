import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard as AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms.module').then(m => m.RoomsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'backoffice',
    loadChildren: () => import('./backoffice/backoffice.module').then( m => m.BackofficePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'NPerfLink',
    loadChildren: () => import('./nperf-link/nperf-link.module').then(m => m.NPerfLinkPageModule),
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
