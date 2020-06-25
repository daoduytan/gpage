// @flow
import React, { useState } from 'react';
import { Icon, Modal } from 'antd';

import { Labels } from './LabelList';
import theme from '../../theme';

type ModalLabelProps = {
  labels: any
};

const ModalLabel = ({ labels }: ModalLabelProps) => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const onCancel = () => setVisible(false);

  return (
    <>
      <div
        style={{
          textAlign: 'center',
          background: theme.color.light,
          display: ' flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        role="presentation"
        onClick={showModal}
      >
        <Icon type="tag" />
      </div>
      <Modal
        title="Nhãn hội thoại"
        visible={visible}
        onCancel={onCancel}
        footer={null}
        centered
      >
        <Labels labels={labels} />
      </Modal>
    </>
  );
};

export default ModalLabel;
