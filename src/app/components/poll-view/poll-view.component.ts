import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { RedirectService } from 'src/app/services/redirect.service';

@Component({
  selector: 'app-poll-view',
  templateUrl: './poll-view.component.html',
  styleUrls: ['./poll-view.component.scss']
})
export class PollViewComponent implements OnInit {
  currentUser: any
  id: any
  polls: any
  poll: any
  loading: boolean = true
  user: any

  constructor(
    private auth: AuthService, 
    private router: Router, 
    private route: ActivatedRoute,
    private store: FirestoreService,
    private redirect: RedirectService
    ) {
      this.redirect.uid.subscribe(res => {
        this.store.getAuthedUser(res)
        .then(user => {
          this.user = user          
        })
      })
    }

  ngOnInit(): void {

    this.route.params.subscribe(params => {      
      this.id = params['id'];     
    })

    this.redirect.uid.subscribe(res => {
      this.store.getAuthedUser(res)
      .then(user => {
        this.currentUser = user
      })
    })

    this.store.getQuestions()
    .then(questions => {
      this.polls = questions
      this.poll = this.polls[this.id]
      this.loading = false
    })
  }
  
  handleBack (event: any) {
    event.preventDefault()
    this.router.navigate(['/'])
  }

}
