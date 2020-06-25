import React from 'react';
import { Card } from 'antd';

import { ErrorLayoutStyle } from './style';

const ErrorLayout = () => {
  return (
    <ErrorLayoutStyle>
      <Card style={{ width: '100%', maxWidth: 500, textAlign: 'center' }}>
        <h1 style={{ fontWeight: '700', fontSize: 40, color: 'red' }}>404</h1>
        <p style={{ fontSize: 18 }}>Xảy ra lỗi, vui lòng reload lại trang.</p>
      </Card>
    </ErrorLayoutStyle>
  );
};

export default ErrorLayout;
