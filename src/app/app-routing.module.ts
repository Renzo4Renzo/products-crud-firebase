import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/products/product-list/product-list.module').then(
        (m) => m.ProductListModule
      ),
  },
  {
    path: 'product-list',
    loadChildren: () =>
      import('./pages/products/product-list/product-list.module').then(
        (m) => m.ProductListModule
      ),
  },
  {
    path: 'product-add',
    loadChildren: () =>
      import('./pages/products/product-add/product-add.module').then(
        (m) => m.ProductAddModule
      ),
  },
  {
    path: 'product-info',
    loadChildren: () =>
      import('./pages/products/product-info/product-info.module').then(
        (m) => m.ProductInfoModule
      ),
  },
  {
    path: 'product-edit',
    loadChildren: () =>
      import('./pages/products/product-edit/product-edit.module').then(
        (m) => m.ProductEditModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
