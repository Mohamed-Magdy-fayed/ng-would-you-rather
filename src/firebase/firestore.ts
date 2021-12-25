import { app } from "./config"
import { setDoc, getFirestore, addDoc, getDocs, collection, doc, getDoc } from "firebase/firestore"
import { getAuth } from 'firebase/auth'

// Initialize the FirebaseUI Widget using Firebase.
const database = getFirestore()
const auth = getAuth()
let uid = auth.currentUser && auth.currentUser.uid

export const saveQuestionAnswer = async (question: { uid: string; qid: string; answer: string }): Promise<any> => {
    const obj = {
        uid: question.uid,
        qid: question.qid,
        answer: question.answer
    }
    try {
        await setDoc(doc(database, 'questions', `${obj.qid}`),
            {
                [obj.answer]: {
                    votes: [obj.uid]
                }
            },
            { merge: true })
        await setDoc(doc(database, 'users', `${obj.uid}`),
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

export const saveUser = async (user: { username: any; url: any; password: any }): Promise<any> => {
    const obj = {
        text: user.username,
        value: user.username,
        image: { avatar: true, src: user.url },
        answers: {},
        questions: [],
        password: user.password
    }
    try {
        await setDoc(doc(database, 'users', `${auth.currentUser?.uid}`), obj)
        return { id: auth.currentUser?.uid, ...obj }
    } catch (e) {
        console.log(e)
    }
}

export const saveQuestion = async (question: { author: any; optionOneText: any; optionTwoText: any }): Promise<any> => {
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
        const hi = await getDoc(doc(database, 'users', `${obj.author}`))
        const docRef = await addDoc(collection(database, 'questions'), obj)
        await setDoc(doc(database, 'users', `${obj.author}`), {
            questions: [...hi.data()?.['questions'], docRef.id]
        },
            { merge: true })
        return { id: docRef.id, ...obj }
    } catch (e) {
        console.log(e)
    }
    return obj
}

export const getQuestions = async () => {
    let questions = {}
    const querySnapshot = await getDocs(collection(database, "questions"));
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

export const getUsers = async () => {
    let users = {}
    const querySnapshot = await getDocs(collection(database, "users"));
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

export const getAuthedUser = async () => {
    let user: any = {}
    try {       
        await getDoc(doc(database, 'users', `${uid}`))
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

export const arraying = (object: any) => {
    const Keys = Object.keys(object)
    let array: any = []
    Keys.forEach((key) => {
      array.push(object[key])
    })
    return array
  }