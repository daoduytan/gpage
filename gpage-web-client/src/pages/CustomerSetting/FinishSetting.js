import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import { navigate } from '@reach/router';

import { refs } from '../../api';
import { loadUserDone } from '../../reducers/authState/authActions';
import { Title } from './style';

const FinishSetting = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const dispatch = useDispatch();
  const finish = () => {
    refs.usersRefs
      .doc(user.shopId)
      .update({
        init: true
      })
      .then(() => {
        refs.usersRefs
          .doc(user.shopId)
          .get()
          .then(doc => {
            const newUser = { ...doc.data() };
            dispatch(loadUserDone(newUser));
            navigate('/customer/conversation');
          });
      });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Title>Hoàn thành cài đặt</Title>
      <p>
        Cảm ơn bạn đã sử dụng dịch vụ. Bấm vào nút dưới để hoàn tất việc đăng ký
        và sử dụng dịch vụ.
      </p>
      <Button type="primary" size="large" onClick={finish}>
        Hoàn thành
      </Button>
    </div>
  );
};

export default FinishSetting;
