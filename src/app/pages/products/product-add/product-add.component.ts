import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductsService } from '../products.service';
import { ImageReader } from '../../../common/image-reader';
import { FileValidator } from 'src/app/common/file-validator';
import { FieldValidator } from 'src/app/common/field-validator';
import { UserMessage } from 'src/app/common/user-message';
import { ProductUtilities } from '../product-utilities';
import { InputUtilities } from 'src/app/common/input-utilities';
import { Session } from 'src/app/common/session';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
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
    private imageReader: ImageReader,
    private fileValidator: FileValidator,
    public fieldValidator: FieldValidator,
    private userMessage: UserMessage,
    public productUtilities: ProductUtilities,
    public inputUtilities: InputUtilities,
    private session: Session
  ) {
    if (!session.getSession()) this.router.navigate(['login']);
    this.initForm();
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
        active: [true, [Validators.required]],
      },
      { updateOn: 'change' }
    );
  }

  ngOnInit(): void {}

  onSave() {
    if (this.productForm.valid) {
      this.savingProduct = true;
      if (this.selectedFile) {
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
            this.userMessage.showMessage(
              1,
              'Your product was NOT created!',
              'Error'
            );
            console.log('Error:', error); //For developers
            this.savingProduct = false;
          });
      } else {
        this.productForm.value.image = '';
        this.saveProduct();
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

  private saveProduct() {
    let history = [
      {
        user: this.session.getSession(),
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
        this.userMessage.showMessage(
          0,
          'Your product was created!',
          String(res)
        );
        this.router.navigate(['product-list']);
      })
      .catch((error) => {
        this.userMessage.showMessage(
          1,
          'Your product was NOT created!',
          'Error'
        );
        console.log('Error:', error); //For developers
        this.savingProduct = false;
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
  }
}
