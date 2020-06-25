import React from 'react';
import { Link } from '@reach/router';
import { useSelector } from 'react-redux';
import { Button } from 'antd';

import { ConversationBlankWrap } from './style';

const ConversationBlank = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  return (
    <ConversationBlankWrap>
      <div style={{ textAlign: 'center', padding: 10 }}>
        <h3 style={{ fontSize: 18, marginBottom: 15 }}>
          Không có hội thoại nào.
        </h3>
        <p>
          {user.role === 'member'
            ? 'Bạn đã hết ca trực'
            : 'Bạn có thể chọn lại page hoặc bỏ lọc hoại thoại'}
        </p>
        {user.role === 'admin' && (
          <Link to="/customer/select-pages">
            <Button type="primary">Chọn page</Button>
          </Link>
        )}
      </div>
    </ConversationBlankWrap>
  );
};

export default React.memo(ConversationBlank);
