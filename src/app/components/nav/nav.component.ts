import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { RedirectService } from 'src/app/services/redirect.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  user: any
  isExpanded: boolean = false
  isVisible: boolean = false

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: FirestoreService,
    private redirect: RedirectService
  ) { }

  ngOnInit(): void {
    this.redirect.uid.subscribe(res => {
      this.store.getAuthedUser(res)
      .then(user => {
        this.user = user
      })
    })
  }

  setIsExpanded(value: boolean) {
    this.isExpanded = value
  }

  setIsVisible(value: boolean) {
    this.isVisible = value
  }

  handleSignout() {
    this.auth.logout()
    this.router.navigate(['/signin'])
  }

  toggleNav(event: any) {
    event.preventDefault()
    if (!this.isVisible) {
      this.setIsVisible(true)
      this.setIsExpanded(true)     
    } else {
      this.setIsVisible(false)
      this.setIsExpanded(false)
    }
  }
}
