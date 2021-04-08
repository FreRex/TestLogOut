import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminPageRoutingModule } from './admin-routing.module';
import { AdminPage } from './admin.page';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomsTabComponent } from './rooms-tab/rooms-tab.component';
import { ProjectsTabComponent } from './projects-tab/projects-tab.component';
import { UsersTabComponent } from './users-tab/users-tab.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AdminPageRoutingModule
  ],
  declarations: [
    AdminPage,
    RoomsTabComponent,
    ProjectsTabComponent,
    UsersTabComponent,
    DashboardComponent
  ]
})
export class AdminPageModule { }
