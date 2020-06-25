const controllerFirebase = require('./controller.firebase');
const middlewareFirebase = require('./middleware.firebase');

const firebaseRouter = app => {
  app.get(
    '/api/get_member',
    middlewareFirebase.authentication,
    controllerFirebase.get_member
  );
  app.post('/api/login_member', controllerFirebase.login_member);
  app.post('/api/create_member', controllerFirebase.create_member);
  app.delete('/api/delete_member', controllerFirebase.delete_member);
  app.delete(
    '/api/delete_conversation',
    controllerFirebase.delete_conversation
  );
};

module.exports = firebaseRouter;
