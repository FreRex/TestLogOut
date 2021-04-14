import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EditProjectModalComponent } from './modals/edit-project-modal/edit-project-modal.component';
import { GisfoSyncModalComponent } from './modals/gisfo-sync-modal/gisfo-sync-modal.component';
import { UploadShpModalComponent } from './modals/upload-shp-modal/upload-shp-modal.component';
import { CreateUserModalComponent } from './modals/create-user-modal/create-user-modal.component';
import { EditUserModalComponent } from './modals/edit-user-modal/edit-user-modal.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { HasRoleDirective } from './has-role.directive';
import { ObsWithStatusPipe } from './obs-with-status.pipe';
import { OrderByButtonComponent } from './order-by-button/order-by-button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditRoomModalComponent } from './modals/edit-room-modal/edit-room-modal.component';
import { NewRoomModalComponent } from './modals/new-room-modal/new-room-modal.component';
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
    // PaginationComponent,
    // RoomsTableComponent,
    RoomsTableItemComponent,
    // ProjectsTableComponent,
    ProjectsTableItemComponent,
    // UsersTableComponent,
    UsersTableItemComponent,
    // RoomsListComponent,
    RoomsListItemComponent,
    // ProjectsListComponent,
    ProjectsListItemComponent,
    // UsersListComponent,
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
    GenericTableComponent,
    GenericListComponent,
    // PaginationComponent,
    // RoomsTableComponent,
    RoomsTableItemComponent,
    // ProjectsTableComponent,
    ProjectsTableItemComponent,
    // UsersTableComponent,
    UsersTableItemComponent,
    // RoomsListComponent,
    RoomsListItemComponent,
    // ProjectsListComponent,
    ProjectsListItemComponent,
    // UsersListComponent,
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
