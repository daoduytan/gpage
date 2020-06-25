import React from 'react';
import { Form, Input, Button } from 'antd';
import { refs } from '../../api';
import { fireAuth } from '../../api/firebase';

const { Password } = Input;

type FormAdminSignupProps = {
  form: any
};

const FormAdminSignup = ({ form }: FormAdminSignupProps) => {
  const [loading, setLoading] = React.useState(false);
  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((error, values) => {
      if (!error) {
        setLoading(true);

        fireAuth
          .createUserWithEmailAndPassword(values.email, values.password)
          .then(res => {
            refs.usersRefs
              .doc(res.user.uid)
              .set({ ...values, type: 'admin', role: 'admin' });
          });

        // adminApi
        //   .signup({ ...values, type: 'admin', role: 'admin' })
        //   .then(res => console.log(res))
        //   .catch(err => {
        //     setLoading(false);
        //     console.log(err);
        //   });
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
          rules: [{ required: true, message: 'Please input your password!' }]
        })(<Password placeholder="********" />)}
      </Form.Item>
      <Form.Item>
        <Button loading={loading} type="primary" block htmlType="submit">
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormAdminSignup);
