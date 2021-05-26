import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConferencePageRoutingModule } from './conference-routing.module';

import { ConferencePage } from './conference.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ConferencePageRoutingModule, SharedModule],
  declarations: [ConferencePage],
})
export class ConferencePageModule {}
