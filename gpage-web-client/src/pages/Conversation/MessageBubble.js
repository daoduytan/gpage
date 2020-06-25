// @flow
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { message, Modal } from 'antd';
import moment from 'moment';

import { Copy } from '../../components';
import { MessageBubbleStyle } from './style';
import { useConvs } from './context';
import MessageModal from './MessageModal';
import MessageBubbleLoading from './MessageBubbleLoading';
import MessageBubbleAction from './MessageBubbleAction';

// context
export const Context = React.createContext();

type MessageBubbleProps = {
  content: {
    id: string,
    message: string,
    sticker: any,
    attachments: any,
    from: {
      name: string
    },
    photo: string,
    attachment: any,
    created_time: any
  },
  isAdmin: boolean,
  comment?: boolean,
  loading?: boolean
};

const MessageBubble = ({
  content,
  isAdmin,
  comment,
  loading
}: MessageBubbleProps) => {
  const [visible, setVisible] = React.useState(false);
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { state } = useConvs();

  const { conversation_select } = state;

  const { facebookPages } = user;

  const { access_token } = facebookPages.find(
    page => page.id === conversation_select.pageId
  );

  const toggle = () => setVisible(!visible);

  const handleMessage = () => {
    toggle();
  };

  if (loading) return <MessageBubbleLoading />;

  const today = moment().format('DD/MM/YYYY');

  const time =
    moment(content.created_time).format('DD/MM/YYYY') === today
      ? `${moment(content.created_time).format('DD/MM/YYYY')} lúc ${moment(
          content.created_time
        ).format('HH:mm')}`
      : moment(content.created_time).format('DD/MM/YYYY');

  return (
    <Context.Provider
      value={{
        content
      }}
    >
      <div style={{ margin: '10px 0', clear: 'both' }}>
        {content.photo && (
          <MessageBubbleStyle isAdmin={isAdmin} type="image">
            <img className="img" src={content.photo} alt="" />
            <div className="info">
              <Copy
                text={content.from.name || conversation_select.sender.name}
                onCopy={() => message.success(`Copy tên`)}
              >
                <div className="name">{content.from.name}</div>
              </Copy>

              <span className="time">{time}</span>
            </div>
          </MessageBubbleStyle>
        )}

        {content.attachment &&
          content.attachment.attachments &&
          content.attachment.attachments.map(m => (
            <MessageBubbleStyle isAdmin={isAdmin} key={m.id} type="image">
              {/* {console.log('photo', content)} */}
              <img className="img" src={m.payload.url} alt="" />
              <div className="info">
                <Copy
                  text={content.from.name}
                  onCopy={() => message.success(`Copy tên`)}
                >
                  <div className="name">{content.from.name}</div>
                </Copy>
                <span className="time">{time}</span>
              </div>
            </MessageBubbleStyle>
          ))}
        {content.sticker && (
          <MessageBubbleStyle isAdmin={isAdmin} type="sticker">
            <img
              src={content.sticker}
              alt=""
              style={{ display: 'block', width: 70 }}
            />

            <div className="info">
              <Copy
                text={content.from.name}
                onCopy={() => message.success(`Copy tên`)}
              >
                <div className="name">{content.from.name}</div>
              </Copy>
              <span className="time">{time}</span>
            </div>
          </MessageBubbleStyle>
        )}

        {content.attachment && content.attachment.type === 'sticker' && (
          <MessageBubbleStyle isAdmin={isAdmin} type="image">
            <img
              src={content.attachment.media.image.src}
              alt=""
              style={{ display: 'block', width: 70 }}
            />

            <div className="info">
              <Copy
                text={content.from.name}
                onCopy={() => message.success(`Copy tên`)}
              >
                <div className="name">{content.from.name}</div>
              </Copy>
              <span>{time}</span>
            </div>
          </MessageBubbleStyle>
        )}
        {content.attachment && content.attachment.type === 'photo' && (
          <MessageBubbleStyle isAdmin={isAdmin} type="image">
            <img
              src={content.attachment.media.image.src}
              className="img"
              alt=""
            />

            <div className="info">
              <Copy
                text={content.from.name}
                onCopy={() => message.success(`Copy tên`)}
              >
                <div className="name">{content.from.name}</div>
              </Copy>

              <span className="time">{time}</span>
            </div>
          </MessageBubbleStyle>
        )}

        {content.message.length > 0 && (
          <MessageBubbleStyle isAdmin={isAdmin} type="text">
            <Copy
              text={content.message}
              onCopy={() => message.success(`Copy tin nhắn`)}
            >
              <span>{content.message}</span>
            </Copy>

            <div className="info">
              {content.from.name && content.from.name.length !== 0 && (
                <Copy
                  text={content.from.name}
                  onCopy={() => message.success(`Copy tên`)}
                >
                  <div className="name">{content.from.name}</div>
                </Copy>
              )}

              <span className="time">{time}</span>
            </div>
          </MessageBubbleStyle>
        )}
        <MessageBubbleAction
          handleMessage={handleMessage}
          comment={comment}
          isAdmin={isAdmin}
          content={content}
          access_token={access_token}
        />

        <Modal
          visible={visible}
          onCancel={toggle}
          footer={null}
          title={`Nhắn tin ${conversation_select.sender.name}`}
          bodyStyle={{ padding: 0 }}
        >
          <MessageModal
            content={content}
            conversation_select={conversation_select}
          />
        </Modal>
      </div>
    </Context.Provider>
  );
};

MessageBubble.defaultProps = {
  comment: false,
  loading: false
};

export default memo<MessageBubbleProps>(MessageBubble);
