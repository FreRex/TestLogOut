import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectsPageRoutingModule } from './projects-routing.module';

import { ProjectsPage } from './projects.page';
import { ProjectItemComponent } from './project-item/project-item.component';
// import { EditProjectModalComponent } from '../angular_components/edit-project-modal/edit-project-modal.component';

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
    // EditProjectModalComponent
  ],
  // entryComponents: [EditProjectModalComponent] // <-- Serve per i componenti che non sono dichiarati all'interno di altri template (es. modal)
})
export class ProjectsPageModule {}
