import { NgModule } from '@angular/core';
import { HasRoleDirective } from './has-role.directive';
import { ObsWithStatusPipe } from './obs-with-status.pipe';
import { IonicModule } from '@ionic/angular';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { OrderByButtonComponent } from './order-by-button/order-by-button.component';

@NgModule({
  declarations: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent
  ],
})
export class SharedModule { }
