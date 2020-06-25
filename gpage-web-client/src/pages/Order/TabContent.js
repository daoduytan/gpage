import React from 'react';
import { connect } from 'react-redux';

import TableOrder from './TableOrder';
import { refs } from '../../api';

type OrderProps = {
  user: {
    shopId: string
  },
  type: string
};

type OrderState = {
  orders: any
};

class TabContent extends React.Component<OrderProps, OrderState> {
  constructor(props) {
    super(props);

    this.state = {
      orders: []
    };
  }

  componentDidMount() {
    this.loadOrder();
  }

  loadOrder = () => {
    const { user, type } = this.props;
    const refsOrders = refs.ordersRefs.where('shopId', '==', user.shopId);

    if (user) {
      if (!type || type === 'all') {
        refsOrders.orderBy('date', 'desc').onSnapshot(snapDocs => {
          const orders = [];
          snapDocs.forEach(doc => {
            orders.push({ ...doc.data(), id: doc.id });
          });

          this.setState({ orders });
        });
      } else {
        refsOrders
          .where('status', '==', type)
          .orderBy('date', 'desc')
          .onSnapshot(snapDocs => {
            const orders = [];

            snapDocs.forEach(doc => {
              orders.push({ ...doc.data(), id: doc.id });
            });

            this.setState({ orders });
          });
      }
    }
  };

  render() {
    const { orders } = this.state;
    const { type } = this.props;

    return <TableOrder orders={orders} type={type} />;
  }
}

const enhace = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhace(TabContent);
