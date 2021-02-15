import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectsPageRoutingModule } from './projects-routing.module';

import { ProjectsPage } from './projects.page';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectsPageRoutingModule
  ],
  declarations: [
    ProjectsPage, 
    ProjectItemComponent, 
    ProjectsListComponent
  ]
})
export class ProjectsPageModule {}
