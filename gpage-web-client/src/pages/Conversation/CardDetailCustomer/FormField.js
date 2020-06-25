// @flow
import React from 'react';
import { Form, Button, Input, Icon, message, Tooltip } from 'antd';

import { useConvs } from '../context';
import { refs } from '../../../api';
import { Copy } from '../../../components';

const FormItem = Form.Item;

type FormFieldProps = {
  form: {
    getFieldDecorator: Function,
    validateFields: Function
  },
  field: string,
  icon: string,
  placeholder: string
};

const FormField = ({ form, icon, field, placeholder }: FormFieldProps) => {
  const { getFieldDecorator, validateFields } = form;
  const { state } = useConvs();

  const conversation = state.conversation_select;

  if (!conversation) return null;

  // console.log('conversation', conversation);

  const { key, phone, email, address } = conversation;

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((err, values) => {
      if (!err && conversation) {
        const ref = refs.activitysRefs.doc(key);
        ref.update(values);
      }
    });
  };

  const initialValue = () => {
    if (field === 'email') return email || '';
    if (field === 'phone') return phone || '';
    if (field === 'address') return address || '';

    return '';
  };

  return (
    <Tooltip placement="left" title="Nhấn Enter để lưu">
      <div>
        <Form
          onSubmit={handleSubmit}
          layout={
            field === 'phone' && phone && phone.length > 0
              ? 'inline'
              : 'horizontal'
          }
        >
          <FormItem style={{ marginBottom: 10, flex: 1, marginRight: 0 }}>
            {getFieldDecorator(`${field}`, {
              initialValue: initialValue()
            })(
              <Input
                placeholder={placeholder}
                addonBefore={<Icon type={icon} style={{ fontSize: 12 }} />}
              />
            )}
          </FormItem>
          {field === 'phone' && phone && (
            <>
              <FormItem
                style={{ marginBottom: 10, marginRight: 0, marginLeft: 10 }}
              >
                <Button.Group style={{ marginRight: 0 }}>
                  <Copy
                    text={phone}
                    onCopy={() => message.success(`Copy: ${phone}`)}
                  >
                    <Tooltip placement="top" title="Copy">
                      <Button type="primary" icon="copy" />
                    </Tooltip>
                  </Copy>

                  {/* <Tooltip placement="top" title="Gọi điện">
                  <Button onClick={handleCallPhone} icon="phone" />
                </Tooltip> */}
                </Button.Group>
              </FormItem>
            </>
          )}
        </Form>
      </div>
    </Tooltip>
  );
};

export default Form.create()(FormField);
