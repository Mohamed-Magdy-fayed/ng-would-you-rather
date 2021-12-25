import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { RedirectService } from 'src/app/services/redirect.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  polls: any = null
  authedUser: any
  answered: any = false
  currentUser: any
  allAnswered: any = []
  allNotAnswered: any = []
  loading: boolean = true

  constructor(
    private store: FirestoreService,
    private redirect: RedirectService
  ) {
    redirect.redirect()
  }

  ngOnInit(): void {
    this.store.getQuestions()
      .then(questions => {
        this.polls = questions
      })
    this.redirect.uid.subscribe(res => {
      this.store.getAuthedUser(res)
        .then(user => {
          this.currentUser = user

          this.polls && Object.keys(this.polls).forEach(q => {
            if (this.polls[q].optionTwo.votes.includes(this.currentUser.id)) {
              this.allAnswered.push({
                id: q,
                ...this.polls[q],
              })
            } else if (this.polls[q].optionOne.votes.includes(this.currentUser.id)) {
              this.allAnswered.push({
                id: q,
                ...this.polls[q],
              })
            } else {
              this.allNotAnswered.push({
                id: q,
                ...this.polls[q],
              })
            }
          })
          this.allAnswered.sort((a: any, b: any) => {
            return b.timestamp - a.timestamp
          })
          this.allNotAnswered.sort((a: any, b: any) => {
            return b.timestamp - a.timestamp
          })
        })
      this.loading = false
    })
  }
}
