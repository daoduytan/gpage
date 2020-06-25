import React, { memo } from 'react';
import { InputNumber } from 'antd';

const InputMoney = props => {
  return (
    <InputNumber
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={value => value.replace(/vnd\s?|(,*)/g, '')}
      {...props}
    />
  );
};

export default memo(InputMoney);
