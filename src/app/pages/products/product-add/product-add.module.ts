import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductAddRoutingModule } from './product-add-routing.module';
import { ProductAddComponent } from './product-add.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductAddComponent],
  imports: [CommonModule, ProductAddRoutingModule, ReactiveFormsModule],
})
export class ProductAddModule {}
