import React from 'react';
import { Form, Button, Input, Select } from 'antd';

const FormCreateShipOrder = ({ order, form }) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <Form>
      <Form.Item label="Hình thức thanh toán">
        <Select>
          <Select.Option value={1}>Shop/Seller</Select.Option>
          <Select.Option value={2}>Buyer/Consignee.</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="ID Quận">
        <Input />
      </Form.Item>

      <Form.Item label="d">
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Tao don
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormCreateShipOrder);
