import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRoomPageRoutingModule } from './edit-room-routing.module';

import { EditRoomPage } from './edit-room.page';
import { RoomsPageModule } from '../rooms.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditRoomPageRoutingModule,
    RoomsPageModule
  ],
  declarations: [EditRoomPage]
})
export class EditRoomPageModule { }
