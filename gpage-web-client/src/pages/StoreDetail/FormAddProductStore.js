import React from 'react';
import { Form, Select, Button, InputNumber, message } from 'antd';
import { useSelector } from 'react-redux';

import { refs } from '../../api';

type FormAddProductStoreProps = {
  form: any,
  storeId: string,
  toggle: void
};

const FormAddProductStore = ({
  form,
  storeId,
  toggle
}: FormAddProductStoreProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);

  const { validateFields, getFieldDecorator, resetFields } = form;

  React.useEffect(() => {
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('products')
        .get()
        .then(snapshot => {
          const arr = snapshot.docs.map(doc => ({
            ...doc.data(),
            key: doc.id
          }));

          setProducts(arr);
        });

      refs.usersRefs
        .doc(user.shopId)
        .collection('supplier')
        .get()
        .then(snapshot => {
          const arr = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

          setSuppliers(arr);
        });
    }
  }, [user]);

  const addHistoryImport = values => {
    const refHistoryImport = refs.usersRefs
      .doc(user.shopId)
      .collection('history_import');

    refHistoryImport.add({
      ...values,
      nha_cung_cap: values.nha_cung_cap || '',
      date: Date.now()
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((error, values) => {
      if (!error) {
        setLoading(true);

        const refStore = refs.usersRefs
          .doc(user.shopId)
          .collection('products_store');

        const new_values = {
          ...values,
          nha_cung_cap: values.nha_cung_cap || '',
          storeId
        };

        refStore
          .where('storeId', '==', storeId)
          .where('productId', '==', values.productId)
          .get()
          .then(response => {
            if (response.empty) {
              refStore
                .add(new_values)
                .then(() => {
                  message.success('Đã nhập kho thành công');
                  addHistoryImport(new_values);
                  setLoading(false);
                  resetFields();
                })
                .catch(() => {
                  message.error('Lỗi nhập kho');
                  setLoading(false);
                });
            } else {
              const product = response.docs[0].data();
              const productId = response.docs[0].id;
              const so_luong = product.so_luong + values.so_luong;

              refStore
                .doc(productId)
                .update({ so_luong })
                .then(() => {
                  message.success('Đã nhập kho thành công');
                  addHistoryImport(new_values);
                  resetFields();
                  setLoading(false);
                })
                .catch(() => {
                  message.error('Lỗi nhập kho');
                  setLoading(false);
                });
            }
          });
      }
    });
  };

  const resetForm = () => resetFields();

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Chọn sản phẩm">
        {getFieldDecorator('productId', {
          rules: [{ required: true, message: 'Chọn sản phẩm' }]
        })(
          <Select placeholder="Chọn sản phẩm" showSearch>
            {products.map(product => (
              <Select.Option key={product.key} value={product.key}>
                {product.ten}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>

      <Form.Item label="Nhà cung cấp">
        {getFieldDecorator('nha_cung_cap', {
          // rules: [{ required: true, message: 'Chọn nhà cung cấp' }]
        })(
          <Select placeholder="Chọn nhà cung cấp" showSearch>
            {suppliers.map(supplier => (
              <Select.Option key={supplier.id} value={supplier.id}>
                {supplier.ten}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>

      <Form.Item label="Số lượng">
        {getFieldDecorator('so_luong', {
          rules: [{ required: true, message: 'Điền số lượng nhập kho' }]
        })(<InputNumber style={{ width: '100%' }} placeholder="Ex: 50" />)}
      </Form.Item>

      <Form.Item>
        <Button style={{ marginRight: 15 }} onClick={resetForm}>
          Hủy
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(FormAddProductStore);
