import React from 'react';
import { Select } from 'antd';

import { useStores } from '../Customer/context_store';

const SelectStore = ({ value, selectStore }) => {
  const { stores } = useStores();

  return (
    <Select style={{ width: '100%' }} onChange={selectStore} value={value}>
      <Select.Option value="all">Tất cả kho hàng</Select.Option>
      {stores.map(store => (
        <Select.Option key={store.id}>{store.ten}</Select.Option>
      ))}
    </Select>
  );
};

export default SelectStore;
