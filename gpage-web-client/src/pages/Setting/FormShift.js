import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  Form,
  Input,
  TimePicker,
  Select,
  Row,
  Col,
  Button,
  message
} from 'antd';
import { pick } from 'lodash';

import { refs } from '../../api';

const format = 'HH:mm';
const size = 'default';

type FormAddShiftProps = {
  form: any,
  edit: () => void,
  shift: any
};

const FormAddShift = ({ form, edit, shift }: FormAddShiftProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  const [loading, setLoading] = React.useState(false);
  const { getFieldDecorator, validateFields, resetFields } = form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((error, values) => {
      if (!error) {
        setLoading(true);

        const refShopShifts = refs.usersRefs
          .doc(user.shopId)
          .collection('shifts');

        const pages = values.pages.map(page => {
          const exist = user.facebookPages.find(p => p.id === page);
          if (!exist) return null;

          return pick(exist, ['id', 'name']);
        });

        const shift_new = {
          ...values,
          pages,
          start_time: moment(values.start_time).format('HH:mm'),
          end_time: moment(values.end_time).format('HH:mm')
        };

        if (edit) {
          refShopShifts
            .doc(shift.id)
            .update({ ...shift_new })
            .then(() => {
              setLoading(false);
              resetFields();
              message.success('Đã thêm ca thành công');
            })
            .catch(err => {
              setLoading(false);
              message.error(err.message);
            });
        } else {
          refShopShifts
            .add(shift_new)
            .then(() => {
              setLoading(false);
              resetFields();
              message.success('Đã thêm ca thành công');
            })
            .catch(err => {
              setLoading(false);
              message.error(err.message);
            });
        }
      }
    });
  };

  const reset = () => resetFields();

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Tên ca">
        {getFieldDecorator('name', {
          initialValue: shift && shift.name,
          rules: [{ required: true, message: 'Điền tên ca' }]
        })(<Input placeholder="Tên ca" size={size} />)}
      </Form.Item>
      <Row gutter={15}>
        <Col span={12}>
          <Form.Item label="Bắt đầu">
            {getFieldDecorator('start_time', {
              initialValue:
                shift && shift.start_time && moment(shift.start_time, 'HH:mm'),
              rules: [{ required: true, message: 'Chọn thời gian' }]
            })(
              <TimePicker
                placeholder="00:00"
                style={{ width: '100%' }}
                format={format}
                size={size}
              />
            )}
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Kết thúc">
            {getFieldDecorator('end_time', {
              initialValue:
                shift && shift.end_time && moment(shift.end_time, 'HH:mm'),
              rules: [{ required: true, message: 'Chọn thời gian' }]
            })(
              <TimePicker
                placeholder="00:00"
                style={{ width: '100%' }}
                format={format}
                size={size}
              />
            )}
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Chọn page">
        {getFieldDecorator('pages', {
          initialValue: shift && shift.pages ? shift.pages.map(p => p.id) : [],
          rules: [{ required: true, message: 'Chọn page' }]
        })(
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Chọn page"
          >
            {user.facebookPages.map(page => (
              <Select.Option key={page.id}>{page.name}</Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>

      <Form.Item>
        <Button style={{ marginRight: 15 }} size={size} onClick={reset}>
          Hủy
        </Button>
        <Button
          size={size}
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          {edit ? 'Sửa' : 'Thêm'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormAddShift);
