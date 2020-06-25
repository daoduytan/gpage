// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from 'antd';

const AccountInfo = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  // const { licence } = user;

  // const time = licence.time || 15;

  // const time_expried = time * 24 * 60 * 60 * 1000;
  // const date_time_expried = licence.date_active + time_expried;
  // const now = Date.now();

  // const percent =
  //   now - date_time_expried > 0
  //     ? 100
  //     : (1 - (date_time_expried - now) / time_expried) * 100;
  // console.log(' now - date_time_expried', now - date_time_expried, percent);

  return (
    <div>
      <div>
        <Avatar /> {user.shop.name}
      </div>

      {/* <Progress percent={percent} showInfo={false} /> */}
    </div>
  );
};

export default AccountInfo;
