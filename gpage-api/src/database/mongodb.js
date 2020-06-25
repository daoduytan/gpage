const mongoose = require('mongoose');

const mongodb = cb => {
  mongoose
    .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    .then(() => {
      cb();
      console.log('Connected to Database');
    })
    .catch(err => {
      console.log('Not Connected to Database ERROR! ', err);
    });
  mongoose.Promise = global.Promise;
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};

module.exports = mongodb;
