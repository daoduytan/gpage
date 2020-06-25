import React from 'react';
import { Card } from 'antd';

import ServicesTable from './ServicesTable';
import AddService from './AddService';

const AdminServices = () => {
  return (
    <Card title={<b>Danh sách dịch vụ</b>} type="inner" extra={<AddService />}>
      <ServicesTable />
    </Card>
  );
};

export default AdminServices;
