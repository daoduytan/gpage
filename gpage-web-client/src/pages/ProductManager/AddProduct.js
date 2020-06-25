import React from 'react';
import { Button, Modal } from 'antd';

import FormAddProduct from './FormAddProduct';

type AddProductProps = { title?: string };

const AddProduct = ({ title }: AddProductProps) => {
  const [visible, setVisible] = React.useState(false);

  const toggle = () => setVisible(!visible);

  return (
    <>
      <Button type="primary" onClick={toggle}>
        {title}
      </Button>
      <Modal
        visible={visible}
        onCancel={toggle}
        footer={null}
        title="Thêm sản phẩm"
      >
        <FormAddProduct />
      </Modal>
    </>
  );
};

AddProduct.defaultProps = {
  title: 'Thêm'
};

export default AddProduct;
