import React from 'react';
import { Modal, Button } from 'antd';
import { useModal } from './hooks';

import FormRenewal from '../AdminCustomer/FormRenewal';

type ModalRenewalProps = {
  customer: any
};

const ModalRenewal = ({ customer }: ModalRenewalProps) => {
  const { visible, toggle } = useModal();

  return (
    <>
      <Button type="primary" block size="large" onClick={toggle}>
        Gia hạn
      </Button>
      <Modal
        visible={visible}
        onCancel={toggle}
        footer={null}
        title="Chọn gói dịch vụ"
      >
        <FormRenewal customer={customer} />
      </Modal>
    </>
  );
};

export default ModalRenewal;
