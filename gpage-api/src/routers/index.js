const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const imageRouter = require('./imageRouter');
const facebookRouter = require('./facebookRouter');
const firebaseRouter = require('./firebaseRouter');
const shipRouter = require('./shipRouter');

const appRouter = app => {
  app.get('/', (req, res) => res.send('This is api not client website'));
  authRouter(app);
  postRouter(app);
  imageRouter(app);
  facebookRouter(app);
  firebaseRouter(app);
  shipRouter(app);
};

module.exports = appRouter;
