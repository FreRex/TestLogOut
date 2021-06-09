import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { PlayerComponent } from './conference/player/player.component';
import { StreamingBarComponent } from './conference/streaming-bar/streaming-bar.component';
import { WebcamComponent } from './conference/webcam/webcam.component';
import { RoomsPageRoutingModule } from './rooms-routing.module';
import { CreateRoomModalComponent } from './rooms-tab/create-room-modal/create-room-modal.component';
import { EditRoomModalComponent } from './rooms-tab/edit-room-modal/edit-room-modal.component';
import { RoomsListItemComponent } from './rooms-tab/rooms-list-item/rooms-list-item.component';
import { RoomsTabComponent } from './rooms-tab/rooms-tab.component';
import { RoomsTableItemComponent } from './rooms-tab/rooms-table-item/rooms-table-item.component';
import { RoomsPage } from './rooms.page';

@NgModule({
  imports: [SharedModule, CommonModule, IonicModule, ReactiveFormsModule, RoomsPageRoutingModule],
  declarations: [
    RoomsPage,
    RoomsTabComponent,
    RoomsTableItemComponent,
    RoomsListItemComponent,
    CreateRoomModalComponent,
    EditRoomModalComponent,
    PlayerComponent,
    WebcamComponent,
    StreamingBarComponent,
  ],
  exports: [PlayerComponent, WebcamComponent, StreamingBarComponent],
  entryComponents: [CreateRoomModalComponent, EditRoomModalComponent],
})
export class RoomsPageModule {}
