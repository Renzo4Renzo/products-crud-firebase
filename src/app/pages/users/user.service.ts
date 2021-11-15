import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.interface';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';

const firebaseApp = initializeApp(environment.firebase);
const firestore = getFirestore();

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUserName(username: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let getUserQuery = query(
          collection(firestore, 'users'),
          where('username', '==', username)
        );
        const user = await getDocs(getUserQuery);
        //console.log('user:', user);
        resolve(user);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  getUser(username: string, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let getUserQuery = query(
          collection(firestore, 'users'),
          where('username', '==', username),
          where('password', '==', password)
        );
        const user = await getDocs(getUserQuery);
        resolve(user);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  saveUser(user: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const userReference = doc(collection(firestore, 'users'));
        await setDoc(userReference, user);
        resolve('Saved successfully!');
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
