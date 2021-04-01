import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomsTableComponent } from './rooms-table/rooms-table.component';

import { AdminPage } from './admin.page';
import { UsersTableComponent } from './users-table/users-table.component';
import { ProjectsTableComponent } from './projects-table/projects-table.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin/tabs/dashboard', pathMatch: 'full' },
  {
    path: 'tabs',
    component: AdminPage,
    children: [
      {
        path: 'rooms',
        component: RoomsTableComponent
      },
      {
        path: 'users',
        component: UsersTableComponent
      },
      {
        path: 'projects',
        component: ProjectsTableComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule { }
