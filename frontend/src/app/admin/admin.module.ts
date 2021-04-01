import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { RoomsTableComponent } from './rooms-table/rooms-table.component';
import { SharedModule } from '../shared/shared.module';
import { ProjectsTableComponent } from './projects-table/projects-table.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
    RoomsTableComponent,
    ProjectsTableComponent,
    UsersTableComponent,
    DashboardComponent
  ]
})
export class AdminPageModule { }
