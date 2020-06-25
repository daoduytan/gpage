// @flow
import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Icon,
  InputNumber,
  message,
  Col,
  Row
} from 'antd';
import { connect } from 'react-redux';

import { fireStore } from '../../api/firebase';
// import UploadImage from './UploadImage';
import { InputMoney, UploadImage } from '../../components';

const FormItem = Form.Item;
const style = { marginBottom: 10 };

type AddProductFormProps = {
  form: any,
  user: {
    uid: String
  }
};

const AddProductForm = ({ form, user }: AddProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const { getFieldDecorator, validateFields, resetFields } = form;
  const [image, setImage] = useState(() =>
    JSON.parse(localStorage.getItem('image'))
  );

  const handleUpload = img_upload => {
    localStorage.setItem('image', img_upload);
    setImage(img_upload);
  };

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        const produdct = { ...values, uid: user.uid, hinh_anh: image };

        const ref = fireStore
          .collection('users')
          .doc(user.uid)
          .collection('products');

        ref
          .where('ten', '==', values.ten)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              return ref
                .where('ma', '==', values.ma)
                .get()
                .then(snap => {
                  if (snap.empty) {
                    ref
                      .add(produdct)
                      .then(() => {
                        setLoading(false);
                        message.success('Thêm sản phẩm thành công');
                        localStorage.removeItem('image');
                        resetFields();
                      })
                      .catch(() => {
                        setLoading(false);
                        message.error('Thêm sản phẩm thất bại');
                      });
                  } else {
                    setLoading(false);
                    return message.warning('Mã sản phẩm đã tồn tại');
                  }
                });
            }
            setLoading(false);
            return message.warning('Tên sản phẩm đã tồn tại');
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
      <Row gutter={30}>
        <Col sm={6}>
          <FormItem label="Ảnh">
            <UploadImage upload={handleUpload} image={image} />
          </FormItem>
        </Col>
        <Col span={9}>
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
          <FormItem label="Mã sản phẩm" style={{ ...style }}>
            {getFieldDecorator('ma', {
              rules: [
                {
                  required: true,
                  message: 'Điền mã sản phẩm'
                }
              ]
            })(<Input placeholder="" />)}
          </FormItem>

          <FormItem label="Giá vốn" style={{ ...style }}>
            {getFieldDecorator('gia_von', {
              rules: [
                {
                  required: true,
                  message: 'Điền vốn sản phẩm'
                }
              ]
            })(<InputMoney placeholder="" style={{ width: 200 }} />)}
          </FormItem>
          <FormItem label="Giá bán" style={{ ...style }}>
            {getFieldDecorator('gia_ban', {
              rules: [
                {
                  required: true,
                  message: 'Điền giá bán sản phẩm'
                }
              ]
            })(<InputMoney placeholder="" style={{ width: 200 }} />)}
          </FormItem>
          <FormItem label="Giá buôn" style={{ ...style }}>
            {getFieldDecorator('gia_buon', {
              rules: [
                {
                  required: true,
                  message: 'Điền giá buôn sản phẩm'
                }
              ]
            })(<InputMoney placeholder="" style={{ width: 200 }} />)}
          </FormItem>
        </Col>
        <Col span={9}>
          <FormItem label="Khối lượng" style={{ ...style }}>
            {getFieldDecorator('khoi_luong', {
              initialValue: 500,
              rules: [
                {
                  required: true,
                  message: 'Điền khối lượng của 1 sản phẩm'
                }
              ]
            })(<InputNumber placeholder="" style={{ width: 200 }} />)}
            <span style={{ marginLeft: 15 }}>gram</span>
          </FormItem>
          <FormItem label="Số lượng" style={{ ...style }}>
            {getFieldDecorator('so_luong', {
              rules: [
                {
                  required: true,
                  message: 'Điền số lượng sản phẩm'
                }
              ]
            })(<InputNumber placeholder="" style={{ width: 200 }} />)}
          </FormItem>
        </Col>
      </Row>

      <FormItem style={{ ...style, textAlign: 'right' }}>
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

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(Form.create()(AddProductForm));
