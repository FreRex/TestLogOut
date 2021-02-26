import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ProjectsPage } from './projects.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectsPage
  },
  {
    path: 'new',
    loadChildren: () => import('./new-project/new-project.module').then( m => m.NewProjectPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: ':projectId',
    loadChildren: () => import('./project-detail/project-detail.module').then( m => m.ProjectDetailPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'edit/:projectId',
    loadChildren: () => import('./edit-project/edit-project.module').then( m => m.EditProjectPageModule),
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsPageRoutingModule {}
