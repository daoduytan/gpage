import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Avatar, Icon, Menu } from 'antd';
import { logout } from '../../reducers/authState/authActions';

const HeaderAdminRight = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout());

  const menu = (
    <Menu>
      <Menu.Item>
        <b>{user.displayName || 'Admin'}</b>
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item key="3" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginLeft: 10
          }}
        >
          <Avatar icon="user" src={user.photoURL} />
          <Icon type="down" style={{ fontSize: 12, marginLeft: 5 }} />
        </div>
      </Dropdown>
    </div>
  );
};

export default HeaderAdminRight;
