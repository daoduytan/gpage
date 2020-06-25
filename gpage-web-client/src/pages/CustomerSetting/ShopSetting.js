import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, message } from 'antd';

import { refs } from '../../api';
import { loadUserDone } from '../../reducers/authState/authActions';
import defaultLabels from '../Customer/defaultLabels';
import { ContextFormSetting } from './FormSetting';
import { Title } from './style';

const { TextArea } = Input;
const style = { marginBottom: 5 };

type ShopSettingProps = {
  form: any
};

const color = '#fff';

const ShopSetting = ({ form }: ShopSettingProps) => {
  const { nextCurrent } = React.useContext(ContextFormSetting);
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
            message.success('Đã cập nhật thông tin shop');

            refs.usersRefs
              .doc(user.shopId)
              .collection('list_labels')
              .get()
              .then(response => {
                if (response.empty) {
                  defaultLabels.forEach(l => {
                    refs.usersRefs
                      .doc(user.shopId)
                      .collection('list_labels')
                      .add({ ...l, status: true, color });
                  });
                }
              });

            refs.usersRefs
              .doc(user.shopId)
              .update({ ...user })
              .then(() => {
                dispatch(loadUserDone({ ...user, shop: { ...values } }));
              });

            setLoading(false);
            nextCurrent();
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
      <Title>Cài đặt thông tin Shop</Title>
      <Form.Item label="Tên" style={style}>
        {getFieldDecorator('name', {
          initialValue: user && user.shop && user.shop.name,
          rules: [{ required: true, message: 'Điền tên shop' }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Số điện thoại" style={style}>
        {getFieldDecorator('phoneNumber', {
          initialValue: user && user.shop && user.shop.phoneNumber,
          rules: [{ required: true, message: 'Điền số điện thoại shop' }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Địa chỉ" style={style}>
        {getFieldDecorator('address', {
          initialValue: user && user.shop && user.shop.address,
          rules: [{ required: true, message: 'Điền địa chỉ shop' }]
        })(<TextArea />)}
      </Form.Item>
      <Form.Item style={{ ...style, textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" size="large" loading={loading}>
          Lưu & Tiếp
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(ShopSetting);
