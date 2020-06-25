import React from 'react';
import { useSelector } from 'react-redux';
import {
  Row,
  Col,
  Card,
  Input,
  Form,
  Divider,
  Button,
  message,
  Spin,
  Tag,
  InputNumber
} from 'antd';

import { refs, shipApi } from '../../api';
import { Discount, InputMoney } from '../../components';
import ChangeStatus from '../Order/ChangeStatus';
import ShipStatus from '../Order/ShipStatus';

import { Title } from './style';
import TableOrderList from './TableOrderList';
import OrderAddress from './OrderAddress';
import TableTotal from './TableTotal';
import ProductAutocomplete from './ProductAutocomplete';
import Shipping from './Shipping';
import PrintOrder from './PrintOrder';
import { formatDataOrderShipGhn, formatDataOrderShipGhtk } from './util';
import TableShip from './TableShip';

const { TextArea } = Input;

const style = { marginBottom: 5 };

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 }
};
const formItemLayout1 = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

type OrderDetailFormProps = {
  order: any,
  order_local: any,
  setOrderLocal: any
};

const OrderDetailForm = ({
  order,
  order_local,
  setOrderLocal
}: OrderDetailFormProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [save_loading, setSaveLoading] = React.useState(false);
  const [loading_ship, setLoadingSet] = React.useState(false);

  const onChange = e => {
    setOrderLocal({
      ...order_local,
      [e.target.name]: e.target.value
    });
  };

  const updateAddress = addressInfo => {
    setOrderLocal({ ...order_local, addressInfo });
  };

  const createOrderShipGhn = async () => {
    try {
      const data = await formatDataOrderShipGhn({ order: order_local, user });

      const res = await shipApi.createOrderGhn(data);

      // console.log('res', res);
      refs.ordersRefs.doc(order.id).update({
        order_ship: res.data.data
      });

      setOrderLocal({
        ...order_local,
        order_ship: res.data.data
      });

      message.success('Đã tạo đơn giao hàng');
      setLoadingSet(false);
    } catch (error) {
      console.log('error', error);
      setLoadingSet(false);
      message.error('Chưa tạo được đơn giao hàng');
    }
  };

  const createOrderShipGhtk = async () => {
    try {
      const data = await formatDataOrderShipGhtk({ order: order_local, user });

      console.log('daa5a', data);

      const res = await shipApi.createOrderGhtk(data);

      if (!res.data.success) {
        message.error(res.data.message);
      } else {
        const order_ship = {
          ...res.data.order,
          status_id: 0
        };
        refs.ordersRefs.doc(order.id).update({
          order_ship
        });
        setOrderLocal({
          ...order_local,
          order_ship
        });
      }

      setLoadingSet(false);
    } catch (error) {
      console.log(error);
      setLoadingSet(false);
      message.error('Chưa tạo được đơn giao hàng');
    }
  };

  const createOrderShip = async () => {
    setLoadingSet(true);

    if (order_local.shiper) {
      // console.log('order_local.shiper', order_local.shiper);

      if (order_local.shiper.id === 'giaohangnhanh') {
        // console.log('giaohangnhanh');
        createOrderShipGhn();
      }
      if (order_local.shiper.id === 'giaohangtietkiem') {
        createOrderShipGhtk();
      }
    } else {
      setLoadingSet(true);
    }
  };

  const cancelOrderGhn = () => {
    const { order_ship } = order_local;
    const { OrderCode } = order_ship;
    // const ship = user.ship.find(s => s.name === order.shiper.id);

    shipApi
      .cancelOrderGhn({
        // token: ship.token,
        OrderCode
      })
      .then(res => {
        refs.ordersRefs.doc(order.id).update({
          order_ship: null
        });

        setOrderLocal({
          ...order_local,
          order_ship: null
        });
        setLoadingSet(false);
        message.success('Đã hủy đơn giao hàng');
      })
      .catch(error => {
        setLoadingSet(false);
        message.error('Chưa hủy đơn giao hàng');
        console.log(error);
      });
  };

  const cancelOrderGhtk = () => {
    const { order_ship } = order_local;
    const { label } = order_ship;
    // const ship = user.ship.find(s => s.name === order.shiper.id);

    const data = {
      // token: ship.token,
      label
    };

    shipApi
      .cancelOrderGhtk(data)
      .then(() => {
        refs.ordersRefs.doc(order.id).update({
          order_ship: null
        });
        setLoadingSet(false);
        setOrderLocal({
          ...order_local,
          order_ship: null
        });
        message.success('Đã hủy đơn giao hàng');
      })
      .catch(() => {
        message.error('Chưa hủy đơn giao hàng');
        setLoadingSet(false);
      });
  };

  const cancelOrder = () => {
    setLoadingSet(true);
    if (order_local.shiper) {
      if (order_local.shiper.id === 'giaohangnhanh') {
        cancelOrderGhn();
      }
      if (order_local.shiper.id === 'giaohangtietkiem') {
        cancelOrderGhtk();
      }
    } else {
      setLoadingSet(false);
    }
  };

  const changeLength = value => {
    setOrderLocal({ ...order_local, Length: value });
  };

  const changeHeight = value => {
    setOrderLocal({ ...order_local, Height: value });
  };

  const changeWidth = value => {
    setOrderLocal({ ...order_local, Width: value });
  };

  const changeListProduct = new_list_product => {
    setOrderLocal({
      ...order_local,
      list_order: new_list_product
    });
  };

  const updateShip = shiper => {
    const phi_van_chuyen = shiper
      ? shiper.ServiceFee
      : order_local.phi_van_chuyen;

    setOrderLocal({ ...order_local, shiper, phi_van_chuyen });
  };

  const changeCkhau = chiet_khau =>
    setOrderLocal({ ...order_local, chiet_khau });

  // const changeTienCoc = tien_coc => setOrderLocal({ ...order_local, tien_coc });
  // const changeCkhoan = tien_chuyen_khoan =>
  //   setOrderLocal({ ...order_local, tien_chuyen_khoan });
  const changePvc = phi_van_chuyen =>
    setOrderLocal({ ...order_local, phi_van_chuyen });
  const changePbk = phi_bao_khach =>
    setOrderLocal({ ...order_local, phi_bao_khach });

  const handleReset = () => {
    setOrderLocal(order);
  };

  const handleSave = () => {
    setSaveLoading(true);
    refs.ordersRefs
      .doc(order.id)
      .update({
        ...order_local
      })
      .then(() => {
        setSaveLoading(false);
        message.success('Đã lưu đơn hàng');
      })
      .catch(() => {
        setSaveLoading(false);
        message.error('Lỗi lưu đơn hàng');
      });
  };

  const renderButtonCreateOrderShip = () => {
    if (!order_local.shiper) return null;

    if (!order_local.order_ship)
      return (
        <Button
          size="small"
          onClick={createOrderShip}
          type="primary"
          loading={loading_ship}
          disabled={loading_ship}
        >
          Tạo đơn giao hàng
        </Button>
      );

    if (
      typeof order_local.order_ship.CurrentStatus === 'undefined' ||
      order_local.order_ship.CurrentStatus.length === 0 ||
      order_local.order_ship.CurrentStatus === 'ReadyToPick'
    )
      return (
        <Button
          size="small"
          onClick={cancelOrder}
          loading={loading_ship}
          disabled={loading_ship}
        >
          Hủy đơn giao hàng
        </Button>
      );

    if (order_local.order_ship.CurrentStatus === 'Finish')
      return <Button size="small">Đơn hàng đã hoàn thành</Button>;

    return (
      <Button size="small" loading={loading_ship} disabled={loading_ship}>
        Đang vận chuyển
      </Button>
    );
  };

  const renderGroupBtn = () => {
    if (
      order.order_ship ||
      order.status === 'dang_chuyen' ||
      order.status === 'huy_hang' ||
      order.status === 'thanh_toan'
    )
      return null;

    if (save_loading)
      return (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      );

    return (
      <div>
        <Divider />
        <Button
          style={{ marginRight: 15 }}
          onClick={handleReset}
          icon="reload"
          disabled={save_loading}
        >
          Hủy
        </Button>

        <Button
          type="primary"
          style={{ marginRight: 15 }}
          onClick={handleSave}
          icon="save"
          disabled={save_loading}
        >
          Lưu
        </Button>

        <PrintOrder
          setLoading={setSaveLoading}
          order={order_local}
          onAfterPrint={handleSave}
          disabled={save_loading}
        />
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: 50 }}>
      <Row gutter={30}>
        <Col span={16}>
          <Card type="inner">
            <Row gutter={30}>
              <Col span={12}>
                <Title>Khách hàng</Title>
                <Form.Item label="Tên" {...formItemLayout} style={style}>
                  <Input
                    placeholder="Điền tên khách hàng"
                    value={order_local.order_name}
                    name="order_name"
                    onChange={onChange}
                  />
                </Form.Item>
                <Form.Item label="Số ĐT" {...formItemLayout} style={style}>
                  <Input
                    placeholder="Điền số điện thoại KH"
                    value={order_local.order_phone}
                    name="order_phone"
                    onChange={onChange}
                  />
                </Form.Item>

                <Form.Item label="Email" {...formItemLayout} style={style}>
                  <Input
                    placeholder="Địa chỉ email KH"
                    onChange={onChange}
                    name="order_email"
                    value={order_local.order_email}
                  />
                </Form.Item>

                <OrderAddress
                  address={order_local.addressInfo}
                  updateAddress={updateAddress}
                />

                <Form.Item label="Địa chỉ" {...formItemLayout} style={style}>
                  <TextArea
                    name="address"
                    onChange={onChange}
                    value={order_local.address}
                  />
                </Form.Item>

                <Form.Item label="Ghi chú KH" {...formItemLayout} style={style}>
                  <TextArea
                    name="customer_note"
                    onChange={onChange}
                    value={order_local.customer_note}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Title>Đơn hàng</Title>
                <Form.Item label="Nhân viên" {...formItemLayout} style={style}>
                  {order_local.member && (
                    <span>
                      {order_local.member.displayName}{' '}
                      <Tag
                        color={
                          order_local.member.role === 'admin'
                            ? '#f50'
                            : '#108ee9'
                        }
                      >
                        {order_local.member.role === 'admin'
                          ? 'Chủ shop'
                          : 'Nhân viên'}
                      </Tag>
                    </span>
                  )}
                </Form.Item>
                <Form.Item
                  label="Ghi chú CSKH"
                  {...formItemLayout}
                  style={style}
                >
                  <TextArea
                    name="cskh_note"
                    onChange={onChange}
                    value={order_local.cskh_note}
                  />
                </Form.Item>

                <Divider dashed style={{ margin: '10px 0' }} />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 15
                  }}
                >
                  <Title style={{ margin: 0 }}>Giao hàng</Title>

                  {renderButtonCreateOrderShip()}
                </div>

                <Form.Item style={{ marginBottom: 10 }}>
                  <TableShip shiper={order_local.shiper} />
                </Form.Item>
                <Row gutter={5}>
                  <Col span={8}>
                    <Form.Item label="Dài">
                      <InputNumber
                        defaultValue={10}
                        value={order_local.Length}
                        name="Length"
                        onChange={changeLength}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Rộng">
                      <InputNumber
                        defaultValue={10}
                        value={order_local.Width}
                        name="Width"
                        onChange={changeWidth}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Cao">
                      <InputNumber
                        defaultValue={10}
                        value={order_local.Height}
                        name="Height"
                        onChange={changeHeight}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Divider dashed style={{ margin: '10px 0' }} />
              </Col>

              <Col span={24}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20
                  }}
                >
                  <Title style={{ margin: 0 }}>Sản phẩm</Title>

                  <ProductAutocomplete
                    changeListProduct={changeListProduct}
                    order={order_local.list_order}
                  />
                </div>

                <Form.Item style={style}>
                  <TableOrderList
                    order={order_local.list_order}
                    changeListProduct={changeListProduct}
                  />
                </Form.Item>

                <Form.Item style={style}>
                  <Shipping order={order_local} updateShip={updateShip} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={8}>
          <Card type="inner">
            <Title>Trạng thái</Title>
            <Form.Item label="Đơn hàng" {...formItemLayout1} style={style}>
              <ChangeStatus order={order_local} style={{ width: 150 }} />
            </Form.Item>
            <Form.Item label="Vận chuyển" {...formItemLayout1} style={style}>
              <ShipStatus
                order_ship={order_local.order_ship}
                shiper={order_local.shiper}
              />
            </Form.Item>
          </Card>
          <Divider />
          <Card type="inner">
            <Title>Thanh toán</Title>

            <Form.Item label="Chiết khấu" {...formItemLayout1} style={style}>
              <Discount
                chiet_khau={order_local.chiet_khau}
                changeCkhau={changeCkhau}
              />
            </Form.Item>

            {/* <Form.Item label="Đặt cọc" {...formItemLayout1} style={style}>
              <InputMoney
                onChange={changeTienCoc}
                value={order_local.tien_coc}
              />
            </Form.Item> */}

            {/* <Form.Item label="Chuyển khoản" {...formItemLayout1} style={style}>
              <InputMoney
                onChange={changeCkhoan}
                value={order_local.tien_chuyen_khoan}
              />
            </Form.Item> */}

            <Form.Item
              label="Phí vận chuyển"
              {...formItemLayout1}
              style={style}
            >
              <InputMoney
                name="phi_van_chuyen"
                onChange={changePvc}
                value={order_local.phi_van_chuyen}
              />
            </Form.Item>

            <Form.Item label="Phí báo khách" {...formItemLayout1} style={style}>
              <InputMoney
                onChange={changePbk}
                value={order_local.phi_bao_khach}
              />
            </Form.Item>
          </Card>

          <Divider />

          <TableTotal order={order_local} />

          {renderGroupBtn()}
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailForm;
