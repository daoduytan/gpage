// @flow
import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { Button } from 'antd';

import HeaderRightAction from './HeaderRightAction';

const HeaderRightProps = {
  isAuth: Boolean,
  login: Function
};

const HeaderRight = ({ isAuth }: HeaderRightProps) => {
  if (!isAuth)
    return (
      <Link to="/login">
        <Button icon="user" size="large" type="primary">
          Đăng nhập
        </Button>
      </Link>
    );
  return <HeaderRightAction />;
};

const enhance = connect(({ authReducer }) => ({ isAuth: authReducer.isAuth }));

export default enhance(HeaderRight);
