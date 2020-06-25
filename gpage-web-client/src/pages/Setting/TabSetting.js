import React from 'react';
import { Row, Col } from 'antd';

import { TabContentWrap } from './style';
// import { FormGhn, FormGhtk } from './ShipSetting';
import ShopSetting from './ShopSetting';
// import AccountInfo from './AccountInfo';

const TabSetting = () => {
  return (
    <TabContentWrap>
      <Row gutter={30} type="flex" justify="center">
        {/* <Col md={10}>
          Updating...
      
        </Col> */}
        <Col md={14}>
          <ShopSetting />
        </Col>
        {/* <Col md={8}>
          <FormGhn />
          <div style={{ marginBottom: 15 }} />
          <FormGhtk />
        </Col> */}
      </Row>
    </TabContentWrap>
  );
};

export default TabSetting;
