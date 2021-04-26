import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RoomsPageRoutingModule } from './rooms-routing.module';
import { RoomsPage } from './rooms.page';
import { SharedModule } from '../shared/shared.module';
import { RoomsTabComponent } from './rooms-tab/rooms-tab.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RoomsPageRoutingModule
  ],
  declarations: [
    RoomsPage,
    RoomsTabComponent
  ]
})
export class RoomsPageModule { }
