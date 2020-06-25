import React from 'react';
import { Card, Button } from 'antd';
import { Link } from '@reach/router';

import theme from '../../theme';
import content from './content';

const ReAnabled = () => {
  return (
    <div style={{ margin: 30 }}>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 25, color: theme.color.secondary }}>
            {content.title}
          </h3>
          <p>{content.text}</p>
          <Link to="/customer/select-pages">
            <Button type="primary" size="large">
              Chọn page
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ReAnabled;
