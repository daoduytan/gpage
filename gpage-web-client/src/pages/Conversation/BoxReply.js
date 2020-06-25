import React from 'react';
import { Context } from './ConversationAction';
import { BoxReplyInput } from './style';

const BoxReply = () => {
  const {
    handleReply,
    handlSelectMessage,
    setMessage,
    show_list_answer,
    message
  } = React.useContext(Context);

  const inputRef = React.useRef();

  const onChangeMessasge = e => {
    handlSelectMessage(e);
    // setMessage(e.target.value);
  };

  React.useEffect(() => {
    if (message.length !== 0) {
      inputRef.current.focus();
    }
  }, [message.length]);

  const handleKeyPress = e => {
    const isValid = e.shiftKey !== true && e.key === 'Enter';

    if (isValid && !show_list_answer) {
      e.preventDefault();
      return handleReply(e.target.value);
    }

    if (isValid && show_list_answer) {
      console.log('hello');
    }

    return null;
  };
  return (
    <BoxReplyInput
      ref={inputRef}
      value={message}
      onKeyPress={handleKeyPress}
      onChange={onChangeMessasge}
      placeholder="Viết tin nhắn....(Enter để gửi tin và Shift + Enter để xuống hàng)"
    />
  );
};

export default BoxReply;
