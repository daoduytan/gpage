import React from 'react';
import { Button, Modal, Icon } from 'antd';
import FormAddStore from './FormAddStore';

type AddStoreProps = {
  block?: boolean,
  type?: string
};

const AddStore = ({ block, type }: AddStoreProps) => {
  const [visible, setVisible] = React.useState(false);

  const toggle = () => setVisible(!visible);

  return (
    <>
      <Button type={type} onClick={toggle} block={block}>
        <Icon type="plus" /> Thêm
      </Button>
      <Modal visible={visible} title="Thêm kho" footer={null} onCancel={toggle}>
        <FormAddStore toggle={toggle} />
      </Modal>
    </>
  );
};

AddStore.defaultProps = {
  block: false,
  type: 'primary'
};

export default AddStore;
