import React from 'react';
import { Button } from 'antd';
import { ContextFormSetting } from './FormSetting';

import { FormGhn, FormGhtk } from '../Setting/ShipSetting';
import { Title } from './style';

const size = 'large';

const ShipSetting = () => {
  const { nextCurrent, prevCurrent } = React.useContext(ContextFormSetting);
  return (
    <>
      <Title>Cài đặt đơn vị giao hàng</Title>
      <FormGhn />
      <div style={{ marginTop: 15 }} />
      <FormGhtk />
      <div
        style={{
          marginTop: 15,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Button onClick={prevCurrent} size={size}>
          Quay lại
        </Button>
        <Button onClick={nextCurrent} size={size} type="primary">
          Lưu & Tiếp
        </Button>
      </div>
    </>
  );
};

export default ShipSetting;
