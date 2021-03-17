import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackofficePageRoutingModule } from './backoffice-routing.module';

import { BackofficePage } from './backoffice.page';
import { GisfoSyncModalComponent } from './projects/gisfo-sync-modal/gisfo-sync-modal.component';
import { UploadShpModalComponent } from './projects/upload-shp-modal/upload-shp-modal.component';
import { CreateUserModalComponent } from './users/create-user-modal/create-user-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackofficePageRoutingModule
  ],
  declarations: [BackofficePage, GisfoSyncModalComponent, UploadShpModalComponent, CreateUserModalComponent,],
  entryComponents:[GisfoSyncModalComponent, UploadShpModalComponent, CreateUserModalComponent]
})
export class BackofficePageModule {}
