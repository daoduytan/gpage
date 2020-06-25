import React from 'react';
import { Modal, Button } from 'antd';
import { useModal } from './hooks';
import FormAddService from './FormAddService';

const AddService = () => {
  const { visible, toggle } = useModal();
  return (
    <>
      <Button type="primary" onClick={toggle}>
        Thêm
      </Button>
      <Modal
        visible={visible}
        onCancel={toggle}
        footer={null}
        title="Thêm dịch vụ"
      >
        <FormAddService />
      </Modal>
    </>
  );
};

export default AddService;
