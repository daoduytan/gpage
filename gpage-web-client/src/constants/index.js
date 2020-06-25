const prod = process.env.NODE_ENV === 'production';

const URL_API = prod ? process.env.REACT_APP_URL_API : 'http://localhost:5000';
const URL_CLIENT = prod
  ? process.env.REACT_APP_URL_CLIENT
  : 'https://localhost:3000';

const FB = {
  FACEBOOK_APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID,
  FACEBOOK_SECRET_KEY: process.env.REACT_APP_FACEBOOK_SECRET_KEY
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCnze0nJZCfaKwBx8k7bnphFVHmZA81QSo",
//   authDomain: "gpage-40d32.firebaseapp.com",
//   databaseURL: "https://gpage-40d32.firebaseio.com",
//   projectId: "gpage-40d32",
//   storageBucket: "gpage-40d32.appspot.com",
//   messagingSenderId: "707043592010",
//   appId: "1:707043592010:web:167f1832422956723463b3",
//   measurementId: "G-G739FV51QY"
// };

// apiKey: 'AIzaSyDjbB1715w1Sxss_2z0SHCUJYuyOA2XdnQ',
// authDomain: 'social.insa.vn',
// databaseURL: 'https://social.insa.vn',
// projectId: 'chatbot-8769a',
// storageBucket: 'chatbot-8769a.appspot.com',
// messagingSenderId: '1022114171404',
// appId: '1:1022114171404:web:707265d50b203b0d'

const CONFIG_FIREBASE = prod
  ? {
      apiKey: 'AIzaSyCnze0nJZCfaKwBx8k7bnphFVHmZA81QSo',
      authDomain: 'gpage.insa.vn',
      databaseURL: 'https://gpage.insa.vn',
      projectId: 'gpage-40d32',
      storageBucket: 'gpage-40d32.appspot.com',
      messagingSenderId: '707043592010',
      appId: '1:707043592010:web:167f1832422956723463b3'
    }
  : {
      apiKey: 'AIzaSyCnze0nJZCfaKwBx8k7bnphFVHmZA81QSo',
      authDomain: 'gpage-40d32.firebaseapp.com',
      databaseURL: 'https://gpage-40d32.firebaseapp.com',
      projectId: 'gpage-40d32',
      storageBucket: 'gpage-40d32.appspot.com',
      messagingSenderId: '707043592010',
      appId: '1:707043592010:web:167f1832422956723463b3'
    };

export default {
  title: 'Gpage',
  URL_API,
  FB,
  URL_CLIENT,
  CONFIG_FIREBASE
};
