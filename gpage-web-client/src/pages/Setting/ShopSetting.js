import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Form, Input, Button, message } from 'antd';

import { refs } from '../../api';
import { loadUserDone } from '../../reducers/authState/authActions';

const { TextArea } = Input;
const style = { marginBottom: 5 };

const FormShopSetting = Form.create()(({ form }) => {
  const [loading, setLoading] = React.useState(false);
  const user = useSelector(({ authReducer }) => authReducer.user);
  const dispatch = useDispatch();
  const { validateFields, getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((error, values) => {
      if (!error) {
        setLoading(true);
        refs.usersRefs
          .doc(user.shopId)
          .update({
            shop: { ...values }
          })
          .then(() => {
            dispatch(loadUserDone({ ...user, shop: { ...values } }));
            message.success('Đã cập nhật shop');
            setLoading(false);
          })
          .catch(err => {
            setLoading(true);
            message.error(err.message);
          });
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Tên" style={style}>
        {getFieldDecorator('name', {
          initialValue: user.shop ? user.shop.name : ''
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Số điện thoại" style={style}>
        {getFieldDecorator('phoneNumber', {
          initialValue: user.shop ? user.shop.phoneNumber : ''
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Địa chỉ" style={style}>
        {getFieldDecorator('address', {
          initialValue: user.shop ? user.shop.address : ''
        })(<TextArea />)}
      </Form.Item>
      <Form.Item style={style}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
});

const ShopSetting = () => {
  return (
    <Card type="inner" title={<span style={{ fontWeight: 600 }}>Shop</span>}>
      <FormShopSetting />
    </Card>
  );
};

export default ShopSetting;
