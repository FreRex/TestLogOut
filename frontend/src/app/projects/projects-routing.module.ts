import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsPage } from './projects.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectsPage
  },
  {
    path: 'new',
    loadChildren: () => import('./edit-project/edit-project.module').then( m => m.EditProjectPageModule)
  },
  {
    path: 'edit/:projectId',
    loadChildren: () => import('./edit-project/edit-project.module').then( m => m.EditProjectPageModule)
  },
  {
    path: ':projectId',
    loadChildren: () => import('./project-detail/project-detail.module').then( m => m.ProjectDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsPageRoutingModule {}
