import React from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { refs } from '../../api';

const { Password } = Input;
const size = 'default';
const style = { marginBottom: 15 };

type GiaohangtietkiemFormProps = {
  form: {
    getFieldDecorator: any,
    validateFields: any
  }
};

const GiaohangtietkiemForm = ({ form }: GiaohangtietkiemFormProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);
  const [giaohangtietkiem, setGiaohangtietkiem] = React.useState(null);

  const { getFieldDecorator, validateFields } = form;

  React.useEffect(() => {
    if (user && user.type === 'admin') {
      refs.shipRefs
        .doc('giaohangtietkiem')
        .get()
        .then(doc => {
          if (doc.exists) {
            setGiaohangtietkiem({ ...doc.data(), id: giaohangtietkiem });
          }
        });
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setLoading(true);

        refs.shipRefs
          .doc('giaohangtietkiem')
          .set({
            ...values,
            id: 'giaohangtietkiem'
          })
          .then(() => {
            setLoading(false);
            message.success('Đã cập nhập giao hàng tiết kiệm');
          })
          .catch(() => {
            setLoading(false);
            message.error('Lỗi cập nhật giao hàng tiết kiệm');
          });
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Token" style={style}>
        {getFieldDecorator('token', {
          rules: [{ required: true, message: 'Không bỏ trống ô này' }],
          initialValue: giaohangtietkiem && giaohangtietkiem.token
        })(<Password size={size} />)}
      </Form.Item>

      <Form.Item label="URL gọi lại (Callback URL)" style={style}>
        {getFieldDecorator('url_callback', {
          rules: [{ required: true, message: 'Không bỏ trống ô này' }],
          initialValue: giaohangtietkiem && giaohangtietkiem.url_callback
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

export default Form.create()(GiaohangtietkiemForm);
