import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { ConferencePageRoutingModule } from './conference-routing.module';
import { ConferencePage } from './conference.page';
import { MapComponent } from './map/map.component';
import { PlayerComponent } from './player/player.component';
import { StreamingBarComponent } from './streaming-bar/streaming-bar.component';
import { UsersListComponent } from './users-list/users-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConferencePageRoutingModule,
    SharedModule,
  ],
  declarations: [
    ConferencePage,
    PlayerComponent,
    StreamingBarComponent,
    UsersListComponent,
    MapComponent,
  ],
})
export class ConferencePageModule {}
