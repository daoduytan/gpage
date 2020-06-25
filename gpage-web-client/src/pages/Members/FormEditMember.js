import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Form, Input, Button, DatePicker, message, Select } from 'antd';
import { refs } from '../../api';

const { TextArea } = Input;
const style = { marginBottom: 15 };

type FormEditMemberProps = {
  form: any,
  member: any
};

const FormEditMember = ({ form, member, toggle }: FormEditMemberProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);

  const [shifts, setShifts] = React.useState([]);

  React.useEffect(() => {
    const loadShifts = () => {
      refs.usersRefs
        .doc(user.shopId)
        .collection('shifts')
        .get()
        .then(response => {
          const arrData = response.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          setShifts(arrData);
        });
    };

    loadShifts();
  }, [user.shopId]);

  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const memberUpdate = {
          displayName: values.displayName || '',
          fullname: values.fullname || '',
          phoneNumber: values.phoneNumber || '',
          birthday: values.birthday ? moment(values.birthday).valueOf() : 0,
          address: values.address || ''
        };

        refs.usersRefs
          .doc(member.uid)
          .update({ ...memberUpdate })
          .then(() => {
            setLoading(false);
            toggle();
            message.success('Chỉnh sửa hoàn tất ');
          })
          .catch(err => {
            setLoading(false);

            message.error(err.message);
          });
      }
    });
  };

  const onCancel = () => toggle();

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Tên" style={style}>
        {getFieldDecorator('displayName', {
          initialValue: member.displayName
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Họ và tên" style={style}>
        {getFieldDecorator('fullname', {
          initialValue: member.fullname
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Ca trực" style={style}>
        {getFieldDecorator('shift', {
          initialValue: member.shift
        })(
          <Select>
            {shifts.map(shift => (
              <Select.Option key={shift.id} value={shift.id}>
                {shift.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Số điện thoại" style={style}>
        {getFieldDecorator('phoneNumber', {
          initialValue: member.phoneNumber
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Ngày sinh" style={style}>
        {getFieldDecorator('birthday', {
          initialValue: moment(member.birthday)
        })(<DatePicker />)}
      </Form.Item>
      <Form.Item label="Địa chỉ" style={style}>
        {getFieldDecorator('address', {
          initialValue: member.address
        })(<TextArea />)}
      </Form.Item>
      <Form.Item>
        <Button style={{ marginRight: 15 }} onClick={onCancel}>
          Hủy
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Chỉnh sửa
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormEditMember);
