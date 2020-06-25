import React from 'react';
import { Select } from 'antd';

import { SelectStyle } from './style';
import { useStores } from '../Customer/context_store';

const { Option } = Select;

type StoreFilterProps = {
  selectStore: any,
  storeId: string
};

const StoreFilter = ({ selectStore, storeId }: StoreFilterProps) => {
  const { stores } = useStores();

  const onChange = value => {
    selectStore(value);
  };

  return (
    <SelectStyle
      showSearch
      style={{ minWidth: 150 }}
      placeholder="CHọn kho hàng"
      onChange={onChange}
      value={storeId}
    >
      <Option value={null}>Kho hàng</Option>
      {stores.map(store => (
        <Option value={store.id} key={store.id}>
          {store.ten}
        </Option>
      ))}
    </SelectStyle>
  );
};

export default StoreFilter;
