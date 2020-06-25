import React from 'react';
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;

type FormSettingKeywordProps = {
  form: any,
  addTextBlacklist: any,
  loading: boolean,
  blacklist: string
};

const FormSettingKeyword = ({
  form,
  addTextBlacklist,
  loading,
  blacklist
}: FormSettingKeywordProps) => {
  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((err, values) => {
      if (!err) {
        addTextBlacklist(values.blacklist);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item style={{ marginBottom: 10 }}>
        {getFieldDecorator('blacklist', {
          // rules: [{ required: true, message: 'Điền từ khóa' }],
          initialValue: blacklist
        })(
          <TextArea
            rows={4}
            placeholder="Nhập mỗi cụm từ cách nhau 1 dấu phẩy"
            style={{ maxWidth: 360 }}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          loading={loading}
          disabled={loading}
          htmlType="submit"
        >
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormSettingKeyword);
