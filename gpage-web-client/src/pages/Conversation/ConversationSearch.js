import React from 'react';
import { Icon } from 'antd';

import { FormSearchStyle } from './style';
import { useConvs } from './context';

const ConversationSearch = () => {
  const { state, handleChangeText } = useConvs();
  const [text, setText] = React.useState('');
  const inputRef = React.useRef();

  React.useEffect(() => {
    setText(state.search_text);
  }, [state.search_text]);

  const focusInput = React.useCallback((e: any) => {
    if (e.code === 'F3') return inputRef.current.focus();

    return null;
  }, []);

  React.useEffect(() => {
    document.addEventListener('keydown', focusInput);

    return () => {
      document.removeEventListener('keydown', focusInput);
    };
  }, [focusInput]);

  const handleSubmit = e => {
    e.preventDefault();
    handleChangeText(text);
  };

  const onChange = e => setText(e.target.value);

  return (
    <FormSearchStyle className="formSearch" onSubmit={handleSubmit}>
      <span className="icon">
        <Icon type="search" style={{ fontSize: 20 }} />
      </span>
      <input
        onChange={onChange}
        value={text}
        placeholder="(F3) Tìm tên, số điện thoại khách hàng"
        ref={inputRef}
      />
    </FormSearchStyle>
  );
};

export default React.memo(ConversationSearch);
