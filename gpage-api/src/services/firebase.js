const firebase = require('firebase-admin');
const serviceAccount = require('../chatbot-8769a-firebase-adminsdk-sty76-05657e9b40.json');

const initFirebase = () =>
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://chatbot-8769a.firebaseio.com'
  });

module.exports = initFirebase;
