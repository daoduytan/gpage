import React from 'react';
import { Form, Select, InputNumber, Button, message } from 'antd';

import { refs } from '../../api';

type FormRenewalProps = {
  form: {
    getFieldDecorator: any,
    validateFields: any
  },
  customer: any
};

const FormRenewal = ({ form, customer }: FormRenewalProps) => {
  const [loading, setLoading] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [type, setType] = React.useState(customer.licence.type);

  React.useEffect(() => {
    refs.servicesRefs
      .where('status', '==', true)
      .orderBy('stt', 'asc')
      .get()
      .then(response => {
        const arrService = response.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        setServices(arrService);
      });
  }, []);

  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((error, values) => {
      if (!error) {
        setLoading(true);
        const service = services.find(s => s.id === values.service);
        const refsCustomer = refs.usersRefs.doc(customer.shopId);

        const time =
          type === 'premium' ? values.number_month * 30 : values.number_day;
        const service_id = service ? service.id : null;
        const number_page = type === 'premium' ? service.number_page : 1;
        const number_users = type === 'premium' ? service.number_users : null;

        if (
          type === 'premium' &&
          customer.licence.number_users > number_users
        ) {
          refs.usersRefs
            .where('role', '==', 'member')
            .get()
            .then(res => {
              res.docs.forEach(doc => {
                refs.usersRefs.doc(doc.id).update({ status: false });
              });
            });
        }

        refsCustomer
          .update({
            licence: {
              service_id,
              time,
              number_page,
              number_users,
              type: values.type,
              date_active: Date.now()
            }
          })
          .then(() => {
            refsCustomer
              .collection('pages_actived')
              .get()
              .then(docs => {
                docs.forEach(doc => {
                  refsCustomer
                    .collection('pages_actived')
                    .doc(doc.id)
                    .delete();
                });
              });
          })
          .then(() => {
            setLoading(false);
            message.success('Đã gia hạn thành công');
          })
          .catch(err => {
            console.log(err);
            message.error('Gia hạn không thành công');
          });
      }
    });
  };

  const onChangeType = value => {
    setType(value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Loại tài khoản">
        {getFieldDecorator('type', {
          initialValue: customer.licence.type || 'trial'
        })(
          <Select onChange={onChangeType}>
            <Select.Option key="trial">Dùng thử</Select.Option>
            <Select.Option key="premium">Trả phí</Select.Option>
          </Select>
        )}
      </Form.Item>

      {type === 'premium' && (
        <Form.Item label="Chọn dịch vụ">
          {getFieldDecorator('service', {
            initialValue: services.length > 0 ? services[0].id : null
          })(
            <Select>
              {services.map(service => (
                <Select.Option key={service.id} value={service.id}>
                  {`${service.name} - ${service.price}/page`}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      )}

      {/* <Form.Item label="Số lượng page">
        {getFieldDecorator('number_page', {
          initialValue: 1
        })(<InputNumber min={1} />)}
      </Form.Item> */}

      {type === 'premium' ? (
        <Form.Item label="Số lượng tháng đăng ký">
          {getFieldDecorator('number_month', {
            initialValue: 1
          })(<InputNumber min={1} />)}
        </Form.Item>
      ) : (
        <Form.Item label="Số ngày đăng ký">
          {getFieldDecorator('number_day', {
            initialValue: customer.licence.time || 15
          })(<InputNumber min={0} />)}
        </Form.Item>
      )}

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Gia hạn
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormRenewal);
