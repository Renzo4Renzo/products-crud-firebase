import { Component, OnInit, ViewChild } from '@angular/core';
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
  productForm!: FormGroup;
  private isValidPrice = '[0-9]+([.][0-9]{1,2}|[0-9]?)';

  lastModified: string = '';
  savingProduct: boolean = false;

  public imagePreview: string = '';
  public selectedFile: File | undefined;

  @ViewChild('inputFile')
  public inputFile: any = null;

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
      this.savingProduct = true;
      if (this.selectedFile != undefined) {
        let preFileName = this.selectedFile?.name;
        let newFileName = preFileName?.substring(0, preFileName?.indexOf('.'));
        let fileName = `${newFileName}_${Date.now()}`;
        this.productService
          .uploadImage(fileName, this.selectedFile)
          .then((res) => {
            this.productForm.value.image = res;
            this.saveProduct();
          })
          .catch((error) => {
            this.showMessage(1, 'Your product was NOT created!', 'Error');
            console.log('Error:', error); //For developers
            this.savingProduct = false;
          });
      } else {
        this.saveProduct();
      }

      /* this.productForm.reset();
      this.initForm(); */
    } else {
      this.showMessage(1, 'Not all fields have valid data!', 'Error');
    }
  }

  private saveProduct() {
    let history = [
      {
        user: 'admin',
        date: Date.now(),
        type: 'c',
      },
    ];
    this.productForm.value.title = this.productForm.value.title.toUpperCase();
    let product = { history, ...this.productForm.value };
    //console.log('product: ', product);
    this.productService
      .saveProduct(product)
      .then((res) => {
        this.savingProduct = false;
        this.showMessage(0, 'Your product was created!', String(res));
        this.router.navigate(['product-list']);
      })
      .catch((error) => {
        this.showMessage(1, 'Your product was NOT created!', 'Error');
        console.log('Error:', error); //For developers
        this.savingProduct = false;
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
}
