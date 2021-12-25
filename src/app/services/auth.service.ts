import { Injectable } from '@angular/core';
import { auth } from '../../firebase/config';
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth
} from 'firebase/auth';
import { Router } from '@angular/router';
import { getAuthedUser, getQuestions, getUsers } from 'src/firebase/firestore';
import { User } from '../User';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: any
  allUsers: any
  allQuestions: any

  constructor() {
    onAuthStateChanged(auth, user => {
      this.currentUser = user
    })
  }

  async initAuthedUsed (): Promise<Observable<object>> {
    return new Observable(await getAuthedUser()
    .then(user => {
      console.log(user)
      return user
    })
    .catch(e => {
      console.log(e)
      return 
    }))
  }

  init() {
    setTimeout(() => {
      getAuthedUser()
      .then(user => this.currentUser = user)
      getUsers()
      .then(users => this.allUsers = users)
      getQuestions()
      .then(questions => this.allQuestions = questions)
    }, 2000);
    setTimeout(() => {
      console.log(this.currentUser)
      console.log(this.allUsers)
      console.log(this.allQuestions)
    }, 3000);
  }

  signup(email: any, password: any) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  login(email: any, password: any) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  logout() {
    return signOut(auth)
  }

  // function resetPassword(email: any) {
  //   return auth.sendPasswordResetEmail(email)
  // }

  // function updateEmail(email: any) {
  //   return currentUser.updateEmail(email)
  // }

  // function updatePassword(password: any) {
  //   return currentUser.updatePassword(password)
  // }

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, user => {
  //     setCurrentUser(user)
  //   })

  //   return unsubscribe
  // }, [])
}