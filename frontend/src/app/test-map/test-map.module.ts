import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestMapPageRoutingModule } from './test-map-routing.module';

import { TestMapPage } from './test-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestMapPageRoutingModule
  ],
  declarations: [TestMapPage]
})
export class TestMapPageModule {}
