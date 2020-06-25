import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Avatar, message, Icon, Tooltip, Modal, Tag } from 'antd';

import { Copy } from '../../components';
import { refs, firebaseApi } from '../../api';

import {
  Column,
  TopNameStyle,
  ConvsDetailTop,
  TopAction,
  PageAction
} from './style';
import MessageList from './MessageList';
import ConversationAction from './ConversationAction';
import { useConvs } from './context';

// context
const ContextDetail = React.createContext();

const base_url = 'https://facebook.com';

const Page = ({ pageId }: { pageId: String }) => {
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(null);
  const user = useSelector(({ authReducer }) => authReducer.user);

  React.useEffect(() => {
    if (user) {
      const { facebookPages } = user;
      const page_exist = facebookPages.find(p => p.id === pageId);

      window.FB.api(
        `/${pageId}`,

        {
          fields: ['name', 'picture'],
          access_token: page_exist.access_token
        },
        response => {
          if (response && !response.error) {
            setPage(response);
          }
          setLoading(false);
        }
      );
    }
  }, [pageId, user]);

  if (user && loading) return null;

  return (
    <PageAction>
      <a
        href={`${base_url}/${page && page.name}-${page && page.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Tooltip placement="bottom" title={page && page.name}>
          <Avatar src={page && page.picture.data.url} />
        </Tooltip>
      </a>
    </PageAction>
  );
};

// toggle block
type ToggleBlockProps = {
  conversation: any,
  page: {
    id: string,
    access_token: string
  }
};

const ToggleBlock = ({ conversation, page }: ToggleBlockProps) => {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [active, setActive] = React.useState(conversation.block || false);

  const toggle = () => setVisible(!visible);

  const unBlock = () => {
    window.FB.api(
      `/${page.id}/blocked`,
      'DELETE',
      {
        psid: conversation.sender.id,
        access_token: page.access_token
      },
      response => {
        if (!response || response.error) {
          // console.log(response);
          message.error('Lỗi khi bỏ chặn người dùng');
        } else {
          refs.activitysRefs
            .where('sender.id', '==', conversation.sender.id)
            .get()
            .then(snapshot => {
              snapshot.docs.forEach(doc => {
                refs.activitysRefs.doc(doc.id).update({
                  block: false
                });
              });
              toggle();
              setLoading(false);
              setActive(false);
            });
        }
      }
    );
  };

  const setBlock = () => {
    window.FB.api(
      `/${page.id}/blocked`,
      'POST',
      {
        psid: [`${conversation.sender.id}`],
        access_token: page.access_token
      },
      response => {
        if (!response || response.error) {
          // console.log(response);
          message.error('Lỗi khi chặn người dùng');
        } else {
          refs.activitysRefs
            .where('sender.id', '==', conversation.sender.id)
            .get()
            .then(snapshot => {
              snapshot.docs.forEach(doc => {
                refs.activitysRefs.doc(doc.id).update({
                  block: true
                });
              });
              toggle();
              setLoading(false);
              setActive(true);
            });
        }
      }
    );
  };

  const toggleBlock = () => {
    setLoading(true);

    if (active) {
      unBlock();
    } else {
      setBlock();
    }
  };

  const color = '#f50';
  const title = active ? (
    <>
      Bỏ chặn khách hàng <Tag color={color}>{conversation.sender.name}</Tag>
    </>
  ) : (
    <>
      Xác nhận chặn khách hàng{' '}
      <Tag color={color}>{conversation.sender.name}</Tag>
    </>
  );
  const content = active
    ? 'Sau khi bỏ chặn, khách hàng sẽ có thể Like, Share, gửi bình luận / tin nhắn với fanpage.'
    : 'Sau khi bị chặn, khách hàng sẽ không thể Like, Share, gửi bình luận / tin nhắn với fanpage nữa.';

  const style = {
    color: active ? 'red' : 'rgba(0, 0, 0, 0.65)'
  };

  const tooltip = active ? 'Bỏ chặn khách hàng' : 'Chặn khách hàng';

  const okText = active ? 'Bỏ chặn' : 'Chặn';
  return (
    <>
      <Tooltip placement="bottom" title={tooltip}>
        <Icon type="minus-circle" onClick={toggle} style={style} />
      </Tooltip>

      <Modal
        width={360}
        visible={visible}
        title={title}
        onOk={toggleBlock}
        okText={okText}
        confirmLoading={loading}
        onCancel={toggle}
        cancelText="Hủy"
      >
        {content}
      </Modal>
    </>
  );
};

const Top = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { state, selectConversation } = useConvs();
  const { conversation_select } = state;

  if (!conversation_select) return null;

  const username = conversation_select.sender.name;
  const src = conversation_select.sender.picture
    ? conversation_select.sender.picture.data.url
    : null;

  const page = user.facebookPages.find(
    p => p.id === conversation_select.pageId
  );

  const endpoint =
    conversation_select.type === 'message'
      ? `${conversation_select.pageId}/inbox/${conversation_select.sender.id}`
      : `${conversation_select.postId}`;

  const removeCons = () => {
    const { key, type } = conversation_select;

    firebaseApi
      .delete_conversation({ key, type })
      .then(res => {
        refs.activitysRefs
          .doc(conversation_select.key)
          .delete()
          .then(() => {
            selectConversation(null);
            message.success('Xóa thành công');
          });
      })
      .catch(error => {
        message.error('Xóa thất bại');
      });
  };

  const setNotSeen = () => {
    const test = conversation_select && conversation_select;
    selectConversation(null);

    if (test) {
      setTimeout(() => {
        refs.activitysRefs.doc(test.key).update({
          seen: false
        });
      }, 300);
    }
  };

  return (
    <ConvsDetailTop>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar icon="user" src={src} />
        <div style={{ marginLeft: 10, lineHeight: 1 }}>
          <Copy
            text={username}
            onCopy={() => message.success(`Copy: ${username}`)}
          >
            <div>
              <TopNameStyle>{username}</TopNameStyle>
            </div>
          </Copy>

          <small>
            {moment(conversation_select.updated_time).format(
              'DD-MM-YYYY HH:mm'
            )}
          </small>
        </div>
      </div>
      <TopAction>
        <span className="item">
          <Tooltip placement="bottom" title="Xóa">
            <Icon type="delete" onClick={removeCons} />
          </Tooltip>
        </span>

        <span className="item">
          <ToggleBlock conversation={conversation_select} page={page} />
        </span>

        <span className="item">
          <Tooltip placement="bottom" title="Đánh dấu chưa đọc">
            <Icon type="pushpin" onClick={setNotSeen} />
          </Tooltip>
        </span>

        <a
          className="item"
          href={`${base_url}/${endpoint}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Tooltip placement="bottom" title="Xem trên facebook">
            <Icon type="facebook" />
          </Tooltip>
        </a>

        <Page pageId={conversation_select.pageId} />
      </TopAction>
    </ConvsDetailTop>
  );
};

const ConversationDetail = () => {
  const [loading, setLoading] = React.useState(false);
  const [draft_content, setDraftContent] = React.useState({
    photos: [],
    message: null
  });

  const user = useSelector(({ authReducer }) => authReducer.user);

  const { state } = useConvs();
  const { conversation_select } = state;

  const { facebookPages } = user;

  const page = conversation_select
    ? facebookPages.find(p => p.id === conversation_select.pageId)
    : null;

  return (
    <ContextDetail.Provider value={{ page, draft_content, setDraftContent }}>
      <Column>
        <div className="columnTop">
          <Top />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <MessageList loading_send={loading} setLoadingSend={setLoading} />

          <ConversationAction setLoading={setLoading} />
        </div>
      </Column>
    </ContextDetail.Provider>
  );
};

export { ConversationDetail as default, ContextDetail };
