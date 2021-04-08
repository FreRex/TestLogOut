import { NgModule } from '@angular/core';
import { HasRoleDirective } from './has-role.directive';
import { ObsWithStatusPipe } from './obs-with-status.pipe';
import { IonicModule } from '@ionic/angular';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { OrderByButtonComponent } from './order-by-button/order-by-button.component';
import { PaginationComponent } from './generic-table/pagination/pagination.component';
import { RoomsTableComponent } from './generic-table/rooms-table/rooms-table.component';
import { RoomsTableItemComponent } from './generic-table/rooms-table/rooms-table-item/rooms-table-item.component';
import { RoomsListComponent } from './generic-list/rooms-list/rooms-list.component';
import { RoomsListItemComponent } from './generic-list/rooms-list/rooms-list-item/rooms-list-item.component';

@NgModule({
  declarations: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    RoomsTableComponent,
    RoomsTableItemComponent,
    RoomsListComponent,
    RoomsListItemComponent,
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
    RoomsListItemComponent,
    PaginationComponent
  ],
})
export class SharedModule { }
