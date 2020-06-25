import React from 'react';
import { Card } from 'antd';
import theme from '../../theme';
import content from './content';

const Exprired = () => {
  return (
    <div style={{ margin: 30 }}>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 25, color: theme.color.secondary }}>
            {content.title}
          </h3>
          <p>{content.text}</p>
        </div>
      </Card>
    </div>
  );
};

export default Exprired;
