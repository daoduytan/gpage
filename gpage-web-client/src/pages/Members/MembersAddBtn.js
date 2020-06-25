import React from 'react';
import { Button, Modal, Icon } from 'antd';
import MemberAddForm from './MemberAddForm';

const MembersAddBtn = ({ size }: { size: string }) => {
  const [visible, setVisible] = React.useState(false);
  const toggle = () => setVisible(!visible);

  return (
    <>
      <Button onClick={toggle} type="primary" size={size}>
        <Icon type="plus" /> Thêm
      </Button>
      <Modal
        title="Thêm nhân viên"
        visible={visible}
        onCancel={toggle}
        footer={null}
      >
        <MemberAddForm onCancel={toggle} />
      </Modal>
    </>
  );
};

export default MembersAddBtn;
