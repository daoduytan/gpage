import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useSelector } from 'react-redux';
import { refs } from '../../api';

const { TextArea } = Input;

type FormAddStoreProps = {
  form: any,
  toggle: void
};

const FormAddSupplier = ({ form, toggle }: FormAddStoreProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);
  const { validateFields, getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((error, values) => {
      if (!error) {
        setLoading(true);
        refs.usersRefs
          .doc(user.shopId)
          .collection('supplier')
          .add(values)
          .then(() => {
            message.success('Đã thêm nhà cung cấp');
            setLoading(false);
            toggle();
          })
          .catch(() => {
            setLoading(false);
            message.error('Lỗi thêm nhà cung cấp');
          });
      }
    });
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Tên">
        {getFieldDecorator('ten', {
          rules: [{ required: true, message: 'Điền tên nhà cung cấp' }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Số điện thoại">
        {getFieldDecorator('so_dien_thoai', {
          rules: [
            { required: true, message: 'Điền số điện thoại nhà cung cấp' }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Địa chỉ">
        {getFieldDecorator('dia_chi', {
          rules: [{ required: true, message: 'Điền địa chỉ nhà cung cấp' }]
        })(<TextArea />)}
      </Form.Item>

      <Form.Item label="Ghi chú">
        {getFieldDecorator('ghi_chu', {})(<TextArea />)}
      </Form.Item>

      <Form.Item>
        <Button style={{ marginRight: 15 }}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Thêm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormAddSupplier);
