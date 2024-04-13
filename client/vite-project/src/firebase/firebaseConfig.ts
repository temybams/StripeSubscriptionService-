import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyB8uICGbzl9C4WLAf7L4Kzdul4rDFcqcdQ",
  authDomain: "stripe-subscription-pj.firebaseapp.com",
  projectId: "stripe-subscription-pj",
  storageBucket: "stripe-subscription-pj.appspot.com",
  messagingSenderId: "180170365259",
  appId: "1:180170365259:web:6182c90f73696630d670ce",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
