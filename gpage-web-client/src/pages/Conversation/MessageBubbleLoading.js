import React, { memo } from 'react';
import { Icon } from 'antd';

import { MessageBubbleStyle, MessageBubbleLoadingStyle } from './style';
import { ContextDetail } from './ConversationDetail';

const MessageBubbleLoading = () => {
  const { draft_content } = React.useContext(ContextDetail);

  const { photos } = draft_content;

  const renderContent =
    photos.length > 0 ? (
      photos.map(photo => (
        <MessageBubbleStyle isAdmin type="image" key={photo.name}>
          <img className="img" src={photo.src} alt="" />
        </MessageBubbleStyle>
      ))
    ) : (
      <MessageBubbleStyle isAdmin type="text">
        <span>{draft_content.message}</span>
      </MessageBubbleStyle>
    );

  return (
    <MessageBubbleLoadingStyle>
      <div style={{ overflow: 'hidden' }}>{renderContent}</div>

      <span className="loading">
        <Icon type="loading" />
      </span>
    </MessageBubbleLoadingStyle>
  );
};

export default memo(MessageBubbleLoading);
