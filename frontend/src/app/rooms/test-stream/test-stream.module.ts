import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PlayerComponent } from './player/player.component';
import { TestStreamPageRoutingModule } from './test-stream-routing.module';
import { TestStreamPage } from './test-stream.page';
import { WebcamComponent } from './webcam/webcam.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TestStreamPageRoutingModule],
  declarations: [TestStreamPage, PlayerComponent, WebcamComponent],
})
export class TestStreamPageModule {}
