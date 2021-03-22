import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackofficePageRoutingModule } from './backoffice-routing.module';

import { BackofficePage } from './backoffice.page';
import { GisfoSyncModalComponent } from './projects/gisfo-sync-modal/gisfo-sync-modal.component';
import { UploadShpModalComponent } from './projects/upload-shp-modal/upload-shp-modal.component';
import { CreateUserModalComponent } from './users/create-user-modal/create-user-modal.component';
import { EditProjectModalComponent } from './projects/edit-project-modal/edit-project-modal.component';
import { EditUserModalComponent } from './users/edit-user-modal/edit-user-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    BackofficePageRoutingModule,
  ],
  declarations: [
    BackofficePage,
    GisfoSyncModalComponent,
    UploadShpModalComponent,
    CreateUserModalComponent,
    EditProjectModalComponent,
    EditUserModalComponent,
  ],
  entryComponents: [
    GisfoSyncModalComponent,
    UploadShpModalComponent,
    CreateUserModalComponent,
    EditProjectModalComponent,
    EditUserModalComponent,
  ],
})
export class BackofficePageModule {}
