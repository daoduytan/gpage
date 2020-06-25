import React from 'react';
import { Card } from 'antd';
import TableCustomer from './TableCustomer';

const AdminCustomer = () => {
  return (
    <Card type="inner" title={<b>Danh sách khách hàng</b>}>
      <TableCustomer />
    </Card>
  );
};

export default AdminCustomer;
