import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectDetailPageRoutingModule } from './project-detail-routing.module';

import { ProjectDetailPage } from './project-detail.page';
import { ProjectFormComponent } from '../components/project-form/project-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectDetailPageRoutingModule
  ],
  declarations: [ProjectDetailPage]
})
export class ProjectDetailPageModule {}
