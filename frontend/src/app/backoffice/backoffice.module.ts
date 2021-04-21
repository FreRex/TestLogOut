import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackofficePageRoutingModule } from './backoffice-routing.module';

import { BackofficePage } from './backoffice.page';
import { CreateProjectModalComponent } from '../shared/modals/create-project-modal/create-project-modal.component';
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
    CreateProjectModalComponent,
    CreateUserModalComponent,
    EditProjectModalComponent,
    EditUserModalComponent,
  ],
})
export class BackofficePageModule { }
