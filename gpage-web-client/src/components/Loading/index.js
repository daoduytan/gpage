import React, { memo } from 'react';
import { Spin } from 'antd';

import { LoadingWrap } from './style';

const Loading = () => (
  <LoadingWrap>
    <Spin />
  </LoadingWrap>
);

export default memo(Loading);
