import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBop7AQbKoGkhdhefwDcRNEkcN2Uo4P1Fg",
    authDomain: "instagram-clone-f5004.firebaseapp.com",
    databaseURL: "https://instagram-clone-f5004-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-f5004",
    storageBucket: "instagram-clone-f5004.appspot.com",
    messagingSenderId: "485038827356",
    appId: "1:485038827356:web:ca6163ae331daea82f8399",
    measurementId: "G-LXG8TKBCKS"
});

const db= firebaseApp.firestore();
const storage = firebase.storage();
const auth= firebase.auth();

export { db, auth, storage };