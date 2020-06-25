import React from 'react';
import { Button, Modal, Icon } from 'antd';
import AddProductForm from './AddProductForm';

const AddProduct = () => {
  const [visible, setVisible] = React.useState(false);

  const toggle = () => setVisible(!visible);
  return (
    <>
      <Button onClick={toggle} type="primary">
        <Icon type="plus" /> Thêm
      </Button>
      <Modal
        visible={visible}
        title="Thêm sản phẩm"
        footer={null}
        width={1000}
        onCancel={toggle}
      >
        <AddProductForm toggle={toggle} />
      </Modal>
    </>
  );
};

export default AddProduct;
