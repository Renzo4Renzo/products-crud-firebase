import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private productService: ProductsService,
    private toastr: ToastrService
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
      this.productForm.value.title = this.productForm.value.title.toUpperCase();
      let product = { history, ...this.productForm.value };
      this.productService
        .saveProduct(product)
        .then((res) => {
          this.showMessage(0, 'Your product was created!', String(res));
          this.router.navigate(['product-list']);
        })
        .catch((error) => {
          this.showMessage(1, 'Your product was NOT created!', 'Error');
          console.log('Error:', error); //For developers
        });
      /* this.productForm.reset();
      this.initForm(); */
    } else {
      this.showMessage(1, 'Not all fields have valid data!', 'Error');
    }
  }

  private initForm(): void {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      // image: [''],
      description: [''],
      price: [
        '',
        [
          Validators.required,
          Validators.pattern(this.isNumber),
          Validators.min(0.01),
        ],
      ],
      active: [true, [Validators.required]],
    });
  }

  isValidField(field: any): string {
    const validatedField = this.productForm.get(field);
    if (validatedField?.touched) {
      if (!validatedField?.valid) return 'is-invalid';
      else return 'is-valid';
    } else return '';
  }

  showMessage(type: number, message: string, title: string) {
    var options = {
      closeButton: true,
    };
    if (type == 0) this.toastr.success(message, title, options);
    else if (type == 1) this.toastr.error(message, title, options);
    else if (type == 2) this.toastr.warning(message, title, options);
    else if (type == 3) this.toastr.info(message, title, options);
  }
}
