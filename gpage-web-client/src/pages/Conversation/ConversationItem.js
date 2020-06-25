import React from 'react';
import { Avatar, Icon, Button, Skeleton } from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';

import theme from '../../theme';
import { refs } from '../../api';

import { useConvs } from './context';
import Label from './Label';
import {
  ConversationItemStyle,
  ConversationItemContent,
  ConversationItemRight,
  LabelStyle
} from './style';
import { useNotification } from '../Customer/context';

// ConversationLabel
type ConversationLabelProps = {
  labels: any
};

const style = { margin: '1px 2px 1px 0' };

type IconTypeProps = {
  type: string,
  seen: boolean
};

const IconType = React.memo(({ type, seen }: IconTypeProps) => {
  const color = type === 'comment' ? theme.color.primary : 'red';

  return (
    <Icon
      type={type === 'comment' ? 'message' : 'mail'}
      theme={seen ? 'outlined' : 'filled'}
      style={{
        color
      }}
    />
  );
});

const ConversationLabel = ({ labels }: ConversationLabelProps) => {
  if (!labels || labels.length === 0) {
    return null;
  }
  return labels.map(l => (
    <Label
      active
      size="sm"
      key={l.id}
      label={l}
      callback={false}
      style={{ ...style, background: l.bg, color: l.color }}
    />
  ));
};

// ConversationItem
type ConversationItemProps = {
  conversation: {
    key: string,
    block: boolean,
    id: string,
    sender: any,
    reply: boolean,
    message: any,
    pageId: string,
    labels: any,
    snippet: any,
    updated_time: string,
    phone: any,
    type: string,
    seen: boolean,
    updatedTime: number,
    member: any
  }
};

const ConversationItem = ({ conversation }: ConversationItemProps) => {
  // const { removeNewMessage } = React.useContext(CustomerContext);
  const [loading, setLoading] = React.useState(true);
  // const [senderProfile, setSenderProfile] = React.useState({
  //   id: conversation.sender.id
  // });

  // console.log('conversation', conversation);

  const { selectConversation, state } = useConvs();
  const { selectConvs, removeNotification } = useNotification();
  const user = useSelector(({ authReducer }) => authReducer.user);
  const renderSnippet = () => {
    // console.log('ddadsasddaada');

    const { message, snippet } = conversation;

    // console.log(message, snippet);

    // if (message) {
    //   let text = '';

    //   if (message.text) {
    //     text = message.text;
    //   }

    //   if (message.photo) {
    //     text = conversation.reply ? 'You: gửi một ảnh' : 'Nhận một ảnh';
    //   }

    //   if (message.attachments) {
    //     if (message.sticker_id) {
    //       text = conversation.reply
    //         ? 'You: gửi một sticker'
    //         : 'Nhận một sticker';
    //     } else {
    //       text = conversation.reply ? 'You: gửi một ảnh' : 'Nhận một ảnh';
    //     }
    //   }

    //   if (text.length === 0) return snippet;

    //   return text;
    // }

    let text;

    if (message && message.photo) {
      text = conversation.reply ? 'You: gửi một ảnh' : 'Nhận một ảnh';
    }

    if (message && message.attachments) {
      if (message.sticker_id) {
        text = conversation.reply ? 'You: gửi một sticker' : 'Nhận một sticker';
      } else {
        text = conversation.reply ? 'You: gửi một ảnh' : 'Nhận một ảnh';
      }

      return text;
    }

    return snippet;
  };

  const { conversation_select } = state;

  const onClick = () => {
    if (!conversation_select || conversation_select.id !== conversation.id) {
      selectConversation(null);

      setTimeout(() => {
        selectConversation(conversation);
        selectConvs(conversation);
        removeNotification(conversation.key);

        const { sender, pageId } = conversation;

        if (conversation && !conversation.seen) {
          // removeNewMessage();
          refs.activitysRefs
            .where('pageId', '==', pageId)
            .where('sender.id', '==', sender.id)
            .get()
            .then(snapshot => {
              if (snapshot.docs.length > 0) {
                refs.activitysRefs
                  .where('pageId', '==', pageId)
                  .where('sender.id', '==', sender.id)
                  .get()
                  .then(snap => {
                    snap.forEach(d => {
                      refs.activitysRefs.doc(d.id).update({
                        actionType: 'edit',
                        seen: true
                      });
                    });
                  });
              }
            });
        }
      }, 50);
    }
  };

  React.useEffect(() => {
    if (user && conversation && !conversation.sender.update) {
      const page = user.facebookPages.find(p => p.id === conversation.pageId);

      if (page) {
        window.FB.api(
          `/${conversation.sender.id}`,
          {
            access_token: page.access_token,
            fields: 'name,picture'
          },
          response => {
            // console.log(response);

            if (response && !response.error) {
              if (conversation.sender && !conversation.sender.update) {
                refs.activitysRefs
                  .where('id', '==', conversation.id)
                  .get()
                  .then(snapshot => {
                    snapshot.forEach(snap => {
                      refs.activitysRefs.doc(snap.id).update({
                        sender: { ...response, update: true }
                      });
                    });
                  });

                setLoading(false);
              } else {
                setLoading(false);
              }
            } else {
              setLoading(false);
            }
          }
        );
      }
    } else {
      setLoading(false);
    }
  }, [conversation, user]);

  if (loading)
    return (
      <Skeleton
        loading={loading}
        paragraph={{ rows: 1 }}
        style={{ padding: 10 }}
        active
        avatar
        rows={1}
      />
    );

  const username = conversation.sender.name;
  const src = conversation.sender.picture
    ? conversation.sender.picture.data.url
    : '';

  // console.log('conversation', conversation);

  const today = moment().format('DD/MM/YYYY');
  const year = moment().format('YYYY');

  const time = () => {
    if (moment(conversation.updatedTime).format('DD/MM/YYYY') === today) {
      return moment(conversation.updatedTime).format('HH:mm');
    }

    if (moment(conversation.updatedTime).format('YYYY') === year) {
      return moment(conversation.updatedTime).format('DD/MM');
    }

    return moment(conversation.updatedTime).format('DD/MM/YY');
  };

  const page = user.facebookPages.find(p => p.id === conversation.pageId);

  return (
    <ConversationItemStyle
      onClick={onClick}
      active={conversation_select && conversation_select.id === conversation.id}
    >
      <Avatar icon="user" src={src} />

      <ConversationItemContent>
        <div className="username">
          <span>{username}</span>
          <Icon type="caret-right" style={{ fontSize: 12, marginLeft: 5 }} />
          <Avatar
            size={20}
            style={{ margin: '0 5px' }}
            src={page && page.picture && page.picture.data.url}
          />
        </div>

        <div>
          {conversation.member && (
            <LabelStyle
              style={{
                background: theme.color.primary,
                marginRight: 5
              }}
              size="sm"
              active
            >
              {conversation.member.displayName}
            </LabelStyle>
          )}
          <ConversationLabel labels={conversation.labels} />
        </div>
        <div
          className="message"
          style={{
            fontWeight: !conversation.seen ? 700 : 400,
            color: !conversation.seen ? theme.color.primary : 'inherit',
            fontSize: 12
          }}
        >
          {conversation.reply && <Icon type="rollback" />}
          {renderSnippet()}
        </div>
      </ConversationItemContent>

      <ConversationItemRight>
        <div className="date">{time()}</div>

        <div className="icon">
          {conversation.phone && (
            <Button
              shape="circle"
              icon="phone"
              size="small"
              style={{ marginRight: 5 }}
            />
          )}

          {conversation.block && (
            <Icon
              type="minus-circle"
              style={{
                color: 'red',
                marginRight: 5
              }}
              theme="filled"
            />
          )}

          <IconType type={conversation.type} seen={conversation.seen} />

          {/* <Icon
            type={conversation.type === 'comment' ? 'message' : 'mail'}
            theme={conversation.seen ? 'outlined' : 'filled'}
            style={{
              color: conversation.seen ? '#000' : theme.color.primary
            }}
          /> */}
        </div>
      </ConversationItemRight>
    </ConversationItemStyle>
  );
};

export default ConversationItem;
