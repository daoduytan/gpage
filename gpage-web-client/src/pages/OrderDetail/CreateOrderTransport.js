import React from 'react';
import { Modal, Button, Form, InputNumber } from 'antd';

const FormCreateOrderShip = () => {
  return (
    <Form>
      <Form.Item label="Chiều cao">
        <InputNumber />
      </Form.Item>
    </Form>
  );
};

const CreateOrderTransport = () => {
  const [visible, setVisible] = React.useState(false);

  const toggle = () => setVisible(!visible);

  return (
    <>
      <Button size="small" onClick={toggle}>
        Tạo đơn giao hàng
      </Button>
      <Modal visible={visible} onCancel={toggle} footer={null}>
        <FormCreateOrderShip />
      </Modal>
    </>
  );
};

export default CreateOrderTransport;
