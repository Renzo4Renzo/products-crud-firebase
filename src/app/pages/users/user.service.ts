import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.interface';

import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(public firestore: Firestore) {}

  getUserName(username: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let getUserQuery = query(
          collection(this.firestore, 'users'),
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
          collection(this.firestore, 'users'),
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
        const userReference = doc(collection(this.firestore, 'users'));
        await setDoc(userReference, user);
        resolve('Saved successfully!');
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
