import React from 'react';
import { Divider } from 'antd';

import { useConvs } from '../context';
import FormInfoCustomer from './FormInfoCustomer';
import BadCustomer from './BadCustomer';
import CustomerNote from './CustomerNote';
import OrderList from './OrderList';

const CustomerInfo = () => {
  const { state } = useConvs();
  const conversation = state.conversation_select;

  if (!conversation) return null;
  return (
    <>
      <div style={{ padding: '0 15px' }}>
        <FormInfoCustomer />
        <BadCustomer />
      </div>
      <Divider dashed style={{ margin: '15px 0' }} />
      <div style={{ padding: '0 15px' }}>
        <CustomerNote />
      </div>

      <OrderList customer={conversation.sender} />
    </>
  );
};

export default CustomerInfo;
