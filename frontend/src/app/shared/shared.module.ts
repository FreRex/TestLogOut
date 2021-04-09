import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EditProjectModalComponent } from './modals/edit-project-modal/edit-project-modal.component';
import { GisfoSyncModalComponent } from './modals/gisfo-sync-modal/gisfo-sync-modal.component';
import { UploadShpModalComponent } from './modals/upload-shp-modal/upload-shp-modal.component';
import { CreateUserModalComponent } from './modals/create-user-modal/create-user-modal.component';
import { EditUserModalComponent } from './modals/edit-user-modal/edit-user-modal.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ProjectsListItemComponent } from './generic-list/projects-list/projects-list-item/projects-list-item.component';
import { ProjectsListComponent } from './generic-list/projects-list/projects-list.component';
import { RoomsListItemComponent } from './generic-list/rooms-list/rooms-list-item/rooms-list-item.component';
import { RoomsListComponent } from './generic-list/rooms-list/rooms-list.component';
import { UsersListItemComponent } from './generic-list/users-list/users-list-item/users-list-item.component';
import { UsersListComponent } from './generic-list/users-list/users-list.component';
import { PaginationComponent } from './generic-table/pagination/pagination.component';
import { ProjectsTableItemComponent } from './generic-table/projects-table/projects-table-item/projects-table-item.component';
import { ProjectsTableComponent } from './generic-table/projects-table/projects-table.component';
import { RoomsTableItemComponent } from './generic-table/rooms-table/rooms-table-item/rooms-table-item.component';
import { RoomsTableComponent } from './generic-table/rooms-table/rooms-table.component';
import { UsersTableItemComponent } from './generic-table/users-table/users-table-item/users-table-item.component';
import { UsersTableComponent } from './generic-table/users-table/users-table.component';
import { HasRoleDirective } from './has-role.directive';
import { ObsWithStatusPipe } from './obs-with-status.pipe';
import { OrderByButtonComponent } from './order-by-button/order-by-button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditRoomModalComponent } from './modals/edit-room-modal/edit-room-modal.component';
import { NewRoomModalComponent } from './modals/new-room-modal/new-room-modal.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { GenericListComponent } from './generic-list/generic-list.component';

@NgModule({
  declarations: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    PaginationComponent,

    GenericListComponent,
    GenericTableComponent,
    // RoomsTableComponent,
    RoomsTableItemComponent,
    ProjectsTableComponent,
    ProjectsTableItemComponent,
    UsersTableComponent,
    UsersTableItemComponent,

    RoomsListComponent,
    RoomsListItemComponent,
    ProjectsListComponent,
    ProjectsListItemComponent,
    UsersListComponent,
    UsersListItemComponent,

    GisfoSyncModalComponent,
    UploadShpModalComponent,
    CreateUserModalComponent,
    EditProjectModalComponent,
    EditUserModalComponent,
    EditRoomModalComponent,
    NewRoomModalComponent
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
    PaginationComponent,

    GenericTableComponent,
    GenericListComponent,
    // RoomsTableComponent,
    RoomsTableItemComponent,
    ProjectsTableComponent,
    ProjectsTableItemComponent,
    UsersTableComponent,
    UsersTableItemComponent,

    RoomsListComponent,
    RoomsListItemComponent,
    ProjectsListComponent,
    ProjectsListItemComponent,
    UsersListComponent,
    UsersListItemComponent,

    GisfoSyncModalComponent,
    UploadShpModalComponent,
    CreateUserModalComponent,
    EditProjectModalComponent,
    EditUserModalComponent,
    EditRoomModalComponent,
    NewRoomModalComponent
  ],
  entryComponents: [
    GisfoSyncModalComponent,
    UploadShpModalComponent,
    CreateUserModalComponent,
    EditProjectModalComponent,
    EditUserModalComponent,
    EditRoomModalComponent,
    NewRoomModalComponent
  ],
})
export class SharedModule { }
