import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackofficePageRoutingModule } from './backoffice-routing.module';

import { BackofficePage } from './backoffice.page';
import { GisfoSyncModalComponent } from './gisfo-sync-modal/gisfo-sync-modal.component';
import { UploadShpModalComponent } from './upload-shp-modal/upload-shp-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackofficePageRoutingModule
  ],
  declarations: [BackofficePage, GisfoSyncModalComponent, UploadShpModalComponent],
  entryComponents:[GisfoSyncModalComponent, UploadShpModalComponent]
})
export class BackofficePageModule {}
