import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackofficePageRoutingModule } from './backoffice-routing.module';

import { BackofficePage } from './backoffice.page';
import { GisfoSyncModalComponent } from '../shared/modals/gisfo-sync-modal/gisfo-sync-modal.component';
import { UploadShpModalComponent } from '../shared/modals/upload-shp-modal/upload-shp-modal.component';
import { CreateUserModalComponent } from '../shared/modals/create-user-modal/create-user-modal.component';
import { EditProjectModalComponent } from '../shared/modals/edit-project-modal/edit-project-modal.component';
import { EditUserModalComponent } from '../shared/modals/edit-user-modal/edit-user-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    BackofficePageRoutingModule,
  ],
  declarations: [
    BackofficePage,

  ],
  entryComponents: [
    GisfoSyncModalComponent,
    UploadShpModalComponent,
    CreateUserModalComponent,
    EditProjectModalComponent,
    EditUserModalComponent,
  ],
})
export class BackofficePageModule { }
