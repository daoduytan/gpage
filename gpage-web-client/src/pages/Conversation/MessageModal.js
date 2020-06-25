import React from 'react';
import { useSelector } from 'react-redux';
import { Input, Icon } from 'antd';
import Axios from 'axios';
import moment from 'moment';

import ListQuickAnwers from './ListQuickAnwers';
import theme from '../../theme';
import { ContextDetail } from './ConversationDetail';
import ListMessageModal from './ListMessageModal';
import { refs } from '../../api';

const { TextArea } = Input;

// MessageModal
type MessageModalProps = {
  content: any,
  conversation_select: any
};

const MessageModal = ({ content, conversation_select }: MessageModalProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { page } = React.useContext(ContextDetail);

  const inputRef = React.useRef();
  const [visible_quick_message, setVisibleQuickMessage] = React.useState(false);
  // const [messages, setMesasges] = React.useState([]);
  const [text, setText] = React.useState('');

  const onChange = e => setText(e.target.value);

  const toggle = () => setVisibleQuickMessage(!visible_quick_message);

  React.useEffect(() => {
    if (text.length === 1 && text === '/') {
      setVisibleQuickMessage(true);
    } else {
      setVisibleQuickMessage(false);
    }
  }, [text]);

  const handleSendMessage = () => {
    const url = `https://graph.facebook.com/v5.0/me/messages?access_token=${page.access_token}`;

    console.log('url,', url, content, text);

    Axios({
      url,
      method: 'POST',

      data: {
        recipient: {
          id: content.from.id
        },
        message: {
          text
        }
      }
    }).then(response => {
      console.log('dasdasd', response);
      refs.activitysRefs
        .where('type', '==', 'message')
        .where('pageId', '==', conversation_select.pageId)
        .where('sender.id', '==', content.from.id)
        .get()
        .then(snap => {
          if (snap.empty) {
            const item = {
              snippet: text,
              id: response.data.message_id,
              sender: conversation_select.sender,
              seen: true,
              startDate: moment().valueOf(),
              updatedTime: moment().valueOf(),
              type: 'message',
              pageId: page.id,
              reply: true
            };

            refs.activitysRefs.add(item).then(rs => {
              refs.activitysRefs
                .doc(rs.id)
                .collection('messages')
                .add({
                  created_time: moment().valueOf(),
                  from: {
                    id: page.id,
                    email: user.email,
                    name: user.displayName
                  },
                  id: rs.id,
                  message: text
                });
            });
          } else {
            // const a = snap.docs[0].data();

            refs.activitysRefs.doc(snap.docs[0].id).update({
              snippet: text,
              reply: true
            });

            refs.activitysRefs
              .doc(snap.docs[0].id)
              .collection('messages')
              .add({
                created_time: moment().format(),
                id: response.data.message_id,
                message: text,
                from: {
                  id: page.id,
                  email: user.email,
                  name: user.displayName
                }
              });
          }
        });

      // .doc(conversation_select.key)
      // .collection('messages')
      // .add({
      //   created_time: moment().format(),
      //   id: response.data.message_id,
      //   message: text,
      //   from: {
      //     id: page.id,
      //     email: user.email,
      //     name: user.displayName
      //   }
      // });
    });
    setText('');
  };

  const handleKeyPress = e => {
    const isValid = e.shiftKey !== true && e.key === 'Enter';

    if (isValid && !visible_quick_message) {
      e.preventDefault();
      return handleSendMessage(e.target.value);
    }

    return null;
  };

  return (
    <div>
      <div style={{ height: 320, paddingBottom: 15 }}>
        <ListMessageModal conversation_select={conversation_select} />
      </div>
      {/* <div>{renderMesasges()}</div> */}
      <div
        style={{
          borderTop: `1px solid ${theme.color.border}`,
          position: 'relative'
        }}
      >
        {visible_quick_message && <ListQuickAnwers />}
        <TextArea
          ref={inputRef}
          autoFocus
          value={text}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          style={{ border: 'none' }}
          placeholder="Nhập tin nhắn...  [Nhấn Enter để gửi, Shift + Enter để xuống dòng]"
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 10,

            borderTop: `1px solid ${theme.color.border}`
          }}
        >
          <span>Gõ &quot;/ + phím tắt&quot; để lấy tin nhắn nhanh</span>
          <div
            style={{
              height: 45,
              lineHeight: '45px',
              padding: '0 10px',
              borderLeft: `1px solid ${theme.color.border}`
            }}
            onClick={toggle}
            role="presentation"
          >
            <Icon type="message" />
            Trả lời nhanh
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
