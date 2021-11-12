import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.interface';
import { ImageReader } from 'src/app/common/image-reader';

@Injectable({
  providedIn: 'root',
})
export class ProductUtilities {
  constructor(private router: Router, private imageReader: ImageReader) {}

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
