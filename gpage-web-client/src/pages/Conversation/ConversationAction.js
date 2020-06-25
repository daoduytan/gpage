// @flow
import React from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';
import moment from 'moment';

import { useConvs } from './context';
import BoxReply from './BoxReply';
import LabelList from './LabelList';
import ActionBottom from './ActionBottom';
import ListQuickAnwers from './ListQuickAnwers';
import { refs } from '../../api';
import { ContextDetail } from './ConversationDetail';

const url = 'https://graph.facebook.com/v4.0/me/messages?access_token=';

const initialContext = {
  mesasge: '',
  show_list_question: false,
  handleSendMessage: () => {},
  attachs: []
};
export const Context = React.createContext(initialContext);

type ConversationActionProps = {
  setLoading: Function
};

const ConversationAction = ({ setLoading }: ConversationActionProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { state } = useConvs();
  const { setDraftContent } = React.useContext(ContextDetail);
  const [show_list_answer, setShowListAnswer] = React.useState(false);
  const [attachs, setAttachs] = React.useState([]);
  const [message, setMessage] = React.useState('');

  const { conversation_select } = state;

  if (!conversation_select) return null;

  const { type, pageId, sender } = conversation_select;

  const page = user.facebookPages.find(p => p.id === pageId);
  const idSender = sender.id;

  /**
   * Reply
   * 1. send message
   *  -  send image
   *  -  send text
   */

  //  send messsage

  const sendMessage = () => {
    if (!show_list_answer) {
      // if no image attach
      if (attachs.length === 0) {
        setTimeout(() => {
          Axios({
            url: `${url}${page.access_token}`,
            method: 'POST',
            data: {
              recipient: {
                id: idSender
              },
              message: {
                text: message
              }
            }
          })
            .then(response => {
              // setLoading(false);

              // console.log('message', message, conversation_select);

              refs.activitysRefs.doc(conversation_select.key).update({
                snippet: message,
                reply: true
              });

              refs.activitysRefs
                .doc(conversation_select.key)
                .collection('messages')
                .add({
                  created_time: moment().valueOf(),
                  id: response.data.message_id,
                  seen: true,
                  message,
                  from: {
                    id: page.id,
                    email: user.email,
                    name: user.displayName
                  }
                });

              // console.log('oke');
            })
            .catch(error => {
              setLoading(false);

              console.log('error', error.message);

              Modal.error({
                title: 'Lỗi gửi tin nhắn',
                content:
                  'Người này quá lâu không tương tác với page, bạn không thể gửi tin nhắn cho họ.'
              });
            });

          setMessage('');
        }, 300);
      } else {
        let index = 0;
        attachs.forEach(a => {
          Axios({
            url: `${url}${page.access_token}`,
            method: 'POST',

            data: {
              recipient: {
                id: idSender
              },
              message: {
                attachment: {
                  type: 'image',
                  payload: {
                    url: a.src,
                    is_reusable: true
                  }
                }
              }
            }
          }).then(response => {
            index += 1;

            refs.activitysRefs
              .doc(conversation_select.key)
              .collection('messages')
              .add({
                created_time: moment().valueOf(),
                id: response.data.message_id,
                attachment: {
                  attachments: [
                    {
                      payload: {
                        url: a.src,
                        type: 'image'
                      }
                    }
                  ]
                },
                message: '',
                from: {
                  id: page.id,
                  email: user.email,
                  name: user.displayName
                }
              });

            if (index === attachs.length) {
              setAttachs([]);

              if (message.length > 0) {
                setTimeout(() => {
                  Axios({
                    url: `${url}${page.access_token}`,
                    method: 'POST',
                    data: {
                      recipient: {
                        id: idSender
                      },
                      message: {
                        text: message
                      }
                    }
                  })
                    .then(res => {
                      // setLoading(false);

                      // console.log('message', message, conversation_select);

                      refs.activitysRefs.doc(conversation_select.key).update({
                        snippet: message,
                        reply: true
                      });

                      refs.activitysRefs
                        .doc(conversation_select.key)
                        .collection('messages')
                        .add({
                          created_time: moment().valueOf(),
                          id: res.data.message_id,
                          seen: true,
                          message,
                          from: {
                            id: page.id,
                            email: user.email,
                            name: user.displayName
                          }
                        });

                      // console.log('oke');
                    })
                    .catch(error => {
                      setLoading(false);

                      console.log('error', error.message);

                      Modal.error({
                        title: 'Lỗi gửi tin nhắn',
                        content:
                          'Người này quá lâu không tương tác với page, bạn không thể gửi tin nhắn cho họ.'
                      });
                    });

                  setMessage('');
                }, 300);

                // Axios({
                //   url: `${url}${page.access_token}`,
                //   method: 'POST',

                //   data: {
                //     recipient: {
                //       id: idSender
                //     },
                //     message: {
                //       // send with text
                //       text: message
                //     }
                //   }
                // }).then(() => {});
                // setMessage('');
                setLoading(false);
              } else {
                setLoading(false);
              }
            }
          });
        });
      }
    }
  };

  const sendCommentText = () => {
    if (!message || message.length === 0) return null;

    setMessage('');

    return window.FB.api(
      `/${conversation_select.id}/comments`,
      'POST',
      {
        access_token: page.access_token,
        message
      },
      res => {
        // console.log(res);
        if (res && !res.error) {
          /* handle the result */

          // setLoading(false);
          console.log(res);
        } else {
          setLoading(false);
        }
      }
    );
  };

  const sendCommentImg = () => {
    attachs.forEach((a, index) => {
      window.FB.api(
        `/${conversation_select.id}/comments`,
        'POST',
        {
          access_token: page.access_token,
          attachment_url: a.src
        },
        response => {
          if (response && !response.error) {
            /* handle the result */

            if (index === attachs.length - 1) {
              sendCommentText();
              setAttachs([]);
              // setLoading(false);
            }
          } else {
            // setLoading(false);
          }
        }
      );
    });
  };

  const sendComment = () => {
    if (!attachs || attachs.length === 0) {
      sendCommentText();
    } else {
      sendCommentImg();
    }
  };

  const handleReply = () => {
    // loading when send
    setLoading(true);

    setDraftContent({
      photos: attachs,
      message
    });

    // send message
    if (type === 'message') {
      sendMessage();
    } else {
      sendComment();
    }
  };

  const handlSelectMessage = e => {
    setMessage(e.target.value);
    if (e.target.value[0] === '/') {
      setShowListAnswer(true);
    } else {
      setShowListAnswer(false);
    }
  };

  return (
    <Context.Provider
      value={{
        handleReply,
        message,
        attachs,
        setMessage,
        setAttachs,
        handlSelectMessage,
        setShowListAnswer,
        show_list_answer
      }}
    >
      <div style={{ position: 'relative' }}>
        {show_list_answer && <ListQuickAnwers />}
        <LabelList />
        <BoxReply />
        <ActionBottom />
      </div>
    </Context.Provider>
  );
};

export default ConversationAction;
