import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPage } from './admin.page';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsTabComponent } from './projects-tab/projects-tab.component';
import { RoomsTabComponent } from '../rooms/rooms-tab/rooms-tab.component';
import { UsersTabComponent } from './users-tab/users-tab.component';
import { CommissionTabComponent } from './commission-tab/commission-tab.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin/tabs/dashboard', pathMatch: 'full' },
  {
    path: 'tabs',
    component: AdminPage,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'projects',
        component: ProjectsTabComponent
      },
      {
        path: 'users',
        component: UsersTabComponent
      },
      {
        path: 'commission',
        component: CommissionTabComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule { }
