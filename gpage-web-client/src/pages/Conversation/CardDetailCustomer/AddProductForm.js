// @flow
import React, { useState } from 'react';
import { Form, Input, Button, Icon, InputNumber, message } from 'antd';
import { useSelector } from 'react-redux';
import { refs } from '../../../api';

const FormItem = Form.Item;
const style = { marginBottom: 10 };

type AddProductFormProps = {
  form: any,
  user: {
    uid: string
  },
  addProductToOrder: any,
  onCancel: any
};

const AddProductForm = ({
  form,
  addProductToOrder,
  onCancel
}: AddProductFormProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = useState(false);
  const { getFieldDecorator, validateFields, resetFields } = form;

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((err, values) => {
      if (!err) {
        setLoading(true);

        const product = { ...values, uid: user.shopId };

        const ref = refs.usersRefs.doc(user.shopId).collection('products');

        ref
          .where('ten', '==', values.ten)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              ref
                .add(product)
                .then(res => {
                  setLoading(false);
                  message.success('Thêm sản phẩm thành công');
                  resetFields();
                  addProductToOrder({ ...values, key: res.id });
                  onCancel();
                })
                .catch(() => {
                  setLoading(false);
                  message.error('Thêm sản phẩm thất bại');
                });
            } else {
              setLoading(false);
              message.warning('Sản phẩm đã tồn tại');
            }
          })
          .catch(() => {
            setLoading(false);
            message.error('Thêm sản phẩm thất bại');
          });
      }
    });
  };

  const resetForm = () => resetFields();

  return (
    <Form onSubmit={handleSubmit}>
      <FormItem label="Tên sản phẩm" style={{ ...style }}>
        {getFieldDecorator('ten', {
          rules: [
            {
              required: true,
              message: 'Điền tên sản phẩm'
            }
          ]
        })(<Input placeholder="" />)}
      </FormItem>

      <FormItem label="Giá" style={{ ...style }}>
        {getFieldDecorator('gia_ban', {
          rules: [
            {
              required: true,
              message: 'Điền giá sản phẩm'
            }
          ]
        })(
          <InputNumber
            placeholder=""
            style={{ width: 200 }}
            formatter={value =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={value => value.replace(/vnd\s?|(,*)/g, '')}
          />
        )}
        <span style={{ marginLeft: 15 }}>vnd</span>
      </FormItem>

      <FormItem label="Khối lượng (gram)" style={{ ...style }}>
        {getFieldDecorator('khoi_luong', {
          initialValue: 500,
          rules: [
            {
              required: true,
              message: 'Điền khối lượng sản phẩm'
            }
          ]
        })(
          <InputNumber
            placeholder=""
            style={{ width: 200 }}
            min={1}
            formatter={value =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={value => value.replace(/gram\s?|(,*)/g, '')}
          />
        )}
        <span style={{ marginLeft: 15 }}>gram</span>
      </FormItem>

      <FormItem style={{ ...style }}>
        <Button
          type="primary"
          style={{ marginRight: 15 }}
          htmlType="submit"
          loading={loading}
        >
          <Icon type="save" /> Lưu lại
        </Button>
        <Button onClick={resetForm}>
          <Icon type="close" /> Hủy
        </Button>
      </FormItem>
    </Form>
  );
};

export default Form.create()(AddProductForm);
