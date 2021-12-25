import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { RedirectService } from 'src/app/services/redirect.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  users: any
  scoresArray: any
  currentUser: any
  usersArray: any

  constructor(
    private auth: AuthService,
    private store: FirestoreService,
    private redirect: RedirectService
    ) { }

  ngOnInit(): void {
    this.redirect.uid.subscribe(res => {
      this.store.getAuthedUser(res)
      .then(user => {
        this.currentUser = user
      })
    })

    this.store.getUsers()
    .then(users => {
      this.users = users
      this.usersArray = this.users && this.store.arraying(this.users)
      this.scoresArray = this.usersArray && this.usersArray.map((user: { answers: any; questions: string | any[]; }) => {
          const answers = this.store.arraying(user.answers).length
          const questions = user.questions.length
          const total = answers + questions
          return {
              ...user,
              score: total,
          }
      }).sort((a: { score: number; },b: { score: number; }) => b.score - a.score)
    })
  }
}
