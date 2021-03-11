import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as geofirestore from 'geofirestore';



// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyByqKVpzNLKDy4qGE_VpVX6qTimVX_xKsQ",
  authDomain: "ordering-app-ph.firebaseapp.com",
  databaseURL: "https://ordering-app-ph.firebaseio.com",
  projectId: "ordering-app-ph",
  storageBucket: "ordering-app-ph.appspot.com",
  messagingSenderId: "1061098229186",
  appId: "1:1061098229186:web:4905dfb655204ff6ac5a5b",
  measurementId: "G-4GRQKEM0YN"
};
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const GeoFirestore = geofirestore.initializeApp(firestore);


const db = firebase.firestore();
const auth = firebase.auth();
/* const currentUser = auth.auth(); */

const restaurantCollection = db.collection("restaurants");

const { Timestamp, GeoPoint } = firebase.firestore();
export { Timestamp, GeoPoint }
export { restaurantCollection, fb }
export { auth, db }

export { GeoFirestore }

