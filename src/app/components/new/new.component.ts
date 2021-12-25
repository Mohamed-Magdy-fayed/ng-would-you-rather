import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { saveQuestion } from 'src/firebase/firestore';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  optionOneText: any = new FormControl('',
    [
      Validators.required
    ])
  optionTwoText: any = new FormControl('',
    [
      Validators.required
    ])
  processing: any
  currentUser: any
  user: any

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: FirestoreService,
    private redirect: RedirectService
  ) {
    redirect.redirect()
  }

  ngOnInit(): void {
    this.redirect.uid.subscribe(res => {
      this.store.getAuthedUser(res)
        .then(user => {
          this.user = user
        })
    })
  }

  getError() {
    return 'Please add two options!'
  }

  setProcessing(value: any) {
    this.processing = value
  }

  handleSubmit(event: any) {
    event.preventDefault()

    console.log(this.optionOneText.value, this.optionTwoText.value);


    if (!this.optionOneText.value || !this.optionTwoText.value) {
      alert('Please add 2 options')
      return
    }

    this.setProcessing(true)

    const data = {
      author: this.user.id,
      optionOneText: this.optionOneText.value,
      optionTwoText: this.optionTwoText.value,
    }

    console.log(data);


    saveQuestion(data)
      .then(() => {
        this.router.navigate(['/'])
        this.setProcessing(false)
      })
  }

}
