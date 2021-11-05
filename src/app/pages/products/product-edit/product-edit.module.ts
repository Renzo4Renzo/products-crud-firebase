import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductEditRoutingModule } from './product-edit-routing.module';
import { ProductEditComponent } from './product-edit.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductEditComponent],
  imports: [CommonModule, ProductEditRoutingModule, ReactiveFormsModule],
})
export class ProductEditModule {}
