import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.interface';

import { initializeApp } from 'firebase/app';

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';

const firebaseApp = initializeApp(environment.firebase);
const firestore = getFirestore();
const storage = getStorage(firebaseApp);

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  productList!: Observable<Product[]>;

  constructor() {}

  getProducts(type: number) {
    if (type == 1) {
      //Gets ALL Products
      return new Promise(async (resolve, reject) => {
        try {
          let getProductQuery = query(collection(firestore, 'products'));
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
            collection(firestore, 'products'),
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
        const productReference = doc(collection(firestore, 'products'));
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
        await setDoc(doc(firestore, 'products', productId), product);
        resolve('Updated successfully!');
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  deleteProduct(productId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await deleteDoc(doc(firestore, 'products', productId));
        resolve('Deleted successfully!');
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  uploadImage(fileName: string, imgBase64: any) {
    return new Promise(async (resolve, reject) => {
      const storageRef = ref(storage, 'images/' + fileName);
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
      const storageRef = ref(storage, filePath);
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
