import React from 'react';
import { Select, InputNumber } from 'antd';
import InputMoney from '../InputMoney';

type DiscountProps = {
  chiet_khau: {
    type: String,
    value: Number
  },
  changeCkhau: Function
};

const Discount = ({ chiet_khau, changeCkhau }: DiscountProps) => {
  const changeType = type => {
    changeCkhau({ ...chiet_khau, type });
  };

  const changeValue = value => {
    changeCkhau({ ...chiet_khau, value });
  };
  const renderInputValue = () => {
    if (!chiet_khau) return <InputMoney min={0} onChange={changeValue} />;

    const { type, value } = chiet_khau;
    if (type === '%')
      return (
        <InputNumber min={0} max={100} value={value} onChange={changeValue} />
      );

    return <InputMoney min={0} value={value} onChange={changeValue} />;
  };

  return (
    <div syle={{ display: 'flex' }}>
      <Select
        style={{ width: 70, marginRight: 3 }}
        defaultValue="money"
        onChange={changeType}
      >
        <Select.Option value="money">Tiền</Select.Option>
        <Select.Option value="percent">%</Select.Option>
      </Select>
      {renderInputValue()}
    </div>
  );
};

export default Discount;
