import React, { type Node } from 'react';
import { Scrollbars } from '../../components';

const Order = ({ children }: { children: Node }) => (
  <Scrollbars style={{ height: 'calc(100vh - 50px)' }}>{children}</Scrollbars>
);

export default Order;
