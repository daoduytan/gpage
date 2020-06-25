import React from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Modal, Button, message } from 'antd';
import { fireStore } from '../../api/firebase';

const FormItem = Form.Item;
const { TextArea } = Input;

const style = { marginBottom: 10 };

type FormAddSupplierProps = {
  form: {
    getFieldDecorator: Function,
    validateFields: Function
  },
  onCancel: Function
};

const FormAddSupplier = ({ form, onCancel }: FormAddSupplierProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);

  const { getFieldDecorator, validateFields, resetFields } = form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        fireStore
          .collection('users')
          .doc(user.uid)
          .collection('suppliers')
          .add({ ...values, uid: user.uid })
          .then(() => {
            setLoading(false);
            message.success('Đã thêm nguồn hàng');
            onCancel();
          })
          .catch(error => {
            console.log(error);
            message.error('Lỗi thêm nguồn hàng');
            setLoading(false);
          });
      }
    });
  };

  const resetForm = () => {
    onCancel();
    resetFields();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormItem label="Tên" style={style}>
        {getFieldDecorator('ten', {
          rules: [{ required: true, message: 'Điền tên nguồn cung cấp' }]
        })(<Input placeholder="Teen" />)}
      </FormItem>
      <FormItem label="Số điện thoại" style={style}>
        {getFieldDecorator('so_dien_thoai', {
          rules: [
            { required: true, message: 'Điền số điện thoại nguồn cung cấp' }
          ]
        })(<Input placeholder="" />)}
      </FormItem>
      <FormItem label="Email" style={style}>
        {getFieldDecorator('email', {})(<Input placeholder="" />)}
      </FormItem>
      <FormItem label="Địa chỉ" style={style}>
        {getFieldDecorator('dia_chi', {})(<TextArea placeholder="" />)}
      </FormItem>

      <FormItem>
        <Button type="primary" htmlType="submit" loading={loading}>
          Thêm
        </Button>
        <Button onClick={resetForm} style={{ marginLeft: 15 }}>
          Hủy
        </Button>
      </FormItem>
    </Form>
  );
};

const WithFormAddSupplier = Form.create()(FormAddSupplier);

const AddSupplier = () => {
  const [visible, setVisible] = React.useState(false);

  const toggle = () => setVisible(!visible);

  return (
    <>
      <Button type="primary" onClick={toggle}>
        Thêm nguồn
      </Button>

      <Modal
        visible={visible}
        onCancel={toggle}
        footer={null}
        title="Thêm nguồn cung cấp"
      >
        <WithFormAddSupplier onCancel={toggle} />
      </Modal>
    </>
  );
};

export default AddSupplier;
