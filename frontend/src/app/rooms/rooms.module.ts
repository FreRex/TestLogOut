import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomsPageRoutingModule } from './rooms-routing.module';

import { RoomsPage } from './rooms.page';
import { EditRoomModalComponent } from './components/edit-room-modal/edit-room-modal.component';
import { NewRoomModalComponent } from './components/new-room-modal/new-room-modal.component';
import { NewRoomFormComponent } from './components/new-room-form/new-room-form.component';
import { EditRoomFormComponent } from './components/edit-room-form/edit-room-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RoomsPageRoutingModule
  ],
  declarations: [
    RoomsPage,
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
export class RoomsPageModule { }
