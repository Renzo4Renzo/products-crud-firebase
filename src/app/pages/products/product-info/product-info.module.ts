import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductInfoRoutingModule } from './product-info-routing.module';
import { ProductInfoComponent } from './product-info.component';


@NgModule({
  declarations: [
    ProductInfoComponent
  ],
  imports: [
    CommonModule,
    ProductInfoRoutingModule
  ]
})
export class ProductInfoModule { }
