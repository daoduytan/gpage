import React from 'react';
import { Button, Modal, Icon } from 'antd';
import QuickAnswerNewForm from './QuickAnswerNewForm';

type EditAnswerProps = {
  answer: any
};

const EditAnswer = ({ answer }: EditAnswerProps) => {
  const [visible, setVisible] = React.useState(false);
  const toggle = () => setVisible(!visible);

  return (
    <>
      <Button type="primary" onClick={toggle} icon="edit" />
      <Modal
        visible={visible}
        title="Chỉnh sửa"
        footer={null}
        onCancel={toggle}
      >
        <QuickAnswerNewForm answer={answer} hideModal={toggle} />
      </Modal>
    </>
  );
};

export default EditAnswer;
