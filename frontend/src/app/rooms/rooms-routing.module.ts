import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { RoomsPage } from './rooms.page';

const routes: Routes = [
  {
    path: '',
    component: RoomsPage,
  },
  {
    path: 'gallery/:id/:proj',
    loadChildren: () => import('./gallery/gallery.module').then((m) => m.GalleryPageModule),
  },
  {
    path: 'conference',
    loadChildren: () =>
      import('./conference/conference.module').then((m) => m.ConferencePageModule),
  },
  {
    path: ':roomId',
    loadChildren: () =>
      import('./room-detail/room-detail.module').then((m) => m.RoomDetailPageModule),
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomsPageRoutingModule {}
