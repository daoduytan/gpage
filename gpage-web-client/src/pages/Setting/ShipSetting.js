import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Input, Form, Button, message } from 'antd';

import { refs } from '../../api';
import { loadUserDone } from '../../reducers/authState/authActions';

const { Password } = Input;
const size = 'default';
const style = { marginBottom: 15 };

// giao hang tiet kiem
const FormGhn = Form.create()(({ form }) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const { validateFields, getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((err, values) => {
      if (!err) {
        setLoading(true);

        const userShip = user.ship ? user.ship : [];

        const exist_ship = userShip.find(s => s.name === 'giaohangnhanh');

        let newShip;

        if (!exist_ship) {
          newShip = [...userShip, { name: 'giaohangnhanh', ...values }];
        } else {
          newShip = userShip.map(s => {
            if (s.name === 'giaohangnhanh')
              return {
                ...s,
                ...values
              };
            return s;
          });
        }

        refs.usersRefs
          .doc(user.shopId)
          .update({ ship: newShip })
          .then(() => {
            dispatch(loadUserDone({ ...user, ship: newShip }));
            setLoading(false);
            message.success('Đã thêm giao hàng nhanh');
          })
          .catch(() => {
            message.error('Lỗi thêm giao hàng nhanh');
            setLoading(false);
          });
      }
    });
  };

  const getValueShip = name_ship => {
    if (!user.ship) return null;

    return user.ship.find(s => s.name === name_ship);
  };

  return (
    <Card
      type="inner"
      title={<span style={{ fontWeight: 600 }}>Giao hàng nhanh</span>}
    >
      <Form onSubmit={handleSubmit}>
        <Form.Item label="Token" style={style}>
          {getFieldDecorator('token', {
            initialValue:
              getValueShip('giaohangnhanh') &&
              getValueShip('giaohangnhanh').token
          })(<Password size={size} />)}
        </Form.Item>

        <Form.Item label="AffiliateID (ClientID)" style={style}>
          {getFieldDecorator('AffiliateID', {
            initialValue:
              getValueShip('giaohangnhanh') &&
              getValueShip('giaohangnhanh').AffiliateID
          })(<Password size={size} />)}
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});

const FormGhtk = Form.create()(({ form }) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const { validateFields, getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((error, values) => {
      if (!error) {
        setLoading(true);

        const userShip = user.ship ? user.ship : [];
        const exist_ship = userShip.find(s => s.name === 'giaohangtietkiem');

        let newShip;

        if (!exist_ship) {
          newShip = [
            ...userShip,
            { name: 'giaohangtietkiem', token: values.token }
          ];
        } else {
          userShip.map(s => {
            if (s.name === 'giaohangtietkiem')
              return {
                ...s,
                ...values
              };
            return s;
          });
        }

        refs.usersRefs
          .doc(user.shopId)
          .update({ ship: newShip })
          .then(() => {
            dispatch(loadUserDone({ ...user, ship: newShip }));
            setLoading(false);
            message.success('Đã thêm giao hàng tiết kiệm');
          })
          .catch(() => {
            message.error('Lỗi thêm giao hàng tiết kiệm');
            setLoading(false);
          });
      }
    });
  };

  const getValueShip = name_ship => {
    if (!user.ship) return null;

    return user.ship.find(s => s.name === name_ship);
  };

  return (
    <Card
      type="inner"
      title={<span style={{ fontWeight: 600 }}>Giao hàng tiết kiệm</span>}
    >
      <Form onSubmit={handleSubmit}>
        <Form.Item label="Token" style={style}>
          {getFieldDecorator('token', {
            initialValue:
              getValueShip('giaohangtietkiem') &&
              getValueShip('giaohangtietkiem').token
          })(<Password size={size} />)}
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});

export { FormGhn, FormGhtk };
