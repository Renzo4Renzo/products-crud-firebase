import { formatNumber } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Product } from 'src/app/models/product.interface';
import { ProductsService } from '../products.service';
import { ImageReader } from '../../../common/image-reader';
import { FileValidator } from 'src/app/common/file-validator';
import { FieldValidator } from 'src/app/common/field-validator';
import { UserMessage } from 'src/app/common/user-message';
import { ProductUtilities } from '../product-utilities';
import { InputUtilities } from 'src/app/common/input-utilities';
import { Session } from 'src/app/common/session';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
  providers: [
    ImageReader,
    FileValidator,
    FieldValidator,
    UserMessage,
    ProductUtilities,
    InputUtilities,
    Session,
  ],
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
  public oldImageHidden: Boolean = false;

  @ViewChild('inputFile')
  public inputFile: any = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private imageReader: ImageReader,
    private fileValidator: FileValidator,
    public fieldValidator: FieldValidator,
    private userMessage: UserMessage,
    public productUtilities: ProductUtilities,
    public inputUtilities: InputUtilities,
    private session: Session
  ) {
    if (!session.getSession()) this.router.navigate(['login']);
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras?.state?.product;
    //console.log('this.product: ', this.product);
    if (typeof this.product === 'undefined') {
      this.router.navigate(['product-list']);
    } else {
      this.lastModified = productUtilities.setLastModified(this.product);
      this.initForm();
    }
  }

  private initForm(): void {
    this.productForm = this.formBuilder.group(
      {
        title: ['', [Validators.required]],
        image: [
          '',
          [
            this.fileValidator.sizeValidator(this, 'selectedFile'),
            this.fileValidator.typeValidator(this, 'selectedFile'),
          ],
        ],
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
      },
      { updateOn: 'change' }
    );
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

  onCreateGroupFormValueChange() {
    const initialValue = this.productForm.value;
    this.productForm.valueChanges.subscribe((value) => {
      this.hasChange = Object.keys(initialValue).some(
        (key) => this.productForm.value[key] != initialValue[key]
      );
    });
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
            this.userMessage.showMessage(
              1,
              'Your product was NOT updated!',
              'Error'
            );
            console.log('Error:', error); //For developers
            this.updatingProduct = false;
          });
      } else {
        if (this.oldImageHidden) {
          this.deleteImage(this.product);
          this.productForm.value.image = '';
        } else {
          this.productForm.value.image = this.product.image;
        }
        this.updateProduct();
      }
      /* this.productForm.reset();
      this.initForm(); */
    } else {
      this.userMessage.showMessage(
        1,
        'Not all fields have valid data!',
        'Error'
      );
    }
  }

  updateProduct() {
    this.product.history.push({
      user: this.session.getSession()!,
      date: String(Date.now()),
      type: 'u',
    });
    let history = this.product.history;
    let product = { history, ...this.productForm.value };
    this.productService
      .updateProduct(product, this.product.id)
      .then((res) => {
        this.updatingProduct = false;
        this.userMessage.showMessage(
          0,
          'Your product was updated!',
          String(res)
        );
        this.router.navigate(['product-list']);
      })
      .catch((error) => {
        this.userMessage.showMessage(
          1,
          'Your product was NOT updated!',
          'Error'
        );
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
        this.userMessage.showMessage(
          1,
          'Previous image was NOT deleted!',
          'Error'
        );
        console.log('Error:', error); //For developers
      });
  }

  onDelete(product: any) {
    this.changeIcons(0);
    if (product.image != undefined && product.image != '') {
      this.productService
        .deleteImage(product.image)
        .then((res: any) => {
          this.deleteProduct(product);
        })
        .catch((error) => {
          this.userMessage.showMessage(
            1,
            'Your product was NOT deleted!',
            'Error'
          );
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
        this.userMessage.showMessage(
          0,
          'Your product was deleted!',
          String(res)
        );
        this.changeIcons(1);
        this.router.navigate(['product-list']);
      })
      .catch((error) => {
        this.userMessage.showMessage(
          1,
          'Your product was NOT deleted!',
          'Error'
        );
        console.log('Error:', error); //For developers
        this.changeIcons(1);
      });
  }

  onFileSelected(event: any) {
    if (event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      this.productForm.controls['image'].updateValueAndValidity();
      this.imageReader
        .extractBase64(this.selectedFile)
        .then((image: any) => {
          this.imagePreview = image.base;
        })
        .catch((error) => {
          this.imagePreview = '';
          //console.log(error);
        });
    } else this.resetFile();
  }

  resetFile() {
    if (this.inputFile) this.inputFile.nativeElement.value = '';
    this.imagePreview = '';
    this.selectedFile = undefined;
    this.productForm.controls['image'].updateValueAndValidity();
    if (this.oldImageHidden) this.hasChange = true;
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
