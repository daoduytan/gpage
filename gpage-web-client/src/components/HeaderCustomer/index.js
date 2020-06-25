import React, { memo } from 'react';

import { HeaderCustomerWrap } from './style';
import HeaderRight from './HeaderRight';
import HeaderLeft from './HeaderLeft';

const HeaderCustomer = () => {
  return (
    <HeaderCustomerWrap>
      <HeaderLeft />
      <HeaderRight />
    </HeaderCustomerWrap>
  );
};

export default memo(HeaderCustomer);
