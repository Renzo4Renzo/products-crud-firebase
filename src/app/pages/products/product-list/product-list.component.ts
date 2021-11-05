import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.interface';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      product: null,
      checked: false,
    },
  };
  productList: Array<Product> = [];
  checked: boolean = false;
  searchString: string = '';

  constructor(private router: Router, private productService: ProductsService) {
    const navigation = this.router.getCurrentNavigation();
    this.checked = navigation?.extras?.state?.checked;
  }

  ngOnInit(): void {
    (<HTMLInputElement>document.getElementById('switchActive')).checked =
      this.checked;
    this.updateProductList();
  }

  updateProductList() {
    this.checked = (<HTMLInputElement>(
      document.getElementById('switchActive')
    )).checked;
    if (this.checked) {
      this.getProducts(true);
    } else {
      this.getProducts(false);
    }
  }

  getProducts(showInactive: boolean) {
    if (showInactive) {
      this.productService
        .getAllProducts()
        .then((res: any) => {
          var preList: Array<Product> = [];
          res.forEach((doc: any) => {
            let id = doc.id;
            preList.push({ id, ...doc.data() });
          });
          this.sortProductList(preList);
          this.productList = preList;
          //console.log('this.productList: ', this.productList);
        })
        .catch((error) => {
          console.log('Error:', error); //TODO: SweetAlert2
        });
    } else {
      this.productService
        .getActiveProducts()
        .then((res: any) => {
          var preList: Array<Product> = [];
          res.forEach((doc: any) => {
            let id = doc.id;
            preList.push({ id, ...doc.data() });
          });
          this.sortProductList(preList);
          this.productList = preList;
          //console.log('this.productList: ', this.productList);
        })
        .catch((error) => {
          console.log('Error:', error); //TODO: SweetAlert2
        });
    }
  }

  searchProducts() {
    this.searchString = (<HTMLInputElement>(
      document.getElementById('product-search')
    )).value;
    console.log('this.searchString: ', this.searchString);
  }

  sortProductList(array: Array<Product>) {
    this.productList = array.sort(
      (a: any, b: any) =>
        b.history[b.history.length - 1].date -
        a.history[a.history.length - 1].date
    );
  }

  seeProduct(item: any) {
    this.navigationExtras.state!.product = item;
    this.navigationExtras.state!.checked = (<HTMLInputElement>(
      document.getElementById('switchActive')
    )).checked;
    this.router.navigate(['product-info'], this.navigationExtras);
  }

  editProduct(item: any) {
    this.navigationExtras.state!.product = item;
    this.navigationExtras.state!.checked = (<HTMLInputElement>(
      document.getElementById('switchActive')
    )).checked;
    this.router.navigate(['product-edit'], this.navigationExtras);
  }

  deleteProduct(productId: string) {
    console.log(productId);
    this.productService
      .deleteProduct(productId)
      .then((res: any) => {
        console.log(res);
        this.updateProductList();
      })
      .catch((error) => {
        console.log('Error:', error); //TODO: SweetAlert2
      });
  }
}
