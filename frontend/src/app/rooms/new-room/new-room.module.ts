import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewRoomPageRoutingModule } from './new-room-routing.module';

import { NewRoomPage } from './new-room.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewRoomPageRoutingModule
  ],
  declarations: [NewRoomPage]
})
export class NewRoomPageModule {}
