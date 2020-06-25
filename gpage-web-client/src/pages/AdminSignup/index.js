import React from 'react';
import { Card } from 'antd';

import FormAdminSignup from './FormAdminSignup';
import { AdminSignupWrap } from './style';

const AdminSignup = () => {
  return (
    <AdminSignupWrap>
      <Card type="inner" style={{ maxWidth: 300, width: '100%' }}>
        <FormAdminSignup />
      </Card>
    </AdminSignupWrap>
  );
};

export default AdminSignup;
