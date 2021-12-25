import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { getAuthedUser } from 'src/firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  email = new FormControl('',
    [
      Validators.required,
      Validators.email
    ])
  password = new FormControl('',
    [
      Validators.required,
      Validators.minLength(6),
    ]
  )
  hide: boolean = true;
  processing: boolean = false
  currentUser: object | null = {}

  constructor(private auth: AuthService, private router: Router) {

  }

  ngOnInit(): void {
  }

  getEmailError() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
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

  onclick(event: Event) {
    event.preventDefault()
    this.auth.login(this.email.value, this.password.value)
    this.router.navigate(['/'])
  }
}
