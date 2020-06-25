import React from 'react';
import { Select } from 'antd';

import { SelectStyle } from './style';
import { useSuppliers } from '../Customer/context_suppliers';

const { Option } = Select;

type SupplierFilterProps = {
  supplierId: string,
  selectSupplier: any
};

const SupplierFilter = ({
  supplierId,
  selectSupplier
}: SupplierFilterProps) => {
  const { suppliers } = useSuppliers();
  const onChange = value => {
    selectSupplier(value);
  };

  return (
    <SelectStyle
      showSearch
      style={{ minWidth: 150 }}
      placeholder="Chọn nhà cung cấp"
      onChange={onChange}
      value={supplierId}
    >
      <Option value={null}>Nhà cung cấp</Option>
      {suppliers.map(supplier => (
        <Option value={supplier.id} key={supplier.id}>
          {supplier.ten}
        </Option>
      ))}
    </SelectStyle>
  );
};

export default SupplierFilter;
