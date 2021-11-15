import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { UserService } from '../pages/users/user.service';
import { User } from 'src/app/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserValidator {
  constructor(private userService: UserService) {}

  passwordMatchValidator($this: any, password: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let passwordMatch = true;
      if ($this[password] !== control.value) {
        passwordMatch = false;
      }
      //console.log('passwordMatch: ', passwordMatch);
      return passwordMatch ? null : { passwordMatch: passwordMatch };
    };
  }
}

export function usernameExistsValidator(
  userService: UserService
): AsyncValidatorFn {
  return async (control: AbstractControl) => {
    let usernameExists;
    let userList: Array<User> = [];
    return await userService
      .getUserName(control.value)
      .then((res: any) => {
        res.forEach((doc: any) => {
          userList.push(doc.data());
        });
        if (userList[0]) {
          usernameExists = true;
        } else usernameExists = false;
        //console.log('usernameExists:', usernameExists);
        return usernameExists ? { usernameExists: usernameExists } : null;
      })
      .catch((error) => {
        console.log('Error:', error); //For developers
        return null;
      });
  };
}
