import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomsPageRoutingModule } from './rooms-routing.module';

import { RoomsPage } from './rooms.page';
import { RoomItemComponent } from './room-item/room-item.component';
import { EditRoomModalComponent } from './edit-room-modal/edit-room-modal.component';
import { NewRoomModalComponent } from './new-room-modal/new-room-modal.component';
import { NewRoomFormComponent } from './forms/new-room-form/new-room-form.component';
import { EditRoomFormComponent } from './forms/edit-room-form/edit-room-form.component';
import { PipesModule } from '../pipes.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedDirectivesModule,
    RoomsPageRoutingModule
  ],
  declarations: [
    RoomsPage, 
    RoomItemComponent,
    EditRoomModalComponent,
    NewRoomModalComponent,
    NewRoomFormComponent,
    EditRoomFormComponent,
  ],
  // providers: [ ObsWithStatusPipe ],
  exports: [NewRoomFormComponent, EditRoomFormComponent],
  // <-- Serve per i componenti che non sono dichiarati all'interno di altri template (es. modal)
  entryComponents: [EditRoomModalComponent, NewRoomModalComponent] 
})
export class RoomsPageModule {}
