// @flow
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../reducers/authState/authActions';
import { BtnLogoutStyle } from './style';

type BtnLogoutProps = { logout: Function };

const BtnLogout = ({ logout }: BtnLogoutProps) => (
  <BtnLogoutStyle onClick={logout}>Logout</BtnLogoutStyle>
);

const enhance = connect(
  null,
  { logout: actions.logout }
);

export default enhance(BtnLogout);
