import { formatNumber } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  private isValidPrice = '[0-9]+([.][0-9]{1,2}|[0-9]?)';
  hasChange: boolean = false;
  updatingProduct: boolean = false;

  public imagePreview: string = '';
  public selectedFile: File | undefined;

  @ViewChild('inputFile')
  public inputFile: any = null;

  public oldImageHidden: Boolean = false;

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
        image: '',
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
      this.updatingProduct = true;
      if (this.selectedFile) {
        let preFileName = this.selectedFile?.name;
        let newFileName = preFileName?.substring(0, preFileName?.indexOf('.'));
        let fileName = `${newFileName}_${Date.now()}`;
        this.productService
          .uploadImage(fileName, this.selectedFile)
          .then((res) => {
            //console.log('this.product.image: ', this.product.image);
            if (this.product.image) {
              this.deleteImage(this.product);
            }
            this.productForm.value.image = res;
            this.updateProduct();
          })
          .catch((error) => {
            this.showMessage(1, 'Your product was NOT updated!', 'Error');
            console.log('Error:', error); //For developers
            this.updatingProduct = false;
          });
      } else {
        if (this.oldImageHidden) {
          this.deleteImage(this.product);
        } else {
          this.productForm.value.image = this.product.image;
        }
        this.updateProduct();
      }
      /* this.productForm.reset();
      this.initForm(); */
    } else {
      this.showMessage(1, 'Not all fields have valid data!', 'Error');
    }
  }

  updateProduct() {
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
        this.updatingProduct = false;
        this.showMessage(0, 'Your product was updated!', String(res));
        this.router.navigate(['product-list']);
      })
      .catch((error) => {
        this.showMessage(1, 'Your product was NOT updated!', 'Error');
        console.log('Error:', error); //For developers
        this.updatingProduct = false;
      });
  }

  deleteImage(product: any) {
    this.productService
      .deleteImage(product.image)
      .then((res: any) => {
        //console.log('Previous image deleted!');
      })
      .catch((error) => {
        this.showMessage(1, 'Previous image was NOT deleted!', 'Error');
        console.log('Error:', error); //For developers
      });
  }

  onDelete(product: any) {
    //console.log(productId);
    this.changeIcons(0);
    if (product.image != undefined && product.image != '') {
      this.productService
        .deleteImage(product.image)
        .then((res: any) => {
          this.deleteProduct(product);
        })
        .catch((error) => {
          this.showMessage(1, 'Your product was NOT deleted!', 'Error');
          console.log('Error:', error); //For developers
          this.changeIcons(1);
        });
    } else {
      this.deleteProduct(product);
    }
  }

  deleteProduct(product: any) {
    this.productService
      .deleteProduct(product.id)
      .then((res: any) => {
        this.showMessage(0, 'Your product was deleted!', String(res));
        this.changeIcons(1);
        this.router.navigate(['product-list']);
      })
      .catch((error) => {
        this.showMessage(1, 'Your product was NOT deleted!', 'Error');
        console.log('Error:', error); //For developers
        this.changeIcons(1);
      });
  }

  private initForm(): void {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      image: [''],
      description: [''],
      price: [
        '',
        [
          Validators.required,
          Validators.pattern(this.isValidPrice),
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

  changeIcons(type: number) {
    let deleteSpinner = <HTMLInputElement>(
      document.getElementById('deleteSpinner')
    );
    let deleteIcon = <HTMLInputElement>document.getElementById('deleteIcon');
    if (type == 0) {
      deleteSpinner.classList.replace('hide-component', 'delete-icon-show');
      deleteIcon.classList.replace('delete-icon-show', 'hide-component');
    } else if (type == 1) {
      deleteSpinner.classList.replace('delete-icon-show', 'hide-component');
      deleteIcon.classList.replace('hide-component', 'delete-icon-show');
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.extractBase64(this.selectedFile)
      .then((image: any) => {
        this.imagePreview = image.base;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  extractBase64 = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const imageReader = new FileReader();
        imageReader.readAsDataURL($event);
        imageReader.onload = () => {
          if (imageReader.result) {
            if (imageReader.result.toString().includes('data:image')) {
              resolve({
                base: imageReader.result,
              });
            } else {
              reject('This file is not an image!');
            }
          } else reject("Can't read this file!");
        };
        imageReader.onerror = (error) => {
          reject("Can't read this file!");
        };
      } catch (error) {
        return console.log(error);
      }
    });

  resetFile() {
    if (this.inputFile) this.inputFile.nativeElement.value = '';
    this.imagePreview = '';
    this.selectedFile = undefined;
  }

  replaceSourceImg() {
    (document.getElementById('displayedImageEdit') as HTMLImageElement).src =
      this.product.image;
  }

  hideOldImage() {
    this.oldImageHidden = true;
    this.hasChange = true;
  }

  showInputDiv() {
    let inputImageDiv = <HTMLInputElement>(
      document.getElementById('inputImageDiv')
    );
    inputImageDiv.classList.replace('hide-input-div', 'show-input-div');
  }
}
