import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Input, Form, Divider, Button } from 'antd';
import { fireStore } from '../../api/firebase';
import { Discount, InputMoney } from '../../components';

import OrderAddress from '../OrderDetail/OrderAddress';
import TableTotal from '../OrderDetail/TableTotal';
import ProductAutocomplete from '../OrderDetail/ProductAutocomplete';
import { Title } from '../OrderDetail/style';
import TableOrderList from '../OrderDetail/TableOrderList';

const { TextArea } = Input;

const style = { marginBottom: 5 };

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

const OrderDetail = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  const [order_local, setOrderLocal] = React.useState({
    order_name: '',
    addressInfo: {
      city: null
    },
    list_order: [],
    chiet_khau: {
      type: 'tien',
      value: 0
    },
    phi_van_chuyen: 0,
    phi_bao_khach: 0
  });

  const changeListProduct = new_list_product => {
    setOrderLocal({
      ...order_local,
      list_order: new_list_product
    });
  };

  const changeCkhau = chiet_khau =>
    setOrderLocal({ ...order_local, chiet_khau });

  const onChange = e => {
    setOrderLocal({
      ...order_local,
      [e.target.name]: e.target.value
    });
  };

  const changePvc = phi_van_chuyen =>
    setOrderLocal({ ...order_local, phi_van_chuyen });
  const changePbk = phi_bao_khach =>
    setOrderLocal({ ...order_local, phi_bao_khach });
  const changeTienCoc = tien_coc => setOrderLocal({ ...order_local, tien_coc });
  const changeCkhoan = tien_chuyen_khoan =>
    setOrderLocal({ ...order_local, tien_chuyen_khoan });

  const updateAddress = addressInfo => {
    setOrderLocal({ ...order_local, addressInfo });
  };

  const handleSave = () => {
    fireStore
      .collection('users')
      .doc(user.uid)
      .collection('orders')
      .add({
        ...order_local
      });
  };

  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 }
  };
  const formItemLayout1 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 176 }
  };

  return (
    <div style={{ padding: 20 }}>
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
                    name="street"
                    onChange={onChange}
                    value={order_local.street}
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
                  <Input
                    name="nhan_vien"
                    onChange={onChange}
                    value={order_local.nhan_vien}
                  />
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
              </Col>
              <Col span={24}>
                <Divider dashed />
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
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={8}>
          <Card type="inner">
            <Title>Thanh toán</Title>

            <Form.Item label="Chiết khấu" {...formItemLayout1} style={style}>
              <Discount
                chiet_khau={order_local.chiet_khau}
                changeCkhau={changeCkhau}
              />
            </Form.Item>

            <Form.Item label="Đặt cọc" {...formItemLayout1} style={style}>
              <InputMoney
                onChange={changeTienCoc}
                value={order_local.tien_coc}
              />
            </Form.Item>

            <Form.Item label="Chuyển khoản" {...formItemLayout1} style={style}>
              <InputMoney
                onChange={changeCkhoan}
                value={order_local.tien_chuyen_khoan}
              />
            </Form.Item>

            <Form.Item label="Phí báo khách" {...formItemLayout1} style={style}>
              <InputMoney
                onChange={changePbk}
                value={order_local.phi_bao_khach}
              />
            </Form.Item>

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
          </Card>

          <Divider />

          <TableTotal order={order_local} />

          <Divider />

          <Button
            type="primary"
            size="large"
            style={{ marginRight: 15 }}
            onClick={handleSave}
            icon="save"
          >
            Lưu
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetail;
