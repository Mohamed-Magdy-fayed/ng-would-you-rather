import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  uid = new Observable<string | null>((observer: Observer<string | null>) => {
    setTimeout(() => observer.next(this.store.getUID()), 1000);
  })
  authedUser: any = null
  loading: boolean = true

  constructor(
    private store: FirestoreService,
    private router: Router,
  ) { }

  redirect() {
    this.uid.subscribe(res => {
      this.store.getAuthedUser(res)
        .then(user => {
          if (!user.id) {
            this.router.navigate(['/signin'])
            alert('Please sign in to view the App!')
          }
          this.authedUser = user
          this.loading = false
        })
    })
  }
}
