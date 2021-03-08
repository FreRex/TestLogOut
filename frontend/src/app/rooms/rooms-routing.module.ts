import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { RoomsPage } from './rooms.page';

const routes: Routes = [
  {
    path: '',
    component: RoomsPage
  },
  {
    path: 'new',
    loadChildren: () => import('./new-room/new-room.module').then( m => m.NewRoomPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: ':roomId',
    loadChildren: () => import('./room-detail/room-detail.module').then( m => m.RoomDetailPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'edit/:roomId',
    loadChildren: () => import('./edit-room/edit-room.module').then( m => m.EditRoomPageModule),
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomsPageRoutingModule {}
