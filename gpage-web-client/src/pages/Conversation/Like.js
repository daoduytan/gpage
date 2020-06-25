// @flow
import React, { memo } from 'react';

import { refs } from '../../api';

import { useConvs } from './context';
import { Context } from './MessageBubble';
import { ActionItem } from './MessageBubbleAction';

// like
type LikeProps = {
  like: boolean,
  id: string,
  access_token: string
};

const Like = ({ like, id, access_token }: LikeProps) => {
  const { state } = useConvs();
  const { content } = React.useContext(Context);
  const [active, setActive] = React.useState(like || false);

  const { conversation_select } = state;

  const toggle = () => setActive(!active);

  const likeFunc = () => {
    window.FB.api(`/${id}/likes`, 'POST', { access_token }, response => {
      if (response && !response.error) {
        toggle();
        refs.activitysRefs
          .doc(conversation_select.key)
          .collection('comments')
          .doc(content.comment_uid)
          .update({ like: true });
      }
    });
  };

  const unlikeFun = () => {
    window.FB.api(`/${id}/likes`, 'DELETE', { access_token }, response => {
      if (response && !response.error) {
        refs.activitysRefs.doc(conversation_select.key).update({
          'post_content.like': false
        });
        toggle();
      }
    });
  };

  const toggleLike = () => {
    if (active) return unlikeFun();
    return likeFunc();
  };

  return (
    <ActionItem
      onClick={toggleLike}
      title={like ? 'Bỏ  thích' : 'Thích'}
      icon="like"
      active={active}
    />
  );
};

export default memo(Like);
