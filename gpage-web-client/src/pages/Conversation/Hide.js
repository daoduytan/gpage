import React, { memo } from 'react';

import { refs } from '../../api';
import { useConvs } from './context';
import { Context } from './MessageBubble';
import { ActionItem } from './MessageBubbleAction';

// hide
type HideProps = {
  hide: boolean,
  id: string,
  access_token: string
};

const Hide = ({ id, hide, access_token }: HideProps) => {
  const [active, setActive] = React.useState(hide || false);
  const { state } = useConvs();
  const { content } = React.useContext(Context);

  const { conversation_select } = state;

  const hideComment = () => {
    setActive(true);
    refs.activitysRefs
      .doc(conversation_select.key)
      .collection('comments')
      .doc(content.comment_uid)
      .update({ hide: true });
    window.FB.api(
      `/${id}`,
      'POST',
      {
        is_hidden: true,
        access_token
      },
      response => {
        // console.log(response);

        if (response && !response.error) {
          /* handle the result */
        }
      }
    );
  };
  const showComment = () => {
    setActive(false);
    refs.activitysRefs
      .doc(conversation_select.key)
      .collection('comments')
      .doc(content.comment_uid)
      .update({ hide: false });
    window.FB.api(
      `/${id}`,
      'POST',
      {
        is_hidden: false,
        access_token
      },
      response => {
        console.log(response);
        if (response && !response.error) {
          /* handle the result */
        }
      }
    );
  };

  const toggleHideComment = () => {
    if (!active) return hideComment();
    return showComment();
  };

  return (
    <ActionItem
      onClick={toggleHideComment}
      title="Ẩn"
      icon="eye-invisible"
      active={active}
    />
  );
};

export default memo(Hide);
