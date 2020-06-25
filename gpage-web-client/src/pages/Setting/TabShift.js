import React from 'react';
import { Row, Col, Card } from 'antd';

import { Scrollbars } from '../../components';
import { TabContentWrap } from './style';
import FormShift from './FormShift';
import ListShift from './ListShift';

const TabShift = () => {
  return (
    <div style={{ height: 'calc(100vh - 100px)' }}>
      <Scrollbars style={{ flex: 1 }}>
        <TabContentWrap>
          <Row gutter={30}>
            <Col span={16}>
              <ListShift />
            </Col>
            <Col span={8}>
              <Card type="inner" title="Thêm ca">
                <FormShift />
              </Card>
            </Col>
          </Row>
        </TabContentWrap>
      </Scrollbars>
    </div>
  );
};

export default TabShift;
