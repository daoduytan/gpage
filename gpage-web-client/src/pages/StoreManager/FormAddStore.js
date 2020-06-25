import React from 'react';
import { Form, Input, Button, message, Row, Col, Select } from 'antd';
import { useSelector } from 'react-redux';

import { tinh_thanhpho, getQuanHuyen, getXaPhuong } from '../../dumpdata';

import { refs } from '../../api';

const { TextArea } = Input;
const style = { marginBottom: 10 };

type FormAddStoreProps = {
  form: any,
  toggle: any,
  store: any
};

const FormAddStore = ({ form, toggle, store }: FormAddStoreProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);
  const { validateFields, getFieldDecorator, resetFields } = form;

  const [districts, setDistrict] = React.useState([]);
  const [wards, setWards] = React.useState([]);

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((error, values) => {
      if (!error) {
        setLoading(true);

        if (!store) {
          refs.usersRefs
            .doc(user.shopId)
            .collection('store')
            .add(values)
            .then(() => {
              message.success('Đã thêm kho hàng');
              setLoading(false);
              resetFields();
              toggle();
            })
            .catch(() => {
              setLoading(false);
              message.error('Lỗi thêm kho hàng');
            });
        } else {
          // edit store
        }
      }
    });
  };

  const reset = () => resetFields();

  const selectCity = e => {
    const res_districts = getQuanHuyen(e);
    setDistrict(res_districts);
  };

  const selectDistrict = e => {
    const res_wards = getXaPhuong(e);
    setWards(res_wards);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Tên" style={style}>
        {getFieldDecorator('ten', {
          initialValue: store ? store.ten : '',
          rules: [{ required: true, message: 'Điền tên kho' }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Số điện thoại" style={style}>
        {getFieldDecorator('so_dien_thoai', {
          initialValue: store ? store.so_dien_thoai : '',
          rules: [{ required: true, message: 'Điền số điện thoại kho' }]
        })(<Input />)}
      </Form.Item>

      <Form.Item label="Quản lý" style={style}>
        {getFieldDecorator('quan_ly', {
          initialValue: store ? store.quan_ly : '',
          rules: [{ required: true, message: 'Điền địa chỉ kho' }]
        })(<Input />)}
      </Form.Item>

      <Row gutter={15}>
        <Col span={8}>
          <Form.Item label="Tỉnh/Thành phố" style={style}>
            {getFieldDecorator('city', {
              // initialValue: store ? store.city : '',
              rules: [{ required: true, message: 'Điền địa chỉ kho' }]
            })(
              <Select
                showSearch
                style={{ width: '100%' }}
                dataSource={tinh_thanhpho}
                placeholder="Tỉnh/Thành phố"
                filterOption={(inputValue, option) =>
                  option.props.children
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                onChange={selectCity}
              >
                {Object.keys(tinh_thanhpho).map(c => (
                  <Select.Option
                    value={tinh_thanhpho[c].code}
                    key={tinh_thanhpho[c].code}
                  >
                    {tinh_thanhpho[c].name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Quận/Huyện" style={style}>
            {getFieldDecorator('district', {
              // initialValue: store ? store.district : '',
              rules: [{ required: true, message: 'Điền địa chỉ kho' }]
            })(
              <Select
                showSearch
                style={{ width: '100%' }}
                dataSource={districts}
                placeholder="Quận/Huyện"
                disabled={districts.length === 0}
                value={store ? store.district : ''}
                filterOption={(inputValue, option) =>
                  option.props.children
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                onChange={selectDistrict}
              >
                {Object.keys(districts).map(c => (
                  <Select.Option value={districts[c].code} key={c}>
                    {districts[c].name_with_type}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Xã/phường" style={style}>
            {getFieldDecorator('ward', {
              // initialValue: store ? store.ward : '',
              rules: [{ required: true, message: 'Điền địa chỉ kho' }]
            })(
              <Select
                style={{ width: '100%' }}
                dataSource={wards}
                placeholder="Phường/Xã"
                disabled={wards.length === 0}
                filterOption={(inputValue, option) =>
                  option.props.children
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              >
                {Object.keys(wards).map(c => (
                  <Select.Option value={wards[c].code} key={c}>
                    {wards[c].name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Địa chỉ" style={style}>
        {getFieldDecorator('dia_chi', {
          initialValue: store ? store.dia_chi : '',
          rules: [{ required: true, message: 'Điền địa chỉ kho' }]
        })(<TextArea />)}
      </Form.Item>

      <Form.Item>
        <Button style={{ marginRight: 15 }} onClick={reset}>
          Hủy
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Thêm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormAddStore);
