import React from 'react';
import { Button, Modal } from 'antd';
import FormAddSupplier from './FormAddSupplier';

const AddSupplier = () => {
  const [visible, setVisible] = React.useState(false);

  const toggle = () => setVisible(!visible);

  return (
    <>
      <Button type="primary" onClick={toggle}>
        Thêm
      </Button>
      <Modal
        visible={visible}
        title="Thêm nhà cung cấp"
        footer={null}
        onCancel={toggle}
      >
        <FormAddSupplier toggle={toggle} />
      </Modal>
    </>
  );
};

export default AddSupplier;
