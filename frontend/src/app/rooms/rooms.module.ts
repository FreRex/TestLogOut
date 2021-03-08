import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomsPageRoutingModule } from './rooms-routing.module';

import { RoomsPage } from './rooms.page';
import { RoomItemComponent } from './room-item/room-item.component';
import { EditRoomModalComponent } from './edit-room-modal/edit-room-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RoomsPageRoutingModule
  ],
  declarations: [
    RoomsPage, 
    RoomItemComponent,
    EditRoomModalComponent,
  ],
  entryComponents: [EditRoomModalComponent] // <-- Serve per i componenti che non sono dichiarati all'interno di altri template (es. modal)
})
export class RoomsPageModule {}
