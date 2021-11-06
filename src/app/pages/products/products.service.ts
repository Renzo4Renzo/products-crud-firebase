import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  productList!: Observable<Product[]>;

  constructor(private firestore: Firestore) {}

  getProducts(type: number /*, searchString: string*/) {
    if (type == 1) {
      //Gets ALL Products
      return new Promise(async (resolve, reject) => {
        try {
          let getProductQuery = query(collection(this.firestore, 'products'));
          const querySnapshot = await getDocs(getProductQuery);
          resolve(querySnapshot);
        } catch (error: any) {
          reject(error.message);
        }
      });
    } else {
      //Gets ACTIVE Products
      return new Promise(async (resolve, reject) => {
        try {
          let getProductQuery = query(
            collection(this.firestore, 'products'),
            where('active', '==', true)
          );
          const querySnapshot = await getDocs(getProductQuery);
          resolve(querySnapshot);
        } catch (error: any) {
          reject(error.message);
        }
      });
    }
  }

  saveProduct(product: Product) {
    return new Promise(async (resolve, reject) => {
      try {
        const productReference = doc(collection(this.firestore, 'products'));
        await setDoc(productReference, product);
        resolve('Saved successfully!');
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  updateProduct(product: Product, productId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await setDoc(doc(this.firestore, 'products', productId), product);
        resolve('Updated successfully!');
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  deleteProduct(productId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await deleteDoc(doc(this.firestore, 'products', productId));
        resolve('Deleted successfully!');
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
