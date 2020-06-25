import React from 'react';
import { Link } from '@reach/router';
import { useSelector } from 'react-redux';
import { Menu, Dropdown, Button, Modal } from 'antd';

import { refs } from '../../api';
import PrintOrder from '../OrderDetail/PrintOrder';

// action
type OrderProps = { order: any };

const Action = ({ order }: OrderProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  const removeOrder = () => {
    if (user) {
      refs.ordersRefs.doc(order.id).delete();
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: 'Xóa đơn hàng?',
      content: 'Bạn chắc chắn muốn xóa đơn hàng?',
      onOk() {
        removeOrder();
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  const onAfterPrint = () => {};

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to={`${order.id}`}>Sửa</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <PrintOrder order={order} title="In" onAfterPrint={onAfterPrint} />
      </Menu.Item>

      <Menu.Item key="2" onClick={showConfirm}>
        Xóa
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button icon="ellipsis" />
    </Dropdown>
  );
};

export default React.memo(Action);
