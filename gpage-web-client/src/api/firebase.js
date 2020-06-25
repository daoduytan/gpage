import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import constants from '../constants';

const config = constants.CONFIG_FIREBASE;

// const config = {
//   apiKey: 'AIzaSyDjbB1715w1Sxss_2z0SHCUJYuyOA2XdnQ',
//   authDomain: 'chatbot-8769a.firebaseapp.com',
//   databaseURL: 'https://chatbot-8769a.firebaseio.com',
//   projectId: 'chatbot-8769a',
//   storageBucket: 'chatbot-8769a.appspot.com',
//   messagingSenderId: '1022114171404',
//   appId: '1:1022114171404:web:707265d50b203b0d'
// };

const app = firebase.initializeApp(config);
const fireStore = firebase.firestore(app);
const fireAuth = firebase.auth(app);
const fireStorage = firebase.storage();

export { fireStore, fireAuth, fireStorage };
