import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FieldValidator } from 'src/app/common/field-validator';
import { UserMessage } from 'src/app/common/user-message';
import { User } from 'src/app/models/user.interface';
import { UserService } from '../user.service';
import { Session } from 'src/app/common/session';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  providers: [FieldValidator, UserMessage, Session],
})
export class UserLoginComponent implements OnInit {
  userList: Array<User> = [];
  userForm!: FormGroup;
  isValidUsername: string = '[A-Za-z0-9]+';

  checkingUser: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public fieldValidator: FieldValidator,
    private userMessage: UserMessage,
    private session: Session
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.userForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(this.isValidUsername),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
      { updateOn: 'change' }
    );
  }

  onLogin() {
    if (this.userForm.valid) {
      this.checkingUser = true;
      //console.log(this.userForm.value);
      this.userService
        .getUser(this.userForm.value.username, this.userForm.value.password)
        .then((res: any) => {
          res.forEach((doc: any) => {
            this.userList.push(doc.data());
          });
          if (this.userList[0]) {
            this.userMessage.showMessage(0, 'You are logged!', 'User found!');
            this.session.saveSession(this.userList[0].username);
            this.router.navigate(['product-list']);
          } else {
            this.userMessage.showMessage(
              1,
              "There aren't any users with these credentials! Try again!",
              'Error'
            );
          }
          this.checkingUser = false;
        })
        .catch((error) => {
          this.userMessage.showMessage(1, 'Your user was NOT found!', 'Error');
          console.log('Error:', error); //For developers
          this.checkingUser = false;
        });
    }
  }
}
