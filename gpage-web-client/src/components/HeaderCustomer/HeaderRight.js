// @flow
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from '@reach/router';
import { Avatar, Dropdown, Menu, Icon, Tag } from 'antd';

import theme from '../../theme';
import { logout } from '../../reducers/authState/authActions';
import HeaderService from './HeaderService';

const HeaderRight = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout());
  const color =
    user.licence.type === 'premium'
      ? theme.color.customer.premium
      : theme.color.customer.trial;

  const menu = (
    <Menu style={{ width: 200 }}>
      <Menu.Item key="1">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <b>{user.displayName}</b>
          <Tag style={{ marginRight: 0 }} color={color}>
            {user.licence.type === 'premium' ? 'Trả phí' : 'Dùng thử'}
          </Tag>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <HeaderService user={user} />
      </Menu.Item>
      <Menu.Divider />
      {user.role === 'admin' && (
        <Menu.Item key="2">
          <Link to="/customer/select-pages">
            <Icon type="appstore" style={{ marginRight: 15 }} />
            Chọn lại Fanpage
          </Link>
        </Menu.Item>
      )}

      <Menu.Item key="3" onClick={handleLogout}>
        <Icon type="logout" style={{ marginRight: 15 }} />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
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
  );
};

export default HeaderRight;
