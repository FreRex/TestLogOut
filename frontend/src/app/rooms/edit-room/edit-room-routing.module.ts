import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRoomPage } from './edit-room.page';

const routes: Routes = [
  {
    path: '',
    component: EditRoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRoomPageRoutingModule {}
