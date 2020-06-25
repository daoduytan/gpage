import React from 'react';
import { useSelector } from 'react-redux';
import {
  Form,
  Row,
  Col,
  Input,
  Card,
  Divider,
  Button,
  Select,
  DatePicker,
  InputNumber
} from 'antd';
import { fireStore } from '../../api/firebase';
import { InputMoney } from '../../components';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 }
};
const style = {
  marginBottom: 10
};

type FormAddSupplierProps = {
  form: any
};

const FormAddSupplier = ({ form }: FormAddSupplierProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [products, setProducts] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);

  const { getFieldDecorator, validateFields } = form;

  React.useEffect(() => {
    if (user) {
      fireStore
        .collection('users')
        .doc(user.shopId)
        .collection('suppliers')
        .get()
        .then(snapShot => {
          const arr = snapShot.docs.map(d => ({ ...d.data(), id: d.id }));
          setSuppliers(arr);
        });

      fireStore
        .collection('users')
        .doc(user.uid)
        .collection('products')
        .get()
        .then(snapShot => {
          const arr = snapShot.docs.map(d => ({ ...d.data(), id: d.id }));
          setProducts(arr);
        });
    }
  }, [user]);

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <Form style={{ padding: 30 }} onSubmit={handleSubmit}>
      <Card type="inner" title="Nhập hàng">
        <Row gutter={30}>
          <Col span={12}>
            <FormItem
              label="Nhà cung cấp"
              {...formItemLayout}
              style={{ ...style }}
            >
              {getFieldDecorator('nha_cung_cap', {
                rules: [{ required: true, message: 'Chọn nhà cung cấp' }]
              })(
                <Select placeholder="">
                  {suppliers.map(s => (
                    <Select.Option key={s.id} value={s.id}>
                      {s.ten}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              label="Nhân viên kinh doanh"
              {...formItemLayout}
              style={style}
            >
              {getFieldDecorator('nhan_vien_kinh_doanh', {})(<Input />)}
            </FormItem>
            <FormItem label="Người gửi" {...formItemLayout} style={style}>
              {getFieldDecorator('nguoi_gui', {})(<Input />)}
            </FormItem>
            <FormItem label="Người nhận" {...formItemLayout} style={style}>
              {getFieldDecorator('nguoi_nhan', {})(<Input />)}
            </FormItem>
            <FormItem label="Ghi chú" {...formItemLayout} style={style}>
              {getFieldDecorator('ghi_chu', {})(<TextArea rows={2} />)}
            </FormItem>

            <FormItem label="Sản phẩm" {...formItemLayout} style={style}>
              {getFieldDecorator(
                'san_pham',
                {}
              )(
                <Select>
                  {products.map(p => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.ten}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem label="Số lượng" {...formItemLayout} style={style}>
              {getFieldDecorator(
                'so_luong',
                {}
              )(<InputNumber min={0} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem label="Khối lượng" {...formItemLayout} style={style}>
              {getFieldDecorator(
                'khoi_luong',
                {}
              )(<InputNumber min={0} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="VAT của hóa đơn" {...formItemLayout} style={style}>
              <Row gutter={5}>
                <Col span={8}>
                  {getFieldDecorator('loai_vat', {
                    initialValue: 'phan_tram'
                  })(
                    <Select>
                      <Select.Option value="phan_tram">%</Select.Option>
                      <Select.Option value="tien">Tiền</Select.Option>
                    </Select>
                  )}
                </Col>
                <Col span={16}>
                  {getFieldDecorator(
                    'gia_tri_vat',
                    {}
                  )(<InputNumber style={{ width: '100%' }} />)}
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Số hóa đơn VAT" {...formItemLayout} style={style}>
              {getFieldDecorator('so_hoa_don_vat', {})(<Input />)}
            </FormItem>
            <FormItem
              label="Ngày xuất hóa đơn VAT"
              {...formItemLayout}
              style={style}
            >
              {getFieldDecorator(
                'ngay_xuat_hoa_don_vat',
                {}
              )(<DatePicker placeholder="" />)}
            </FormItem>
            <FormItem label="Chiết khấu" {...formItemLayout} style={style}>
              <Row gutter={5}>
                <Col span={8}>
                  {getFieldDecorator('loai_chiet_khau', {
                    initialValue: 'phan_tram'
                  })(
                    <Select>
                      <Select.Option value="phan_tram">%</Select.Option>
                      <Select.Option value="tien">Tiền</Select.Option>
                    </Select>
                  )}
                </Col>
                <Col span={16}>
                  {getFieldDecorator(
                    'chiet_khau',
                    {}
                  )(<InputNumber style={{ width: '100%' }} />)}
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Tiền mặt " {...formItemLayout} style={style}>
              {getFieldDecorator(
                'tien_mat',
                {}
              )(<InputMoney style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem
              label="Tiền chuyển khoản"
              {...formItemLayout}
              style={style}
            >
              {getFieldDecorator(
                'tien_chuyen_khoan',
                {}
              )(<InputMoney style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem
              label="Ngày hẹn thanh toán"
              {...formItemLayout}
              style={style}
            >
              {getFieldDecorator(
                'ngay_hen_thanh_toan',
                {}
              )(<DatePicker placeholder="" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" size="large" icon="save">
              Lưu
            </Button>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default Form.create()(FormAddSupplier);
