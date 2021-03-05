import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NPerfLinkPageRoutingModule } from './nperf-link-routing.module';

import { NPerfLinkPage } from './nperf-link.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NPerfLinkPageRoutingModule
  ],
  declarations: [NPerfLinkPage]
})
export class NPerfLinkPageModule {}
