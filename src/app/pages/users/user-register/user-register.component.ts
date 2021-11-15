import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FieldValidator } from 'src/app/common/field-validator';
import { Session } from 'src/app/common/session';
import { UserMessage } from 'src/app/common/user-message';
import {
  usernameExistsValidator,
  UserValidator,
} from 'src/app/common/user-validator';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss'],
  providers: [UserValidator, FieldValidator, UserMessage, Session],
})
export class UserRegisterComponent implements OnInit {
  userForm!: FormGroup;
  isValidUsername: string = '[A-Za-z0-9]+';

  comparingPassword: string = '';
  savingUser: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private userValidator: UserValidator,
    public fieldValidator: FieldValidator,
    private userMessage: UserMessage,
    private session: Session
  ) {
    this.initForm();
    if (session.getSession()) this.router.navigate(['product-list']);
  }

  private initForm(): void {
    this.userForm = this.formBuilder.group(
      {
        username: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(6),
              Validators.pattern(this.isValidUsername),
            ],
            asyncValidators: [usernameExistsValidator(this.userService)],
            updateOn: 'change',
          },
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.userValidator.passwordMatchValidator(
              this,
              'comparingPassword'
            ),
          ],
        ],
      },
      { updateOn: 'change' }
    );
  }

  updateUsername(event: any) {
    this.userForm.controls['username'].updateValueAndValidity();
  }

  updatePassword(event: any) {
    this.comparingPassword = this.userForm.value.password;
    this.userForm.controls['repeatPassword'].updateValueAndValidity();
  }

  ngOnInit(): void {}

  onSave() {
    if (this.userForm.valid) {
      this.savingUser = true;
      let type = 'admin';
      let user = {
        username: this.userForm.value.username.toLowerCase(),
        password: this.userForm.value.password,
        type: type,
      };
      this.userService
        .saveUser(user)
        .then((res) => {
          this.savingUser = false;
          this.userMessage.showMessage(
            0,
            'Your user was registered!',
            String(res)
          );
          this.router.navigate(['login']);
        })
        .catch((error) => {
          this.userMessage.showMessage(
            1,
            'Your user was NOT registered!',
            'Error'
          );
          console.log('Error:', error); //For developers
          this.savingUser = false;
        });
    }
  }
}
