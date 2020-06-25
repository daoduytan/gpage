import React from 'react';
import { Button, Modal } from 'antd';

import QuickAnswerNewForm from './QuickAnswerNewForm';

const QuickAnswerNew = () => {
  const [visible, setVisible] = React.useState(false);

  const toggle = () => setVisible(!visible);

  return (
    <>
      <Button onClick={toggle} type="primary" style={{ marginRight: 15 }}>
        Thêm mới
      </Button>
      <Modal
        visible={visible}
        onCancel={toggle}
        footer={false}
        title="Thêm câu trả lời mới"
      >
        <QuickAnswerNewForm hideModal={toggle} />
      </Modal>
    </>
  );
};

export default QuickAnswerNew;
