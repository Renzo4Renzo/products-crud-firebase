import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Product } from 'src/app/models/product.interface';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      product: null,
      checked: null,
    },
  };

  product: Product;
  lastModified: string = '';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras?.state?.product;
    this.navigationExtras.state!.checked = navigation?.extras?.state?.checked;
    if (typeof this.product === 'undefined') {
      this.router.navigate(['product-list'], this.navigationExtras);
    } else {
      this.setLastModified();
    }
  }

  ngOnInit(): void {}

  setLastModified() {
    this.lastModified =
      this.product.history[this.product.history.length - 1].date;
  }

  editProduct() {
    this.navigationExtras.state!.product = this.product;
    this.router.navigate(['product-edit'], this.navigationExtras);
  }

  deleteProduct() {
    this.router.navigate(['product-list'], this.navigationExtras);
  }

  returnToList() {
    this.router.navigate(['product-list'], this.navigationExtras);
  }
}