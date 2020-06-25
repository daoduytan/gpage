/* eslint-disable no-restricted-syntax */

const { sendMessage, sendComment } = require('./util');

const facebookController = {
  webhook_get: (req, res) => {
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Invalid verify token');
    }
  },

  webhook_post: (req, res) => {
    const entries = req.body.entry;
    for (const entry of entries) {
      const { messaging, time, changes } = entry;

      // eslint-disable-next-line no-restricted-syntax
      if (messaging) {
        for (const message of messaging) {
          // console.log('message', message);

          const senderId = message.sender.id;
          const pageId = message.recipient.id;

          if (message.message) {
            const { text } = message.message;
            sendMessage(senderId, pageId, text, message, time);
          }
        }
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const message of changes) {
          // console.log('changes', message);
          const { value } = message;
          if (value.from) {
            const senderId = value.from ? value.from.id : '';
            const pageId = entry.id;
            const postId = value.post_id;
            const text = value.message;
            // const time = value.created_time;

            sendComment(
              senderId,
              pageId,
              postId,
              text,
              message,
              value.created_time
            );
          }
        }
      }
    }

    res.status(200).send('OK');
  },
};

module.exports = facebookController;
