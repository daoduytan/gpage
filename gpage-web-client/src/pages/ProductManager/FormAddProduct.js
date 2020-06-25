import React from 'react';
import { useSelector } from 'react-redux';
import {
  Form,
  Col,
  Row,
  Input,
  Button,
  Divider,
  message,
  InputNumber
} from 'antd';
import { refs } from '../../api';
import { InputMoney, UploadImage } from '../../components';

const style = { marginBottom: 10 };

type FormAddProductProps = {
  form: any
};

const FormAddProduct = ({ form }: FormAddProductProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState(null);

  const { validateFields, getFieldDecorator, resetFields } = form;

  const updateImage = resImage => {
    setImage(resImage);
  };

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((error, values) => {
      if (!error) {
        setLoading(true);

        const data = { ...values, hinh_anh: image, shopId: user.shopId };

        refs.usersRefs
          .doc(user.shopId)
          .collection('products')
          .add(data)
          .then(() => {
            message.success('Đã thêm sản phẩm');
            setLoading(false);
            resetFields();
          })
          .catch(() => {
            message.error('Lỗi khi thêm sản phẩm');
            setLoading(false);
          });
      }
    });
  };

  const resetForm = () => resetFields();

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col span={8}>
          <Form.Item label="Ảnh sản phẩm">
            <UploadImage image={image} upload={updateImage} />
          </Form.Item>
        </Col>

        <Col span={16}>
          <Form.Item label="Tên sản phẩm" style={style}>
            {getFieldDecorator('ten', {
              rules: [{ required: true, message: 'Điền tên sản phẩm' }]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Mã sản phẩm" style={style}>
            {getFieldDecorator('ma', {
              rules: [{ required: true, message: 'Điền mã sản phẩm' }]
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Khối lượng (gram)" style={style}>
            {getFieldDecorator('khoi_luong', {
              initialValue: 500,
              rules: [{ required: true, message: 'Điền khối lượng sản phẩm' }]
            })(<InputNumber style={{ width: '100%' }} min={1} />)}
          </Form.Item>
          <Form.Item label="Giá vốn (vnd)" style={style}>
            {getFieldDecorator('gia_von', {
              rules: [{ required: true, message: 'Điền giá sản gốc' }]
            })(<InputMoney style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item label="Giá bán (vnd)" style={style}>
            {getFieldDecorator('gia_ban', {
              rules: [{ required: true, message: 'Điền giá bán' }]
            })(<InputMoney style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item label="Giá buôn (vnd)" style={style}>
            {getFieldDecorator('gia_buon', {
              rules: [{ required: true, message: 'Điền giá buôn' }]
            })(<InputMoney style={{ width: '100%' }} />)}
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button style={{ marginRight: 15 }} onClick={resetForm}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create()(FormAddProduct);
