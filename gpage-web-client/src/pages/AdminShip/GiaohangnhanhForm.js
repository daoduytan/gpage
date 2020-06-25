import React from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { refs } from '../../api';

const { Password } = Input;
const size = 'default';
const style = { marginBottom: 15 };

type GiaohangnhanhFormProps = {
  form: {
    getFieldDecorator: any,
    validateFields: any
  }
};

const GiaohangnhanhForm = ({ form }: GiaohangnhanhFormProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { getFieldDecorator, validateFields } = form;
  const [loading, setLoading] = React.useState(false);
  const [giaohangnhanh, setGiaohangnhanh] = React.useState(null);

  React.useEffect(() => {
    refs.shipRefs
      .doc('giaohangnhanh')
      .get()
      .then(doc => {
        if (doc.exists) {
          setGiaohangnhanh({ ...doc.data(), id: 'giaohangnhanh' });
        }
      });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    if (user && user.type === 'admin') {
      validateFields((err, values) => {
        if (!err) {
          setLoading(true);

          refs.shipRefs
            .doc('giaohangnhanh')
            .set({
              ...values,
              id: 'giaohangnhanh'
            })
            .then(() => {
              setLoading(false);
              message.success('Đã cập nhập giao hàng nhanh');
            })
            .catch(() => {
              setLoading(false);
              message.error('Lỗi cập nhật giao hàng nhanh');
            });
        }
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Token" style={style}>
        {getFieldDecorator('token', {
          rules: [{ required: true, message: 'Không bỏ trống ô này' }],
          initialValue: giaohangnhanh && giaohangnhanh.token
        })(<Password size={size} />)}
      </Form.Item>

      <Form.Item label="ClientID (AffiliateID)" style={style}>
        {getFieldDecorator('AffiliateID', {
          rules: [{ required: true, message: 'Không bỏ trống ô này' }],
          initialValue: giaohangnhanh && giaohangnhanh.AffiliateID
        })(<Password size={size} />)}
      </Form.Item>

      <Form.Item label="URL gọi lại (Callback URL)" style={style}>
        {getFieldDecorator('url_callback', {
          rules: [{ required: true, message: 'Không bỏ trống ô này' }],
          initialValue: giaohangnhanh && giaohangnhanh.url_callback
        })(<Input size={size} />)}
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(GiaohangnhanhForm);
