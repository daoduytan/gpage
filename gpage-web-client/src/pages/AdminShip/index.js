import React from 'react';
import { Card, Tabs } from 'antd';

import shisp from './ships';

const { TabPane } = Tabs;

const AdminShip = () => {
  return (
    <Card type="inner" title="Dịch vụ vận chuyển" bodyStyle={{ padding: 0 }}>
      <Tabs defaultActiveKey="2">
        {shisp.map(ship => (
          <TabPane tab={<span>{ship.title}</span>} key={ship.id}>
            {ship.component}
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
};

export default AdminShip;
