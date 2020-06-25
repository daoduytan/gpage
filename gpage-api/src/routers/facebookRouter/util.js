const firebase = require('firebase-admin');
const moment = require('moment');
const request = require('request-promise');

const db = firebase.firestore();

const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const regVNPhoneMobile = /(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})/;

// check email
function checkEmail(text) {
  return regEmail.test(text);
}

// check phone
function checkPhone(text) {
  return regVNPhoneMobile.test(text);
}

// checkBlackList
function checkBlackList(text, array) {
  const isExist = array.some(i => {
    const index = text.search(RegExp(i));
    // console.log(index);
    if (index !== -1) return true;
    return false;
  });

  return isExist;
}

// hide comment
function hideComment(page, message) {
  const options = {
    method: 'POST',
    uri: `https://graph.facebook.com/v5.0/${message.value.comment_id}`,
    qs: {
      is_hidden: true,
      access_token: page.access_token,
    },
  };
  return request(options)
    .then(resFb => console.log('resFb', resFb))
    .catch(error => console.log('error', error));
}

module.exports = {
  // send message
  sendMessage: (senderId, pageId, text, message, time) => {
    // console.log('dadadadad', senderId, pageId, text, message, time);

    db.collection('user_activity')
      .where('pageId', '==', pageId)
      .where('sender.id', '==', senderId)
      .where('type', '==', 'message')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          db.collection('user_activity')
            .where('pageId', '==', senderId)
            .where('sender.id', '==', pageId)
            .where('type', '==', 'message')
            .get()
            .then(snap => {
              if (snap.empty) {
                console.log('th1');

                db.collection('user_activity')
                  // .doc(senderId)
                  .add({
                    id: `m_${pageId}_${senderId}`,
                    sender: {
                      id: senderId,
                      name: '',
                      email: '',
                    },
                    pageId,
                    actionType: 'add',
                    snippet: text || '',
                    attachment: message.message,
                    updatedTime: Date.now(),
                    startDate: Date.now(),
                    reply: false,
                    seen: false,
                    type: 'message',
                  })
                  .then(res => {
                    // const { sender } = res.data();

                    db.collection('user_activity')
                      .doc(res.id)
                      .get()
                      .then(doc => {
                        const { sender } = doc.data();

                        db.collection('user_activity')
                          .doc(res.id)
                          .collection('messages')
                          .add({
                            created_time: Date.now(),
                            id: Date.now(),
                            message: text || '',
                            attachment: message.message,
                            from: {
                              id: senderId,
                              email: sender.email || '',
                              name: sender.name,
                            },
                          });
                      });
                  });
              } else {
                console.log('th3');
                snap.forEach(d => {
                  db.collection('user_activity')
                    .doc(d.id)
                    .update({
                      actionType: 'add',
                      snippet: text || '',
                      message: message.message,
                      updatedTime: Date.now(),
                      reply: true,
                      seen: true,
                      type: 'message',
                    })
                    .then(res => {
                      console.log('res.id', d.id);

                      db.collection('user_activity')
                        .doc(d.id)
                        .collection('messages')
                        .add({
                          created_time: Date.now(),
                          id: Date.now(),
                          message: text || '',
                          attachment: message.message,
                          from: {
                            id: senderId,
                            email: '',
                            name: '',
                          },
                        });
                    });

                  // const { sender } = d.data();
                });
              }
            });
        } else {
          console.log('th2', snapshot.docs.length);

          snapshot.docs.forEach(d => {
            const { sender } = d.data();

            db.collection('user_activity')
              .doc(d.id)
              .update({
                actionType: 'add',
                snippet: text || '',
                message: message.message,
                updatedTime: Date.now(),
                reply: false,
                seen: false,
                type: 'message',
              })
              .then(res => {
                db.collection('user_activity')
                  .doc(d.id)
                  .collection('messages')
                  .add({
                    created_time: Date.now(),
                    id: Date.now(),
                    message: text || '',
                    attachment: message.message,
                    from: {
                      id: senderId,
                      email: '',
                      name: sender.name,
                    },
                  });
              });
          });
        }
      });
  },

  // send comment
  sendComment: (senderId, pageId, postId, text, message, time) => {
    // console.log('sss', senderId, pageId, postId, text, message, time);
    // test check hide comment with email
    // console.log('comment', message);
    db.collection('pages_hide')
      .doc(pageId)
      .get()
      .then(response => {
        if (response && !response.error) {
          const page = response.data();

          if (page) {
            let hide = false;

            const isValid =
              (page.hide_phone && checkPhone(message.value.message)) ||
              (page.hide_email && checkEmail(message.value.message)) ||
              (page.blacklist &&
                page.blacklist.length > 0 &&
                checkBlackList(message.value.message, page.blacklist));

            if (isValid) {
              hide = true;
              hideComment(page, message);
            }

            if (
              message.value.verb === 'add' &&
              message.value.item === 'comment'
            ) {
              // const id_filter = `${postId}_${senderId}`;

              db.collection('user_activity')
                .where('type', '==', 'comment')
                .where('pageId', '==', pageId)
                .where('postId', '==', postId)
                .where('id', '==', message.value.parent_id)
                // .where('id_filter', '==', id_filter)
                // .where('type', '==', 'comment')
                .get()
                .then(snapshot => {
                  if (snapshot.empty) {
                    console.log('ko co');
                    db.collection('user_activity')
                      .add({
                        sender: {
                          id: senderId,
                          name: message.value.from.name,
                          email: '',
                        },
                        id: message.value.comment_id,

                        pageId,
                        postId,
                        actionType: 'add',
                        snippet: message.value.message || '',
                        message: message.value,
                        updatedTime: Date.now(),
                        startDate: Date.now(),
                        reply: false,
                        seen: false,

                        type: 'comment',
                      })
                      .then(res => {
                        db.collection('user_activity')
                          .doc(res.id)
                          .collection('comments')
                          .add({
                            // created_time: Date.now(),
                            created_time: moment().format(),
                            photo: message.value.photo || '',
                            from: {
                              id: senderId,
                              name: message.value.from.name,
                              email: '',
                            },
                            hide,
                            id: message.value.comment_id,
                            message: message.value.message || '',
                          });
                      });
                  } else {
                    console.log('co', senderId !== pageId);
                    snapshot.forEach(d => {
                      console.log('aaaaaaaaa', d.id);

                      db.collection('user_activity')
                        .doc(d.id)
                        .update({
                          actionType: 'add',
                          snippet: message.value.message || '',
                          message: message.value || '',
                          updatedTime: Date.now(),
                          reply: senderId !== d.data().sender.id,
                          seen: senderId === pageId,
                          type: 'comment',
                        });

                      db.collection('user_activity')
                        .doc(d.id)
                        .collection('comments')
                        .add({
                          // created_time: Date.now(),
                          created_time: moment().format(),
                          photo: message.value.photo || '',
                          from: {
                            id: senderId,
                            name: message.value.from.name,
                            email: '',
                          },
                          hide,
                          id: message.value.comment_id,
                          // id: postId,
                          message: message.value.message || '',
                        });
                    });
                  }
                });
            }
          } else if (
            message.value.verb === 'add' &&
            message.value.item === 'comment'
          ) {
            // const id_filter = `${postId}_${senderId}`;

            db.collection('user_activity')
              .where('type', '==', 'comment')
              .where('pageId', '==', pageId)
              .where('postId', '==', postId)
              .where('id', '==', message.value.parent_id)
              // .where('id_filter', '==', id_filter)
              // .where('type', '==', 'comment')
              .get()
              .then(snapshot => {
                if (snapshot.empty) {
                  console.log('ko co');
                  db.collection('user_activity')
                    .add({
                      sender: {
                        id: senderId,
                        name: message.value.from.name,
                        email: '',
                      },
                      id: message.value.comment_id,

                      pageId,
                      postId,
                      actionType: 'add',
                      snippet: message.value.message || '',
                      message: message.value,
                      updatedTime: Date.now(),
                      startDate: Date.now(),
                      reply: false,
                      seen: false,

                      type: 'comment',
                    })
                    .then(res => {
                      db.collection('user_activity')
                        .doc(res.id)
                        .collection('comments')
                        .add({
                          // created_time: Date.now(),
                          created_time: moment().format(),
                          photo: message.value.photo || '',
                          from: {
                            id: senderId,
                            name: message.value.from.name,
                            email: '',
                          },
                          hide: false,
                          id: message.value.comment_id,
                          message: message.value.message || '',
                        });
                    });
                } else {
                  console.log('co', senderId !== pageId);
                  snapshot.forEach(d => {
                    console.log('aaaaaaaaa', d.id);

                    db.collection('user_activity')
                      .doc(d.id)
                      .update({
                        actionType: 'add',
                        snippet: message.value.message || '',
                        message: message.value || '',
                        updatedTime: Date.now(),
                        reply: senderId !== d.data().sender.id,
                        seen: senderId === pageId,
                        type: 'comment',
                      });

                    db.collection('user_activity')
                      .doc(d.id)
                      .collection('comments')
                      .add({
                        // created_time: Date.now(),
                        created_time: moment().format(),
                        photo: message.value.photo || '',
                        from: {
                          id: senderId,
                          name: message.value.from.name,
                          email: '',
                        },
                        hide: false,
                        id: message.value.comment_id,
                        // id: postId,
                        message: message.value.message || '',
                      });
                  });
                }
              });
          }
        }
      })
      .catch(error => console.log(error));

    // end test check hide comment with email

    // tets
    // if (message.value.verb === 'add' && message.value.item === 'comment') {
    //   // const id_filter = `${postId}_${senderId}`;

    //   db.collection('user_activity')
    //     .where('type', '==', 'comment')
    //     .where('pageId', '==', pageId)
    //     .where('postId', '==', postId)
    //     .where('id', '==', message.value.parent_id)
    //     // .where('id_filter', '==', id_filter)
    //     // .where('type', '==', 'comment')
    //     .get()
    //     .then(snapshot => {
    //       if (snapshot.empty) {
    //         console.log('ko co');
    //         db.collection('user_activity')
    //           .add({
    //             sender: {
    //               id: senderId,
    //               name: message.value.from.name,
    //               email: '',
    //             },
    //             id: message.value.comment_id,

    //             pageId,
    //             postId,
    //             actionType: 'add',
    //             snippet: message.value.message || '',
    //             message: message.value,
    //             updatedTime: Date.now(),
    //             startDate: Date.now(),
    //             reply: false,
    //             seen: false,
    //             type: 'comment',
    //           })
    //           .then(res => {
    //             db.collection('user_activity')
    //               .doc(res.id)
    //               .collection('comments')
    //               .add({
    //                 //created_time: Date.now(),
    //                 created_time: moment().format(),
    //                 photo: message.value.photo || '',
    //                 from: {
    //                   id: senderId,
    //                   name: message.value.from.name,
    //                   email: '',
    //                 },
    //                 id: message.value.comment_id,
    //                 message: message.value.message || '',
    //               });
    //           });
    //       } else {
    //         console.log('co', senderId !== pageId);
    //         snapshot.forEach(d => {
    //           console.log('aaaaaaaaa', d.id);

    //           db.collection('user_activity')
    //             .doc(d.id)
    //             .update({
    //               actionType: 'add',
    //               snippet: message.value.message || '',
    //               message: message.value || '',
    //               updatedTime: Date.now(),
    //               reply: senderId !== d.data().sender.id,
    //               seen: senderId === pageId,
    //               type: 'comment',
    //             });

    //           db.collection('user_activity')
    //             .doc(d.id)
    //             .collection('comments')
    //             .add({
    //               // created_time: Date.now(),
    //               created_time: moment().format(),
    //               photo: message.value.photo || '',
    //               from: {
    //                 id: senderId,
    //                 name: message.value.from.name,
    //                 email: '',
    //               },
    //               id: message.value.comment_id,
    //               // id: postId,
    //               message: message.value.message || '',
    //             });
    //         });
    //       }
    //     });
    // }
  },
};
