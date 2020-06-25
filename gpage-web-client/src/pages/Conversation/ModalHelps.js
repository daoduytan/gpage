// @flow
import React from 'react';
import { Icon, Modal } from 'antd';

import hocModal from './hocModal';

const LabelModalHelps = () => <Icon type="question-circle" />;

type ModalHelpsProps = {
  visible: boolean,
  onCancel: Function
};

const ModalHelps = ({ visible, onCancel }: ModalHelpsProps) => {
  return (
    <Modal title="Trợ giúp" visible={visible} onCancel={onCancel} footer={null}>
      Nội dung
    </Modal>
  );
};

export default hocModal(ModalHelps, LabelModalHelps);
