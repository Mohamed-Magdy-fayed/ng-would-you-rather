import { Component, OnInit } from '@angular/core';
import { upload } from 'src/firebase/upload';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { RedirectService } from 'src/app/services/redirect.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  name = new FormControl('',
    [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*')
    ]
  )
  email = new FormControl('',
    [
      Validators.required,
      Validators.email
    ]
  )
  password = new FormControl('',
    [
      Validators.required,
      Validators.minLength(6),
    ]
  )
  hide: boolean = true;
  processing: boolean = false
  url: null | string = null

  constructor(
    private auth: AuthService,
    private store: FirestoreService,
    private redirect: RedirectService
  ) { }

  ngOnInit(): void {
  }

  getNameError() {
    if (this.name.hasError('required')) {
      return 'You must enter a name';
    }
    return this.name.hasError('pattern') ? 'Please use letters only!' : '';
  }

  getEmailError() {
    if (this.email.hasError('required')) {
      return 'You must enter an email';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordError() {
    const test = /^[0-9\b]+$/
    if (this.password.hasError('required')) {
      return 'You must enter a password';
    } else if (!test.test(this.password.value)) {
      return 'Please type numbers only'
    } else {
      return 'Password length must be at least 6 numbers'
    }
  }

  setProcessing(value: boolean) {
    this.processing = value
  }

  handleSubmit(event: any) {
    event.preventDefault()

    this.setProcessing(true)
    const user = {
      name: this.name.value,
      email: this.email.value,
      password: this.password.value,
    }

    this.auth.signup(this.email.value, this.password.value)
      .then(() => {
        this.store.saveUser(user)
        this.redirect.redirect()
        this.setProcessing(false)
      })
  }
}
