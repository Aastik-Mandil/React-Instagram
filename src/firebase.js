import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCtbGJAyF2iShrIk47okkSs1EsYnJmneTQ",
    authDomain: "instragram-e05d2.firebaseapp.com",
    projectId: "instragram-e05d2",
    storageBucket: "instragram-e05d2.appspot.com",
    messagingSenderId: "361132770585",
    appId: "1:361132770585:web:e9497230b0fe440c577188",
    measurementId: "G-WT21B7TV5G"
};

const firebaseapp = firebase.initializeApp(firebaseConfig);
const db = firebaseapp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };