import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewRoomPageRoutingModule } from './new-room-routing.module';

import { NewRoomPage } from './new-room.page';
import { RoomsPageModule } from '../rooms.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewRoomPageRoutingModule,
    RoomsPageModule
  ],
  declarations: [NewRoomPage]
})
export class NewRoomPageModule {}
