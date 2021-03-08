import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRoomPageRoutingModule } from './edit-room-routing.module';

import { EditRoomPage } from './edit-room.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditRoomPageRoutingModule
  ],
  declarations: [EditRoomPage]
})
export class EditRoomPageModule {}
