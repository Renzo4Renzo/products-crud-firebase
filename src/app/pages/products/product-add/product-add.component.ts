import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Product } from 'src/app/models/product.interface';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit {
  //product!: Product;
  lastModified: string = '';
  productForm!: FormGroup;
  private isNumber = '[0-9]+([.][0-9]{1,2}|[0-9]?)';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductsService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  returnToList() {
    this.router.navigate(['product-list']);
  }

  onSave() {
    if (this.productForm.valid) {
      let history = [
        {
          user: 'admin',
          date: Date.now(),
          type: 'c',
        },
      ];
      let product = { history, ...this.productForm.value };
      this.productService
        .saveProduct(product)
        .then((res) => {
          console.log(res); //TODO: SweetAlert2
        })
        .catch((error) => {
          console.log('Error:', error);
        });
      /* this.productForm.reset();
      this.initForm(); */
      this.router.navigate(['product-list']);
    } else {
      console.log('El formulario no es válido!'); //TODO: SweetAlert2
    }
  }

  private initForm(): void {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      // image: [''],
      description: [''],
      price: ['', [Validators.required, Validators.pattern(this.isNumber)]],
      active: [true, [Validators.required]],
    });
  }
}
