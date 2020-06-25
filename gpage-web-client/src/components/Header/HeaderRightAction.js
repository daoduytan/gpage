// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Icon, Dropdown, Menu } from 'antd';
import { Link } from '@reach/router';

import * as actions from '../../reducers/authState/authActions';

type HeaderUserActionsProps = {
  user: {
    type: string,
    username: string,
    displayName: string,
    photoURL: string
  },
  logout: Function
};

const HeaderUserActions = ({ user, logout }: HeaderUserActionsProps) => {
  if (!user) {
    return null;
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <b>{user.displayName}</b>
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item key="3" onClick={logout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const to =
    user.type === 'admin' ? '/admin/overview' : '/customer/conversation';

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Link to={to}>Vào trang quản trị</Link>

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

const enhance = connect(
  ({ authReducer }) => ({
    user: authReducer.user
  }),
  { logout: actions.logout }
);

export default enhance(HeaderUserActions);
