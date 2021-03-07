// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app"
import "firebase/firestore"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
}

firebase.initializeApp(firebaseConfig)

let db = firebase.firestore()

export default {db}