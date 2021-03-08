import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomDetailPageRoutingModule } from './room-detail-routing.module';

import { RoomDetailPage } from './room-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomDetailPageRoutingModule
  ],
  declarations: [RoomDetailPage]
})
export class RoomDetailPageModule {}
