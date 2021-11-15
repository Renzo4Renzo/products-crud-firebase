import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.interface';

import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  productList!: Observable<Product[]>;

  constructor(public firestore: Firestore, public storage: Storage) {}

  getProducts(type: number) {
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

  uploadImage(fileName: string, imgBase64: any) {
    return new Promise(async (resolve, reject) => {
      const storageRef = ref(this.storage, 'images/' + fileName);
      uploadBytes(storageRef, imgBase64)
        .then((snapshot) => {
          //console.log('Image uploaded successfully!');
          getDownloadURL(ref(storageRef))
            .then((url) => {
              //console.log('URL is: ' + url);
              resolve(url);
            })
            .catch((error) => {
              reject(error.message);
            });
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  }

  deleteImage(filePath: string) {
    return new Promise(async (resolve, reject) => {
      const storageRef = ref(this.storage, filePath);
      deleteObject(storageRef)
        .then(() => {
          resolve('File deleted succesfully!');
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  }
}
