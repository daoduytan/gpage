import React from 'react';
import { navigate } from '@reach/router';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { fireAuth } from '../../api/firebase';
import { refs } from '../../api';
import { loadUserDone } from '../../reducers/authState/authActions';

const { Password } = Input;

type FormAdminLoginProps = {
  form: any
};

const FormAdminLogin = ({ form }: FormAdminLoginProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields(async (error, values) => {
      if (!error) {
        setLoading(true);

        try {
          const { email, password } = values;
          const res = await fireAuth.signInWithEmailAndPassword(
            email,
            password
          );

          const { user } = res;

          const userDoc = await refs.usersRefs.doc(user.uid).get();

          const userData = userDoc.data();

          if (user.type === 'admin') {
            dispatch(loadUserDone(userData));
            navigate('/admin/overview');
            message.success('Đăng nhập thành công');
          }

          setLoading(false);
        } catch (err) {
          message.error(err.message);

          setLoading(false);
        }
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Email">
        {getFieldDecorator('email', {
          rules: [{ required: true, message: 'Please input your username!' }]
        })(<Input placeholder="email@email.com" />)}
      </Form.Item>
      <Form.Item label="Password">
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }]
        })(<Password placeholder="********" />)}
      </Form.Item>
      <Form.Item>
        <Button loading={loading} type="primary" block htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormAdminLogin);
