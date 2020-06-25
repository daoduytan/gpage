import React from 'react';
import { Avatar } from 'antd';
import { useSelector } from 'react-redux';

import { HeaderStyle } from './style';
import BtnLogout from './BtnLogout';

const Header = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  return (
    <HeaderStyle>
      <div style={{ display: 'flex' }}>
        <Avatar icon="user" size={45} src={user.photoURL} />
        <span style={{ marginLeft: 5 }}>
          <strong>{user.displayName}</strong>
          <br />
          <BtnLogout />
        </span>
      </div>
    </HeaderStyle>
  );
};

export default Header;
