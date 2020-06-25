import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useSelector } from 'react-redux';

import customerApi from '../../api/customerApi';
import { refs } from '../../api';

const { Password } = Input;
const style = { marginBottom: 10 };

type MemberAddFormProps = {
  form: any,
  onCancel: any
};

const MemberAddForm = ({ form, onCancel }: MemberAddFormProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);
  const { getFieldDecorator, validateFields, resetFields } = form;
  const [is_full_user, setIsFullUser] = React.useState(false);

  React.useEffect(() => {
    if (user.licence.type === 'premium') {
      refs.usersRefs
        .where('shopId', '==', user.shopId)
        .get()
        .then(res => {
          const members = res.docs.map(doc => doc.data());
          const members_active = members.filter(m => {
            if (typeof m.status === 'undefined' && !m.status) return false;
            return true;
          });

          if (members_active.length <= user.licence.number_users) {
            setIsFullUser(false);
          } else {
            setIsFullUser(true);
          }
        });
    }
  }, [user.licence.number_users, user.licence.type, user.shopId]);

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        customerApi
          .create_member({
            ...values,
            uid: user.uid,
            shopId: user.shopId,
            status: true
          })
          .then(() => {
            setLoading(false);
            resetFields();
            message.success('Thêm nhân viên thành công');
            onCancel();
          })
          .catch(() => {
            setLoading(false);

            message.error('Lỗi khi thêm nhân viên');
          });
      }
    });
  };

  const reset = () => resetFields();

  if (is_full_user)
    return (
      <div>
        <p>
          Tài khoản của bạn đã thành viên. Để có thể thêm thành viên bạn có thể
          nâng cấp lên gói dịch vụ cao hơn.
        </p>
      </div>
    );

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Tên" style={style}>
        {getFieldDecorator('ho_va_ten', {
          rules: [{ required: true, message: 'Điền họ tên nhân viên' }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Email" style={style}>
        {getFieldDecorator('email', {
          rules: [{ required: true, message: 'Điền email' }]
        })(<Input />)}
      </Form.Item>

      <Form.Item label="Mật khẩu" style={style}>
        {getFieldDecorator('mat_khau', {
          rules: [{ required: true, message: 'Điền mật khẩu' }]
        })(<Password />)}
      </Form.Item>

      <Form.Item label="SĐT" style={style}>
        {getFieldDecorator('so_dien_thoai', {
          rules: [{ required: true, message: 'Điền số điện thoại nhân viên' }]
        })(<Input />)}
      </Form.Item>

      <Form.Item style={style}>
        <Button onClick={reset} style={{ marginRight: 15 }}>
          Hủy
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Thêm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(MemberAddForm);
