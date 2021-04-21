import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EditProjectModalComponent } from './modals/edit-project-modal/edit-project-modal.component';
import { CreateProjectModalComponent } from './modals/create-project-modal/create-project-modal.component';
import { CreateUserModalComponent } from './modals/create-user-modal/create-user-modal.component';
import { EditUserModalComponent } from './modals/edit-user-modal/edit-user-modal.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { HasRoleDirective } from './has-role.directive';
import { ObsWithStatusPipe } from './obs-with-status.pipe';
import { OrderByButtonComponent } from './order-by-button/order-by-button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditRoomModalComponent } from './modals/edit-room-modal/edit-room-modal.component';
import { CreateRoomModalComponent } from './modals/create-room-modal/create-room-modal.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { GenericListComponent } from './generic-list/generic-list.component';
import { ProjectsListItemComponent } from './generic-items/projects-list-item/projects-list-item.component';
import { RoomsListItemComponent } from './generic-items/rooms-list-item/rooms-list-item.component';
import { UsersListItemComponent } from './generic-items/users-list-item/users-list-item.component';
import { ProjectsTableItemComponent } from './generic-items/projects-table-item/projects-table-item.component';
import { RoomsTableItemComponent } from './generic-items/rooms-table-item/rooms-table-item.component';
import { UsersTableItemComponent } from './generic-items/users-table-item/users-table-item.component';

@NgModule({
  declarations: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    GenericListComponent,
    GenericTableComponent,
    RoomsTableItemComponent,
    ProjectsTableItemComponent,
    UsersTableItemComponent,
    RoomsListItemComponent,
    ProjectsListItemComponent,
    UsersListItemComponent,
    CreateProjectModalComponent,
    CreateUserModalComponent,
    CreateRoomModalComponent,
    EditProjectModalComponent,
    EditUserModalComponent,
    EditRoomModalComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    GenericTableComponent,
    GenericListComponent,
    RoomsTableItemComponent,
    ProjectsTableItemComponent,
    UsersTableItemComponent,
    RoomsListItemComponent,
    ProjectsListItemComponent,
    UsersListItemComponent,
    CreateProjectModalComponent,
    CreateUserModalComponent,
    CreateRoomModalComponent,
    EditProjectModalComponent,
    EditUserModalComponent,
    EditRoomModalComponent,
  ],
  entryComponents: [
    CreateProjectModalComponent,
    CreateUserModalComponent,
    CreateRoomModalComponent,
    EditProjectModalComponent,
    EditUserModalComponent,
    EditRoomModalComponent,
  ],
})
export class SharedModule { }
