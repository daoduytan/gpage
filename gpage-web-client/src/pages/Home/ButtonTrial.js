import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '@reach/router';

import { login } from '../../reducers/authState/authActions';
import { ButtonTrialStyle } from './style';
import content from './content';

const ButtonTrial = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (user) {
      navigate('/customer/conversation');
    } else {
      dispatch(login());
    }
  };

  return (
    <ButtonTrialStyle size="large" onClick={handleLogin}>
      {content.banner.button}
    </ButtonTrialStyle>
  );
};

export default React.memo(ButtonTrial);
