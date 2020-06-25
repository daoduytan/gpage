import React, { useState } from 'react';
import { Button, Modal, Form, Input, Icon } from 'antd';
import { useSelector } from 'react-redux';

import { refs } from '../../../api';
import { hocModalBad } from '../hocModal';
import { useConvs } from '../context';

const { TextArea } = Input;

type FormBadCustomerProps = {
  form: {
    getFieldDecorator: Function,
    validateFields: Function,
    resetFields: Function
  },
  conversation: {
    key: string,
    bads: any
  },
  displayName: string
};

const FormBadCustomer = ({ form, ...rest }: FormBadCustomerProps) => {
  const [loading, setLoading] = useState(false);
  const { getFieldDecorator, validateFields, resetFields } = form;
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { state } = useConvs();

  const conversation = state.conversation_select;
  const displayName = user ? user.displayName : '';

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      setLoading(true);
      if (!err) {
        const { key } = conversation;
        const bads = conversation.bads || [];

        const bad = {
          text: values.text,
          date: Date.now(),
          user: displayName
        };

        refs.activitysRefs
          .doc(key)
          .update({
            bads: [...bads, bad]
          })
          .then(() => {
            resetFields();
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  };

  return (
    <Modal title="Báo khách xấu" {...rest} footer={null}>
      <Form onSubmit={handleSubmit}>
        <Form.Item style={{ marginBottom: 15 }}>
          {getFieldDecorator('text', {
            rules: [{ required: true, message: 'Không để trống' }]
          })(<TextArea rows={3} placeholder="Nội dung...." />)}
        </Form.Item>
        <Form.Item style={{ marginBottom: 15 }}>
          <Button type="danger" htmlType="submit" loading={loading}>
            <Icon type="warning" theme="filled" /> Báo xấu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const FormBadCustomerContainer = Form.create()(FormBadCustomer);

const ModalFormBadCustomer = hocModalBad(FormBadCustomerContainer, () => (
  <Button type="danger">
    <Icon type="warning" theme="filled" /> Báo xấu
  </Button>
));

export default ModalFormBadCustomer;
