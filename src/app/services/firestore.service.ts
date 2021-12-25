import { Injectable } from '@angular/core';
import { app } from "../../firebase/config"
import { setDoc, getFirestore, addDoc, getDocs, collection, doc, getDoc } from "firebase/firestore"
import { getAuth } from 'firebase/auth'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  // Initialize the FirebaseUI Widget using Firebase.
  database = getFirestore()
  auth = getAuth()

  constructor() { }

  getUID() {
    return this.auth.currentUser && this.auth.currentUser.uid
  }

  async saveQuestionAnswer(question: { uid: string; qid: string; answer: string }): Promise<any> {
    const obj = {
      uid: question.uid,
      qid: question.qid,
      answer: question.answer
    }
    try {
      await setDoc(doc(this.database, 'questions', `${obj.qid}`),
        {
          [obj.answer]: {
            votes: [obj.uid]
          }
        },
        { merge: true })
      await setDoc(doc(this.database, 'users', `${obj.uid}`),
        {
          answers: {
            [obj.qid]: obj.answer
          }
        },
        { merge: true })
      return obj
    } catch (e) {
      console.log(e)
    }
  }

  async saveUser (user: { name: any; email: any; password: any }): Promise<any> {
    const obj = {
      text: user.name,
      value: user.email,
      answers: {},
      questions: [],
      password: user.password
    }
    try {
      await setDoc(doc(this.database, 'users', `${this.auth.currentUser?.uid}`), obj)
      return { id: this.auth.currentUser?.uid, ...obj }
    } catch (e) {
      console.log(e)
    }
  }

  async saveQuestion (question: { author: any; optionOneText: any; optionTwoText: any }): Promise<any> {
    const obj = {
      timestamp: Date.now(),
      author: question.author,
      optionOne: {
        votes: [],
        text: question.optionOneText,
      },
      optionTwo: {
        votes: [],
        text: question.optionTwoText,
      }
    }
    try {
      const hi = await getDoc(doc(this.database, 'users', `${obj.author}`))
      const docRef = await addDoc(collection(this.database, 'questions'), obj)
      await setDoc(doc(this.database, 'users', `${obj.author}`), {
        questions: [...hi.data()?.['questions'], docRef.id]
      },
        { merge: true })
      return { id: docRef.id, ...obj }
    } catch (e) {
      console.log(e)
    }
    return obj
  }

  async getQuestions () {
    let questions = {}
    const querySnapshot = await getDocs(collection(this.database, "questions"));
    querySnapshot.forEach((doc) => {
      questions = {
        ...questions,
        [doc.id]: {
          id: doc.id,
          ...doc.data()
        }
      }
    })
    return questions
  }

  async getUsers() {
    let users = {}
    const querySnapshot = await getDocs(collection(this.database, "users"));
    querySnapshot.forEach((doc) => {
      users = {
        ...users,
        [doc.id]: {
          id: doc.id,
          ...doc.data()
        }
      }
    })
    return users
  }

  async getAuthedUser(uid: any) {
    let user: any = {}
    try {
      await getDoc(doc(this.database, 'users', `${uid}`))
        .then((snapshot) => {
          user = snapshot.data()
        })
    } catch (e: any) {
      alert(e.message)
    }
    return {
      id: uid,
      ...user,
    }
  }

  arraying(object: any) {
    const Keys = Object.keys(object)
    let array: any = []
    Keys.forEach((key) => {
      array.push(object[key])
    })
    return array
  }
}
