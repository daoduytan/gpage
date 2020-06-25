import React from 'react';
import { Link } from '@reach/router';
import { Card, Button, Empty, Tabs } from 'antd';

import { Loading, Scrollbars } from '../../components';
import { BaseLayout } from '../../layout';
import { ContentPage } from '../../layout/style';
import { refs } from '../../api';
import OrderDetailForm from './OrderDetailForm';
import OrderDetailHistory from './OrderDetailHistory';

const { TabPane } = Tabs;

export const caculatorMoney = order => {
  const tong_tien = order.list_order.reduce((value, o) => {
    const gia_product = value + o.gia_ban * o.so_luong;

    const chiet_khau = () => {
      if (!o.chiet_khau) return 0;
      if (o.chiet_khau.type === 'money') return o.chiet_khau.value || 0;
      if (o.chiet_khau.type === 'percent')
        return (gia_product * o.chiet_khau.value || 0) / 100;
      return o.chiet_khau.value;
    };

    return gia_product - chiet_khau();
  }, 0);

  const tien_chiet_khau =
    order.chiet_khau.type === 'tien'
      ? order.chiet_khau.value
      : (tong_tien * order.chiet_khau.value) / 100;

  const tien_coc = order.tien_coc || 0;
  const tien_chuyen_khoan = order.tien_chuyen_khoan || 0;

  return tong_tien - tien_chiet_khau - tien_coc - tien_chuyen_khoan;
};

function callback(key) {
  console.log(key);
}

type OrderDetailProps = {
  id: string
};

type OrderDetailState = {
  loading: boolean,
  order: any,
  order_local: any
};

class OrderDetail extends React.Component<OrderDetailProps, OrderDetailState> {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      order: null,
      order_local: null
    };
  }

  componentDidMount() {
    const { id } = this.props;

    if (!id) return null;

    try {
      return refs.ordersRefs.doc(id).onSnapshot(doc => {
        if (!doc.exists) {
          return this.setState({ loading: false });
        }

        const order = { ...doc.data(), id: doc.id };
        const order_local = { ...order, Width: 10, Height: 10, Length: 10 };

        this.setState({ order, order_local, loading: false });
      });
    } catch (error) {
      return this.setState({ loading: false });
    }
  }

  setOrderLocal = order_local => {
    this.setState({ order_local });
  };

  render() {
    const { loading, order_local, order } = this.state;

    if (loading)
      return (
        <div style={{ height: 300 }}>
          <Loading />
        </div>
      );

    if (!order_local) {
      return (
        <Card type="inner" style={{ margin: 30 }}>
          <Empty title="Không tìm thấy đơn hàng">
            <Link to="/customer/order">
              <Button type="primary" size="large">
                Trở lại đơn hàng
              </Button>
            </Link>
          </Empty>
        </Card>
      );
    }

    return (
      <BaseLayout title="Chi tiết đơn hàng">
        <Scrollbars style={{ height: '100vh' }}>
          {/* <TitlePage>
            <Link to="/customer/order">
              <Button icon="arrow-left" style={{ marginRight: 15 }} />
            </Link>
            <span className="title">Chi tiết đơn hàng</span>
          </TitlePage> */}

          <ContentPage>
            <Tabs
              defaultActiveKey="1"
              onChange={callback}
              tabBarExtraContent={
                <Link to="/customer/order">
                  <Button icon="arrow-left" style={{ marginRight: 10 }} />
                  Quay lại
                </Link>
              }
            >
              <TabPane tab="Chi tiết đơn hàng" key="1">
                <OrderDetailForm
                  order_local={order_local}
                  order={order}
                  setOrderLocal={this.setOrderLocal}
                />
              </TabPane>
              <TabPane tab="Lịch sử đơn hàng" key="2">
                <OrderDetailHistory order={order} />
              </TabPane>
            </Tabs>
          </ContentPage>
        </Scrollbars>
      </BaseLayout>
    );
  }
}

export default OrderDetail;
