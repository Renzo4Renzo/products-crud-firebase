import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product.interface';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit {
  product: Product;
  lastModified: string = '';
  productForm!: FormGroup;
  private isNumber = '[0-9]+([.][0-9]{1,2}|[0-9]?)';
  hasChange: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private toastr: ToastrService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras?.state?.product;
    //console.log('this.product: ', this.product);
    if (typeof this.product === 'undefined') {
      this.router.navigate(['product-list']);
    } else {
      this.setLastModified();
      this.initForm();
    }
  }

  ngOnInit(): void {
    if (typeof this.product === 'undefined') {
      this.router.navigate(['product-list']);
    } else {
      this.productForm.patchValue(this.product);
      this.productForm.patchValue({
        price: formatNumber(this.product.price, 'en-US', '1.2-2'),
      });
      this.onCreateGroupFormValueChange();
    }
  }

  setLastModified() {
    this.lastModified =
      this.product.history[this.product.history.length - 1].date;
  }

  returnToList() {
    this.router.navigate(['product-list']);
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
          this.showMessage(0, 'Your product was updated!', String(res));
          this.router.navigate(['product-list']);
        })
        .catch((error) => {
          this.showMessage(1, 'Your product was NOT updated!', 'Error');
          console.log('Error:', error); //For developers
        });
      /* this.productForm.reset();
      this.initForm(); */
    } else {
      this.showMessage(1, 'Not all fields have valid data!', 'Error');
    }
  }

  deleteProduct(productId: string) {
    //console.log(productId);
    this.productService
      .deleteProduct(productId)
      .then((res: any) => {
        this.showMessage(0, 'Your product was deleted!', String(res));
        this.router.navigate(['product-list']);
      })
      .catch((error) => {
        this.showMessage(1, 'Your product was NOT deleted!', 'Error');
        console.log('Error:', error); //For developers
      });
  }

  private initForm(): void {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      /* image: [''], */
      description: [''],
      price: [
        '',
        [
          Validators.required,
          Validators.pattern(this.isNumber),
          Validators.min(0.01),
        ],
      ],
      active: ['', [Validators.required]],
    });
  }

  isValidField(field: any): string {
    const validatedField = this.productForm.get(field);
    if (validatedField?.touched) {
      if (!validatedField?.valid) return 'is-invalid';
      else return 'is-valid';
    } else return '';
  }

  onCreateGroupFormValueChange() {
    const initialValue = this.productForm.value;
    this.productForm.valueChanges.subscribe((value) => {
      this.hasChange = Object.keys(initialValue).some(
        (key) => this.productForm.value[key] != initialValue[key]
      );
    });
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
