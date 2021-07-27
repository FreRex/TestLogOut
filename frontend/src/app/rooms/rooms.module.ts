import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { RoomsPageRoutingModule } from './rooms-routing.module';
import { CreateRoomModalComponent } from './create-room-modal/create-room-modal.component';
import { EditRoomModalComponent } from './edit-room-modal/edit-room-modal.component';
import { RoomsListComponent } from './rooms-list/rooms-list.component';
import { RoomsPage } from './rooms.page';
import { RoomsListItemDesktopComponent } from './rooms-list/rooms-list-item-desktop/rooms-list-item-desktop.component';
import { RoomsListItemMobileComponent } from './rooms-list/rooms-list-item-mobile/rooms-list-item-mobile.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RoomsPageRoutingModule,
  ],
  declarations: [
    RoomsPage,
    RoomsListComponent,
    RoomsListItemDesktopComponent,
    RoomsListItemMobileComponent,
    CreateRoomModalComponent,
    EditRoomModalComponent,
  ],
  entryComponents: [CreateRoomModalComponent, EditRoomModalComponent],
})
export class RoomsPageModule {}
