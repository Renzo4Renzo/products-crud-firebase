import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Product } from 'src/app/models/product.interface';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      checked: null,
    },
  };

  product: Product;
  lastModified: string = '';
  productForm!: FormGroup;
  private isNumber = '[0-9]+([.][0-9]{1,2}|[0-9]?)';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductsService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras?.state?.product;
    this.navigationExtras.state!.checked = navigation?.extras?.state?.checked;
    //console.log('this.product: ', this.product);
    if (typeof this.product === 'undefined') {
      this.router.navigate(['product-list'], this.navigationExtras);
    } else {
      this.setLastModified();
      this.initForm();
    }
  }

  ngOnInit(): void {
    if (typeof this.product === 'undefined') {
      this.router.navigate(['product-list'], this.navigationExtras);
    } else {
      this.productForm.patchValue(this.product);
      this.productForm.patchValue({
        price: formatNumber(this.product.price, 'en-US', '1.2-2'),
      });
    }
  }

  setLastModified() {
    this.lastModified =
      this.product.history[this.product.history.length - 1].date;
  }

  returnToList() {
    this.router.navigate(['product-list'], this.navigationExtras);
  }

  onSave() {
    if (this.productForm.valid) {
      this.product.history.push({
        user: 'admin',
        date: String(Date.now()),
        type: 'u',
      });
      let history = this.product.history;
      let product = { history, ...this.productForm.value };
      this.productService
        .updateProduct(product, this.product.id)
        .then((res) => {
          console.log(res); //TODO: SweetAlert2
        })
        .catch((error) => {
          console.log('Error:', error);
        });
      /* this.productForm.reset();
      this.initForm(); */
      this.router.navigate(['product-list'], this.navigationExtras);
    } else {
      console.log('El formulario no es válido!'); //TODO: SweetAlert2
    }
  }

  private initForm(): void {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      /* image: [''], */
      description: [''],
      price: ['', [Validators.required, Validators.pattern(this.isNumber)]],
      active: ['', [Validators.required]],
    });
  }
}
