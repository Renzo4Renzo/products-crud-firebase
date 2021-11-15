import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserLoginRoutingModule } from './user-login-routing.module';
import { UserLoginComponent } from './user-login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserLoginComponent],
  imports: [CommonModule, UserLoginRoutingModule, ReactiveFormsModule],
})
export class UserLoginModule {}
