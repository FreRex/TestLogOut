import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';
import { GuestLoginComponent } from './guest-login/guest-login.component';
import { UserLoginComponent } from './user-login/user-login.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, AuthPageRoutingModule],
  declarations: [AuthPage, UserLoginComponent, GuestLoginComponent],
})
export class AuthPageModule {}
