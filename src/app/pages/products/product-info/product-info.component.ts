import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { Session } from 'src/app/common/session';
import { Product } from 'src/app/models/product.interface';
import { ProductUtilities } from '../product-utilities';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
  providers: [ProductUtilities, Session],
})
export class ProductInfoComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      product: null,
    },
  };

  product: Product;
  lastModified: string = '';

  constructor(
    private router: Router,
    public productUtilities: ProductUtilities,
    private session: Session
  ) {
    if (!session.getSession()) this.router.navigate(['login']);
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras?.state?.product;
    if (typeof this.product === 'undefined') {
      productUtilities.returnToList();
    } else {
      this.lastModified = productUtilities.setLastModified(this.product);
    }
  }

  ngOnInit(): void {}

  editProduct() {
    this.navigationExtras.state!.product = this.product;
    this.router.navigate(['product-edit'], this.navigationExtras);
  }
}
