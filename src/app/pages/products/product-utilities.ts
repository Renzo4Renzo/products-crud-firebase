import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductUtilities {
  constructor(private router: Router) {}

  returnToList() {
    this.router.navigate(['product-list']);
  }

  setLastModified(product: Product) {
    return product.history[product.history.length - 1].date;
  }

  replaceSourceImg(product: Product, id: string) {
    (document.getElementById(id) as HTMLImageElement).src = product.image;
  }
}
