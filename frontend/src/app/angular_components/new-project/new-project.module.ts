import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewProjectPageRoutingModule } from './new-project-routing.module';

import { NewProjectPage } from './new-project.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewProjectPageRoutingModule
  ],
  declarations: [NewProjectPage]
})
export class NewProjectPageModule {}
