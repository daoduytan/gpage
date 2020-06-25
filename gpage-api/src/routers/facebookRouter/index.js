const axios = require('axios');
const facebookController = require('./controller.facebook');

const base_url = `https://graph.facebook.com/v5.0/oauth/access_token?grant_type=fb_exchange_token`;

const facebookRouter = app => {
  // webhook
  app.get('/webhook', facebookController.webhook_get);

  app.post('/webhook', facebookController.webhook_post);

  // get long token facebook page
  app.post('/api/facebook/long_token', async (req, res) => {
    const { token } = req.body;

    const url = `${base_url}&client_id=${process.env.FB_CLIENT_ID}&client_secret=${process.env.FB_CLIENT_SECRET}&fb_exchange_token=${token}`;

    const tokenRes = await axios.get(url);

    res.json({ data: tokenRes.data });
  });
};

module.exports = facebookRouter;
