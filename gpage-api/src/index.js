require('babel-polyfill');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const firebase = require('firebase-admin');
const serviceAccount = require('./gpage-40d32-firebase-adminsdk-p21vj-e8a41025d8.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://chatbot-8769a.firebaseio.com',
});

const appRouter = require('./routers');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

appRouter(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Running....'));
