import React from 'react';
import { Button, Modal } from 'antd';
import FormAddProductStore from './FormAddProductStore';

type AddProductStoreProps = {
  storeId: string
};

const AddProductStore = ({ storeId }: AddProductStoreProps) => {
  const [visible, setVisible] = React.useState(false);
  const toggle = () => setVisible(!visible);
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={toggle}>
          Nhập hàng
        </Button>
      </div>

      <Modal
        visible={visible}
        onCancel={toggle}
        title="Nhập sản phẩm"
        footer={null}
      >
        <FormAddProductStore storeId={storeId} toggle={toggle} />
      </Modal>
    </>
  );
};

export default AddProductStore;
