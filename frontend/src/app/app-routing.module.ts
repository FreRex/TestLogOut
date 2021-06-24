import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard as AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'rooms',
    loadChildren: () =>
      import('./rooms/rooms.module').then((m) => m.RoomsPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'conference',
    loadChildren: () =>
      import('./conference/conference.module').then(
        (m) => m.ConferencePageModule
      ),
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'backoffice',
  //   loadChildren: () =>
  //     import('./backoffice/backoffice.module').then(
  //       (m) => m.BackofficePageModule
  //     ),
  //   canLoad: [AuthGuard],
  // },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'test-map',
    loadChildren: () => import('./test-map/test-map.module').then( m => m.TestMapPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
