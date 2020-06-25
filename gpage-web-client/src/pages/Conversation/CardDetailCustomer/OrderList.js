import React from 'react';
import { connect } from 'react-redux';
import { Table, Divider } from 'antd';
import moment from 'moment';

import { formatMoney } from '../../../ultils';
import { refs } from '../../../api';

const columns = [
  {
    title: 'Ngày',
    dataIndex: 'date',
    key: 'date',
    render: date => moment(date).format('DD/MM/YYYY')
  },
  {
    title: 'Tổng thu',
    dataIndex: '',
    key: 'price',
    render: ({ list_order }) =>
      formatMoney(
        list_order.reduce((number, d) => number + d.so_luong * d.gia_ban, 0)
      )
  }
];
const TableOrderList = ({ orders }: { orders: any }) => {
  const dataSource = orders.map(order => ({ ...order, key: order.id }));

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      bordered
      title={() => <span style={{ fontWeight: 600 }}>Đơn hàng</span>}
      pagination={false}
    />
  );
};

type OrderListProps = {
  user: {
    uid: String
  }
};

type OrderListState = {
  orders: any
};

class OrderList extends React.Component<OrderListProps, OrderListState> {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
  }

  componentDidMount() {
    const { user, customer } = this.props;
    if (user) {
      refs.ordersRefs
        .where('shopId', '==', user.shopId)
        .where('order_user_info.id', '==', customer.id)
        .onSnapshot(snapDoc => {
          snapDoc.docs.forEach(doc => {
            this.setState(prevState => ({
              orders: [...prevState.orders, { ...doc.data(), id: doc.id }]
            }));
          });
        });
    }
  }

  render() {
    const { orders } = this.state;

    if (orders.length === 0) return null;

    return (
      <>
        <Divider dashed style={{ margin: '15px 0' }} />
        <div style={{ padding: '0 15px' }}>
          <TableOrderList orders={orders} />
        </div>
      </>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(OrderList);
