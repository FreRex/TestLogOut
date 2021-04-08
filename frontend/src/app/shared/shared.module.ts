import { NgModule } from '@angular/core';
import { HasRoleDirective } from './has-role.directive';
import { ObsWithStatusPipe } from './obs-with-status.pipe';
import { IonicModule } from '@ionic/angular';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { OrderByButtonComponent } from './order-by-button/order-by-button.component';
import { PaginationComponent } from './pagination/pagination.component';
import { RoomsTableComponent } from './generic-table/rooms-table/rooms-table.component';
import { RoomsListComponent } from './generic-list/rooms-list/rooms-list.component';
import { RoomListItemComponent } from './generic-list/rooms-list/room-list-item/room-list-item.component';
import { RoomsTableItemComponent } from './generic-table/rooms-table/rooms-table-item/rooms-table-item.component';

@NgModule({
  declarations: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    RoomsTableComponent,
    RoomsTableItemComponent,
    RoomsListComponent,
    RoomListItemComponent,
    PaginationComponent
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    RoomsTableComponent,
    RoomsTableItemComponent,
    RoomsListComponent,
    RoomListItemComponent,
    PaginationComponent
  ],
})
export class SharedModule { }
