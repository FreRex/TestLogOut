import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestAudiortcPageRoutingModule } from './test-audiortc-routing.module';

import { TestAudiortcPage } from './test-audiortc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestAudiortcPageRoutingModule
  ],
  declarations: [TestAudiortcPage]
})
export class TestAudiortcPageModule {}
