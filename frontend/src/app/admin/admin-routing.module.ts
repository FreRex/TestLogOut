import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPage } from './admin.page';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsTabComponent } from './projects-tab/projects-tab.component';
import { RoomsTabComponent } from './rooms-tab/rooms-tab.component';
import { UsersTabComponent } from './users-tab/users-tab.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin/tabs/dashboard', pathMatch: 'full' },
  {
    path: 'tabs',
    component: AdminPage,
    children: [
      {
        path: 'rooms',
        component: RoomsTabComponent
      },
      {
        path: 'users',
        component: UsersTabComponent
      },
      {
        path: 'projects',
        component: ProjectsTabComponent
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
