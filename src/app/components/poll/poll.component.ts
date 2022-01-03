import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { saveQuestionAnswer } from 'src/firebase/firestore';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})

export class PollComponent implements OnInit {
  user: any
  users: any
  answer: any
  optionOneVotes: any
  optionTwoVotes: any
  total: any
  processing: any = false
  currentUser: any
  authedUser: any
  answered: any
  loading: boolean = true

  @Input() viewed: any;
  @Input() poll: any;
  @Input() freshPoll: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: FirestoreService,
    private redirect: RedirectService
  ) {}

  ngOnInit(): void {
    this.init()
      
    }

  init() {
    this.setLoading(true)
    this.store.getUsers()
    .then(users => {
      this.users = users
      this.user = this.users[this.poll.author]
    })

    this.redirect.uid.subscribe(res => {
      this.store.getAuthedUser(res)
        .then(user => {
          this.currentUser = user
          this.authedUser = user
          
          if (this.poll.optionOne.votes.includes(this.currentUser.id)
            || this.poll.optionTwo.votes.includes(this.currentUser.id)) {
            this.setAnswered(true)
            this.setLoading(false)
          } else {
            this.setAnswered(false)
            this.setLoading(false)
          }
        })
      })

      this.optionOneVotes = this.poll.optionOne.votes.length
      this.optionTwoVotes = this.poll.optionTwo.votes.length
      this.total = this.optionOneVotes + this.optionTwoVotes

  }

  setAnswered(value: any) {
      this.answered = value
    }

  setProcessing(value: any) {
      this.processing = value
    }
    
  setLoading(value: any) {
      this.loading = value
    }

  handleSubmit(event: any) {
      event.preventDefault()
    if(this.answer === '') {
      alert('Please choose an answer!')
      return
    }
    this.setProcessing(true)
    const question = {
      uid: this.currentUser.id,
      qid: this.poll.id,
      answer: this.answer,
    }

    saveQuestionAnswer(question)
      .then(() => {
        setTimeout(() => {
          if (this.answer === 'optionOne') {
            this.optionOneVotes += 1
            this.total = this.optionOneVotes + this.optionTwoVotes
          } else {
            this.optionTwoVotes += 1
          this.total = this.optionOneVotes + this.optionTwoVotes
          }
          
          this.setAnswered(true)
          this.setProcessing(false)
        }, 2000);
      })
  }
  handleBack(event: any) {
    event.preventDefault()
    this.router.navigate(['/'])
  }

  setAnswer(event: any) {
    this.answer = event.target.id
  }
}
