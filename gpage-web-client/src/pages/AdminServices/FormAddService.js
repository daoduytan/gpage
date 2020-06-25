import React from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, message, Input, InputNumber, Row, Col } from 'antd';
import { refs } from '../../api';

const { TextArea } = Input;
const style = { marginBottom: 10 };

type FormAddServiceProps = {
  form: any,
  service: any
};

const FormAddService = ({ form, service }: FormAddServiceProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);

  const { getFieldDecorator, validateFields, resetFields } = form;

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((error, values) => {
      if (!error && user && user.type === 'admin') {
        setLoading(true);

        if (service) {
          refs.servicesRefs
            .doc(service.id)
            .update({
              ...values
            })
            .then(() => {
              message.success('Đã cập nhật dịch vụ');
              setLoading(false);
            })
            .catch(() => {
              message.error('Lỗi cập nhật nhậtm dịch vụ');
              setLoading(false);
            });
        } else {
          refs.servicesRefs
            .add({ ...values, status: true })
            .then(() => {
              message.success('Đã thêm dịch vụ thành công');
              setLoading(false);
              resetFields();
            })
            .catch(() => {
              message.error('Lỗi thêm dịch vụ');
              setLoading(false);
            });
        }
      }
    });
  };

  const reset = () => resetFields();

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Tên dịch vụ" style={style}>
        {getFieldDecorator('name', {
          initialValue: service && service.name,
          rules: [{ required: true, message: 'Điền tên dịch vụ' }]
        })(<Input />)}
      </Form.Item>

      <Row gutter={15}>
        {/* <Col span={12}>
          <Form.Item label="Thời gian(tháng)" style={style}>
            {getFieldDecorator('time', {
              initialValue: service && service.time,
              rules: [{ required: true, message: 'Chọn thời gian' }]
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </Col> */}

        <Col span={12}>
          <Form.Item label="Số page" style={style}>
            {getFieldDecorator('number_page', {
              initialValue: (service && service.number_page) || 1,
              rules: [
                { required: true, message: 'Điền số fanpage có thể quản lý' }
              ]
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Số thành viên" style={style}>
            {getFieldDecorator('number_users', {
              initialValue: service && service.number_users,
              rules: [{ required: true, message: 'Điền số lượng thành viên' }]
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Giá dịch vụ (page/tháng)" style={style}>
        {getFieldDecorator('price', {
          initialValue: service && service.price,
          rules: [{ required: true, message: 'Điền giá dịch vụ' }]
        })(
          <InputNumber
            style={{ width: '100%' }}
            formatter={value =>
              `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            // eslint-disable-next-line no-useless-escape
            parser={value => value.replace(/\VND\s?|(,*)/g, '')}
          />
        )}
      </Form.Item>

      <Form.Item label="Ghi chú" style={style}>
        {getFieldDecorator('note', {
          initialValue: (service && service.note) || ''
          // rules: [{ required: true, message: 'Điền ghi chú cho dịch vụ' }]
        })(<TextArea placeholder="" />)}
      </Form.Item>
      <Form.Item style={style}>
        <Button onClick={reset} style={{ marginRight: 15 }}>
          Hủy
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {service ? 'Chỉnh sửa' : 'Thêm'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormAddService);
