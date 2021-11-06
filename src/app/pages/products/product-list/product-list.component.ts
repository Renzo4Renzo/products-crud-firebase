import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.interface';
import { ProductsService } from '../products.service';

import { Global } from 'src/app/common/global';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      product: null,
    },
  };
  productList: Array<Product> = [];
  loadingList: boolean = false;
  emptyList: boolean = false;

  constructor(
    private router: Router,
    private productService: ProductsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    (<HTMLInputElement>document.getElementById('switchActive')).checked =
      Global.productCheckStatus;
    (<HTMLInputElement>document.getElementById('product-search')).value =
      Global.productSearchString;
    this.updateProductList();
  }

  updateProductList() {
    this.emptyList = false;
    this.loadingList = true;
    Global.productCheckStatus = (<HTMLInputElement>(
      document.getElementById('switchActive')
    )).checked;
    Global.productSearchString = (<HTMLInputElement>(
      document.getElementById('product-search')
    )).value
      .trim()
      .toUpperCase();
    //console.log(Global.productSearchString);
    let type = 0;
    if (Global.productCheckStatus) type = 1;
    this.getProducts(type);
  }

  getProducts(type: number) {
    let doSearch = false;
    if (Global.productSearchString != '') {
      doSearch = true;
    }
    this.productService
      .getProducts(type)
      .then((res: any) => {
        var preList: Array<Product> = [];
        res.forEach((doc: any) => {
          //console.log(doc.data());
          let id = doc.id;
          if (doSearch) {
            let docData = doc.data().title;
            let docPrice = Number.parseFloat(doc.data().price)
              .toFixed(2)
              .toString();
            if (
              docData.includes(Global.productSearchString) ||
              docPrice.includes(Global.productSearchString)
            ) {
              preList.push({ id, ...doc.data() });
            }
          } else preList.push({ id, ...doc.data() });
        });
        this.sortProductList(preList);
        this.productList = preList;
        if (this.productList.length == 0) {
          this.emptyList = true;
        }
        //console.log('this.productList: ', this.productList);
        this.loadingList = false;
      })
      .catch((error) => {
        this.showMessage(1, "Couldn't retrieve product list!", 'Error');
        console.log('Error:', error); //For developers
        this.loadingList = false;
      });
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
    this.router.navigate(['product-info'], this.navigationExtras);
  }

  editProduct(item: any) {
    this.navigationExtras.state!.product = item;
    this.router.navigate(['product-edit'], this.navigationExtras);
  }

  deleteProduct(productId: string) {
    //console.log(productId);
    this.productService
      .deleteProduct(productId)
      .then((res: any) => {
        this.showMessage(0, 'Your product was deleted!', String(res));
        this.updateProductList();
      })
      .catch((error) => {
        this.showMessage(1, 'Your product was NOT deleted!', 'Error');
        console.log('Error:', error); //For developers
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
