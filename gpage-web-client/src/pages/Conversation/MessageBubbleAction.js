import React, { memo } from 'react';
import { Icon, Tooltip } from 'antd';

import { MessageBubbleActionStyle } from './style';
import Like from './Like';
import Delete from './Delete';
import Hide from './Hide';

// action item
type ActionItemProps = {
  onClick: any,
  title: string,
  icon: string,
  active: boolean
};

export const ActionItem = ({
  onClick,
  active,
  title,
  icon
}: ActionItemProps) => {
  const color = active ? 'blue' : '#333';
  return (
    <span className="item" onClick={onClick} role="presentation">
      <Tooltip placement="top" title={title}>
        <Icon type={icon} style={{ color }} />
      </Tooltip>
    </span>
  );
};

type MessageBubbleActionProps = {
  handleMessage: Function,
  comment: boolean,
  isAdmin: boolean,
  content: any,
  access_token: string
};

const MessageBubbleAction = ({
  handleMessage,
  comment,
  content,
  isAdmin,
  access_token
}: MessageBubbleActionProps) => {
  const [is_delete, setDelete] = React.useState(content.delete || false);

  if (!comment) return null;

  const deleteComment = () => {
    setDelete(true);
  };

  if (is_delete)
    return (
      <MessageBubbleActionStyle isAdmin={isAdmin}>
        <small style={{ fontStyle: 'italic' }}>Bình luận này đã bị xóa!</small>
      </MessageBubbleActionStyle>
    );

  if (comment && isAdmin)
    return (
      <MessageBubbleActionStyle isAdmin>
        <Delete
          id={content.id}
          access_token={access_token}
          deleteComment={deleteComment}
        />
      </MessageBubbleActionStyle>
    );

  const { like, hide } = content;

  return (
    <MessageBubbleActionStyle>
      <Like like={like} id={content.id} access_token={access_token} />

      <Hide hide={hide} id={content.id} access_token={access_token} />
      <Delete
        id={content.id}
        access_token={access_token}
        deleteComment={deleteComment}
      />
      <ActionItem onClick={handleMessage} title="Nhắn tin" icon="mail" />
    </MessageBubbleActionStyle>
  );
};

export default memo(MessageBubbleAction);
