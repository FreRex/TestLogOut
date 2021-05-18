import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { DropdownComponent } from './dropdown/dropdown.component';
import { HasRoleDirective } from './has-role.directive';
import { ObsWithStatusPipe } from './obs-with-status.pipe';
import { OrderByButtonComponent } from './order-by-button/order-by-button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { GenericListComponent } from './generic-list/generic-list.component';

import { EditProjectModalComponent } from '../admin/projects-tab/edit-project-modal/edit-project-modal.component';
import { CreateProjectModalComponent } from '../admin/projects-tab/create-project-modal/create-project-modal.component';
import { CreateUserModalComponent } from '../admin/users-tab/create-user-modal/create-user-modal.component';
import { EditUserModalComponent } from '../admin/users-tab/edit-user-modal/edit-user-modal.component';
import { EditRoomModalComponent } from '../rooms/rooms-tab/edit-room-modal/edit-room-modal.component';
import { CreateRoomModalComponent } from '../rooms/rooms-tab/create-room-modal/create-room-modal.component';

import { ProjectsListItemComponent } from '../admin/projects-tab/projects-list-item/projects-list-item.component';
import { RoomsListItemComponent } from '../rooms/rooms-tab/rooms-list-item/rooms-list-item.component';
import { UsersListItemComponent } from '../admin/users-tab/users-list-item/users-list-item.component';
import { ProjectsTableItemComponent } from '../admin/projects-tab/projects-table-item/projects-table-item.component';
import { RoomsTableItemComponent } from '../rooms/rooms-tab/rooms-table-item/rooms-table-item.component';
import { UsersTableItemComponent } from '../admin/users-tab/users-table-item/users-table-item.component';
import { SyncToastComponent } from './sync-toast/sync-toast.component';

@NgModule({
  declarations: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    GenericListComponent,
    GenericTableComponent,
    SyncToastComponent,
    // RoomsTableItemComponent,
    // RoomsListItemComponent,
    // ProjectsTableItemComponent,
    // ProjectsListItemComponent,
    // UsersTableItemComponent,
    // UsersListItemComponent,

    // CreateProjectModalComponent,
    // EditProjectModalComponent,
    // CreateUserModalComponent,
    // EditUserModalComponent,
    // CreateRoomModalComponent,
    // EditRoomModalComponent,
  ],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  exports: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    GenericTableComponent,
    GenericListComponent,
    SyncToastComponent,
    // RoomsTableItemComponent,
    // RoomsListItemComponent,
    // ProjectsTableItemComponent,
    // ProjectsListItemComponent,
    // UsersTableItemComponent,
    // UsersListItemComponent,

    // CreateProjectModalComponent,
    // EditProjectModalComponent,
    // CreateUserModalComponent,
    // EditUserModalComponent,
    // CreateRoomModalComponent,
    // EditRoomModalComponent,
  ],
  entryComponents: [
    // CreateProjectModalComponent,
    // EditProjectModalComponent,
    // CreateUserModalComponent,
    // EditUserModalComponent,
    // CreateRoomModalComponent,
    // EditRoomModalComponent,
  ],
})
export class SharedModule {}
