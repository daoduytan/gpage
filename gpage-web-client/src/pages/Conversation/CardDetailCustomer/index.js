import React, { Suspense, lazy } from 'react';
import { Tabs } from 'antd';

import { Loading, Scrollbars } from '../../../components';

// import CustomerInfo from './CustomerInfo';
// import CreateOrder from './CreateOrder';
import { useConvs } from '../context';

const CustomerInfo = lazy(() => import('./CustomerInfo'));
const CreateOrder = lazy(() => import('./CreateOrder'));

const { TabPane } = Tabs;

const CardDetailCustomer = () => {
  const { state } = useConvs();
  const { conversation_select } = state;
  if (!conversation_select) return null;

  function callback(key) {
    console.log(key);
  }

  const height = 'calc(100vh - 50px - 45px - 16px - 80px)';

  const defaultActiveKey = '1';

  return (
    <Tabs defaultActiveKey={defaultActiveKey} onChange={callback}>
      <TabPane tab="Khách hàng" key="1">
        <Suspense fallback={<Loading />}>
          <Scrollbars style={{ height }}>
            <CustomerInfo />
          </Scrollbars>
        </Suspense>
      </TabPane>
      <TabPane tab="Tạo đơn" key="2">
        <Suspense fallback={<Loading />}>
          <CreateOrder />
        </Suspense>
      </TabPane>
    </Tabs>
  );
};

export default CardDetailCustomer;
