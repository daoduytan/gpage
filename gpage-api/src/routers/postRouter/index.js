const { authentication } = require('../../middlewares');
const { Post } = require('../../models');

const postRouter = app => {
  // add post
  app.post('/api/post/new_post', authentication, (req, res) => {
    const { _id } = req;

    console.log('handleSave', req.body);
    const post = new Post({ ...req.body, user: { id: _id } });
    post
      .save()
      .then(resPost => {
        return res.json({ status: true, post: resPost });
      })
      .catch(error => res.status(500).json({ status: false }));
  });

  // get all post in user
  app.get('/api/posts/get_all_posts', authentication, (req, res) => {
    const { _id } = req;

    const { page, limit } = req.body;

    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sort: { whenDate: -1 }
    };

    Post.paginate({ 'user.id': _id }, options, (error, result) => {
      if (error) return res.status(500).json({ status: false });
      return res.json({ status: true, result });
    });
  });
};

module.exports = postRouter;
