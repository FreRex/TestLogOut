import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { RoomsPageModule } from '../rooms.module';
import { ConferencePageRoutingModule } from './conference-routing.module';
import { ConferencePage } from './conference.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConferencePageRoutingModule,
    SharedModule,
    RoomsPageModule,
  ],
  declarations: [ConferencePage],
})
export class ConferencePageModule {}
