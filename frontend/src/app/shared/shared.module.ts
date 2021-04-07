import { NgModule } from '@angular/core';
import { HasRoleDirective } from './has-role.directive';
import { ObsWithStatusPipe } from './obs-with-status.pipe';
import { IonicModule } from '@ionic/angular';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { OrderByButtonComponent } from './order-by-button/order-by-button.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { PaginationComponent } from './pagination/pagination.component';
import { RoomsTableComponent } from './generic-table/rooms-table/rooms-table.component';
import { RoomsListComponent } from './generic-list/rooms-list/rooms-list.component';
import { RoomItemComponent } from '../rooms/components/room-item/room-item.component';

@NgModule({
  declarations: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    // GenericTableComponent,
    RoomsTableComponent,
    RoomsListComponent,
    RoomItemComponent,
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
    // GenericTableComponent,
    RoomsListComponent,
    RoomsTableComponent,
    RoomItemComponent,
    PaginationComponent
  ],
})
export class SharedModule { }
