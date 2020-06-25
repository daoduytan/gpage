import React, { memo } from 'react';

import { refs } from '../../api';
import { useConvs } from './context';
import { Context } from './MessageBubble';
import { ActionItem } from './MessageBubbleAction';

// remove
type DeleteProps = {
  id: string,
  access_token: string,
  deleteComment: any
};

const Delete = ({ id, access_token, deleteComment }: DeleteProps) => {
  const { state } = useConvs();
  const { content } = React.useContext(Context);

  const { conversation_select } = state;

  const handleDeleteComment = () => {
    deleteComment();

    // console.log(id, conversation_select, content);

    window.FB.api(`/${id}`, 'DELETE', { access_token }, response => {
      if (response && !response.error) {
        /* handle the result */
        refs.activitysRefs
          .doc(conversation_select.key)
          .collection('comments')
          .doc(content.comment_uid)
          .update({ delete: true })
          .then(res => console.log('res', res));
      }
    });
  };

  return (
    <ActionItem
      onClick={handleDeleteComment}
      title="Xóa"
      icon="delete"
      active={false}
    />
  );
};

export default memo(Delete);
