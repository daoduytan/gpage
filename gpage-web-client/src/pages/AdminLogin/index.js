import React from 'react';
import { Card } from 'antd';

import FormAdminLogin from './FormAdminLogin';
import { AdminLoginWrap } from '../AdminCustomer/style';

const AdminLogin = () => {
  return (
    <AdminLoginWrap>
      <Card type="inner" style={{ maxWidth: 300, width: '100%' }}>
        <FormAdminLogin />
      </Card>
    </AdminLoginWrap>
  );
};

export default AdminLogin;
